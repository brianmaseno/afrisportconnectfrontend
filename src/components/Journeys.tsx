import { Reveal } from './Reveal';
import './Journeys.css';

const lifecycle = ['Discover', 'Enter', 'Understand', 'Act', 'Feedback', 'Continue'];

const screenTypes = [
  {
    title: 'Public',
    body: 'Welcome, clubs, matches, news, events, marketplace preview and help—usable before sign-in.',
  },
  {
    title: 'Authentication',
    body: 'Sign up, login, social sign-in, verification, recovery and consent.',
  },
  {
    title: 'Personal workspace',
    body: 'Role-aware home for supporters, players, coaches, clubs and partners.',
  },
  {
    title: 'Functional modules',
    body: 'Ticketing, learning, commerce, messaging, media, analytics and AI.',
  },
  {
    title: 'Administration',
    body: 'Authorised tools for moderation, configuration, reporting and audit.',
  },
  {
    title: 'Utility',
    body: 'Search, notifications, settings, profile, errors, offline and maintenance.',
  },
];

const flows = [
  {
    title: 'Join Afrisport Connect',
    steps: ['Welcome', 'Sign up', 'Verify', 'Terms', 'Profile', 'Onboarding', 'Home'],
  },
  {
    title: 'Buy a ticket',
    steps: ['Match', 'Details', 'Seat', 'Pay', 'Digital ticket', 'QR', 'Reminder'],
  },
  {
    title: 'Complete a course',
    steps: ['Catalogue', 'Details', 'Enrol', 'Lessons', 'Assessment', 'Certificate', 'Share'],
  },
];

export function Journeys() {
  return (
    <section className="journeys" id="journeys">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Screens &amp; flows</Reveal>
          <Reveal>
            <h2 className="display">Every screen has a job to finish.</h2>
            <p>
              Afrisport Connect experiences follow one lifecycle—discover, enter, understand, act, get
              feedback, continue—so fans, players and clubs move through the app with less friction.
            </p>
          </Reveal>
        </div>

        <Reveal className="journey-lifecycle" aria-label="Experience flow lifecycle">
          <p className="journey-label">Experience flow framework</p>
          <ol className="journey-steps">
            {lifecycle.map((stage) => (
              <li key={stage}>
                <span>{stage}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="journey-types" role="list">
          {screenTypes.map((type) => (
            <Reveal as="article" key={type.title} className="journey-type" role="listitem">
              <h3>{type.title}</h3>
              <p>{type.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="journey-flows-head">
          <Reveal className="eyebrow">Core user journeys</Reveal>
          <Reveal>
            <p className="journey-flows-copy">
              Three flows every supporter should recognise—join, matchday tickets, and learning.
            </p>
          </Reveal>
        </div>

        <div className="journey-flows">
          {flows.map((flow) => (
            <Reveal as="article" key={flow.title} className="journey-flow">
              <h3>{flow.title}</h3>
              <ol>
                {flow.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
