import { Reveal } from './Reveal';
import './Governance.css';

const principles = [
  'Mission-driven leadership',
  'Transparency',
  'Integrity',
  'Stakeholder participation',
  'Evidence-based decisions',
  'Inclusive representation',
];

const layers = [
  {
    n: '01',
    title: 'Strategic',
    body: 'Vision, oversight, investment priorities and organisational stewardship.',
  },
  {
    n: '02',
    title: 'Executive',
    body: 'Strategy execution, enterprise performance and financial leadership.',
  },
  {
    n: '03',
    title: 'Operational',
    body: 'Service delivery, platform ops, commercial activity and CX.',
  },
  {
    n: '04',
    title: 'Digital',
    body: 'Architecture, cybersecurity, AI governance, data and interoperability.',
  },
  {
    n: '05',
    title: 'Programme',
    body: 'Projects, product delivery, change management and quality assurance.',
  },
  {
    n: '06',
    title: 'Ecosystem',
    body: 'Federations, clubs, governments, sponsors and community partners.',
  },
];

const operating = [
  { name: 'Strategy', focus: 'Vision, policies, investment and long-term planning' },
  { name: 'People', focus: 'Leadership, capability, succession and performance' },
  { name: 'Process', focus: 'Governance, delivery, controls and workflows' },
  { name: 'Technology', focus: 'Infrastructure, AI, analytics, security and ops' },
  { name: 'Partnerships', focus: 'External collaboration with shared accountability' },
];

const committees = [
  'Audit & Risk',
  'Finance & Investment',
  'Technology & Innovation',
  'AI & Digital Ethics',
  'Cybersecurity & Privacy',
  'Community & Football',
];

export function Governance() {
  return (
    <section className="governance" id="governance">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Enterprise governance</Reveal>
          <Reveal>
            <h2 className="display">Leadership for a continental institution.</h2>
            <p>
              Afrisport Connect needs more than software—it needs accountable leadership, clear
              decision rights and a Programme Management Office that delivers with discipline.
            </p>
          </Reveal>
        </div>

        <Reveal className="gv-principles" aria-label="CEGF principles">
          <p className="gv-label">CEGF principles</p>
          <div className="gv-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="gv-layers" role="list">
          {layers.map((layer) => (
            <Reveal as="article" key={layer.n} className="gv-layer" role="listitem">
              <span className="gv-n" aria-hidden="true">
                {layer.n}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="gv-seg-head">
          <Reveal className="eyebrow">Operating model</Reveal>
          <Reveal>
            <p className="gv-seg-copy">
              Five domains keep strategy, people, process, technology and partnerships aligned.
            </p>
          </Reveal>
        </div>

        <div className="gv-domains" role="list">
          {operating.map((item) => (
            <Reveal as="div" key={item.name} className="gv-domain" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="gv-pmo">
          <p className="gv-label">Programme Management Office</p>
          <h3>One PMO for portfolio, delivery and benefits.</h3>
          <p>
            Portfolio management across platform, AI &amp; data, commercial growth, community,
            infrastructure and partnerships—with schedule, budget, quality and lessons learned in
            one transparent rhythm.
          </p>
        </Reveal>

        <Reveal className="gv-committees" aria-label="Governance committees">
          <p className="gv-label">Governance committees</p>
          <div className="gv-committee-pills">
            {committees.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="gv-note">
          <strong>Governance is a strategic capability.</strong> Ethics, risk, performance and
          change management turn Afrisport Connect into a trusted continental institution—not only
          a product.
        </Reveal>
      </div>
    </section>
  );
}
