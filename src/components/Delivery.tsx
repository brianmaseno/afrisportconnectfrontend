import { Reveal } from './Reveal';
import './Delivery.css';

const principles = [
  'Strategy drives execution',
  'User needs guide design',
  'Security by default',
  'Modular scalability',
  'Quality is shared',
  'Documentation is a product',
];

const phases = [
  { n: '01', title: 'Discover', body: 'Stakeholders, research, analysis and vision refinement.' },
  { n: '02', title: 'Define', body: 'Requirements, IA, UX strategy, architecture and security.' },
  { n: '03', title: 'Design', body: 'Wireframes, prototypes, design system and usability.' },
  { n: '04', title: 'Build', body: 'Front-end, APIs, AI, mobile and infrastructure.' },
  { n: '05', title: 'Verify', body: 'Functional, performance, security, a11y and UAT.' },
  { n: '06', title: 'Release', body: 'Deploy, validate, monitor and communicate.' },
  { n: '07', title: 'Operate', body: 'Support, incidents, optimisation and learning.' },
];

const standards = [
  { name: 'Product', focus: 'Vision, backlog, acceptance criteria and analytics' },
  { name: 'Engineering', focus: 'Secure coding, reviews, CI/CD and conventions' },
  { name: 'UX & design', focus: 'Human-centred, accessible, mobile-first consistency' },
  { name: 'Documentation', focus: 'ADRs, APIs, runbooks, DR and release notes' },
  { name: 'DevSecOps', focus: 'Build, scan, provision, deploy and rollback' },
  { name: 'Quality', focus: 'Unit to UAT, defects prioritised by risk' },
];

const maturity = [
  { level: 'L1', title: 'Foundation', body: 'Basic governance, engineering and docs.' },
  { level: 'L2', title: 'Standardised', body: 'Consistent processes and reusable controls.' },
  { level: 'L3', title: 'Integrated', body: 'Cross-functional automation and analytics.' },
  { level: 'L4', title: 'Optimised', body: 'AI-assisted engineering and advanced DevSecOps.' },
  { level: 'L5', title: 'Adaptive', body: 'Data-driven decisions and institutional learning.' },
];

export function Delivery() {
  return (
    <section className="delivery" id="delivery">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">How we build</Reveal>
          <Reveal>
            <h2 className="display">From vision to executable craft.</h2>
            <p>
              The Afrisport Connect Enterprise Delivery System™ is the operational handbook for everyone
              who designs, builds, ships and improves Africa&apos;s football super app.
            </p>
          </Reveal>
        </div>

        <Reveal className="dl-principles" aria-label="CEDS principles">
          <p className="dl-label">CEDS principles</p>
          <div className="dl-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="dl-goals">
          <p className="dl-label">Five delivery goals</p>
          <ul>
            <li>Exceptional user experiences</li>
            <li>Enterprise-grade quality and security</li>
            <li>Scalable, modular growth</li>
            <li>Governance and compliance by design</li>
            <li>Sustainable value for African football</li>
          </ul>
        </Reveal>

        <div className="dl-phases" role="list">
          {phases.map((item) => (
            <Reveal as="article" key={item.n} className="dl-phase" role="listitem">
              <span className="dl-n" aria-hidden="true">
                {item.n}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="dl-seg-head">
          <Reveal className="eyebrow">Delivery standards</Reveal>
          <Reveal>
            <p className="dl-seg-copy">
              Product, engineering, design, docs, DevSecOps and QA share one bar.
            </p>
          </Reveal>
        </div>

        <div className="dl-standards" role="list">
          {standards.map((item) => (
            <Reveal as="div" key={item.name} className="dl-std" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <div className="dl-seg-head">
          <Reveal className="eyebrow">Maturity model</Reveal>
          <Reveal>
            <p className="dl-seg-copy">Grow capability from foundation to adaptive enterprise.</p>
          </Reveal>
        </div>

        <div className="dl-maturity" role="list">
          {maturity.map((item) => (
            <Reveal as="div" key={item.level} className="dl-mat" role="listitem">
              <span className="dl-level">{item.level}</span>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="dl-note">
          <strong>Documentation is a core deliverable.</strong> Readiness checklists, release
          governance and knowledge management keep Afrisport Connect buildable, operable and
          improvable at continental scale.
        </Reveal>
      </div>
    </section>
  );
}
