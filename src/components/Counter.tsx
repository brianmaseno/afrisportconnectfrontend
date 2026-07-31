import { useEffect, useRef, useState } from 'react';

type CounterProps = {
  to: number;
  /** Rendered before the number, e.g. "R" or "$". */
  prefix?: string;
  /** Rendered after the number, e.g. "%" or "M+". */
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts up to `to` the first time it scrolls into view. */
export function Counter({
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1600,
  className = '',
}: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setValue(to * easeOut(t));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  const shown = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US');

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
