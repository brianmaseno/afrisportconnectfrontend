import { Reveal } from './Reveal';
import './Commerce.css';

const principles = [
  'Inclusive value',
  'Sustainable revenue',
  'Transparent governance',
  'Fair participation',
  'Responsible monetisation',
  'Digital inclusion',
];

const layers = [
  {
    n: '01',
    title: 'Customer experience',
    body: 'Browse, buy tickets, manage memberships, donate and subscribe.',
  },
  {
    n: '02',
    title: 'Commerce services',
    body: 'Catalogue, cart, orders, pricing, promotions and loyalty.',
  },
  {
    n: '03',
    title: 'Financial services',
    body: 'Payments, refunds, settlement, tax and financial reporting.',
  },
  {
    n: '04',
    title: 'Marketplace',
    body: 'Clubs, merchants, coaches, academies and event organisers.',
  },
  {
    n: '05',
    title: 'Analytics',
    body: 'Sales intelligence, forecasting and campaign performance.',
  },
  {
    n: '06',
    title: 'Governance',
    body: 'Controls, compliance, fraud monitoring and commercial policy.',
  },
];

const categories = [
  { name: 'Merchandise', focus: 'Jerseys, kit, apparel and memorabilia' },
  { name: 'Tickets & events', focus: 'Match tickets, VIP and fan experiences' },
  { name: 'Learning', focus: 'Courses, certifications and development' },
  { name: 'Club services', focus: 'Academies, bookings and talent events' },
  { name: 'Sponsorship', focus: 'Campaigns, activation and brand reach' },
  { name: 'Giving', focus: 'Fundraising and community impact projects' },
];

const revenue = [
  'Memberships',
  'Marketplace',
  'Ticketing',
  'Sponsorship',
  'Advertising',
  'Education',
  'Premium services',
  'Donations',
];

export function Commerce() {
  return (
    <section className="commerce" id="commerce">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Digital commerce</Reveal>
          <Reveal>
            <h2 className="display">Africa&apos;s football digital economy.</h2>
            <p>
              Tickets, merch, memberships, learning and sponsorship—Afrisport Connect turns football
              activity into inclusive commerce with transparent, sustainable value for every side of
              the game.
            </p>
          </Reveal>
        </div>

        <Reveal className="cm-principles" aria-label="CSVF principles">
          <p className="cm-label">CSVF principles</p>
          <div className="cm-pills">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <div className="cm-layers" role="list">
          {layers.map((layer) => (
            <Reveal as="article" key={layer.n} className="cm-layer" role="listitem">
              <span className="cm-n" aria-hidden="true">
                {layer.n}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="cm-cat-head">
          <Reveal className="eyebrow">Marketplace categories</Reveal>
          <Reveal>
            <p className="cm-cat-copy">
              One trusted marketplace for what clubs sell and what fans need.
            </p>
          </Reveal>
        </div>

        <div className="cm-categories" role="list">
          {categories.map((item) => (
            <Reveal as="div" key={item.name} className="cm-cat" role="listitem">
              <strong>{item.name}</strong>
              <span>{item.focus}</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="cm-revenue" aria-label="Revenue streams">
          <p className="cm-label">Diversified revenue</p>
          <div className="cm-rev-pills">
            {revenue.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>

        <Reveal className="cm-note">
          <strong>Grow the game. Share the value.</strong> Clear revenue sharing, loyalty rewards and
          financial controls keep commerce fair for clubs, creators and communities.
        </Reveal>
      </div>
    </section>
  );
}
