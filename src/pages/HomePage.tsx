import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { Ticker } from '../components/Ticker';
import { Vision } from '../components/Vision';
import { Platform } from '../components/Platform';
import { Impact } from '../components/Impact';
import { Testimonial } from '../components/Testimonial';
import { Download } from '../components/Download';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { media } from '../lib/media';
import { BRAND } from '../lib/brand';
import './HomePage.css';

const destinations = [
  {
    to: '/platform',
    title: 'Platform',
    body: 'Matches, clubs, learning, marketplace and journeys in one app.',
    image: media.matchAction,
    feature: true,
  },
  {
    to: '/commerce',
    title: 'Commerce',
    body: 'Tickets, merch, memberships and football marketplace value.',
    image: media.commerceMerch,
    feature: true,
  },
  {
    to: '/ecosystem',
    title: 'Ecosystem',
    body: 'Fans, players, clubs, sponsors and institutions—connected.',
    image: media.nightMatch,
  },
  {
    to: '/governance',
    title: 'Governance',
    body: 'Board, leadership, committees and the PMO that deliver with discipline.',
    image: media.governanceMeeting,
  },
  {
    to: '/roadmap',
    title: 'Roadmap',
    body: 'Eight phases from mobilisation to continental optimisation.',
    image: media.pitchAerial,
  },
  {
    to: '/investment',
    title: 'Investment',
    body: 'Funding channels, CapEx/OpEx and long-term sustainability.',
    image: media.investmentCapital,
  },
  {
    to: '/resilience',
    title: 'Resilience',
    body: 'Risk, continuity, crisis leadership and recovery.',
    image: media.stadiumTunnel,
  },
  {
    to: '/impact',
    title: 'Impact',
    body: 'MEL, ESG and outcomes beyond downloads and revenue.',
    image: media.grassrootsHuddle,
  },
  {
    to: '/delivery',
    title: 'Delivery',
    body: 'CEDS playbook—discover to operate with one handbook.',
    image: media.deliveryTeam,
  },
  {
    to: '/reference',
    title: 'Reference',
    body: 'Frameworks, models, checklist and master index.',
    image: media.referenceLibrary,
  },
  {
    to: '/trust',
    title: 'Trust',
    body: 'Identity, privacy, security and resilience by design.',
    image: media.trustSecurity,
  },
];

export function HomePage() {
  return (
    <>
      <Seo
        description={`${BRAND.description} Founded by ${BRAND.founder.name}. Official site ${BRAND.domain}.`}
        path="/"
      />
      <Hero />
      <Ticker />
      <Vision />

      <section className="home-destinations" aria-label="Explore Afrisport Connect">
        <div className="shell">
          <div className="section-head">
            <Reveal className="eyebrow" dir="left">
              Explore
            </Reveal>
            <Reveal>
              <h2 className="display">
                Go deeper — <span className="accent">page by page.</span>
              </h2>
              <p>Product, people, technology and trust each get their own stage.</p>
            </Reveal>
          </div>

          <Reveal className="home-dest-grid" stagger>
            {destinations.map((item) => (
              <article
                key={item.to}
                className={`home-dest${item.feature ? ' home-dest-feature' : ''}`}
              >
                <Link to={item.to} className="home-dest-link">
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
                  <div className="home-dest-copy">
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                    <em aria-hidden="true">Explore →</em>
                  </div>
                </Link>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <Platform />
      <Impact />
      <Testimonial />
      <Download />
    </>
  );
}
