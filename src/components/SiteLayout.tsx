import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { Loader } from './Loader';
import { ScrollProgress } from './ScrollProgress';
import './SiteLayout.css';

export function SiteLayout() {
  const { pathname } = useLocation();
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    // Brief wipe so route changes feel authored rather than abrupt.
    setTransitioning(true);
    const timer = window.setTimeout(() => setTransitioning(false), 480);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <Loader />
      <ScrollProgress />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" key={pathname} className={`page${transitioning ? ' page-enter' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
