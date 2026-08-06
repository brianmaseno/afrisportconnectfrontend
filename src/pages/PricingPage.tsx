import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { api } from '../lib/api';
import { formatMembershipUsd, toUsdAmount } from '../lib/format';
import { media } from '../lib/media';
import type { MembershipTier } from '../lib/types';
import './PricingPage.css';

type Plan = {
  id?: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  tagline: string;
  benefits: string[];
  featured?: boolean;
  sort_order: number;
};

const FALLBACK: Plan[] = [
  {
    slug: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    period: 'forever',
    tagline: 'Everything you need to follow the game and find your people.',
    benefits: [
      'Club news and match centre',
      'Fixtures, results and standings',
      'Fan polls and community access',
      'Digital Fan Passport',
    ],
    sort_order: 1,
  },
  {
    slug: 'silver',
    name: 'Silver',
    price: 0.77,
    currency: 'USD',
    period: 'per month',
    tagline: 'Start earning from every match, event and challenge you join.',
    benefits: [
      'Everything in Free',
      'Reward points on every action',
      'Member discounts in the marketplace',
      'Priority chapter invitations',
    ],
    sort_order: 2,
  },
  {
    slug: 'gold',
    name: 'Gold',
    price: 2.31,
    currency: 'USD',
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
  },
  {
    slug: 'platinum',
    name: 'Platinum',
    price: 3.85,
    currency: 'USD',
    period: 'per month',
    tagline: 'For the supporters who show up for everything.',
    benefits: [
      'Everything in Gold',
      'Priority support',
      'Exclusive merchandise drops',
      'Founding-community recognition',
    ],
    sort_order: 4,
  },
  {
    slug: 'impact',
    name: 'Impact',
    price: 3.85,
    currency: 'USD',
    period: 'per month',
    tagline: 'Put your membership behind community projects that need it.',
    benefits: [
      'Everything in Gold',
      'Impact tracking on your passport',
      'Project progress updates',
      'Named on the projects you fund',
    ],
    sort_order: 5,
  },
];

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
    q: 'Can I start free?',
    a: 'Yes. Free is a full membership, not a trial — you keep your Fan Passport, your club, the match centre and community access for as long as you like.',
  },
  {
    q: 'How do I pay?',
    a: 'Payments run through Paystack, which supports card and mobile money across our markets. Prices on this page are shown in US dollars (USD).',
  },
  {
    q: 'Can I change or cancel my tier?',
    a: 'Any time, from Membership in your account. Changes take effect at the end of the current billing period and you keep access until then.',
  },
  {
    q: 'What happens to my points if I downgrade?',
    a: 'You keep every point and badge you have earned. Only the ongoing benefits of the higher tier stop.',
  },
  {
    q: 'Do clubs and chapters get their own pricing?',
    a: 'Yes — clubs, academies and institutions are onboarded separately. Talk to us about an organisation plan.',
  },
];

const formatUsd = (value: number) =>
  value <= 0 ? 'Free' : formatMembershipUsd(value, 'USD');

function tierToPlan(t: MembershipTier, index: number): Plan {
  const benefits = Array.isArray(t.benefits)
    ? t.benefits.slice(0, 4).map((b) => String(b).replace(/_/g, ' '))
    : [];
  const usd = toUsdAmount(t.price, t.currency ?? 'KES');
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    price: usd,
    currency: 'USD',
    period: usd > 0 ? 'per month' : 'forever',
    tagline: t.description?.trim() || 'Full membership benefits for Afrisport Connect fans.',
    benefits: benefits.length
      ? benefits
      : ['Fan Passport', 'Match centre', 'Community access'],
    featured: t.slug === 'gold' || index === 2,
    sort_order: t.sort_order ?? index,
  };
}

export function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>(FALLBACK);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    let active = true;
    api
      .get<MembershipTier[]>('/membership/tiers', {
        anonymous: true,
        query: { category: 'individual' },
      })
      .then((tiers) => {
        if (!active || !Array.isArray(tiers) || !tiers.length) return;
        const sorted = [...tiers]
          .filter((t) => t.is_visible !== false)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id)
          .map(tierToPlan);
        if (sorted.length) setPlans(sorted);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      active = false;
    };
  }, []);

  const columns = useMemo(
    () => plans.slice(0, 4).map((p) => p.slug),
    [plans],
  );

  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Support your club. Get more back."
        copy="Every tier starts with the same promise — your club, your community and your Fan Passport. Choose how far you want to take it."
        image={media.fansCelebrate}
        imagePosition="42%"
        ctaHref="/signup"
        ctaLabel="Start free"
        secondaryHref="#compare"
        secondaryLabel="Compare tiers"
      />

      <section className="pricing">
        <div className="shell">
          <div className="section-head">
            <Reveal className="eyebrow" dir="left">
              Choose your tier
            </Reveal>
            <Reveal>
              <h2 className="display">
                One membership, <span className="accent">priced in USD.</span>
              </h2>
              <p>
                Prices are per member, billed monthly, and shown in US dollars. Free stays free —
                no card, no expiry.
              </p>
            </Reveal>
          </div>

          <Reveal className="pricing-grid" stagger>
            {plans.map((plan) => (
              <article
                key={plan.slug}
                className={`price-card${plan.featured ? ' price-card-featured' : ''}`}
              >
                {plan.featured && <span className="price-flag">Most popular</span>}

                <header>
                  <h3>{plan.name}</h3>
                  <p className="price-tagline">{plan.tagline}</p>
                </header>

                <p className="price-amount">
                  <strong>{formatUsd(plan.price)}</strong>
                  {plan.price > 0 && <span>/{plan.period.replace('per ', '')}</span>}
                </p>

                <ul className="price-benefits">
                  {plan.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <Link
                  className={`button ${plan.featured ? 'button-gold' : 'button-outline'} price-cta`}
                  to="/signup"
                >
                  {plan.price === 0 ? 'Start free' : `Choose ${plan.name}`}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </Reveal>

          <Reveal className="pricing-note" delay={120}>
            <p>
              Paying by card or mobile money through Paystack. Cancel or change tier any time from
              your account. Display order is controlled from the admin membership tiers page.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pricing-compare plate-dark grain" id="compare">
        <div className="shell">
          <div className="section-head">
            <Reveal className="eyebrow" dir="left">
              Compare
            </Reveal>
            <Reveal>
              <h2 className="display">
                What each tier <span className="accent">unlocks.</span>
              </h2>
              <p>Everything below is included at the tier shown and every tier above it.</p>
            </Reveal>
          </div>

          <Reveal className="compare-scroll" dir="none">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {columns.map((slug) => {
                    const plan = plans.find((p) => p.slug === slug);
                    return (
                      <th
                        key={slug}
                        scope="col"
                        className={plan?.featured ? 'is-featured' : undefined}
                      >
                        {plan?.name ?? slug}
                        <span>{plan ? formatUsd(plan.price) : ''}</span>
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
                      const plan = plans.find((p) => p.slug === slug);
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
