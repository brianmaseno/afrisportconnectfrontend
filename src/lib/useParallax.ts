import { useEffect, useRef } from 'react';

/**
 * Writes a `--parallax` custom property (in px) onto the element as it scrolls
 * through the viewport. CSS decides what to do with it, so the effect stays
 * cheap and is trivially disabled for reduced motion.
 *
 * @param strength Pixels of travel across a full viewport of scrolling.
 */
export function useParallax<T extends HTMLElement>(strength = 90) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let queued = false;

    const update = () => {
      queued = false;
      const rect = el.getBoundingClientRect();
      // -1 when the element sits just below the fold, +1 once it has scrolled past.
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;
      el.style.setProperty('--parallax', `${(progress * strength).toFixed(2)}px`);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [strength]);

  return ref;
}
