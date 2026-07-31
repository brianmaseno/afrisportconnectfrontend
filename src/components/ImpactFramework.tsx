import { Reveal } from './Reveal';
import './ImpactFramework.css';

const principles = [
  'Impact by design',
  'Evidence-based decisions',
  'Continuous learning',
  'Accountability',
  'Inclusive participation',
  'Sustainable value',
];

const chain = [
  { n: '01', title: 'Inputs', body: 'Capital, technology, people, partnerships and football expertise.' },
  { n: '02', title: 'Activities', body: 'Platform, programmes, marketplace, training and community work.' },
  { n: '03', title: 'Outputs', body: 'Users, clubs, transactions, courses and AI services delivered.' },
  { n: '04', title: 'Outcomes', body: 'Participation, inclusion, governance, skills and engagement.' },
  { n: '05', title: 'Impact', body: 'Stronger football, inclusive growth and continental competitiveness.' },
];

const mel = [
  { name: 'Monitor', focus: 'Track activities and outputs in real time' },
  { name: 'Evaluate', focus: 'Effectiveness, equity, sustainability and scale' },
  { name: 'Learn', focus: 'Capture lessons and institutional knowledge' },
  { name: 'Adapt', focus: 'Improve products and programmes with evidence' },
  { name: 'Report', focus: 'Transparent results for every stakeholder' },
];

const esg = [
  {
    name: 'Environmental',
    focus: 'Efficient cloud, sustainable procurement and climate-conscious events',
  },
  {
    name: 'Social',
    focus: 'Youth, women\'s football, accessibility, skills and wellbeing',
  },
  {
    name: 'Governance',
    focus: 'Ethics, transparency, data, responsible AI and accountability',
  },
];

const kpis = [
  'Platform adoption',
  'Football development',
  'Commercial activity',
  'Community engagement',
  'Innovation',
  'ESG indicators',
];

export function ImpactFramework() {
  return (
    <section className="impact-fw" id="impact-framework">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Impact, sustainability &amp; learning</Reveal>
          <Reveal>
            <h2 className="display">Measure what matters—then learn.</h2>
            <p>
              The Afrisport Connect Impact, Sustainability &amp; Learning Framework™ turns activity into
              evidence: MEL systems, ESG practice and transparent reporting for Africa&apos;s football
              ecosystem.
            </p>
          </Reveal>
        </div>

        <Reveal className="if-principles" aria-label="CISLF principles">
          <p className="if-label">CISLF principles</p>
          <div className="if-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="if-seg-head">
          <Reveal className="eyebrow">Theory of change</Reveal>
          <Reveal>
            <p className="if-seg-copy">From investment to lasting continental impact.</p>
          </Reveal>
        </div>

        <div className="if-chain" role="list">
          {chain.map((item) => (
            <Reveal as="article" key={item.n} className="if-step" role="listitem">
              <span className="if-n" aria-hidden="true">
                {item.n}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="if-seg-head">
          <Reveal className="eyebrow">MEL system</Reveal>
          <Reveal>
            <p className="if-seg-copy">Five linked capabilities for adaptive management.</p>
          </Reveal>
        </div>

        <div className="if-mel" role="list">
          {mel.map((item) => (
            <Reveal as="div" key={item.name} className="if-mel-item" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <div className="if-seg-head">
          <Reveal className="eyebrow">ESG</Reveal>
          <Reveal>
            <p className="if-seg-copy">
              Environmental, social and governance practice across operations and partnerships.
            </p>
          </Reveal>
        </div>

        <div className="if-esg" role="list">
          {esg.map((item) => (
            <Reveal as="div" key={item.name} className="if-esg-item" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="if-kpis" aria-label="KPI domains">
          <p className="if-label">KPI domains</p>
          <div className="if-kpi-pills">
            {kpis.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="if-note">
          <strong>Success is more than downloads.</strong> Annual impact and ESG reporting—aligned
          with SDGs and Agenda 2063—keep Afrisport Connect accountable to communities, investors
          and football institutions.
        </Reveal>
      </div>
    </section>
  );
}
