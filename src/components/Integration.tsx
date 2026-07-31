import { Reveal } from './Reveal';
import './Integration.css';

const principles = [
  'API-first',
  'Open standards',
  'Secure by design',
  'Modular integrations',
  'Event-ready',
  'Partner enablement',
];

const layers = [
  {
    n: '01',
    title: 'Experience',
    body: 'Mobile, web, partner portals, admin tools and AI assistants.',
  },
  {
    n: '02',
    title: 'API gateway',
    body: 'Auth, routing, rate limits, versioning and traffic control.',
  },
  {
    n: '03',
    title: 'Integration services',
    body: 'Orchestration, transformation, events and partner connectivity.',
  },
  {
    n: '04',
    title: 'External partners',
    body: 'Federations, banks, payments, media, education and sponsors.',
  },
  {
    n: '05',
    title: 'Enterprise data',
    body: 'Secure exchange, metadata, audit trails and analytics.',
  },
];

const domains = [
  { name: 'Payments', focus: 'Tickets, memberships, merch, donations and fees' },
  { name: 'Football orgs', focus: 'Fixtures, clubs, leagues and academies' },
  { name: 'Media', focus: 'News, streaming and rights-aware content' },
  { name: 'Learning', focus: 'Courses, certifications and institutions' },
  { name: 'Sponsorship', focus: 'Campaigns, activation and commercial tools' },
  { name: 'Community', focus: 'Campaigns, sharing and engagement channels' },
];

export function Integration() {
  return (
    <section className="integration" id="integration">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Ecosystem integration</Reveal>
          <Reveal>
            <h2 className="display">One platform. Many trusted connections.</h2>
            <p>
              Afrisport Connect links payments, federations, media, learning and sponsors through
              secure APIs—so African football can collaborate without rebuilding everything twice.
            </p>
          </Reveal>
        </div>

        <Reveal className="int-principles" aria-label="CEIF principles">
          <p className="int-label">CEIF principles</p>
          <div className="int-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="int-layers" role="list">
          {layers.map((layer) => (
            <Reveal as="article" key={layer.n} className="int-layer" role="listitem">
              <span className="int-n" aria-hidden="true">
                {layer.n}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="int-domains-head">
          <Reveal className="eyebrow">Integration domains</Reveal>
          <Reveal>
            <p className="int-domains-copy">
              From kick-off to checkout—partners plug into the same governed ecosystem.
            </p>
          </Reveal>
        </div>

        <div className="int-domains" role="list">
          {domains.map((domain) => (
            <Reveal as="div" key={domain.name} className="int-domain" role="listitem">
              <strong>{domain.name}</strong>
              <span>{domain.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="int-note">
          <strong>Connect with confidence.</strong> Strong authentication, audit trails and partner
          lifecycle controls keep every integration secure, observable and ready to grow.
        </Reveal>
      </div>
    </section>
  );
}
