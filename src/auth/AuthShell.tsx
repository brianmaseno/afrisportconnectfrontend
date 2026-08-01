import { Link } from 'react-router-dom';
import { brand, media } from '../lib/media';
import './auth.css';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Right-hand panel image. */
  image?: string;
};

/** Split layout shared by sign in / join / password reset. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  image = media.nightMatch,
}: AuthShellProps) {
  return (
    <div className="auth">
      <div className="auth-form-side">
        <div className="auth-form-inner">
          <Link className="auth-brand" to="/">
            <img src={brand.mark} alt="" width={40} height={40} />
            <span>
              Afrisport Connect<span className="brand-dot">.</span>
            </span>
          </Link>

          <header className="auth-head">
            <h1 className="display">{title}</h1>
            <p>{subtitle}</p>
          </header>

          {children}

          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </div>

      <aside className="auth-visual" aria-hidden="true">
        <img src={image} alt="" />
        <div className="auth-visual-veil" />
        <figure className="auth-visual-copy">
          <img src={brand.lockup} alt="" width={150} />
          <blockquote>
            Football is the door. <em>Afrisport Connect</em> is what happens when millions of fans
            walk through it together.
          </blockquote>
        </figure>
      </aside>
    </div>
  );
}
