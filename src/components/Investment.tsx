import { Reveal } from './Reveal';
import './Investment.css';

const principles = [
  'Long-term value',
  'Financial sustainability',
  'Transparent capital',
  'Diversified funding',
  'Responsible investment',
  'Continuous reinvestment',
];

const capital = [
  {
    n: '01',
    title: 'Platform development',
    body: 'Product, mobile, web, APIs, AI and enterprise integrations.',
  },
  {
    n: '02',
    title: 'Cloud infrastructure',
    body: 'Hosting, security, DR, monitoring and platform resilience.',
  },
  {
    n: '03',
    title: 'Operations',
    body: 'People, customer success, legal, governance and finance.',
  },
  {
    n: '04',
    title: 'Marketing & growth',
    body: 'Brand, acquisition, community and partnership activation.',
  },
  {
    n: '05',
    title: 'Research & innovation',
    body: 'AI research, pilots and emerging technology programmes.',
  },
  {
    n: '06',
    title: 'Continental expansion',
    body: 'Country launches, localisation and regional capacity.',
  },
];

const funding = [
  { name: 'Founder capital', focus: 'Validation, planning and early build' },
  { name: 'Strategic investors', focus: 'Mission-aligned long-term capital' },
  { name: 'Development finance', focus: 'Digital infrastructure and football development' },
  { name: 'Grants', focus: 'Youth, women\'s football, inclusion and innovation' },
  { name: 'Sponsorship', focus: 'Platform, events and community programmes' },
  { name: 'Commercial revenue', focus: 'Reinvest marketplace, tickets and memberships' },
];

const model = [
  { name: 'CapEx', focus: 'Technology, infrastructure, security and systems' },
  { name: 'OpEx', focus: 'Staff, ops, marketing, support and governance' },
  { name: 'Revenue', focus: 'Memberships, tickets, sponsorship, education, ads' },
];

export function Investment() {
  return (
    <section className="investment" id="investment">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Investment & sustainability</Reveal>
          <Reveal>
            <h2 className="display">Finance Africa&apos;s football digital future.</h2>
            <p>
              The Afrisport Connect Investment & Sustainability Framework™ balances commercial
              discipline with mission impact—diversified capital, clear governance and long-term
              reinvestment.
            </p>
          </Reveal>
        </div>

        <Reveal className="inv-principles" aria-label="CISF principles">
          <p className="inv-label">CISF principles</p>
          <div className="inv-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="inv-capital" role="list">
          {capital.map((item) => (
            <Reveal as="article" key={item.n} className="inv-cap" role="listitem">
              <span className="inv-n" aria-hidden="true">
                {item.n}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="inv-seg-head">
          <Reveal className="eyebrow">Funding channels</Reveal>
          <Reveal>
            <p className="inv-seg-copy">
              Diversified sources reduce dependency and strengthen resilience.
            </p>
          </Reveal>
        </div>

        <div className="inv-funding" role="list">
          {funding.map((item) => (
            <Reveal as="div" key={item.name} className="inv-fund" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <div className="inv-seg-head">
          <Reveal className="eyebrow">Financial model</Reveal>
          <Reveal>
            <p className="inv-seg-copy">CapEx, OpEx and evidence-based revenue forecasting.</p>
          </Reveal>
        </div>

        <div className="inv-model" role="list">
          {model.map((item) => (
            <Reveal as="div" key={item.name} className="inv-model-item" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="inv-impact">
          <p className="inv-label">Impact investment</p>
          <h3>Mission-aligned capital with measurable outcomes.</h3>
          <p>
            Participation, youth and women&apos;s football, digital inclusion, skills and community
            engagement—reported with transparent indicators that investors and partners can trust.
          </p>
        </Reveal>

        <Reveal className="inv-note">
          <strong>Sustainable growth, responsible stewardship.</strong> Financial governance,
          reserves and strategic partnerships keep Afrisport Connect investment-ready for the long
          term.
        </Reveal>
      </div>
    </section>
  );
}
