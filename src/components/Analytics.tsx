import { Reveal } from './Reveal';
import './Analytics.css';

const principles = [
  'Trusted data',
  'Evidence-based',
  'Role-aware',
  'Real-time where it matters',
  'Responsible AI',
  'Measurable impact',
];

const layers = [
  {
    n: '01',
    title: 'Acquisition',
    body: 'Transactions, football ops, commerce, learning, media and integrations.',
  },
  {
    n: '02',
    title: 'Management',
    body: 'Validation, master data, metadata, quality and governance controls.',
  },
  {
    n: '03',
    title: 'Analytics',
    body: 'Descriptive, diagnostic, predictive and trend intelligence.',
  },
  {
    n: '04',
    title: 'Business intelligence',
    body: 'Dashboards, scorecards, reports and operational monitoring.',
  },
  {
    n: '05',
    title: 'Decision support',
    body: 'Forecasting, scenarios, recommendations and human review.',
  },
  {
    n: '06',
    title: 'Presentation',
    body: 'Tailored views for executives, clubs, sponsors and partners.',
  },
];

const dashboards = [
  { name: 'Executive', focus: 'Growth, revenue, risks and strategic AI insights' },
  { name: 'Club', focus: 'Members, fixtures, tickets, merch and engagement' },
  { name: 'Federation', focus: 'Participation, competitions and development' },
  { name: 'Sponsor', focus: 'Reach, campaigns, ROI and brand visibility' },
  { name: 'Community', focus: 'Events, volunteers, youth and social impact' },
];

const kpis = [
  'Platform growth',
  'Football development',
  'Commercial performance',
  'Community impact',
  'Operational excellence',
];

export function Analytics() {
  return (
    <section className="analytics" id="analytics">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Enterprise intelligence</Reveal>
          <Reveal>
            <h2 className="display">From matchday data to strategic decisions.</h2>
            <p>
              Afrisport Connect turns participation, commerce and community activity into trusted
              dashboards, KPIs and decision support—so leaders act on evidence, not guesswork.
            </p>
          </Reveal>
        </div>

        <Reveal className="an-principles" aria-label="CCEIF principles">
          <p className="an-label">CCEIF principles</p>
          <div className="an-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="an-layers" role="list">
          {layers.map((layer) => (
            <Reveal as="article" key={layer.n} className="an-layer" role="listitem">
              <span className="an-n" aria-hidden="true">
                {layer.n}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="an-dash-head">
          <Reveal className="eyebrow">Role-specific dashboards</Reveal>
          <Reveal>
            <p className="an-dash-copy">
              The right scoreboard for each seat at the table—executives to community leaders.
            </p>
          </Reveal>
        </div>

        <div className="an-dashboards" role="list">
          {dashboards.map((item) => (
            <Reveal as="div" key={item.name} className="an-dash" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="an-kpis" aria-label="KPI framework">
          <p className="an-label">Enterprise KPI framework</p>
          <div className="an-kpi-pills">
            {kpis.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="an-note">
          <strong>AI augments. Leaders decide.</strong> Predictive insights and briefings come with
          evidence and human oversight—so football organisations measure impact with confidence.
        </Reveal>
      </div>
    </section>
  );
}
