import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/Reveal';
import { Download } from '../components/Download';
import { BRAND } from '../lib/brand';
import './AboutPage.css';

const faqs = [
  {
    q: 'What is Afrisport Connect?',
    a: `${BRAND.name} is ${BRAND.shortDescription} Official website: ${BRAND.domain}.`,
  },
  {
    q: 'Who founded Afrisport Connect?',
    a: `${BRAND.name} was founded by ${BRAND.founder.name}, ${BRAND.founder.jobTitle}.`,
  },
  {
    q: 'Where is Afrisport Connect based?',
    a: `${BRAND.name} is based in ${BRAND.foundingLocation}, serving football communities across Africa.`,
  },
];

export function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        description={`About ${BRAND.name}: founded by ${BRAND.founder.name}, ${BRAND.founder.jobTitle}. ${BRAND.shortDescription}`}
        path="/about"
      />

      <PageHero
        eyebrow="About Afrisport Connect"
        title="Africa's football digital ecosystem."
        copy={`${BRAND.name} connects fans, athletes, clubs, businesses, investors and communities through technology, innovation and opportunity.`}
        image="/images/grassroots-huddle.jpg"
        imagePosition="40%"
        ctaHref="/signup"
        ctaLabel="Join Afrisport Connect"
        secondaryHref="/platform"
        secondaryLabel="Explore the platform"
      />

      <section className="about-section shell">
        <div className="about-grid about-grid-founder">
          <Reveal className="about-card about-card-founder">
            <p className="eyebrow">{BRAND.founder.jobTitle}</p>
            <h2 className="display about-heading">{BRAND.founder.name}</h2>
            <p className="about-lead">{BRAND.founder.bio}</p>
          </Reveal>

          <Reveal className="about-card" delay={80}>
            <h3>Our mission</h3>
            <p>
              {BRAND.description} We power matchday, community, learning, marketplace, tourism and
              impact in one product — so African football communities can belong, grow and thrive
              online.
            </p>
            <ul>
              <li>Fans &amp; communities</li>
              <li>Clubs &amp; chapters</li>
              <li>Athletes &amp; talent pathways</li>
              <li>Businesses, sponsors &amp; investors</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="about-section shell" id="faq">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2 className="display about-heading">Common questions</h2>
        </Reveal>
        <div className="about-faq">
          {faqs.map((item) => (
            <Reveal key={item.q} className="about-faq-item">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </Reveal>
          ))}
        </div>
        <p className="about-contact muted">
          Press &amp; partnerships:{' '}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          {' · '}
          <Link to="/platform">Platform overview</Link>
          {' · '}
          <Link to="/download">Get the app</Link>
        </p>
      </section>

      <Download />
    </>
  );
}
