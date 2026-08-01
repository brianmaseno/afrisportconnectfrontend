import { api } from './api';

export type PaystackInit = {
  authorization_url?: string;
  checkout_url?: string;
  url?: string;
  reference?: string;
  access_code?: string;
  provider?: string;
};

/** Paystack returns the hosted checkout under one of a few key names. */
export function checkoutUrlOf(init: PaystackInit | null | undefined): string | null {
  if (!init) return null;
  return init.authorization_url ?? init.checkout_url ?? init.url ?? null;
}

/**
 * Send the browser to Paystack's hosted checkout. The gateway redirects back to
 * the callback the backend configured; `/payments/verify` then confirms it.
 */
export function goToCheckout(init: PaystackInit | null | undefined): boolean {
  const url = checkoutUrlOf(init);
  if (!url) return false;
  if (init?.reference) {
    try {
      window.sessionStorage.setItem('afrisport.payment.reference', init.reference);
    } catch {
      /* non-fatal */
    }
  }
  window.location.assign(url);
  return true;
}

/**
 * Where Paystack should send the customer once payment finishes. The API only
 * honours hosts on its allowlist, so this is a request, not a guarantee.
 */
export function returnUrl(): string {
  return `${window.location.origin}/app/payment/return`;
}

export const payments = {
  /** Generic charge — `purpose` is a short slug the backend records. */
  initialize: (amount: number, purpose: string, currency = 'KES', metadata?: Record<string, unknown>) =>
    api.post<PaystackInit>('/payments/initialize', {
      amount,
      purpose,
      currency,
      metadata,
      callback_url: returnUrl(),
    }),

  subscribe: (tierSlug: string) =>
    api.post<PaystackInit | null>('/membership/subscribe', {
      tier_slug: tierSlug,
      callback_url: returnUrl(),
    }),

  topUpWallet: (amount: number) => api.post<PaystackInit>('/wallet/top-up', { amount }),

  verify: (reference: string) => api.post('/payments/verify', { reference, provider: 'paystack' }),

  config: () => api.get<{ public_key?: string; currency?: string; enabled?: boolean }>('/payments/config'),

  savedCards: () => api.get('/payments/saved-cards'),

  removeCard: (id: number | string) => api.delete(`/payments/saved-cards/${id}`),
};
