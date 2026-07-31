import { Reveal } from './Reveal';
import './Experience.css';

export function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow eyebrow-green">Made for every day</Reveal>
          <Reveal>
            <h2 className="display">The whole game in your pocket.</h2>
            <p>
              From the first whistle to your next opportunity, Afrisport Connect keeps the moments and
              communities you care about close—whether you support, play, coach, manage or partner.
            </p>
          </Reveal>
        </div>

        <div className="phones">
          <Reveal className="phone">
            <div className="phone-screen">
              <div className="phone-top">
                <span>9:41</span>
                <span>● ● ●</span>
              </div>
              <h3>Match Centre</h3>
              <div className="app-panel green">
                <div className="app-label">Live · Premier League</div>
                <div className="score">
                  <span>ARS</span>
                  <span>2 — 1</span>
                  <span>CHE</span>
                </div>
                <div className="app-meta">78&apos; · Emirates Stadium</div>
              </div>
              <div className="app-panel">
                <div className="app-label">Next match</div>
                <div className="score">
                  <span>MCI</span>
                  <span>20:00</span>
                  <span>ARS</span>
                </div>
              </div>
              <div className="app-panel">
                <div className="app-label">Your prediction</div>
                <div className="app-big">+250 pts</div>
              </div>
            </div>
          </Reveal>

          <Reveal className="phone phone-lift">
            <div className="phone-screen">
              <div className="phone-top">
                <span>9:41</span>
                <span>● ● ●</span>
              </div>
              <h3>Fan Passport</h3>
              <div className="app-panel blue passport">
                <div className="app-label">Afrisport Connect</div>
                <div className="app-big passport-id">
                  CCA-KE
                  <br />
                  004821
                </div>
                <div className="passport-foot">
                  <span>VERIFIED FAN</span>
                  <span aria-hidden="true">◈</span>
                </div>
              </div>
              <div className="app-panel green">
                <div className="app-label">Impact score</div>
                <div className="app-big">8,420</div>
              </div>
            </div>
          </Reveal>

          <Reveal className="phone">
            <div className="phone-screen">
              <div className="phone-top">
                <span>9:41</span>
                <span>● ● ●</span>
              </div>
              <h3>Your Chapter</h3>
              <div className="app-panel">
                <div className="app-label">Nairobi Gooners</div>
                <div className="app-big">2,814 fans</div>
                <div className="avatar-row">
                  <i className="avatar" />
                  <i className="avatar" />
                  <i className="avatar" />
                  <i className="avatar" />
                </div>
              </div>
              <div className="app-panel green">
                <div className="app-label">Next event</div>
                <div className="event-title">North London Derby Watch Party</div>
                <div className="app-meta">Sunday · 18:30 · Westlands</div>
              </div>
              <div className="app-panel">
                <div className="app-label">Community challenge</div>
                <div className="challenge">Plant 1,000 trees</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
