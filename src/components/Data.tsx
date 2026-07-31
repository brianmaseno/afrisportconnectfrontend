import { Reveal } from './Reveal';
import './Data.css';

const layers = [
  {
    n: '01',
    title: 'Operational',
    body: 'Day-to-day accounts, clubs, competitions, payments, learning and messaging.',
  },
  {
    n: '02',
    title: 'Master data',
    body: 'Authoritative records for users, clubs, teams, players, venues and partners.',
  },
  {
    n: '03',
    title: 'Transactional',
    body: 'Tickets, orders, enrolments, donations, match events and community actions.',
  },
  {
    n: '04',
    title: 'Analytical',
    body: 'Dashboards, trends, performance metrics and trusted inputs for AI.',
  },
  {
    n: '05',
    title: 'Search',
    body: 'Fast discovery of clubs, players, events, courses, news and products.',
  },
  {
    n: '06',
    title: 'Metadata',
    body: 'Definitions, ownership, lineage, classification and retention rules.',
  },
  {
    n: '07',
    title: 'Archive',
    body: 'Long-term preservation, regulatory retention and controlled disposal.',
  },
];

const domains = [
  'Identity',
  'Football',
  'Community',
  'Commerce',
  'Finance',
  'Learning',
  'Media',
  'Governance',
  'Analytics',
  'AI',
  'Operations',
];

const relationships = [
  { from: 'Club', to: 'Teams', via: 'contains' },
  { from: 'Team', to: 'Players & coaches', via: 'fields' },
  { from: 'Competition', to: 'Fixtures', via: 'schedules' },
  { from: 'Fixture', to: 'Events & stats', via: 'produces' },
  { from: 'Supporter', to: 'Tickets & merch', via: 'buys' },
  { from: 'Learner', to: 'Courses', via: 'completes' },
];

export function Data() {
  return (
    <section className="data-arch" id="data">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Enterprise data framework</Reveal>
          <Reveal>
            <h2 className="display">Trusted information behind every insight.</h2>
            <p>
              Afrisport Connect treats data as a strategic asset—governed for quality, privacy and
              scale so operations, analytics and AI stay accurate and accountable.
            </p>
          </Reveal>
        </div>

        <div className="data-layers" role="list">
          {layers.map((layer) => (
            <Reveal as="article" key={layer.n} className="data-layer" role="listitem">
              <span className="data-n" aria-hidden="true">
                {layer.n}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="data-domains" aria-label="Data domains">
          <p className="data-label">Information domains</p>
          <div className="data-pills">
            {domains.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="data-model-head">
          <Reveal className="eyebrow">Conceptual model</Reveal>
          <Reveal>
            <p className="data-model-copy">
              A shared vocabulary for how football entities connect across the platform.
            </p>
          </Reveal>
        </div>

        <div className="data-rels" role="list">
          {relationships.map((row) => (
            <Reveal as="div" key={`${row.from}-${row.to}`} className="data-rel" role="listitem">
              <strong>{row.from}</strong>
              <span className="data-via">{row.via}</span>
              <span>{row.to}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="data-note">
          <strong>Privacy by default.</strong> Consent, minimisation, encryption, access control and
          audit trails protect people while unlocking responsible analytics and AI.
        </Reveal>
      </div>
    </section>
  );
}
