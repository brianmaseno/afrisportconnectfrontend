import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { mediaUrl } from '../lib/api';
import { brand } from '../lib/media';
import './ui.css';

/* -------------------------------------------------------------------------- */
/* Media                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Image with a branded fallback. Much of the catalogue has no artwork yet
 * (products, videos and partner logos frequently come back null), so the
 * placeholder has to look deliberate rather than broken.
 */
export function Media({
  src,
  alt = '',
  ratio = '4 / 3',
  label,
  className = '',
}: {
  src?: string | null;
  alt?: string;
  /** CSS aspect-ratio, e.g. "16 / 9". */
  ratio?: string;
  /** Shown inside the placeholder — usually the item's initials. */
  label?: string;
  className?: string;
}) {
  const url = mediaUrl(src);
  // Several catalogue rows point at URLs that 404. Falling back on error keeps
  // a broken-image icon from ever reaching the page.
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [url]);

  const showImage = Boolean(url) && !failed;

  return (
    <div className={`media ${className}`.trim()} style={{ aspectRatio: ratio }}>
      {showImage ? (
        <img
          src={url!}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="media-fallback" aria-hidden="true">
          <img src={brand.mark} alt="" />
          {label && <em>{label}</em>}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page scaffolding                                                            */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="pg-head">
      <div>
        <h1 className="display">{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="pg-head-actions">{actions}</div>}
    </header>
  );
}

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="pg-section">
      <div className="pg-section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Panel({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`panel ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Async states                                                                */
/* -------------------------------------------------------------------------- */

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="skeleton" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <img className="empty-mark" src={brand.mark} alt="" width={38} height={38} />
      <strong>{title}</strong>
      {body && <p>{body}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="empty empty-error" role="alert">
      <strong>Couldn&apos;t load this</strong>
      <p>{message}</p>
      {onRetry && (
        <button className="button button-outline button-sm" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

/**
 * One place for the loading → error → empty → content decision, so every
 * screen behaves the same way.
 */
export function DataState<T>({
  loading,
  error,
  data,
  onRetry,
  empty,
  skeletonRows,
  children,
}: {
  loading: boolean;
  error: string | null;
  data: T | null | undefined;
  onRetry?: () => void;
  empty?: { title: string; body?: string; action?: ReactNode };
  skeletonRows?: number;
  children: (data: T) => ReactNode;
}) {
  if (loading) return <Skeleton rows={skeletonRows} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  const isEmpty =
    data === null ||
    data === undefined ||
    (Array.isArray(data) && data.length === 0);

  if (isEmpty) {
    return (
      <EmptyState
        title={empty?.title ?? 'Nothing here yet'}
        body={empty?.body}
        action={empty?.action}
      />
    );
  }

  return <>{children(data as T)}</>;
}

/* -------------------------------------------------------------------------- */
/* Small pieces                                                                */
/* -------------------------------------------------------------------------- */

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="stat-tile">
      <span className="stat-tile-value">{value}</span>
      <span className="stat-tile-label">{label}</span>
      {hint && <span className="stat-tile-hint">{hint}</span>}
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'green' | 'gold' | 'red' | 'blue';
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Row({
  title,
  meta,
  right,
  onClick,
  media: mediaNode,
}: {
  title: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
  media?: ReactNode;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className={`row${onClick ? ' row-button' : ''}`} onClick={onClick} type={onClick ? 'button' : undefined}>
      {mediaNode && <div className="row-media">{mediaNode}</div>}
      <div className="row-body">
        <strong>{title}</strong>
        {meta && <span>{meta}</span>}
      </div>
      {right && <div className="row-right">{right}</div>}
    </Tag>
  );
}
