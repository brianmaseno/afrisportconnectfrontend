import { Reveal } from './Reveal';
import './Trust.css';

const principles = [
  'Trust by design',
  'Security by default',
  'Privacy by design',
  'Zero-trust',
  'Identity-first',
  'Continuous monitoring',
];

const layers = [
  {
    n: '01',
    title: 'Identity',
    body: 'Secure registration, MFA, sessions and verified access for people and orgs.',
  },
  {
    n: '02',
    title: 'Application',
    body: 'Secure development, validation, API protection and dependency hygiene.',
  },
  {
    n: '03',
    title: 'Data',
    body: 'Encryption, access controls, integrity checks, backups and key care.',
  },
  {
    n: '04',
    title: 'Infrastructure',
    body: 'Hardened cloud, firewalls, load balancing, monitoring and resilience.',
  },
  {
    n: '05',
    title: 'Operations',
    body: 'Detection, vulnerability management, incident response and governance.',
  },
];

const domains = [
  { name: 'Digital identity', focus: 'Users, clubs, partners and admin roles' },
  { name: 'Access', focus: 'Least privilege, RBAC and reviewable permissions' },
  { name: 'Privacy', focus: 'Minimisation, consent and user rights' },
  { name: 'API security', focus: 'Auth, throttles, validation and abuse controls' },
  { name: 'Fraud controls', focus: 'Risk signals, lockouts and audit trails' },
  { name: 'Continuity', focus: 'Backups, recovery and crisis readiness' },
];

export function Trust() {
  return (
    <section className="trust" id="trust">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Enterprise trust architecture</Reveal>
          <Reveal>
            <h2 className="display">Security people can feel without friction.</h2>
            <p>
              Afrisport Connect protects identities, payments, football records and AI-assisted
              experiences with layered controls—so trust scales with the game.
            </p>
          </Reveal>
        </div>

        <Reveal className="trust-principles" aria-label="CETA principles">
          <p className="trust-label">CETA principles</p>
          <div className="trust-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="trust-layers" role="list">
          {layers.map((layer) => (
            <Reveal as="article" key={layer.n} className="trust-layer" role="listitem">
              <span className="trust-n" aria-hidden="true">
                {layer.n}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="trust-domains-head">
          <Reveal className="eyebrow">Trust domains</Reveal>
          <Reveal>
            <p className="trust-domains-copy">
              Identity, privacy and resilience work together—never as afterthoughts.
            </p>
          </Reveal>
        </div>

        <div className="trust-domains" role="list">
          {domains.map((domain) => (
            <Reveal as="div" key={domain.name} className="trust-domain" role="listitem">
              <strong>{domain.name}</strong>
              <span>{domain.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="trust-note">
          <strong>Assume breach. Design for containment.</strong> Continuous verification, least
          privilege and clear incident playbooks keep the ecosystem resilient when threats evolve.
        </Reveal>
      </div>
    </section>
  );
}
