import { Reveal } from './Reveal';
import './Roadmap.css';

const principles = [
  'Vision-led execution',
  'Incremental value',
  'User-centred delivery',
  'Agile + governance',
  'Partnership-driven',
  'Measurable benefits',
];

const phases = [
  {
    n: '01',
    title: 'Vision & mobilisation',
    body: 'Charter, sponsorship, funding and stakeholder register.',
  },
  {
    n: '02',
    title: 'Discovery & design',
    body: 'Research, backlog, design system and solution architecture.',
  },
  {
    n: '03',
    title: 'Engineering & integration',
    body: 'Modules, APIs, AI, security baseline and cloud environments.',
  },
  {
    n: '04',
    title: 'Testing & QA',
    body: 'Functional, security, accessibility, UAT and go-live readiness.',
  },
  {
    n: '05',
    title: 'Pilot deployment',
    body: 'Selected clubs and academies—validate adoption and scale.',
  },
  {
    n: '06',
    title: 'National rollout',
    body: 'Onboarding, training, campaigns and partner integration.',
  },
  {
    n: '07',
    title: 'Continental expansion',
    body: 'Regional waves with local language, regulation and ops.',
  },
  {
    n: '08',
    title: 'Continuous optimisation',
    body: 'Features, AI, security, feedback and innovation cycles.',
  },
];

const waves = [
  { name: 'Wave 1', focus: 'Internal teams, pilot clubs and selected academies' },
  { name: 'Wave 2', focus: 'National federations, leagues and regional partners' },
  { name: 'Wave 3', focus: 'Grassroots, education and community programmes' },
  { name: 'Wave 4', focus: 'Continental reach, diaspora and international partners' },
];

const benefits = [
  { name: 'Football development', focus: 'Participation, governance and talent pathways' },
  { name: 'Commercial growth', focus: 'Revenue, sponsorship and marketplace activity' },
  { name: 'Community impact', focus: 'Youth, women\'s football and volunteers' },
  { name: 'Digital transformation', focus: 'Adoption, utilisation and process efficiency' },
];

export function Roadmap() {
  return (
    <section className="roadmap" id="roadmap">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Implementation roadmap</Reveal>
          <Reveal>
            <h2 className="display">From vision to continental delivery.</h2>
            <p>
              The Afrisport Connect Transformation Delivery Framework™ turns strategy into phased
              execution—pilots, national rollout and continuous improvement with measurable benefits.
            </p>
          </Reveal>
        </div>

        <Reveal className="rm-principles" aria-label="CTDF principles">
          <p className="rm-label">CTDF principles</p>
          <div className="rm-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="rm-phases" role="list">
          {phases.map((phase) => (
            <Reveal as="article" key={phase.n} className="rm-phase" role="listitem">
              <span className="rm-n" aria-hidden="true">
                {phase.n}
              </span>
              <h3>{phase.title}</h3>
              <p>{phase.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="rm-seg-head">
          <Reveal className="eyebrow">Rollout waves</Reveal>
          <Reveal>
            <p className="rm-seg-copy">
              Each wave advances only when readiness and quality criteria are met.
            </p>
          </Reveal>
        </div>

        <div className="rm-waves" role="list">
          {waves.map((item) => (
            <Reveal as="div" key={item.name} className="rm-wave" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="rm-change">
          <p className="rm-label">Change management</p>
          <h3>Prepare people as carefully as the platform.</h3>
          <p>
            Leadership engagement, training, readiness assessments and adoption support run
            alongside every phase—so federations, clubs and communities can move with confidence.
          </p>
        </Reveal>

        <div className="rm-seg-head">
          <Reveal className="eyebrow">Benefits realisation</Reveal>
          <Reveal>
            <p className="rm-seg-copy">Define, measure and review outcomes from day one.</p>
          </Reveal>
        </div>

        <div className="rm-benefits" role="list">
          {benefits.map((item) => (
            <Reveal as="div" key={item.name} className="rm-benefit" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="rm-note">
          <strong>Disciplined execution, adaptive learning.</strong> Hybrid agile delivery with
          programme governance keeps Afrisport Connect resilient from pilot to continental scale.
        </Reveal>
      </div>
    </section>
  );
}
