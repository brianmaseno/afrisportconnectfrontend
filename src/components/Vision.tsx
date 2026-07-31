import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { media } from '../lib/media';
import './Vision.css';

const stakeholders = [
  {
    n: '01',
    who: 'People across the game',
    benefit: 'Supporters, players, coaches, officials and families—each with a relevant experience.',
  },
  {
    n: '02',
    who: 'Clubs & institutions',
    benefit: 'Shared tools for clubs, academies, schools, leagues and federations.',
  },
  {
    n: '03',
    who: 'Partners & public value',
    benefit: 'Sponsors, media, governments and researchers measuring real football impact.',
  },
];

const principles = [
  'People first',
  'Football at the centre',
  'Trust by design',
  'Intelligence with responsibility',
  'Open collaboration',
];

export function Vision() {
  return (
    <section className="vision" id="vision">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow" dir="left">
            Product vision
          </Reveal>
          <Reveal>
            <h2 className="display">
              Africa&apos;s football super app and <span className="accent">digital ecosystem.</span>
            </h2>
            <p>
              Afrisport Connect unifies the continent&apos;s football community—strengthening clubs,
              institutions and people with shared digital infrastructure for participation,
              learning, commerce, governance and measurable impact.
            </p>
          </Reveal>
        </div>

        <div className="vision-body">
          <Reveal className="vision-statement" dir="left">
            <figure className="vision-figure media-frame">
              <img
                src={media.streetFootball}
                alt="A player striking the ball on an open pitch"
                loading="lazy"
              />
              <figcaption>
                <strong>Technology should strengthen people</strong>
                <span>— not replace them.</span>
              </figcaption>
            </figure>

            <p className="vision-lead">
              Built as digital public infrastructure for African football.
            </p>
            <p className="vision-note">
              One trusted platform from grassroots clubs to continental bodies, with role-based
              access, security, privacy and ethical AI designed in from the start.
            </p>
          </Reveal>

          <div className="vision-stakeholders" role="list">
            {stakeholders.map((item, i) => (
              <Reveal
                as="div"
                key={item.who}
                className="vision-row"
                role="listitem"
                dir="right"
                delay={i * 90}
              >
                <span className="vision-n" aria-hidden="true">
                  {item.n}
                </span>
                <h3>{item.who}</h3>
                <p>{item.benefit}</p>
              </Reveal>
            ))}

            <Reveal className="vision-cta-row" delay={280}>
              <Link className="link-arrow" to="/ecosystem">
                Explore all 12 stakeholder domains <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </div>

        <Reveal className="vision-principles" aria-label="Product principles" stagger>
          {principles.map((principle) => (
            <span key={principle} className="chip">
              {principle}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
