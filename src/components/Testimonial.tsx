import { Reveal } from './Reveal';
import { media, brand } from '../lib/media';
import './Testimonial.css';

export function Testimonial() {
  return (
    <section className="testimonial">
      <div className="testimonial-bg" aria-hidden="true">
        <img src={media.fansCelebrate} alt="" loading="lazy" />
      </div>

      <div className="shell testimonial-inner">
        <Reveal dir="scale">
          <img className="testimonial-mark" src={brand.mark} alt="" width={64} height={64} />

          <blockquote className="quote display">
            Football is the door. <span className="accent">Afrisport Connect</span> is what happens
            when millions of fans walk through it together.
          </blockquote>

          <div className="quote-meta">
            <span className="quote-rule" aria-hidden="true" />
            Built for the next generation of fandom
          </div>
        </Reveal>
      </div>
    </section>
  );
}
