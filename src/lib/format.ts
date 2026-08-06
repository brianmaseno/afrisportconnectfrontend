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

export function formatMoney(
  amount?: string | number | null,
  currency = 'KES',
): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  try {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: n % 1 === 0 ? 0 : 2,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}

/** Convert a tier price into USD for public pricing UI. */
export function toUsdAmount(
  amount?: string | number | null,
  currency = 'KES',
): number {
  const n = typeof amount === 'string' ? parseFloat(amount) : Number(amount ?? 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  const code = (currency || 'KES').toUpperCase();
  if (code === 'USD') return n;
  if (code === 'KES') return n / KES_PER_USD;
  return n;
}

/** Always show membership prices in USD (converting from KES when needed). */
export function formatMembershipUsd(
  amount?: string | number | null,
  currency = 'KES',
): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : Number(amount ?? 0);
  if (!Number.isFinite(n)) return '—';
  if (n <= 0) return 'Free';
  return formatMoney(toUsdAmount(n, currency), 'USD');
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
