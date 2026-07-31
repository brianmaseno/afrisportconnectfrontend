import { Reveal } from './Reveal';
import './Resilience.css';

const principles = [
  'Resilience by design',
  'Prevention before response',
  'Rapid detection',
  'Clear accountability',
  'Operational continuity',
  'Adaptive learning',
];

const lifecycle = [
  {
    n: '01',
    title: 'Identify',
    body: 'Strategic, operational, cyber, AI, financial and external risks.',
  },
  {
    n: '02',
    title: 'Assess',
    body: 'Likelihood, impact, velocity, detectability and dependencies.',
  },
  {
    n: '03',
    title: 'Treat',
    body: 'Avoid, mitigate, transfer, accept or plan contingencies.',
  },
  {
    n: '04',
    title: 'Monitor',
    body: 'Indicators, emerging threats and control effectiveness.',
  },
  {
    n: '05',
    title: 'Improve',
    body: 'Lessons learned into policy, training and capability.',
  },
  {
    n: '06',
    title: 'Report',
    body: 'Executive dashboards for posture and readiness.',
  },
];

const categories = [
  { name: 'Strategic', focus: 'Market, partnerships, funding and governance' },
  { name: 'Operational', focus: 'Outages, process failure and vendor performance' },
  { name: 'Cybersecurity', focus: 'Breaches, ransomware, DDoS and credentials' },
  { name: 'AI risks', focus: 'Bias, drift, hallucinations and misuse' },
  { name: 'Financial', focus: 'Liquidity, fraud, overruns and volatility' },
  { name: 'Reputational', focus: 'Misuse, misinformation and trust erosion' },
];

const pillars = [
  { name: 'Business continuity', focus: 'BIA, critical services and recovery objectives' },
  { name: 'Disaster recovery', focus: 'Backups, redundant cloud and restore drills' },
  { name: 'Crisis management', focus: 'Leadership, playbooks and escalation paths' },
  { name: 'Communications', focus: 'Users, partners, regulators and the public' },
];

export function Resilience() {
  return (
    <section className="resilience" id="resilience">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Enterprise resilience</Reveal>
          <Reveal>
            <h2 className="display">Anticipate. Absorb. Recover. Learn.</h2>
            <p>
              The Afrisport Connect Enterprise Resilience Framework™ keeps Africa&apos;s football digital
              ecosystem ready for disruption—without losing trust or critical services.
            </p>
          </Reveal>
        </div>

        <Reveal className="rs-principles" aria-label="CERF principles">
          <p className="rs-label">CERF principles</p>
          <div className="rs-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="rs-lifecycle" role="list">
          {lifecycle.map((item) => (
            <Reveal as="article" key={item.n} className="rs-step" role="listitem">
              <span className="rs-n" aria-hidden="true">
                {item.n}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="rs-seg-head">
          <Reveal className="eyebrow">Risk categories</Reveal>
          <Reveal>
            <p className="rs-seg-copy">
              Enterprise-wide coverage from strategy and cyber to AI and reputation.
            </p>
          </Reveal>
        </div>

        <div className="rs-categories" role="list">
          {categories.map((item) => (
            <Reveal as="div" key={item.name} className="rs-cat" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <div className="rs-seg-head">
          <Reveal className="eyebrow">Continuity &amp; crisis</Reveal>
          <Reveal>
            <p className="rs-seg-copy">
              Continuity plans, DR drills and crisis playbooks keep critical football services online.
            </p>
          </Reveal>
        </div>

        <div className="rs-pillars" role="list">
          {pillars.map((item) => (
            <Reveal as="div" key={item.name} className="rs-pillar" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="rs-prep">
          <p className="rs-label">Organisational preparedness</p>
          <h3>Exercises make culture—not just documents.</h3>
          <p>
            Tabletop scenarios, simulations and leadership readiness assessments turn resilience into
            habit across engineering, operations and customer success.
          </p>
        </Reveal>

        <Reveal className="rs-note">
          <strong>Resilience is a strategic capability.</strong> Designed into architecture and
          governance from day one, it protects stakeholders when disruption arrives—and strengthens
          the institution afterward.
        </Reveal>
      </div>
    </section>
  );
}
