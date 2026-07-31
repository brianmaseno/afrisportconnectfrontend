import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import './Impact.css';

const items = [
  {
    n: '01',
    title: 'Earn as you engage',
    body: 'Collect points through predictions, events, learning and community challenges. Rise through the rankings and unlock meaningful rewards.',
  },
  {
    n: '02',
    title: 'Learn & grow',
    body: 'Access courses, assessments, certificates and opportunities designed around real ambition.',
  },
  {
    n: '03',
    title: 'Show your impact',
    body: 'Your Fan Passport records the difference you make—not only the team you support.',
  },
  {
    n: '04',
    title: 'Bring clubs closer',
    body: 'One connected platform for memberships, tickets, merchandise, news and direct fan participation.',
  },
];

export function Impact() {
  return (
    <section className="impact-section" id="impact">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow" dir="left">
            Beyond ninety minutes
          </Reveal>
          <Reveal>
            <h2 className="display">
              Support that creates <span className="accent">real change.</span>
            </h2>
            <p>
              Every fan can learn, lead, contribute and be seen. Afrisport Connect gives community
              action a home—and gives clubs, sponsors and partners clearer evidence of impact.
            </p>
          </Reveal>
        </div>

        <Reveal className="impact-grid" stagger>
          {items.map((item) => (
            <article key={item.n} className="impact-item">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span className="impact-number" aria-hidden="true">
                {item.n}
              </span>
            </article>
          ))}
        </Reveal>

        <Reveal className="impact-cta" delay={140}>
          <Link className="link-arrow" to="/impact">
            See how impact is measured <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
