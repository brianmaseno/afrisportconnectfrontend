import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Brand } from './Brand';
import { navGroups } from '../lib/navigation';
import './Nav.css';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenGroup(null);
      setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Small grace period so the pointer can travel from trigger to panel.
  const openNow = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenGroup(label);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 160);
  };

  return (
    <header
      className={`nav${scrolled ? ' scrolled' : ''}${mobileOpen ? ' menu-open' : ''}`}
      onMouseLeave={closeSoon}
    >
      <div className="nav-inner shell-wide">
        <Brand />

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-top active' : 'nav-top')}>
            Home
          </NavLink>

          {navGroups.map((group) => (
            <div
              key={group.label}
              className={`nav-group${openGroup === group.label ? ' open' : ''}`}
              onMouseEnter={() => openNow(group.label)}
            >
              <button
                type="button"
                className="nav-top nav-trigger"
                aria-expanded={openGroup === group.label}
                onClick={() => setOpenGroup((v) => (v === group.label ? null : group.label))}
              >
                {group.label}
                <svg viewBox="0 0 10 6" aria-hidden="true" className="nav-caret">
                  <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>

              <div className="nav-panel" role="menu">
                <div className="nav-panel-inner">
                  {group.items.map((item) => (
                    <Link key={item.to} to={item.to} className="nav-panel-item" role="menuitem">
                      <strong>{item.label}</strong>
                      <span>{item.blurb}</span>
                      <em aria-hidden="true">→</em>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="nav-actions">
          <Link className="button button-green button-sm nav-cta" to="/download">
            Get the app <span aria-hidden="true">↗</span>
          </Link>

          <button
            className="menu-button"
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-drawer${mobileOpen ? ' open' : ''}`}>
        <div className="nav-drawer-scroll">
          <NavLink to="/" end className="drawer-link drawer-lead">
            Home
          </NavLink>

          {navGroups.map((group) => (
            <section key={group.label} className="drawer-group">
              <h3>{group.label}</h3>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'drawer-link active' : 'drawer-link')}
                >
                  {item.label}
                  <em aria-hidden="true">→</em>
                </NavLink>
              ))}
            </section>
          ))}

          <div className="drawer-footer">
            <Link className="button button-green" to="/download">
              Get the app <span aria-hidden="true">↗</span>
            </Link>
            <div className="drawer-meta">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
