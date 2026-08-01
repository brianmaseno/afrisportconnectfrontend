import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, getToken, setToken, setUnauthorizedHandler } from './api';
import type { LoginResult, User } from './types';

type AuthState = {
  user: User | null;
  /** True until the stored token has been checked against /auth/me. */
  booting: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<LoginResult>;
  verifyMfa: (mfaToken: string, code: string) => Promise<LoginResult>;
  register: (payload: Record<string, unknown>) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  /** Replace the cached user after a profile update. */
  setUser: (user: User) => void;
};

export type LoginPayload = {
  email?: string;
  phone?: string;
  password: string;
  captcha_token?: string;
};

const AuthContext = createContext<AuthState | null>(null);

/** `/auth/me` returns either the user directly or `{ user: {...} }`. */
function unwrapUser(data: unknown): User | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (d.user && typeof d.user === 'object') return d.user as User;
  if (typeof d.id === 'string' || typeof d.id === 'number') return d as unknown as User;
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [booting, setBooting] = useState(true);

  const clearSession = useCallback(() => {
    setToken(null);
    setUserState(null);
  }, []);

  // A 401 anywhere in the app drops the session rather than leaving a
  // half-authenticated UI on screen.
  useEffect(() => {
    setUnauthorizedHandler(() => setUserState(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUserState(null);
      return;
    }
    try {
      const data = await api.get('/auth/me');
      const next = unwrapUser(data);
      if (next) setUserState(next);
      else clearSession();
    } catch {
      // Token rejected or network down — treat as signed out.
      clearSession();
    }
  }, [clearSession]);

  // Restore the session on first load.
  useEffect(() => {
    let active = true;
    (async () => {
      await refresh();
      if (active) setBooting(false);
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await api.post<LoginResult>('/auth/login', payload, { anonymous: true });

    // MFA-enabled accounts get a challenge instead of a session token.
    if (data?.requires_mfa) return data;

    if (data?.token) setToken(data.token);
    const next = unwrapUser(data) ?? data?.user ?? null;
    if (next) setUserState(next);
    return data;
  }, []);

  const verifyMfa = useCallback(async (mfaToken: string, code: string) => {
    const data = await api.post<LoginResult>(
      '/auth/mfa/verify-login',
      { code },
      // The challenge token from /auth/login authorises this one call.
      { token: mfaToken },
    );
    if (data?.token) setToken(data.token);
    const next = data?.user ?? unwrapUser(data);
    if (next) setUserState(next);
    return data;
  }, []);

  const register = useCallback(async (payload: Record<string, unknown>) => {
    const data = await api.post<LoginResult>('/auth/register', payload, { anonymous: true });
    if (data?.token) setToken(data.token);
    const next = data?.user ?? unwrapUser(data);
    if (next) setUserState(next);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if the call fails, drop the local session.
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      booting,
      isAuthenticated: Boolean(user),
      login,
      verifyMfa,
      register,
      logout,
      refresh,
      setUser: setUserState,
    }),
    [user, booting, login, verifyMfa, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
