import { Reveal } from './Reveal';
import './Ecosystem.css';

const domains = [
  {
    n: '01',
    who: 'Supporters & fans',
    benefit: 'Matches, tickets, marketplace, communities, rewards and personalised recommendations.',
  },
  {
    n: '02',
    who: 'Players',
    benefit: 'Professional profiles, performance insight, learning pathways and talent visibility.',
  },
  {
    n: '03',
    who: 'Coaches & technical staff',
    benefit: 'Team tools, training plans, coaching education and match analysis.',
  },
  {
    n: '04',
    who: 'Referees & officials',
    benefit: 'Appointments, assessments, certifications and continuous professional development.',
  },
  {
    n: '05',
    who: 'Clubs, academies & teams',
    benefit: 'Membership, players, staff, competitions, sponsorship and club operations.',
  },
  {
    n: '06',
    who: 'Leagues & federations',
    benefit: 'Competition admin, licensing, compliance, national statistics and governance.',
  },
  {
    n: '07',
    who: 'Educational institutions',
    benefit: 'Football programmes, student pathways, learning management and certification.',
  },
  {
    n: '08',
    who: 'Businesses & sponsors',
    benefit: 'Campaigns, marketplace presence, audience engagement and measurable impact.',
  },
  {
    n: '09',
    who: 'Media & broadcasters',
    benefit: 'Accreditation, press resources, coverage tools and content distribution.',
  },
  {
    n: '10',
    who: 'Governments & NGOs',
    benefit: 'Impact dashboards, funding programmes, community reporting and policy insight.',
  },
  {
    n: '11',
    who: 'Investors & researchers',
    benefit: 'Ecosystem analytics, research datasets and innovation opportunities.',
  },
  {
    n: '12',
    who: 'Platform operations',
    benefit: 'Secure administration, support, compliance, audit and platform reliability.',
  },
];

const journey = ['Discover', 'Join', 'Learn', 'Engage', 'Contribute', 'Grow'];

const roles = [
  'Fan',
  'Player',
  'Coach',
  'Referee',
  'Parent',
  'Scout',
  'Club admin',
  'Federation',
  'Sponsor',
  'Volunteer',
];

export function Ecosystem() {
  return (
    <section className="ecosystem" id="ecosystem">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Twelve domains</Reveal>
          <Reveal>
            <h2 className="display">Built for every side of the game.</h2>
            <p>
              Afrisport Connect is a multi-sided ecosystem. Each stakeholder domain gets a clear
              purpose, the right permissions and a journey designed around how they actually work—
              not a one-size-fits-all football feed.
            </p>
          </Reveal>
        </div>

        <Reveal className="ecosystem-roles" aria-label="Platform roles">
          <p className="ecosystem-journey-label">Role-based access</p>
          <div className="ecosystem-role-pills">
            {roles.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>
        </Reveal>

        <div className="ecosystem-grid" role="list">
          {domains.map((item) => (
            <Reveal as="article" key={item.n} className="ecosystem-item" role="listitem">
              <span className="ecosystem-n" aria-hidden="true">
                {item.n}
              </span>
              <h3>{item.who}</h3>
              <p>{item.benefit}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="ecosystem-journey" aria-label="User journey stages">
          <p className="ecosystem-journey-label">Shared journey framework</p>
          <ol className="ecosystem-steps">
            {journey.map((stage) => (
              <li key={stage}>
                <span>{stage}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
