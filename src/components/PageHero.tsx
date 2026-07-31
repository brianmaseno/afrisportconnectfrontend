import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { brand } from '../lib/media';
import { useParallax } from '../lib/useParallax';
import './PageHero.css';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  /** Vertical focal point of the photo, e.g. "30%". */
  imagePosition?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

function HeroAction({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: 'gold' | 'ghost';
}) {
  const className = variant === 'gold' ? 'button button-gold' : 'button button-ghost';
  const inner =
    variant === 'gold' ? (
      <>
        {label} <span aria-hidden="true">→</span>
      </>
    ) : (
      label
    );

  if (href.startsWith('http') || href.startsWith('#')) {
    return (
      <a className={className} href={href}>
        {inner}
      </a>
    );
  }

  return (
    <Link className={className} to={href}>
      {inner}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
  image,
  imagePosition = '45%',
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
}: PageHeroProps) {
  const bgRef = useParallax<HTMLDivElement>(80);

  return (
    <section className="page-hero">
      <div className="page-hero-bg" ref={bgRef}>
        <img src={image} alt="" style={{ objectPosition: `center ${imagePosition}` }} />
      </div>
      <div className="page-hero-veil" aria-hidden="true" />

      <div className="page-hero-content shell">
        <Reveal className="page-hero-badge" dir="none">
          <img src={brand.mark} alt="" width={22} height={22} />
          <span>{eyebrow}</span>
        </Reveal>

        <Reveal delay={90}>
          <h1 className="display page-hero-title">{title}</h1>
        </Reveal>

        <Reveal delay={190}>
          <p className="page-hero-copy">{copy}</p>
          {(ctaHref || secondaryHref) && (
            <div className="page-hero-actions">
              {ctaHref && ctaLabel && <HeroAction href={ctaHref} label={ctaLabel} variant="gold" />}
              {secondaryHref && secondaryLabel && (
                <HeroAction href={secondaryHref} label={secondaryLabel} variant="ghost" />
              )}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
