/**
 * Web counterpart of the Flutter app's ApiClient
 * (mobile/lib/core/network/api_client.dart).
 *
 * Same contract: bearer token, `{ success, message, data }` envelope,
 * Laravel pagination under `data.data`, and relative media paths resolved
 * against the API origin.
 */

const DEFAULT_BASE = 'https://admindashboard.afrisportconnect.com/api/v1';

/**
 * Either absolute ("https://host/api/v1") or relative ("/api/v1").
 * Relative goes through the Vite dev proxy, which keeps the call same-origin
 * and avoids the API host's missing CORS headers.
 */
export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE
).replace(/\/+$/, '');

const IS_RELATIVE_BASE = API_BASE_URL.startsWith('/');

/**
 * Origin of the API host, used to turn storage paths into absolute URLs.
 * With a relative base the proxy only covers /api, so media has to be loaded
 * straight from the API host (images are not subject to CORS for display).
 */
export const API_ORIGIN = IS_RELATIVE_BASE
  ? (import.meta.env.VITE_API_PROXY_TARGET || DEFAULT_BASE).replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '')
  : API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export const APP_ENABLED = import.meta.env.VITE_ENABLE_APP !== 'false';

const TOKEN_KEY = 'afrisport.auth.token';
const TIMEOUT_MS = 35_000;

/* -------------------------------------------------------------------------- */
/* Token                                                                       */
/* -------------------------------------------------------------------------- */

let memoryToken: string | null = null;

export function getToken(): string | null {
  if (memoryToken) return memoryToken;
  try {
    memoryToken = window.localStorage.getItem(TOKEN_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    memoryToken = null;
  }
  return memoryToken;
}

export function setToken(token: string | null) {
  memoryToken = token;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* keep the in-memory copy so the session still works this tab */
  }
}

/* -------------------------------------------------------------------------- */
/* Errors                                                                      */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  // Declared explicitly rather than as constructor parameter properties,
  // which `erasableSyntaxOnly` disallows.
  readonly status?: number;
  readonly data?: Record<string, unknown>;
  /** Laravel 422 validation bag: { field: [messages] } */
  readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    status?: number,
    data?: Record<string, unknown>,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.errors = errors;
  }

  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isValidation() {
    return this.status === 422;
  }
  get isNetwork() {
    return this.status === undefined;
  }

  /** First message for a given field, if the server sent a validation bag. */
  fieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0];
  }
}

/** Mirrors ApiClient._messageFrom so web and mobile say the same things. */
function messageFor(status: number | undefined, body: unknown): string {
  if (body && typeof body === 'object') {
    const b = body as Record<string, unknown>;
    if (typeof b.message === 'string' && b.message) return b.message;
    const errors = b.errors;
    if (errors && typeof errors === 'object') {
      const first = Object.values(errors as Record<string, unknown>)[0];
      if (Array.isArray(first) && first.length) return String(first[0]);
    }
  }

  switch (status) {
    case undefined:
      return 'No internet connection. Check your network and try again.';
    case 401:
      return 'Your session expired. Please sign in again.';
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 422:
      return 'Please check your input and try again.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 503:
      return 'Service is busy. Please try again shortly.';
    default:
      if (status && status >= 500) {
        return `Server error (${status}). Please try again shortly.`;
      }
      return 'Something went wrong. Please try again.';
  }
}

/* -------------------------------------------------------------------------- */
/* Core request                                                                */
/* -------------------------------------------------------------------------- */

type Query = Record<string, string | number | boolean | null | undefined>;

type RequestOptions = {
  query?: Query;
  body?: unknown;
  signal?: AbortSignal;
  /** Skip the Authorization header even when a token exists. */
  anonymous?: boolean;
  /**
   * Send this bearer token instead of the stored one. Used for the MFA
   * challenge, where the server issues a short-lived token that authorises
   * only `/auth/mfa/verify-login`.
   */
  token?: string;
};

/** Called when the API rejects our token, so the session can be cleared. */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

function buildUrl(path: string, query?: Query): string {
  const joined = API_BASE_URL + (path.startsWith('/') ? path : `/${path}`);
  // A relative base needs the page origin to form a valid URL.
  const url = IS_RELATIVE_BASE ? new URL(joined, window.location.origin) : new URL(joined);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function request<T = unknown>(
  method: string,
  path: string,
  { query, body, signal, anonymous, token: tokenOverride }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'AfrisportWeb',
  };
  // Only needed when the API is reached through an ngrok tunnel in local/dev.
  if (import.meta.env.DEV || /ngrok/i.test(API_BASE_URL)) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }

  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';

  const token = tokenOverride ?? (anonymous ? null : getToken());
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      signal: controller.signal,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (err) {
    window.clearTimeout(timer);
    if ((err as Error)?.name === 'AbortError' && signal?.aborted) {
      throw new ApiError('Request cancelled');
    }
    if ((err as Error)?.name === 'AbortError') {
      throw new ApiError('The server took too long to respond. Please try again.');
    }
    throw new ApiError(messageFor(undefined, null));
  } finally {
    window.clearTimeout(timer);
  }

  let payload: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (response.status === 401 && !anonymous && !tokenOverride) {
    setToken(null);
    onUnauthorized?.();
  }

  const envelope = (payload ?? {}) as Record<string, unknown>;

  if (!response.ok || envelope.success === false) {
    throw new ApiError(
      messageFor(response.ok ? undefined : response.status, payload),
      response.status,
      (envelope.data as Record<string, unknown>) ?? undefined,
      (envelope.errors as Record<string, string[]>) ?? undefined,
    );
  }

  // Unwrap the envelope; endpoints that return a bare body still work.
  return (('data' in envelope ? envelope.data : envelope) as T);
}

export const api = {
  get: <T = unknown>(path: string, opts?: RequestOptions) => request<T>('GET', path, opts),
  post: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('POST', path, { ...opts, body }),
  put: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PUT', path, { ...opts, body }),
  patch: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PATCH', path, { ...opts, body }),
  delete: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('DELETE', path, { ...opts, body }),
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Pull a list out of a plain array, a Laravel paginator (`{ data: [...] }`),
 * or an endpoint that names its collection — `/cart` returns `{ items: [...] }`
 * and a few others use `results`.
 */
export function extractList<T = Record<string, unknown>>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    for (const key of ['data', 'items', 'results']) {
      const inner = obj[key];
      if (Array.isArray(inner)) return inner as T[];
      // Paginated payloads nested one level deeper: { items: { data: [...] } }
      if (inner && typeof inner === 'object' && Array.isArray((inner as Record<string, unknown>).data)) {
        return (inner as Record<string, unknown>).data as T[];
      }
    }
  }
  return [];
}

/** Turn a relative storage path into an absolute URL. Mirrors resolveMediaUrl. */
export function mediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return path.startsWith('/') ? `${API_ORIGIN}${path}` : `${API_ORIGIN}/${path}`;
}
