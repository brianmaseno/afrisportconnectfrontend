import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { api } from '../lib/api';
import { media } from '../lib/media';
import type { MembershipTier } from '../lib/types';
import './PricingPage.css';

/**
 * Seeded from the live membership tiers so the page renders instantly and
 * still works with no backend — prices refresh from the API when it is
 * reachable (see the effect below).
 */
type Plan = {
  slug: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  tagline: string;
  benefits: string[];
  featured?: boolean;
};

const FALLBACK: Plan[] = [
  {
    slug: 'free',
    name: 'Free',
    price: 0,
    currency: 'KES',
    period: 'forever',
    tagline: 'Everything you need to follow the game and find your people.',
    benefits: [
      'Club news and match centre',
      'Fixtures, results and standings',
      'Fan polls and community access',
      'Digital Fan Passport',
    ],
  },
  {
    slug: 'silver',
    name: 'Silver',
    price: 600,
    currency: 'KES',
    period: 'per month',
    tagline: 'Start earning from every match, event and challenge you join.',
    benefits: [
      'Everything in Free',
      'Reward points on every action',
      'Member discounts in the marketplace',
      'Priority chapter invitations',
    ],
  },
  {
    slug: 'gold',
    name: 'Gold',
    price: 3000,
    currency: 'KES',
    period: 'per month',
    tagline: 'The full supporter experience — access, recognition and rewards.',
    benefits: [
      'Everything in Silver',
      'VIP and members-only events',
      'Leaderboard standing and badges',
      'Premium content and analysis',
    ],
    featured: true,
  },
  {
    slug: 'platinum',
    name: 'Platinum',
    price: 500,
    currency: 'KES',
    period: 'per month',
    tagline: 'For the supporters who show up for everything.',
    benefits: [
      'Everything in Gold',
      'Priority support',
      'Exclusive merchandise drops',
      'Founding-community recognition',
    ],
  },
  {
    slug: 'impact',
    name: 'Impact',
    price: 500,
    currency: 'KES',
    period: 'per month',
    tagline: 'Put your membership behind community projects that need it.',
    benefits: [
      'Everything in Gold',
      'Impact tracking on your passport',
      'Project progress updates',
      'Named on the projects you fund',
    ],
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
    a: 'Payments run through Paystack, which supports card and mobile money across our markets. Prices are shown in Kenyan shillings.',
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

const formatPrice = (value: number, currency: string) =>
  value === 0
    ? 'Free'
    : new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);

export function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>(FALLBACK);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Refresh prices from the API when it is reachable. The page is fully
  // usable without this, so any failure is silent by design.
  useEffect(() => {
    let active = true;
    api
      .get<MembershipTier[]>('/membership/tiers', { anonymous: true })
      .then((tiers) => {
        if (!active || !Array.isArray(tiers) || !tiers.length) return;
        setPlans((current) =>
          current.map((plan) => {
            const live = tiers.find((t) => t.slug === plan.slug);
            if (!live) return plan;
            return {
              ...plan,
              name: live.name ?? plan.name,
              price: Number(live.price ?? plan.price),
              currency: live.currency ?? plan.currency,
            };
          }),
        );
      })
      .catch(() => {
        /* keep the seeded prices */
      });
    return () => {
      active = false;
    };
  }, []);

  const columns = ['free', 'silver', 'gold', 'platinum'];

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

      {/* ---------------- Plans ---------------- */}
      <section className="pricing">
        <div className="shell">
          <div className="section-head">
            <Reveal className="eyebrow" dir="left">
              Choose your tier
            </Reveal>
            <Reveal>
              <h2 className="display">
                One membership, <span className="accent">five ways in.</span>
              </h2>
              <p>
                Prices are per member and billed monthly. Free stays free — no card, no expiry.
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
                  <strong>{formatPrice(plan.price, plan.currency)}</strong>
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
              your account.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Comparison ---------------- */}
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
                      <th key={slug} scope="col" className={slug === 'gold' ? 'is-featured' : undefined}>
                        {plan?.name ?? slug}
                        <span>{plan ? formatPrice(plan.price, plan.currency) : ''}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    {columns.map((slug) => (
                      <td key={slug} className={slug === 'gold' ? 'is-featured' : undefined}>
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
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
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
