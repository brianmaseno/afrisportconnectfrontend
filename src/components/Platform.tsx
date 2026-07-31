import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { media } from '../lib/media';
import './Platform.css';

/** Line icons drawn in the same hairline style as the shield in the logo. */
const icons = {
  passport: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M8.5 17.5h7" />
    </svg>
  ),
  match: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2l3.6 2.6-1.4 4.3H9.8L8.4 9.8 12 7.2z" />
      <path d="M12 3v4.2M3.4 10.2l5-.4M20.6 10.2l-5-.4M6.6 19.6l3.2-5.5M17.4 19.6l-3.2-5.5" />
    </svg>
  ),
  community: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="9" cy="8.5" r="3.1" />
      <circle cx="17" cy="10.5" r="2.4" />
      <path d="M3 19.5c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4" />
      <path d="M16.2 14.4c2.8.2 4.8 2.1 4.8 5.1" />
    </svg>
  ),
  opportunity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M3 16.5l5.2-5.6 3.6 3.2 4.4-5.4L21 6.4" />
      <path d="M21 11V6.4h-4.6" />
      <path d="M3 20.5h18" />
    </svg>
  ),
};

const features = [
  {
    icon: icons.passport,
    title: 'Fan Passport',
    body: 'Your verified club identity, membership and impact journey—always with you.',
  },
  {
    icon: icons.match,
    title: 'Match Centre',
    body: 'Fixtures, live scores, results, standings and the stories that shape the game.',
  },
  {
    icon: icons.community,
    title: 'Chapters & Community',
    body: 'Find supporters near you, join events and build something bigger together.',
  },
  {
    icon: icons.opportunity,
    title: 'Opportunity & Impact',
    body: 'Discover learning, scholarships and challenges while earning recognition for your contribution.',
  },
];

export function Platform() {
  return (
    <section className="mission plate-dark grain" id="platform">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow" dir="left">
            Built for belonging
          </Reveal>
          <Reveal>
            <h2 className="display">
              Your club. Your people. <span className="accent">Your platform.</span>
            </h2>
            <p>
              Afrisport Connect turns support into participation—football operations, community,
              commerce, learning and impact in one modular capability architecture. The digital
              bridge between clubs and fans across Africa.
            </p>
          </Reveal>
        </div>

        <div className="mission-grid">
          <Reveal className="mission-photo media-frame" dir="left">
            <img src={media.duelAction} alt="Two players competing for the ball" loading="lazy" />
            <div className="photo-caption">
              <strong>Football starts the conversation.</strong>
              <span>Community takes it further.</span>
            </div>
          </Reveal>

          <div className="feature-stack">
            {features.map((feature, i) => (
              <Reveal
                as="article"
                key={feature.title}
                className="feature-row"
                dir="right"
                delay={i * 80}
              >
                <div className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              </Reveal>
            ))}

            <Reveal className="feature-cta" delay={340}>
              <Link className="link-arrow" to="/platform">
                See the full platform <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
