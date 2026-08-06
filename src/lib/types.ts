/** Shapes returned by the Laravel API. Kept loose where the API is loose. */

export type Country = {
  id: number;
  name: string;
  iso2?: string;
  phone_code?: string;
  currency?: string;
  flag_emoji?: string;
  flag_url?: string;
  regions?: Region[];
};

export type Region = {
  id: number;
  country_id: number;
  name: string;
  cities?: City[];
};

export type City = { id: number; region_id: number; name: string };

export type Club = {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  banner?: string | null;
  description?: string | null;
  country_id?: number;
  primary_color?: string | null;
  secondary_color?: string | null;
  impact_pillar?: string | null;
};

export type MembershipCategory = 'individual' | 'corporate';

export type MembershipTier = {
  id: number;
  name: string;
  slug: string;
  /** individual = fans; corporate = organisations / brands */
  category?: MembershipCategory | string | null;
  description?: string | null;
  price: string | number;
  currency?: string;
  duration_days?: number | null;
  benefits?: string[];
  badge_color?: string | null;
  passport_theme?: PassportTheme | null;
  /** Lower numbers appear first on signup, membership and pricing. */
  sort_order?: number | null;
  is_active?: boolean;
  is_visible?: boolean;
};

export type PassportTheme = {
  badge?: string;
  label?: string;
  accent?: string;
  primary?: string;
};

export type FanPassport = {
  member_number?: string;
  issued_at?: string | null;
  qr_url?: string | null;
  qr_code_path?: string | null;
};

export type Subscription = {
  id?: number;
  status?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  tier?: MembershipTier | null;
};

/** Matches AuthController::formatUser. */
export type User = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  occupation?: string | null;
  is_guest?: boolean;
  referral_code?: string | null;
  country?: Country | null;
  region?: Region | null;
  city?: City | null;
  preferred_club?: Club | null;
  passport?: FanPassport | null;
  membership?: Subscription | null;
  passport_theme?: PassportTheme | null;
  loyalty_points?: number;
  loyalty_level?: string | null;
  wallet_balance?: number;
  mfa_enabled?: boolean;
  chapters?: Chapter[];
  roles?: string[];
  permissions?: string[];
  pending_membership_tier_id?: number | null;
};

export type LoginResult = {
  user?: User;
  token?: string;
  passport?: FanPassport;
  subscription?: Subscription;
  requires_mfa?: boolean;
  mfa_token?: string;
  channel?: string;
  message?: string | null;
  /**
   * Registration with a paid tier activates Free immediately and returns a
   * Paystack session here, so the account exists whether or not payment clears.
   */
  requires_payment?: boolean;
  payment?: {
    authorization_url?: string;
    checkout_url?: string;
    url?: string;
    reference?: string;
    provider?: string;
  } | null;
  pending_tier?: MembershipTier | null;
};

export type Chapter = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  /** Eager-loaded city object when present — use labelOf(). */
  city?: unknown;
  city_id?: number | null;
  members_count?: number;
  /** What the API actually returns. */
  member_count?: number;
  cover?: string | null;
  cover_image?: string | null;
};

export type FootballMatch = {
  id: number;
  /** The API returns a nested team object here, not a string — use labelOf(). */
  home_team?: unknown;
  away_team?: unknown;
  home_club?: Club | null;
  away_club?: Club | null;
  home_score?: number | null;
  away_score?: number | null;
  status?: string;
  kickoff_at?: string | null;
  competition?: { id?: number; name?: string } | string | null;
  venue?: string | null;
  status_short?: string | null;
};

export type NewsItem = {
  id: number;
  title: string;
  slug?: string;
  excerpt?: string | null;
  body?: string | null;
  image?: string | null;
  published_at?: string | null;
  club?: Club | null;
};

export type EventItem = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  location?: string | null;
  cover?: string | null;
  is_free?: boolean;
  price?: string | number | null;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  currency?: string;
  image?: string | null;
  images?: string[];
  description?: string | null;
  category?: string | { name?: string } | null;
  stock?: number | null;
};

export type Course = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  cover?: string | null;
  level?: string | null;
  duration_minutes?: number | null;
  lessons_count?: number;
};

export type NotificationItem = {
  id: number | string;
  title?: string;
  body?: string | null;
  message?: string | null;
  type?: string | null;
  read_at?: string | null;
  created_at?: string | null;
};

export type RewardBalance = {
  balance?: number;
  points?: number;
  loyalty_points?: number;
  level?: string | null;
  next_level?: string | null;
};

export type Ticket = {
  id: number;
  reference?: string;
  status?: string;
  event?: EventItem | null;
  category?: string | null;
  qr_url?: string | null;
  created_at?: string | null;
};
