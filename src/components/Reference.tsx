import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import './Reference.css';

const frameworks = [
  {
    code: 'CASIF™',
    name: 'Strategic Insight',
    body: 'Turns analysis into strategy, policy, investment and innovation action.',
    to: '/impact',
  },
  {
    code: 'CCIL™',
    name: 'Intelligence Layer',
    body: 'Responsible AI for personalisation, analytics and decision support.',
    to: '/technology',
  },
  {
    code: 'CEIF™',
    name: 'Ecosystem Integration',
    body: 'Coordinates clubs, federations, governments, business and community.',
    to: '/ecosystem',
  },
  {
    code: 'CCEIF™',
    name: 'Enterprise Intelligence',
    body: 'Dashboards, forecasting and executive strategic reporting.',
    to: '/analytics',
  },
  {
    code: 'CSVF™',
    name: 'Sustainable Value',
    body: 'Commercial, football, social and community value creation.',
    to: '/commerce',
  },
  {
    code: 'CGEF™',
    name: 'Growth & Engagement',
    body: 'Marketing, community, loyalty, brand and adoption.',
    to: '/growth',
  },
  {
    code: 'CEGF™',
    name: 'Enterprise Governance',
    body: 'Board, risk, compliance, strategy and accountability.',
    to: '/governance',
  },
  {
    code: 'CTDF™',
    name: 'Transformation Delivery',
    body: 'Programme management, rollout and change management.',
    to: '/roadmap',
  },
  {
    code: 'CISF™',
    name: 'Investment & Sustainability',
    body: 'Capital, revenue, financial governance and growth.',
    to: '/investment',
  },
  {
    code: 'CLCF™',
    name: 'Legal & Compliance',
    body: 'Compliance, IP, contracts, standards and ethics.',
    to: '/legal',
  },
  {
    code: 'CERF™',
    name: 'Enterprise Resilience',
    body: 'Risk, continuity, DR, crisis and preparedness.',
    to: '/resilience',
  },
  {
    code: 'CISLF™',
    name: 'Impact & Learning',
    body: 'ESG, MEL and sustainable development outcomes.',
    to: '/impact',
  },
  {
    code: 'CEDS™',
    name: 'Enterprise Delivery',
    body: 'Product, engineering, DevSecOps and continuous improvement.',
    to: '/delivery',
  },
];

const models = [
  'Vision architecture',
  'Platform architecture',
  'Information architecture',
  'User journey model',
  'AI reference architecture',
  'Security architecture',
  'Data architecture',
  'Governance architecture',
  'Value creation model',
  'Investment architecture',
];

const sequence = [
  'Vision',
  'Governance',
  'Funding',
  'Product strategy',
  'Research',
  'UX/UI',
  'Architecture',
  'Infrastructure',
  'Security',
  'AI foundation',
  'Core platform',
  'Marketplace',
  'Payments',
  'Analytics',
  'Mobile',
  'Testing',
  'Pilot',
  'National rollout',
  'Expansion',
  'Innovation',
];

const checklist = [
  'Governance approved',
  'Roadmap complete',
  'Design system live',
  'Architecture validated',
  'Security tested',
  'Accessibility reviewed',
  'Performance met',
  'APIs documented',
  'AI governance approved',
  'Privacy controls live',
  'DR tested',
  'BCM validated',
  'Analytics configured',
  'Docs complete',
  'UAT passed',
  'Release approved',
];

const acronyms = [
  'API',
  'AI',
  'CI/CD',
  'DevSecOps',
  'ESG',
  'KPI',
  'MEL',
  'MFA',
  'PMO',
  'RBAC',
  'SSO',
  'SLA',
  'RTO',
  'RPO',
];

export function Reference() {
  return (
    <section className="reference" id="reference">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Enterprise reference</Reveal>
          <Reveal>
            <h2 className="display">The authoritative knowledge foundation.</h2>
            <p>
              Appendices that consolidate frameworks, reference models, standards and checklists—so
              Afrisport Connect stays a living institutional blueprint, not a one-off document.
            </p>
          </Reveal>
        </div>

        <div className="rf-seg-head">
          <Reveal className="eyebrow">Strategic frameworks™</Reveal>
          <Reveal>
            <p className="rf-seg-copy">
              Thirteen proprietary frameworks form the intellectual architecture of the ecosystem.
            </p>
          </Reveal>
        </div>

        <div className="rf-frameworks" role="list">
          {frameworks.map((item) => (
            <Reveal as="article" key={item.code} className="rf-fw" role="listitem">
              <Link to={item.to} className="rf-fw-link">
                <span className="rf-code">{item.code}</span>
                <strong>{item.name}</strong>
                <span>{item.body}</span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="rf-models" aria-label="Reference models">
          <p className="rf-label">Enterprise reference models</p>
          <div className="rf-model-pills">
            {models.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="rf-seg-head">
          <Reveal className="eyebrow">Master implementation sequence</Reveal>
          <Reveal>
            <p className="rf-seg-copy">Recommended order from vision to continuous innovation.</p>
          </Reveal>
        </div>

        <ol className="rf-sequence">
          {sequence.map((item, index) => (
            <Reveal as="li" key={item}>
              <span className="rf-seq-n">{String(index + 1).padStart(2, '0')}</span>
              {item}
            </Reveal>
          ))}
        </ol>

        <div className="rf-seg-head">
          <Reveal className="eyebrow">Pre-production checklist</Reveal>
          <Reveal>
            <p className="rf-seg-copy">Confirm readiness before every major release.</p>
          </Reveal>
        </div>

        <ul className="rf-checklist">
          {checklist.map((item) => (
            <Reveal as="li" key={item}>
              {item}
            </Reveal>
          ))}
        </ul>

        <Reveal className="rf-acronyms" aria-label="Acronyms">
          <p className="rf-label">Acronyms &amp; abbreviations</p>
          <div className="rf-acronym-pills">
            {acronyms.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="rf-note">
          <strong>Knowledge is an institutional asset.</strong> Glossaries, standards catalogues and
          edition reviews keep the blueprint living—ready for the next wave of African football
          digital innovation.
        </Reveal>
      </div>
    </section>
  );
}
