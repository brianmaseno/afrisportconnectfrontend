import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { Counter } from './Counter';
import { media, brand } from '../lib/media';
import { useParallax } from '../lib/useParallax';
import './Hero.css';

const stats = [
  { to: 54, suffix: '', label: 'African markets in scope' },
  { to: 12, suffix: '', label: 'Stakeholder domains' },
  { to: 8, suffix: '', label: 'Delivery phases' },
];

export function Hero() {
  const bgRef = useParallax<HTMLDivElement>(120);

  return (
    <section className="hero" id="top">
      <div className="hero-bg" ref={bgRef}>
        <img src={media.heroStadium} alt="" fetchPriority="high" decoding="async" />
      </div>
      <div className="hero-veil" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-content shell">
        <Reveal className="hero-badge" dir="none">
          <img src={brand.mark} alt="" width={26} height={26} />
          <span>Africa&apos;s football super app</span>
        </Reveal>

        <h1 className="display hero-title">
          <Reveal as="span" className="hero-line" delay={80}>
            More than
          </Reveal>
          <Reveal as="span" className="hero-line" delay={180}>
            a <em className="shimmer">fan.</em>
          </Reveal>
        </h1>

        <div className="hero-bottom">
          <Reveal delay={280}>
            <p className="hero-copy">
              One trusted digital ecosystem for the match, the movement and everyone behind it —
              clubs, communities and opportunity across the continent.
            </p>
            <div className="hero-actions">
              <Link className="button button-gold" to="/download">
                Join Afrisport Connect <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button-ghost" to="/platform">
                Explore the platform
              </Link>
            </div>
          </Reveal>

          <Reveal className="hero-stats" delay={400} stagger>
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <Counter to={stat.to} suffix={stat.suffix} className="hero-stat-value" />
                <span>{stat.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <a className="hero-scroll" href="#vision" aria-label="Scroll to product vision">
        <span className="hero-scroll-line" aria-hidden="true" />
        Scroll
      </a>
    </section>
  );
}
