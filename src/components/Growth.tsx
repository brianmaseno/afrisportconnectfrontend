import { Reveal } from './Reveal';
import './Growth.css';

const principles = [
  'Community first',
  'Value-led growth',
  'Inclusive participation',
  'Local + continental',
  'Trust & authenticity',
  'Long-term relationships',
];

const stages = [
  { n: '01', title: 'Discover', body: 'Campaigns, events, media, outreach and partnerships.' },
  { n: '02', title: 'Join', body: 'Simple, secure, multilingual onboarding for every role.' },
  { n: '03', title: 'Activate', body: 'Profiles, clubs, teams and personalised first wins.' },
  { n: '04', title: 'Engage', body: 'Matches, learning, forums, marketplace and events.' },
  { n: '05', title: 'Retain', body: 'Recognition, loyalty, exclusive content and belonging.' },
  { n: '06', title: 'Advocate', body: 'Referrals, ambassadors, creators and campaign champions.' },
];

const segments = [
  { name: 'Supporters', focus: 'News, tickets, merch, communities and rewards' },
  { name: 'Players', focus: 'Profiles, pathways, training and talent discovery' },
  { name: 'Coaches & referees', focus: 'Certification, resources and careers' },
  { name: 'Clubs & academies', focus: 'Members, teams, fans and commerce' },
  { name: 'Federations', focus: 'Competitions, governance and development' },
  { name: 'Sponsors', focus: 'Campaigns, insights and brand activation' },
];

const brand = [
  'Unity',
  'Excellence',
  'Innovation',
  'Integrity',
  'Inclusion',
  'African pride',
];

export function Growth() {
  return (
    <section className="growth" id="growth">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Growth & engagement</Reveal>
          <Reveal>
            <h2 className="display">A continental movement—not just an app.</h2>
            <p>
              Afrisport Connect grows by delivering value first: discover, join, activate, engage,
              retain and advocate—across every role in African football.
            </p>
          </Reveal>
        </div>

        <Reveal className="gr-principles" aria-label="CGEF principles">
          <p className="gr-label">CGEF principles</p>
          <div className="gr-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="gr-stages" role="list">
          {stages.map((stage) => (
            <Reveal as="article" key={stage.n} className="gr-stage" role="listitem">
              <span className="gr-n" aria-hidden="true">
                {stage.n}
              </span>
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="gr-seg-head">
          <Reveal className="eyebrow">Tailored for every role</Reveal>
          <Reveal>
            <p className="gr-seg-copy">
              Segmentation keeps experiences relevant—from fans to federations and sponsors.
            </p>
          </Reveal>
        </div>

        <div className="gr-segments" role="list">
          {segments.map((item) => (
            <Reveal as="div" key={item.name} className="gr-seg" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="gr-brand" aria-label="Brand values">
          <p className="gr-label">Brand experience</p>
          <div className="gr-brand-pills">
            {brand.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="gr-note">
          <strong>Community before transactions.</strong> Referrals, ambassadors, localisation and
          customer success turn first visits into lasting belonging across Africa.
        </Reveal>
      </div>
    </section>
  );
}
