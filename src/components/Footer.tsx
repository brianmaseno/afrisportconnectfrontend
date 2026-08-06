import { Link } from 'react-router-dom';
import { brand } from '../lib/media';
import { navGroups } from '../lib/navigation';
import './Footer.css';

const socials = [
  { label: 'X', href: 'https://x.com', glyph: 'X' },
  { label: 'Instagram', href: 'https://instagram.com', glyph: 'IG' },
  { label: 'LinkedIn', href: 'https://linkedin.com', glyph: 'in' },
  { label: 'YouTube', href: 'https://youtube.com', glyph: '▶' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer grain">
      {/* Call to action lifted into the footer so every page ends on an ask */}
      <div className="footer-cta shell">
        <div className="footer-cta-inner">
          <div>
            <p className="eyebrow">One continent. One game.</p>
            <h2 className="display">
              Bring your club into <span className="accent">the movement.</span>
            </h2>
          </div>
          <div className="footer-cta-actions">
            <Link className="button button-gold" to="/download">
              Get the app <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-ghost" to="/platform">
              Explore the platform
            </Link>
          </div>
        </div>
      </div>

      <div className="shell footer-main">
        <div className="footer-grid">
          <div className="footer-intro">
            <img className="footer-logo" src={brand.lockup} alt="Afrisport Connect" />
            <p>
              Africa&apos;s football super app and digital ecosystem — connecting clubs, communities
              and opportunity through the game we love.
            </p>

            <ul className="footer-social" aria-label="Social channels">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span aria-hidden="true">{social.glyph}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {navGroups.map((group) => (
            <nav key={group.label} className="footer-col" aria-label={group.label}>
              <h3>{group.label}</h3>
              {group.items.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}

          <nav className="footer-col" aria-label="Company">
            <h3>Company</h3>
            <Link to="/about">About</Link>
            <Link to="/impact">Impact &amp; ESG</Link>
            <a href="mailto:support@clubconnect.africa">Help centre</a>
            <a href="mailto:support@clubconnect.africa?subject=Afrisport%20Connect%20feedback">
              Feedback
            </a>
            <a href="mailto:support@clubconnect.africa">Contact</a>
            <a href="/admin/login">Admin sign in</a>
          </nav>
        </div>

        <div className="footer-stores">
          <span className="footer-stores-label">Coming soon to</span>
          <div className="store-badges">
            <span className="store-badge">
              <b aria-hidden="true">▶</b>
              <span>
                <small>Coming soon on</small>
                <strong>Google Play</strong>
              </span>
            </span>
            <span className="store-badge">
              <b aria-hidden="true"></b>
              <span>
                <small>Coming soon on the</small>
                <strong>App Store</strong>
              </span>
            </span>
          </div>
        </div>

        <hr className="rule-gold" />

        <div className="footer-bottom">
          <span>© {year} Afrisport Connect. All rights reserved.</span>
          <div className="footer-legal">
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/legal">Legal framework</Link>
          </div>
          <span className="footer-motto">Official site: afrisportconnect.com</span>
        </div>
      </div>
    </footer>
  );
}
