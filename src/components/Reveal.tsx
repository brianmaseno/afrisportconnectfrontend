import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'li' | 'ul' | 'header' | 'figure' | 'span';
  id?: string;
  role?: HTMLAttributes<HTMLElement>['role'];
  'aria-label'?: string;
  /** Entry direction. `up` is the default. */
  dir?: 'up' | 'left' | 'right' | 'scale' | 'none';
  /** Delay in milliseconds before the element animates in. */
  delay?: number;
  /** Animate direct children in sequence instead of the container as one block. */
  stagger?: boolean;
  style?: CSSProperties;
};

export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  id,
  role,
  dir = 'up',
  delay = 0,
  stagger = false,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [stagger ? 'stagger' : 'reveal', className].filter(Boolean).join(' ');

  return (
    <Tag
      {...rest}
      ref={ref as never}
      id={id}
      role={role}
      data-dir={stagger ? undefined : dir}
      className={classes}
      style={{ ...style, ...(delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : null) }}
    >
      {children}
    </Tag>
  );
}
