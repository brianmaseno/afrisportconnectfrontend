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
    a: `${BRAND.name} was founded by ${BRAND.founder.name}${BRAND.founder.alternateName ? ` (also known as ${BRAND.founder.alternateName})` : ''}. He is the Founder of the platform at ${BRAND.domain}.`,
  },
  {
    q: 'Is Afrisport Connect the same as AfriSportsConnect?',
    a: `No. ${BRAND.notAffiliatedWith.note}`,
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
        title="About & Founder"
        description={`About ${BRAND.name}: founded by ${BRAND.founder.name}. Official site ${BRAND.domain} — Africa's football super app. Not affiliated with afrisportsconnect.com.`}
        path="/about"
      />

      <PageHero
        eyebrow="About Afrisport Connect"
        title="The official Afrisport Connect."
        copy={`${BRAND.name} (${BRAND.domain}) is Africa's football super app — founded by ${BRAND.founder.name}. One trusted digital home for fans, clubs and communities.`}
        image="/images/grassroots-huddle.jpg"
        imagePosition="40%"
        ctaHref="/signup"
        ctaLabel="Join Afrisport Connect"
        secondaryHref="/platform"
        secondaryLabel="Explore the platform"
      />

      <section className="about-section shell">
        <Reveal>
          <p className="eyebrow">Official identity</p>
          <h2 className="display about-heading">
            Afrisport Connect<span className="accent">.</span> {BRAND.domain}
          </h2>
          <p className="about-lead">
            When people search for <strong>Afrisport Connect</strong>, they should reach{' '}
            <strong>{BRAND.url}</strong> — the football digital ecosystem built for African fans,
            clubs, chapters, memberships, tickets, tourism and opportunity.
          </p>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-card">
            <h3>What we are</h3>
            <p>
              {BRAND.description} We power matchday, community, learning, marketplace and impact in
              one product.
            </p>
            <ul>
              <li>Official name: <strong>{BRAND.name}</strong></li>
              <li>Official website: <strong>{BRAND.domain}</strong></li>
              <li>Based in: <strong>{BRAND.foundingLocation}</strong></li>
              <li>Founded: <strong>{BRAND.foundedYear}</strong></li>
            </ul>
          </Reveal>

          <Reveal className="about-card about-card-founder" delay={80}>
            <p className="eyebrow">Founder</p>
            <h3>{BRAND.founder.name}</h3>
            <p className="about-role">{BRAND.founder.jobTitle} of {BRAND.name}</p>
            <p>
              {BRAND.founder.name} founded {BRAND.name} to build a trusted football-powered digital
              ecosystem for Africa — connecting supporters, clubs and institutions on{' '}
              {BRAND.domain}.
            </p>
            {BRAND.founder.alternateName ? (
              <p className="muted">Also known as {BRAND.founder.alternateName}.</p>
            ) : null}
            <a
              className="button button-outline button-sm"
              href={BRAND.founder.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn profile
            </a>
          </Reveal>
        </div>
      </section>

      <section className="about-section about-section-alt">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Name clarity</p>
            <h2 className="display about-heading">Not the same as AfriSportsConnect</h2>
            <p className="about-lead">
              {BRAND.notAffiliatedWith.note} Our brand spelling is <strong>Afrisport</strong>{' '}
              (singular) <strong>Connect</strong>, domain <strong>{BRAND.domain}</strong>.
            </p>
            <div className="about-compare">
              <div>
                <strong>This platform</strong>
                <span>{BRAND.name}</span>
                <span>{BRAND.domain}</span>
                <span>Founder: {BRAND.founder.name}</span>
                <span>Football digital ecosystem &amp; super app</span>
              </div>
              <div>
                <strong>Separate organisation</strong>
                <span>{BRAND.notAffiliatedWith.name}</span>
                <span>{BRAND.notAffiliatedWith.domain}</span>
                <span>Athletics scholarships / trials initiative</span>
                <span>Not affiliated with us</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="about-section shell" id="faq">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2 className="display about-heading">Answers search &amp; AI look for</h2>
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
