import { Link } from 'react-router-dom';
import { brand } from '../lib/media';

type BrandProps = {
  /** `light` renders the wordmark in white for dark surfaces. */
  tone?: 'dark' | 'light';
  className?: string;
  onClick?: () => void;
};

/**
 * The Afrisport Connect lockup — the same gold shield used as the Flutter app icon
 * (mobile/assets/images/afrisport_connect_logo_annotated-Photoroom.png).
 */
export function Brand({ tone = 'dark', className = '', onClick }: BrandProps) {
  return (
    <Link
      className={`brand brand-${tone} ${className}`.trim()}
      to="/"
      aria-label="Afrisport Connect — home"
      onClick={onClick}
    >
      <img className="brand-mark" src={brand.mark} alt="" width={38} height={38} />
      <span className="brand-word">
        <b>
          Afrisport Connect<span className="brand-dot">.</span>
        </b>
        <small>Africa&apos;s football super app</small>
      </span>
    </Link>
  );
}
