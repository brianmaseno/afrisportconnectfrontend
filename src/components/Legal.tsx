import { Reveal } from './Reveal';
import './Legal.css';

const principles = [
  'Compliance by design',
  'Integrity & accountability',
  'Stakeholder rights',
  'Responsible innovation',
  'IP stewardship',
  'International interoperability',
];

const domains = [
  {
    n: '01',
    title: 'Corporate governance',
    body: 'Structure, board duties, policies and delegation of authority.',
  },
  {
    n: '02',
    title: 'Digital governance',
    body: 'Platform, AI, cybersecurity and enterprise data governance.',
  },
  {
    n: '03',
    title: 'Contractual governance',
    body: 'User, partner, vendor, service and licensing agreements.',
  },
  {
    n: '04',
    title: 'Intellectual property',
    body: 'Brand, software, designs, frameworks and digital content.',
  },
  {
    n: '05',
    title: 'Regulatory governance',
    body: 'Jurisdiction-aware compliance with qualified legal counsel.',
  },
  {
    n: '06',
    title: 'Standards governance',
    body: 'Alignment with recognised international best practice.',
  },
];

const focus = [
  { name: 'Privacy', focus: 'Lawful processing, minimisation, retention and rights' },
  { name: 'Responsible AI', focus: 'Human oversight, fairness, risk and review' },
  { name: 'Accessibility', focus: 'Assistive tech, clear language and inclusion' },
  { name: 'Open source', focus: 'Licence review, SCA and dependency hygiene' },
  { name: 'Third parties', focus: 'Due diligence, security and exit planning' },
  { name: 'Records', focus: 'Classification, retention, disposal and audit trails' },
];

const standards = [
  'Information security',
  'Privacy management',
  'Quality & service',
  'Business continuity',
  'Risk management',
  'AI governance',
];

export function Legal() {
  return (
    <section className="legal" id="legal">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Legal & compliance</Reveal>
          <Reveal>
            <h2 className="display">Trusted, compliant, globally aligned.</h2>
            <p>
              The Afrisport Connect Legal & Compliance Framework™ embeds rights protection, IP
              stewardship and standards alignment into every layer of the digital institution.
            </p>
          </Reveal>
        </div>

        <Reveal className="lg-principles" aria-label="CLCF principles">
          <p className="lg-label">CLCF principles</p>
          <div className="lg-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="lg-domains" role="list">
          {domains.map((item) => (
            <Reveal as="article" key={item.n} className="lg-domain" role="listitem">
              <span className="lg-n" aria-hidden="true">
                {item.n}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="lg-seg-head">
          <Reveal className="eyebrow">Compliance in practice</Reveal>
          <Reveal>
            <p className="lg-seg-copy">
              Privacy, AI, accessibility and third-party controls run as continuous programmes—not
              one-off checklists.
            </p>
          </Reveal>
        </div>

        <div className="lg-focus" role="list">
          {focus.map((item) => (
            <Reveal as="div" key={item.name} className="lg-focus-item" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="lg-ip">
          <p className="lg-label">Intellectual property</p>
          <h3>Protect the brand, product and proprietary frameworks.</h3>
          <p>
            From visual identity and source code to CASIF™, CCIL™, CEGF™ and related methodologies—IP
            is governed as a long-term organisational asset across Africa and beyond.
          </p>
        </Reveal>

        <Reveal className="lg-standards" aria-label="Standards alignment">
          <p className="lg-label">International standards</p>
          <div className="lg-standard-pills">
            {standards.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="lg-note">
          <strong>Compliance by design.</strong> Cross-border expansion proceeds with legal due
          diligence, transparent policies and continuous monitoring—so trust scales with the
          platform.
        </Reveal>
      </div>
    </section>
  );
}
