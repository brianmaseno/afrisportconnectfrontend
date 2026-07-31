import { Reveal } from './Reveal';
import './Architecture.css';

const globalNav = [
  'Home',
  'Discover',
  'Matches',
  'Communities',
  'Marketplace',
  'Learn',
  'AI Assistant',
  'Notifications',
  'Profile',
];

const zones = [
  { name: 'Home', focus: 'Personalised entry and daily rhythm' },
  { name: 'Football', focus: 'Matches, clubs, scores and standings' },
  { name: 'Community', focus: 'Chapters, feed and local belonging' },
  { name: 'Learning', focus: 'Courses, skills and certification' },
  { name: 'Marketplace', focus: 'Tickets, merch and offers' },
  { name: 'Media Centre', focus: 'News, video and creator content' },
  { name: 'Events', focus: 'Fixtures, gatherings and RSVPs' },
  { name: 'Governance', focus: 'Roles, compliance and oversight' },
  { name: 'Analytics', focus: 'Insight for clubs and partners' },
  { name: 'Administration', focus: 'Secure ops and platform tools' },
  { name: 'AI & Intelligence', focus: 'Assistance and recommendations' },
  { name: 'Settings', focus: 'Privacy, language and preferences' },
];

const layers = [
  { n: '01', title: 'Global navigation', body: 'Primary destinations always within reach.' },
  { n: '02', title: 'Role-based menus', body: 'Supporters, clubs and partners see what they need.' },
  { n: '03', title: 'Contextual actions', body: 'Task tools appear only when they matter.' },
  { n: '04', title: 'Quick actions', body: 'Search, AI, alerts and help from anywhere.' },
  { n: '05', title: 'Trust & support', body: 'Help, privacy, terms and accessibility stay visible.' },
];

const engineering = [
  'Component-first',
  'Mobile-first',
  'Accessible',
  'Performant',
  'Secure',
  'Reusable',
  'Localisable',
  'Offline-ready',
  'Testable',
  'AI-integrated',
];

export function Architecture() {
  return (
    <section className="architecture" id="navigate">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Experience architecture</Reveal>
          <Reveal>
            <h2 className="display">Find everything without getting lost.</h2>
            <p>
              Afrisport Connect organises a football super app into clear destinations, role-aware
              menus and twelve experience zones—so the platform can grow without becoming noisy.
            </p>
          </Reveal>
        </div>

        <Reveal className="arch-global" aria-label="Global navigation destinations">
          <p className="arch-label">Layer 1 · Global navigation</p>
          <div className="arch-pills">
            {globalNav.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="arch-global" aria-label="Website sitemap">
          <p className="arch-label">Website destinations</p>
          <div className="arch-pills">
            {[
              'Home',
              'Platform',
              'Commerce',
              'Ecosystem',
              'Growth',
              'Governance',
              'Roadmap',
              'Investment',
              'Legal',
              'Resilience',
              'Delivery',
              'Reference',
              'Technology',
              'Analytics',
              'Trust',
              'Impact',
              'Download',
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="arch-layers" role="list">
          {layers.map((layer) => (
            <Reveal as="article" key={layer.n} className="arch-layer" role="listitem">
              <span className="arch-n" aria-hidden="true">
                {layer.n}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="arch-zones-head">
          <Reveal className="eyebrow">Twelve experience zones</Reveal>
          <Reveal>
            <p className="arch-zones-copy">
              Each zone scales on its own while staying connected to the rest of the ecosystem.
            </p>
          </Reveal>
        </div>

        <div className="arch-zones" role="list">
          {zones.map((zone) => (
            <Reveal as="div" key={zone.name} className="arch-zone" role="listitem">
              <strong>{zone.name}</strong>
              <span>{zone.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="arch-engineering" aria-label="Front-end engineering principles">
          <p className="arch-label">Front-end engineering framework</p>
          <div className="arch-eng-pills">
            {engineering.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="arch-note" id="accessibility">
          <strong>Inclusive by design.</strong> Accessibility, multilingual support, offline-friendly
          flows and progressive disclosure keep the experience usable across devices and network
          conditions—with reduced-motion respected automatically.
        </Reveal>
      </div>
    </section>
  );
}
