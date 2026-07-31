import { Reveal } from './Reveal';
import './Operations.css';

const principles = [
  'Cloud-first',
  'Automation by default',
  'DevSecOps',
  'Reliability measured',
  'Continuous delivery',
  'Infrastructure as code',
  'Observable',
  'Elastic scale',
];

const layers = [
  {
    n: '01',
    title: 'Edge',
    body: 'CDN, secure routing, threat protection and performance at the network edge.',
  },
  {
    n: '02',
    title: 'Application',
    body: 'APIs, web, admin and AI services running as portable cloud workloads.',
  },
  {
    n: '03',
    title: 'Data',
    body: 'Databases, cache, object storage, search and durable backups.',
  },
  {
    n: '04',
    title: 'Operations',
    body: 'Monitoring, logging, automation, security ops and incident response.',
  },
];

const practices = [
  { name: 'CI/CD', focus: 'Build, test, secure and release with rollback paths' },
  { name: 'IaC', focus: 'Versioned infrastructure for consistency and audit' },
  { name: 'SRE', focus: 'Availability, capacity and reliability objectives' },
  { name: 'Observability', focus: 'Logs, metrics, traces and operational dashboards' },
  { name: 'Resilience', focus: 'Health checks, failover and graceful degradation' },
  { name: 'Cost & green ops', focus: 'Right-sizing, lifecycle and efficient scale' },
];

export function Operations() {
  return (
    <section className="operations" id="operations">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Digital operations framework</Reveal>
          <Reveal>
            <h2 className="display">Built to run matchday after matchday.</h2>
            <p>
              Afrisport Connect operates as a cloud-native platform—automated, observable and
              secured through DevSecOps so growth never outruns reliability.
            </p>
          </Reveal>
        </div>

        <Reveal className="ops-principles" aria-label="CDOF principles">
          <p className="ops-label">CDOF principles</p>
          <div className="ops-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="ops-layers" role="list">
          {layers.map((layer) => (
            <Reveal as="article" key={layer.n} className="ops-layer" role="listitem">
              <span className="ops-n" aria-hidden="true">
                {layer.n}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="ops-practices-head">
          <Reveal className="eyebrow">How we operate</Reveal>
          <Reveal>
            <p className="ops-practices-copy">
              From pipelines to playbooks—engineering disciplines that keep the super app online.
            </p>
          </Reveal>
        </div>

        <div className="ops-practices" role="list">
          {practices.map((item) => (
            <Reveal as="div" key={item.name} className="ops-practice" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="ops-note">
          <strong>Scale without drama.</strong> Horizontal growth, async workers, caching and clear
          rollback keep commerce, match data and AI services resilient under continental demand.
        </Reveal>
      </div>
    </section>
  );
}
