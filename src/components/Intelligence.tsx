import { Reveal } from './Reveal';
import './Intelligence.css';

const principles = [
  'Human-centred',
  'Responsible AI',
  'Explainable',
  'Private & secure',
  'Fair & inclusive',
  'Human oversight',
];

const domains = [
  {
    n: '01',
    title: 'Predictive',
    body: 'Demand, membership, scheduling and development trend foresight.',
  },
  {
    n: '02',
    title: 'Conversational',
    body: 'Multilingual assistants, natural search and guided support.',
  },
  {
    n: '03',
    title: 'Decision',
    body: 'Dashboards, scenarios and recommendations with human review.',
  },
  {
    n: '04',
    title: 'Operational',
    body: 'Workflow automation, routing, alerts and exception detection.',
  },
  {
    n: '05',
    title: 'Personal',
    body: 'Tailored home, learning, matches and marketplace suggestions.',
  },
  {
    n: '06',
    title: 'Collective',
    body: 'Ecosystem insights for football development and collaboration.',
  },
];

const capabilities = [
  'Intelligent search',
  'Recommendations',
  'Knowledge assistant',
  'Summarisation',
  'Translation-ready',
  'Pattern detection',
  'Automation',
  'Analytics support',
];

export function Intelligence() {
  return (
    <section className="intelligence" id="intelligence">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Intelligence layer</Reveal>
          <Reveal>
            <h2 className="display">Responsible AI across the football ecosystem.</h2>
            <p>
              The Afrisport Connect Intelligence Layer embeds assistants, recommendations and decision
              support into every domain—always with transparency, privacy and human accountability.
            </p>
          </Reveal>
        </div>

        <Reveal className="intel-principles" aria-label="CCIL principles">
          <p className="intel-label">CCIL principles</p>
          <div className="intel-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="intel-domains" role="list">
          {domains.map((domain) => (
            <Reveal as="article" key={domain.n} className="intel-domain" role="listitem">
              <span className="intel-n" aria-hidden="true">
                {domain.n}
              </span>
              <h3>{domain.title}</h3>
              <p>{domain.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="intel-caps" aria-label="AI capability catalogue">
          <p className="intel-label">Capability catalogue</p>
          <div className="intel-cap-pills">
            {capabilities.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="intel-note">
          <strong>AI assists. People decide.</strong> Clear labelling, feedback paths and oversight
          keep automation helpful—never a substitute for coaches, officials or community judgement.
        </Reveal>
      </div>
    </section>
  );
}
