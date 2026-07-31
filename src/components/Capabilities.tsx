import { Reveal } from './Reveal';
import './Capabilities.css';

const domains = [
  {
    n: '01',
    title: 'Identity & Access',
    body: 'Registration, SSO, biometrics, RBAC, consent and trusted sessions.',
    status: 'Live',
  },
  {
    n: '02',
    title: 'Football Operations',
    body: 'Clubs, teams, fixtures, live match centre, scouting and competitions.',
    status: 'Live',
  },
  {
    n: '03',
    title: 'Community & Engagement',
    body: 'Chapters, memberships, rewards, predictions, fantasy and impact.',
    status: 'Live',
  },
  {
    n: '04',
    title: 'Commerce & Finance',
    body: 'Marketplace, ticketing, wallet, subscriptions and payment rails.',
    status: 'Live',
  },
  {
    n: '05',
    title: 'Learning & Talent',
    body: 'Courses, certifications, talent pathways and career development.',
    status: 'Live',
  },
  {
    n: '06',
    title: 'Media & Content',
    body: 'News, Club TV, video, galleries and editorial storytelling.',
    status: 'Live',
  },
  {
    n: '07',
    title: 'Communications',
    body: 'Messaging, notifications, announcements and support.',
    status: 'Live',
  },
  {
    n: '08',
    title: 'Intelligence & Analytics',
    body: 'AI assistant, search, recommendations and performance insight.',
    status: 'Live',
  },
  {
    n: '09',
    title: 'Governance & Admin',
    body: 'Roles, approvals, policies, audits and institutional oversight.',
    status: 'Live',
  },
  {
    n: '10',
    title: 'Integration',
    body: 'APIs, payments, identity providers and federation connectors.',
    status: 'Partial',
  },
  {
    n: '11',
    title: 'Trust & Security',
    body: 'Encryption, privacy, fraud monitoring and compliance controls.',
    status: 'Live',
  },
  {
    n: '12',
    title: 'Platform Operations',
    body: 'Monitoring, feature flags, releases and continuous innovation.',
    status: 'Live',
  },
];

export function Capabilities() {
  return (
    <section className="capabilities" id="capabilities">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Capability architecture</Reveal>
          <Reveal>
            <h2 className="display">Twelve domains. One football ecosystem.</h2>
            <p>
              The Afrisport Connect Capability Architecture maps every module—from identity and matchday
              to commerce, learning, AI and trust—so the super app can grow without fragmenting.
            </p>
          </Reveal>
        </div>

        <div className="cap-grid" role="list">
          {domains.map((domain) => (
            <Reveal as="article" key={domain.n} className="cap-item" role="listitem">
              <span className="cap-n" aria-hidden="true">
                {domain.n}
              </span>
              <div className="cap-title-row">
                <h3>{domain.title}</h3>
                <span className={`cap-status ${domain.status === 'Live' ? 'is-live' : 'is-partial'}`}>
                  {domain.status}
                </span>
              </div>
              <p>{domain.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="cap-note">
          Identity underpins every domain. Intelligence enhances them. Trust and security run through
          all of them—so modules can ship independently without breaking the whole. Machine-readable
          catalogue: <code>GET /api/v1/capabilities</code>.
        </Reveal>
      </div>
    </section>
  );
}
