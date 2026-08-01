import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useApi } from '../lib/useApi';
import { brand } from '../lib/media';
import { mediaUrl } from '../lib/api';
import { initials } from '../lib/format';
import { appNav } from './nav';
import './app.css';

/** Blocks the authenticated area until a session is confirmed. */
export function RequireAuth() {
  const { isAuthenticated, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div className="app-boot">
        <img src={brand.lockup} alt="Afrisport Connect" width={150} />
        <span className="app-boot-bar" aria-hidden="true" />
        <p>Loading your account…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <AppLayout />;
}

function AppLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Unread badge on the Notifications item.
  const unread = useApi<{ count?: number; unread?: number }>('/notifications/unread-count');
  const unreadCount = unread.data?.count ?? unread.data?.unread ?? 0;

  useEffect(() => {
    setNavOpen(false);
    setMenuOpen(false);
    // Without this a route change keeps the previous scroll offset, so pages
    // opened from part-way down a long list start in the middle or at the end.
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  const avatar = mediaUrl(user?.avatar);

  return (
    <div className="app">
      {/* ---------- Sidebar ---------- */}
      <aside className={`app-side${navOpen ? ' open' : ''}`}>
        <Link className="app-side-brand" to="/app" onClick={() => setNavOpen(false)}>
          <img src={brand.mark} alt="" width={34} height={34} />
          <span>
            Afrisport Connect<span className="brand-dot">.</span>
          </span>
        </Link>

        {/* Collapsible groups — 40 links in one list meant scrolling to reach
            anything below "Identity". Only the group you are in stays open. */}
        <nav className="app-nav" aria-label="Account">
          {appNav.map((group) => {
            const holdsActive = group.items.some((item) =>
              item.end ? pathname === item.to : pathname.startsWith(item.to),
            );

            return (
              <details key={group.label} className="app-nav-group" open={holdsActive}>
                <summary>
                  <span>{group.label}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="app-nav-chev">
                    <path
                      d="M6 9l6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>

                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => (isActive ? 'app-nav-link active' : 'app-nav-link')}
                  >
                    <span className="app-nav-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                    {item.to === '/app/notifications' && unreadCount > 0 && (
                      <span className="app-nav-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                    )}
                  </NavLink>
                ))}
              </details>
            );
          })}
        </nav>

        <div className="app-side-foot">
          <Link to="/" className="app-nav-link">
            <span className="app-nav-icon" aria-hidden="true">
              ←
            </span>
            Back to website
          </Link>
        </div>
      </aside>

      {navOpen && (
        <button
          className="app-scrim"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* ---------- Main ---------- */}
      <div className="app-main">
        <header className="app-top">
          <button
            className="app-burger"
            type="button"
            aria-label="Open navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link className="app-top-brand" to="/app">
            <img src={brand.mark} alt="" width={28} height={28} />
          </Link>

          <div className="app-top-spacer" />

          <Link className="app-top-icon" to="/app/notifications" aria-label="Notifications">
            <span aria-hidden="true">◔</span>
            {unreadCount > 0 && <i className="app-top-dot" />}
          </Link>

          <div className="app-user">
            <button
              type="button"
              className="app-user-button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {avatar ? (
                <img className="app-avatar" src={avatar} alt="" />
              ) : (
                <span className="app-avatar app-avatar-fallback">{initials(user?.name)}</span>
              )}
              <span className="app-user-name">{user?.name ?? 'Account'}</span>
              <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>

            {menuOpen && (
              <div className="app-user-menu" role="menu">
                <div className="app-user-meta">
                  <strong>{user?.name}</strong>
                  <span>{user?.email ?? user?.phone}</span>
                </div>
                <Link to="/app/profile" role="menuitem">
                  Profile
                </Link>
                <Link to="/app/membership" role="menuitem">
                  Membership
                </Link>
                <Link to="/app/security" role="menuitem">
                  Security
                </Link>
                <button type="button" role="menuitem" onClick={() => void logout()}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
