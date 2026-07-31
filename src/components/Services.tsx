import { Reveal } from './Reveal';
import './Services.css';

const stack = [
  {
    n: '01',
    title: 'API gateway',
    body: 'Auth, authorisation, rate limits, versioning and secure routing for every client.',
  },
  {
    n: '02',
    title: 'Business services',
    body: 'Domain logic for identity, football, community, commerce, learning and more.',
  },
  {
    n: '03',
    title: 'Intelligence',
    body: 'Recommendations, search, assistants, personalisation and decision support.',
  },
  {
    n: '04',
    title: 'Integrations',
    body: 'Payments, messaging, storage, streaming and federation connectors.',
  },
  {
    n: '05',
    title: 'Data',
    body: 'Operational stores, cache, search indexes, media, audit and backups.',
  },
];

const domains = [
  { name: 'Identity', focus: 'Registration, roles, MFA and profiles' },
  { name: 'Football', focus: 'Clubs, fixtures, results and stats' },
  { name: 'Community', focus: 'Forums, messaging and campaigns' },
  { name: 'Commerce', focus: 'Marketplace, tickets and payments' },
  { name: 'Learning', focus: 'Courses, assessments and mentorship' },
  { name: 'Media', focus: 'News, video, streaming and CMS' },
  { name: 'Governance', focus: 'Policies, compliance and audit' },
  { name: 'Intelligence', focus: 'AI, reports and recommendations' },
];

const principles = [
  'API-first',
  'Domain-driven',
  'Event-ready',
  'Secure by design',
  'Observable',
  'Independently scalable',
];

export function Services() {
  return (
    <section className="services" id="services">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Digital services architecture</Reveal>
          <Reveal>
            <h2 className="display">The intelligent backbone under every matchday.</h2>
            <p>
              Afrisport Connect runs on a modular, API-first service stack—so mobile, web and
              partners share one secure platform that can scale across Africa.
            </p>
          </Reveal>
        </div>

        <Reveal className="svc-principles" aria-label="Architecture principles">
          <p className="svc-label">CDSA principles</p>
          <div className="svc-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="svc-stack" role="list">
          {stack.map((layer) => (
            <Reveal as="article" key={layer.n} className="svc-layer" role="listitem">
              <span className="svc-n" aria-hidden="true">
                {layer.n}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="svc-domains-head">
          <Reveal className="eyebrow">Service domains</Reveal>
          <Reveal>
            <p className="svc-domains-copy">
              Clear boundaries keep football ops, commerce and intelligence evolving without
              breaking the whole.
            </p>
          </Reveal>
        </div>

        <div className="svc-domains" role="list">
          {domains.map((domain) => (
            <Reveal as="div" key={domain.name} className="svc-domain" role="listitem">
              <strong>{domain.name}</strong>
              <span>{domain.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="svc-note">
          <strong>Built to endure.</strong> Versioned APIs, encrypted traffic, audit trails,
          health checks and graceful degradation keep the platform resilient as usage grows.
        </Reveal>
      </div>
    </section>
  );
}
