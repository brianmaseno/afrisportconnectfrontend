import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { api, extractList } from '../lib/api';
import {
  currencyDisplayName,
  detectPricingCurrency,
  DISPLAY_CURRENCIES,
  formatMembershipPrice,
  KES_PER_USD,
  savePricingCurrency,
  USD_PER_EUR,
  type DisplayCurrency,
} from '../lib/format';
import { media } from '../lib/media';
import type { MembershipTier } from '../lib/types';
import './PricingPage.css';

type Audience = 'individual' | 'corporate';

type Plan = {
  id?: number;
  slug: string;
  name: string;
  /** Raw amount as stored for the plan (usually KES from admin). */
  amount: number;
  sourceCurrency: string;
  period: string;
  tagline: string;
  benefits: string[];
  featured?: boolean;
  sort_order: number;
  category: Audience;
};

const INDIVIDUAL_FALLBACK: Plan[] = [
  {
    slug: 'free',
    name: 'Free',
    amount: 0,
    sourceCurrency: 'KES',
    period: 'forever',
    tagline: 'Everything you need to follow the game and find your people.',
    benefits: [
      'Club news and match centre',
      'Fixtures, results and standings',
      'Fan polls and community access',
      'Digital Fan Passport',
    ],
    sort_order: 1,
    category: 'individual',
  },
  {
    slug: 'silver',
    name: 'Silver',
    amount: 100,
    sourceCurrency: 'KES',
    period: 'per month',
    tagline: 'Start earning from every match, event and challenge you join.',
    benefits: [
      'Everything in Free',
      'Reward points on every action',
      'Member discounts in the marketplace',
      'Priority chapter invitations',
    ],
    sort_order: 2,
    category: 'individual',
  },
  {
    slug: 'gold',
    name: 'Gold',
    amount: 300,
    sourceCurrency: 'KES',
    period: 'per month',
    tagline: 'The full supporter experience — access, recognition and rewards.',
    benefits: [
      'Everything in Silver',
      'VIP and members-only events',
      'Leaderboard standing and badges',
      'Premium content and analysis',
    ],
    featured: true,
    sort_order: 3,
    category: 'individual',
  },
  {
    slug: 'platinum',
    name: 'Platinum',
    amount: 500,
    sourceCurrency: 'KES',
    period: 'per month',
    tagline: 'For the supporters who show up for everything.',
    benefits: [
      'Everything in Gold',
      'Priority support',
      'Exclusive merchandise drops',
      'Founding-community recognition',
    ],
    sort_order: 4,
    category: 'individual',
  },
  {
    slug: 'impact',
    name: 'Impact',
    amount: 500,
    sourceCurrency: 'KES',
    period: 'per month',
    tagline: 'Put your membership behind community projects that need it.',
    benefits: [
      'Everything in Gold',
      'Impact tracking on your passport',
      'Project progress updates',
      'Named on the projects you fund',
    ],
    sort_order: 5,
    category: 'individual',
  },
];

const CORPORATE_FALLBACK: Plan[] = [
  {
    slug: 'corporate-starter',
    name: 'Corporate Starter',
    amount: 2500,
    sourceCurrency: 'KES',
    period: 'per month',
    tagline: 'Brand visibility for small teams and community partners.',
    benefits: [
      'Organisation profile listing',
      'Match & community visibility',
      'Up to 5 team seats',
      'Marketplace partner discounts',
    ],
    sort_order: 10,
    category: 'corporate',
  },
  {
    slug: 'corporate-partner',
    name: 'Corporate Partner',
    amount: 10000,
    sourceCurrency: 'KES',
    period: 'per month',
    tagline: 'Sponsored chapter support, campaigns and partner dashboard access.',
    benefits: [
      'Everything in Starter',
      'Campaign tools & chapter sponsorship',
      'Up to 25 team seats',
      'Priority partner support',
    ],
    featured: true,
    sort_order: 11,
    category: 'corporate',
  },
  {
    slug: 'corporate-enterprise',
    name: 'Corporate Enterprise',
    amount: 35000,
    sourceCurrency: 'KES',
    period: 'per month',
    tagline: 'Multi-club activation, custom impact reporting and dedicated support.',
    benefits: [
      'Everything in Partner',
      'Custom reporting & exclusive events',
      'Up to 100 team seats',
      'Dedicated account manager',
    ],
    sort_order: 12,
    category: 'corporate',
  },
];

const BENEFIT_LABELS: Record<string, string> = {
  news: 'Club news',
  fixtures: 'Fixtures & results',
  polls: 'Fan polls',
  community: 'Community access',
  rewards: 'Reward points',
  discounts: 'Marketplace discounts',
  all_silver: 'Everything in Silver',
  vip_events: 'VIP & members-only events',
  leaderboard: 'Leaderboard & badges',
  premium_content: 'Premium content',
  all_gold: 'Everything in Gold',
  priority_support: 'Priority support',
  exclusive_merch: 'Exclusive merchandise',
  impact_tracking: 'Impact tracking',
  project_updates: 'Project progress updates',
  brand_listing: 'Organisation brand listing',
  all_corporate_starter: 'Everything in Starter',
  campaigns: 'Campaign tools',
  chapter_sponsorship: 'Chapter sponsorship',
  all_corporate_partner: 'Everything in Partner',
  custom_reporting: 'Custom reporting',
  exclusive_events: 'Exclusive events',
  dedicated_manager: 'Dedicated account manager',
};

const COMPARISON: { feature: string; tiers: Record<string, boolean | string> }[] = [
  { feature: 'Match centre and fixtures', tiers: { free: true, silver: true, gold: true, platinum: true } },
  { feature: 'Digital Fan Passport', tiers: { free: true, silver: true, gold: true, platinum: true } },
  { feature: 'Community chapters', tiers: { free: true, silver: true, gold: true, platinum: true } },
  { feature: 'Reward points', tiers: { free: false, silver: true, gold: true, platinum: true } },
  { feature: 'Marketplace discounts', tiers: { free: false, silver: true, gold: true, platinum: true } },
  { feature: 'VIP and members-only events', tiers: { free: false, silver: false, gold: true, platinum: true } },
  { feature: 'Leaderboard and badges', tiers: { free: false, silver: false, gold: true, platinum: true } },
  { feature: 'Premium content', tiers: { free: false, silver: false, gold: true, platinum: true } },
  { feature: 'Priority support', tiers: { free: false, silver: false, gold: false, platinum: true } },
  { feature: 'Exclusive merchandise', tiers: { free: false, silver: false, gold: false, platinum: true } },
];

const FAQS = [
  {
    q: 'What is the difference between membership and corporate?',
    a: 'Membership packages are for individual fans and supporters. Corporate plans are for organisations, brands, clubs and partners that need seats, sponsorship tools and business visibility.',
  },
  {
    q: 'Can I start free as a fan?',
    a: 'Yes. Free is a full individual membership — Fan Passport, club, match centre and community access — with no card and no expiry.',
  },
  {
    q: 'Who should choose a corporate plan?',
    a: 'Businesses, sponsors, academies, institutions and clubs that want brand presence, multiple team seats, campaigns or chapter sponsorship should use Corporate Starter, Partner or Enterprise.',
  },
  {
    q: 'How do I pay?',
    a: 'Individual memberships pay through Paystack (card or mobile money). Corporate partners can pay the same way or request an invoice — talk to us for Enterprise billing.',
  },
  {
    q: 'Can I change or cancel my tier?',
    a: 'Individual members can change or cancel any time from Membership in their account. Corporate changes are handled with our partnerships team.',
  },
  {
    q: 'Why can I pick Ksh, Dollar or Euro?',
    a: 'Pick the currency that fits you: Kenya Shillings (Ksh) for locals, US Dollars for most international visitors, or Euro for Europe. The plans are the same — only the display currency changes.',
  },
];

function humanBenefit(raw: string): string {
  const key = raw.trim();
  if (BENEFIT_LABELS[key]) return BENEFIT_LABELS[key];
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function priceLabel(plan: Plan, display: DisplayCurrency): string {
  return formatMembershipPrice(plan.amount, plan.sourceCurrency, display);
}

function tierToPlan(t: MembershipTier, index: number, category: Audience): Plan {
  const benefits = Array.isArray(t.benefits)
    ? t.benefits.slice(0, 4).map((b) => humanBenefit(String(b)))
    : [];
  const amount = Number(t.price ?? 0);
  const sourceCurrency = (t.currency ?? 'KES').toUpperCase();
  const featured =
    category === 'individual'
      ? t.slug === 'gold' || index === 2
      : t.slug === 'corporate-partner' || index === 1;
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    amount: Number.isFinite(amount) ? amount : 0,
    sourceCurrency,
    period: amount > 0 ? 'per month' : 'forever',
    tagline:
      t.description?.trim() ||
      (category === 'corporate'
        ? 'Organisation plan for brands, clubs and partners on Afrisport Connect.'
        : 'Full membership benefits for Afrisport Connect fans.'),
    benefits: benefits.length
      ? benefits
      : category === 'corporate'
        ? ['Brand listing', 'Team seats', 'Partner support']
        : ['Fan Passport', 'Match centre', 'Community access'],
    featured,
    sort_order: t.sort_order ?? index,
    category,
  };
}

function mapTiers(tiers: MembershipTier[], category: Audience): Plan[] {
  return [...tiers]
    .filter((t) => t.is_visible !== false)
    .filter((t) => (t.category ?? 'individual') === category || !t.category)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id)
    .map((t, i) => tierToPlan(t, i, category));
}

function PlanCard({
  plan,
  audience,
  display,
}: {
  plan: Plan;
  audience: Audience;
  display: DisplayCurrency;
}) {
  const isCorp = audience === 'corporate';
  const paid = plan.amount > 0;
  const ctaHref = isCorp
    ? `mailto:support@clubconnect.africa?subject=${encodeURIComponent(`Corporate plan: ${plan.name}`)}`
    : '/signup';
  const ctaLabel = !paid
    ? 'Start free'
    : isCorp
      ? `Talk about ${plan.name}`
      : `Choose ${plan.name}`;

  const ctaClass = `button ${plan.featured ? 'button-gold' : 'button-outline'} price-cta`;

  return (
    <article
      className={`price-card${plan.featured ? ' price-card-featured' : ''}${isCorp ? ' price-card-corporate' : ''}`}
    >
      {plan.featured && (
        <span className="price-flag">{isCorp ? 'Recommended for partners' : 'Most popular'}</span>
      )}
      <span className={`price-audience ${isCorp ? 'is-corporate' : 'is-individual'}`}>
        {isCorp ? 'Corporate' : 'Membership'}
      </span>

      <header>
        <h3>{plan.name}</h3>
        <p className="price-tagline">{plan.tagline}</p>
      </header>

      <p className="price-amount">
        <strong>{priceLabel(plan, display)}</strong>
        {paid && <span>/{plan.period.replace('per ', '')}</span>}
      </p>

      <ul className="price-benefits">
        {plan.benefits.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      {isCorp ? (
        <a className={ctaClass} href={ctaHref}>
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </a>
      ) : (
        <Link className={ctaClass} to={ctaHref}>
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}

export function PricingPage() {
  const [individual, setIndividual] = useState<Plan[]>(INDIVIDUAL_FALLBACK);
  const [corporate, setCorporate] = useState<Plan[]>(CORPORATE_FALLBACK);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [active, setActive] = useState<Audience>('individual');
  const [display, setDisplay] = useState<DisplayCurrency>('USD');

  useEffect(() => {
    setDisplay(detectPricingCurrency());
  }, []);

  const setCurrency = (next: DisplayCurrency) => {
    setDisplay(next);
    savePricingCurrency(next);
  };

  useEffect(() => {
    let alive = true;

    const load = async (category: Audience) => {
      try {
        const raw = await api.get<unknown>('/membership/tiers', {
          anonymous: true,
          query: { category },
        });
        const tiers = extractList<MembershipTier>(raw);
        if (!alive || !tiers.length) return;
        const mapped = mapTiers(
          tiers.map((t) => ({ ...t, category: t.category ?? category })),
          category,
        );
        if (!mapped.length) return;
        if (category === 'individual') setIndividual(mapped);
        else setCorporate(mapped);
      } catch {
        /* keep fallbacks */
      }
    };

    void load('individual');
    void load('corporate');

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#corporate') setActive('corporate');
      if (window.location.hash === '#membership') setActive('individual');
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const columns = useMemo(
    () => individual.slice(0, 4).map((p) => p.slug),
    [individual],
  );

  const scrollTo = (audience: Audience) => {
    setActive(audience);
    const id = audience === 'individual' ? 'membership' : 'corporate';
    window.history.replaceState(null, '', `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currencyHint =
    display === 'KES'
      ? `Showing Kenya Shillings (Ksh). Approx. KES ${KES_PER_USD} = $1 · €1 ≈ $${USD_PER_EUR}.`
      : display === 'EUR'
        ? `Showing Euro. Approx. €1 = $${USD_PER_EUR} · KES ${KES_PER_USD} = $1.`
        : `Showing US Dollars. Approx. KES ${KES_PER_USD} = $1 · €1 ≈ $${USD_PER_EUR}.`;

  return (
    <>
      <Seo
        title="Pricing"
        description="Afrisport Connect pricing in Ksh, US Dollar or Euro — fan memberships and corporate plans."
        path="/pricing"
      />

      <PageHero
        eyebrow="Pricing"
        title="Memberships for fans. Plans for organisations."
        copy="Individual packages are for supporters. Corporate plans are for brands, clubs and partners — choose Ksh, Dollar or Euro to view prices."
        image={media.fansCelebrate}
        imagePosition="42%"
        ctaHref="#membership"
        ctaLabel="View memberships"
        secondaryHref="#corporate"
        secondaryLabel="View corporate plans"
      />

      <div className="pricing-toolbar shell">
        <nav className="pricing-switch" aria-label="Choose plan type">
          <button
            type="button"
            className={`pricing-switch-btn${active === 'individual' ? ' is-active' : ''}`}
            onClick={() => scrollTo('individual')}
            aria-current={active === 'individual' ? 'true' : undefined}
          >
            <span className="pricing-switch-kicker">For fans</span>
            Individual memberships
          </button>
          <button
            type="button"
            className={`pricing-switch-btn is-corp${active === 'corporate' ? ' is-active' : ''}`}
            onClick={() => scrollTo('corporate')}
            aria-current={active === 'corporate' ? 'true' : undefined}
          >
            <span className="pricing-switch-kicker">For organisations</span>
            Corporate plans
          </button>
        </nav>
      </div>

      <section className="pricing" id="membership">
        <div className="shell">
          <div className="section-head">
            <Reveal className="eyebrow" dir="left">
              Individual memberships
            </Reveal>
            <Reveal>
              <h2 className="display">
                For fans &amp; <span className="accent">supporters.</span>
              </h2>
              <p>
                Personal memberships for people who follow clubs, join chapters and earn on the
                platform. One account, one Fan Passport — currently shown in{' '}
                <strong>{currencyDisplayName(display)}</strong>.
              </p>
            </Reveal>

            <Reveal className="pricing-currency-inline" delay={60}>
              <label className="pricing-currency-select-wrap" htmlFor="pricing-currency-select">
                <span className="pricing-currency-label">Currencies</span>
                <select
                  id="pricing-currency-select"
                  className="pricing-currency-select"
                  value={display}
                  onChange={(e) => setCurrency(e.target.value as DisplayCurrency)}
                  aria-label="Select currency: Ksh, Dollar or Euro"
                >
                  {DISPLAY_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="pricing-currency-chips" role="group" aria-label="Quick currency">
                {DISPLAY_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={display === c.code ? 'is-active' : undefined}
                    onClick={() => setCurrency(c.code)}
                    aria-pressed={display === c.code}
                  >
                    {c.short}
                  </button>
                ))}
              </div>
              <p className="pricing-currency-hint">{currencyHint}</p>
            </Reveal>
          </div>

          <Reveal className="pricing-grid" stagger>
            {individual.map((plan) => (
              <PlanCard key={plan.slug} plan={plan} audience="individual" display={display} />
            ))}
          </Reveal>

          <Reveal className="pricing-note" delay={120}>
            <p>
              Fans pay by card or mobile money through Paystack. Cancel or change tier any time
              from your account.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pricing-compare plate-dark grain" id="compare">
        <div className="shell">
          <div className="section-head">
            <Reveal className="eyebrow" dir="left">
              Membership compare
            </Reveal>
            <Reveal>
              <h2 className="display">
                What each fan tier <span className="accent">unlocks.</span>
              </h2>
              <p>Individual memberships only — corporate benefits are listed in the section below.</p>
            </Reveal>
          </div>

          <Reveal className="compare-scroll" dir="none">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {columns.map((slug) => {
                    const plan = individual.find((p) => p.slug === slug);
                    return (
                      <th
                        key={slug}
                        scope="col"
                        className={plan?.featured ? 'is-featured' : undefined}
                      >
                        {plan?.name ?? slug}
                        <span>{plan ? priceLabel(plan, display) : ''}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    {columns.map((slug) => {
                      const plan = individual.find((p) => p.slug === slug);
                      return (
                        <td key={slug} className={plan?.featured ? 'is-featured' : undefined}>
                          {row.tiers[slug] ? (
                            <span className="tick" aria-label="Included">
                              ✓
                            </span>
                          ) : (
                            <span className="dash" aria-label="Not included">
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section className="pricing pricing-corporate" id="corporate">
        <div className="shell">
          <div className="section-head">
            <Reveal className="eyebrow" dir="left">
              Corporate plans
            </Reveal>
            <Reveal>
              <h2 className="display">
                For brands, clubs &amp; <span className="accent">partners.</span>
              </h2>
              <p>
                Organisation packages with team seats, brand listing, campaigns and sponsorship —
                separate from personal fan memberships. Prices below in{' '}
                <strong>{currencyDisplayName(display)}</strong>
                {' — '}
                <button
                  type="button"
                  className="pricing-currency-jump"
                  onClick={() =>
                    document.getElementById('pricing-currency-select')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }
                >
                  change currency
                </button>
                .
              </p>
            </Reveal>
          </div>

          <Reveal className="pricing-diff" dir="none">
            <div>
              <strong>Memberships</strong>
              <span>Fans &amp; individuals</span>
              <span>Fan Passport &amp; rewards</span>
              <span>Self-serve signup</span>
            </div>
            <div>
              <strong>Corporate</strong>
              <span>Businesses &amp; organisations</span>
              <span>Seats, campaigns &amp; sponsorship</span>
              <span>Partner onboarding</span>
            </div>
          </Reveal>

          <Reveal className="pricing-grid" stagger>
            {corporate.map((plan) => (
              <PlanCard key={plan.slug} plan={plan} audience="corporate" display={display} />
            ))}
          </Reveal>

          <Reveal className="pricing-note" delay={120}>
            <p>
              Need a custom package or invoice? Email{' '}
              <a href="mailto:support@clubconnect.africa?subject=Corporate%20partnership">
                support@clubconnect.africa
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pricing-faq">
        <div className="shell">
          <div className="section-head">
            <Reveal className="eyebrow" dir="left">
              Questions
            </Reveal>
            <Reveal>
              <h2 className="display">
                Before you <span className="accent">decide.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal className="faq-list" stagger>
            {FAQS.map((faq, i) => (
              <div key={faq.q} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <button
                  type="button"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p>{faq.a}</p>}
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
