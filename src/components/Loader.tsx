import { useEffect, useState } from 'react';
import { brand } from '../lib/media';
import './Loader.css';

const MIN_VISIBLE_MS = 900;

/**
 * Branded first-paint loader. Takes over from the inline `#boot` splash in index.html
 * so the handover between static HTML and React is seamless.
 */
export function Loader() {
  const [progress, setProgress] = useState(8);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const started = performance.now();
    let raf = 0;

    // Creep toward 90% while assets load, then complete on window load.
    const tick = () => {
      setProgress((p) => (p >= 90 ? p : p + Math.max(0.4, (92 - p) * 0.035)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      cancelAnimationFrame(raf);
      setProgress(100);
      const elapsed = performance.now() - started;
      window.setTimeout(() => setHidden(true), Math.max(0, MIN_VISIBLE_MS - elapsed) + 320);
    };

    if (document.readyState === 'complete') {
      window.setTimeout(finish, 260);
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    // Safety net: never trap the page behind the loader.
    const bail = window.setTimeout(finish, 4500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(bail);
      window.removeEventListener('load', finish);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = hidden ? '' : 'hidden';
    if (hidden) document.getElementById('boot')?.remove();
    return () => {
      document.body.style.overflow = '';
    };
  }, [hidden]);

  // Remove the static splash as soon as React takes over rendering the loader.
  useEffect(() => {
    document.getElementById('boot')?.classList.add('done');
  }, []);

  return (
    <div className={`loader${hidden ? ' loader-hidden' : ''}`} role="status" aria-live="polite">
      <div className="loader-glow" aria-hidden="true" />

      <div className="loader-core">
        <div className="loader-ring" aria-hidden="true">
          <span />
          <span />
        </div>
        <img className="loader-logo" src={brand.lockup} alt="Afrisport Connect" />
      </div>

      <div className="loader-meter" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>

      <p className="loader-caption">
        More than a fan<span className="loader-dots" aria-hidden="true" />
      </p>

      <span className="sr-only">Loading Afrisport Connect</span>
    </div>
  );
}
