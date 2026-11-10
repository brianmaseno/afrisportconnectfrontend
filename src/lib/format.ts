export function formatDate(value?: string | null, withTime = false): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : null),
  });
}

export function formatTime(value?: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/** "3 days ago" / "in 2 hours" */
export function relativeTime(value?: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';

  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000_000],
    ['month', 2_592_000_000],
    ['week', 604_800_000],
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
  ];

  for (const [unit, ms] of units) {
    if (abs >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return 'just now';
}

/** How many KES equal 1 USD for membership display conversion. */
export const KES_PER_USD = Number(import.meta.env.VITE_KES_PER_USD || 130) || 130;
/** How many USD equal 1 EUR for membership display conversion. */
export const USD_PER_EUR = Number(import.meta.env.VITE_USD_PER_EUR || 1.08) || 1.08;

export function formatMoney(
  amount?: string | number | null,
  currency = 'KES',
): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const code = (currency || 'KES').toUpperCase();
  const locale = code === 'USD' ? 'en-US' : code === 'EUR' ? 'en-IE' : 'en-KE';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: n % 1 === 0 ? 0 : 2,
    }).format(n);
  } catch {
    return `${code} ${n.toLocaleString()}`;
  }
}

export type DisplayCurrency = 'KES' | 'USD' | 'EUR';

export const DISPLAY_CURRENCIES: {
  code: DisplayCurrency;
  label: string;
  short: string;
}[] = [
  { code: 'KES', label: 'Ksh — Kenya Shilling', short: 'Ksh' },
  { code: 'USD', label: 'Dollar — US Dollar', short: 'Dollar' },
  { code: 'EUR', label: 'Euro — Euro', short: 'Euro' },
];

/** Convert any supported source currency into USD. */
export function toUsdAmount(
  amount?: string | number | null,
  currency = 'KES',
): number {
  const n = typeof amount === 'string' ? parseFloat(amount) : Number(amount ?? 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  const code = (currency || 'KES').toUpperCase();
  if (code === 'USD') return n;
  if (code === 'KES') return n / KES_PER_USD;
  if (code === 'EUR') return n * USD_PER_EUR;
  return n;
}

/** Convert a tier price into KES for local pricing UI. */
export function toKesAmount(
  amount?: string | number | null,
  currency = 'KES',
): number {
  return toUsdAmount(amount, currency) * KES_PER_USD;
}

/** Convert a tier price into EUR. */
export function toEurAmount(
  amount?: string | number | null,
  currency = 'KES',
): number {
  return toUsdAmount(amount, currency) / USD_PER_EUR;
}

/** Show a membership price in the visitor's chosen display currency. */
export function formatMembershipPrice(
  amount?: string | number | null,
  sourceCurrency: string = 'KES',
  display: DisplayCurrency = 'USD',
): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : Number(amount ?? 0);
  if (!Number.isFinite(n)) return '—';
  if (n <= 0) return 'Free';
  const value =
    display === 'KES'
      ? toKesAmount(n, sourceCurrency)
      : display === 'EUR'
        ? toEurAmount(n, sourceCurrency)
        : toUsdAmount(n, sourceCurrency);
  const rounded = display === 'KES' ? Math.round(value) : value;
  return formatMoney(rounded, display);
}

/** Always show membership prices in USD (converting from KES when needed). */
export function formatMembershipUsd(
  amount?: string | number | null,
  currency = 'KES',
): string {
  return formatMembershipPrice(amount, currency, 'USD');
}

const PRICING_CURRENCY_KEY = 'afrisport.pricing.currency';

/** Prefer KES for Kenyan locale/timezone; EUR for eurozone hints; otherwise USD. */
export function detectPricingCurrency(): DisplayCurrency {
  try {
    const saved = localStorage.getItem(PRICING_CURRENCY_KEY);
    if (saved === 'KES' || saved === 'USD' || saved === 'EUR') return saved;
  } catch {
    /* ignore */
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Africa/Nairobi') return 'KES';
    if (
      /^(Europe\/(Paris|Berlin|Madrid|Rome|Amsterdam|Brussels|Vienna|Lisbon|Dublin)|Atlantic\/Canary)/.test(
        tz,
      )
    ) {
      return 'EUR';
    }
  } catch {
    /* ignore */
  }

  const langs = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : [];
  if (langs.some((l) => /^en-KE/i.test(l || '') || /^sw-KE/i.test(l || '') || /^sw$/i.test(l || ''))) {
    return 'KES';
  }
  if (langs.some((l) => /^(de|fr|es|it|nl|pt-PT|fi|el)/i.test(l || ''))) {
    return 'EUR';
  }

  return 'USD';
}

export function savePricingCurrency(currency: DisplayCurrency): void {
  try {
    localStorage.setItem(PRICING_CURRENCY_KEY, currency);
  } catch {
    /* ignore */
  }
}

export function currencyDisplayName(code: DisplayCurrency): string {
  return DISPLAY_CURRENCIES.find((c) => c.code === code)?.short ?? code;
}

export function formatNumber(n?: number | null): string {
  if (n === null || n === undefined) return '0';
  return n.toLocaleString('en-US');
}

export function initials(name?: string | null): string {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Competition/venue fields come back as either a string or an object. */
export function labelOf(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'name' in (value as object)) {
    return String((value as { name?: unknown }).name ?? '');
  }
  return '';
}
