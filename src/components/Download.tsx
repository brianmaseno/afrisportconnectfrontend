import { Reveal } from './Reveal';
import { Counter } from './Counter';
import { media } from '../lib/media';
import './Download.css';

const highlights = [
  { to: 100, suffix: '%', label: 'Free to join' },
  { to: 54, suffix: '', label: 'Markets in scope' },
  { to: 24, suffix: '/7', label: 'Community & support' },
];

export function Download() {
  return (
    <section className="download" id="download">
      <div className="shell">
        <Reveal className="download-panel" dir="scale">
          <div className="download-bg" aria-hidden="true">
            <img src={media.womenFootball} alt="" loading="lazy" />
          </div>

          <div className="download-copy">
            <div className="eyebrow eyebrow-green">Your club is waiting</div>
            <h2 className="display">
              Take your <span className="accent">place.</span>
            </h2>
            <p>
              The Afrisport Connect app is coming to your store. Your download links will appear here
              as soon as they are ready.
            </p>

            <div className="store-row">
              <span className="store" aria-label="Google Play — coming soon">
                <span className="store-icon" aria-hidden="true">
                  ▶
                </span>
                <span>
                  <small>Coming soon on</small>
                  <strong>Google Play</strong>
                </span>
              </span>
              <span className="store" aria-label="App Store — coming soon">
                <span className="store-icon" aria-hidden="true">

                </span>
                <span>
                  <small>Coming soon on the</small>
                  <strong>App Store</strong>
                </span>
              </span>
            </div>
          </div>

          <div className="download-highlights">
            {highlights.map((item) => (
              <div key={item.label}>
                <Counter to={item.to} suffix={item.suffix} className="download-stat" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
