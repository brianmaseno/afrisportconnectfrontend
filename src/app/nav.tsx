import type { ReactNode } from 'react';

export type AppNavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const I = {
  home: icon('M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z'),
  ball: icon('M12 3a9 9 0 100 18 9 9 0 000-18zm0 4.5l3.6 2.6-1.4 4.3H9.8L8.4 10.1 12 7.5z'),
  search: icon('M11 3a8 8 0 105.3 14L21 21.7 22.4 20l-4.6-4.6A8 8 0 0011 3zm0 2a6 6 0 110 12 6 6 0 010-12z'),
  people: icon('M9 8.5a3 3 0 106 0 3 3 0 00-6 0zM3 20c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4M17 9.6a2.4 2.4 0 100-4.8M18.5 20c0-2.6-1.4-4.4-3.5-5'),
  shield: icon('M12 3l7 3v6c0 4.4-3 8.3-7 9.4-4-1.1-7-5-7-9.4V6l7-3z'),
  card: icon('M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1zm7 4.5a3 3 0 100 6 3 3 0 000-6zM8.5 17.5h7'),
  star: icon('M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8L12 3z'),
  chart: icon('M3 17l5-5.4 3.5 3.1L16 9.2 21 6M21 11V6h-5M3 21h18'),
  wallet: icon('M3 7.5A1.5 1.5 0 014.5 6h13A1.5 1.5 0 0119 7.5V9h1.5A1.5 1.5 0 0122 10.5v6a1.5 1.5 0 01-1.5 1.5h-16A1.5 1.5 0 013 16.5v-9zM17 13.5h2'),
  calendar: icon('M4 6h16a1 1 0 011 1v13a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zm4-3v5m8-5v5M3 11h18'),
  pin: icon('M12 21s-7-4.9-7-10a7 7 0 1114 0c0 5.1-7 10-7 10zm0-12.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z'),
  book: icon('M3 7l9-4 9 4-9 4-9-4zm3 5.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5M21 8v6'),
  bag: icon('M5 8h14l-1.2 11.1a1 1 0 01-1 .9H7.2a1 1 0 01-1-.9L5 8zm3.5 0V6a3.5 3.5 0 017 0v2'),
  bell: icon('M12 3a6 6 0 00-6 6v3.5L4.5 16h15L18 12.5V9a6 6 0 00-6-6zM9.5 19a2.5 2.5 0 005 0'),
  user: icon('M12 12a4 4 0 100-8 4 4 0 000 8zm-8 8.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5'),
  lock: icon('M6 10V8a6 6 0 1112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z'),
  help: icon('M12 3a9 9 0 100 18 9 9 0 000-18zm0 13.5v.01M9.8 9.4a2.2 2.2 0 114 1.2c-.6.8-1.8 1-1.8 2.4'),
  news: icon('M4 5h13a1 1 0 011 1v13a2 2 0 002-2V8M4 5a1 1 0 00-1 1v11a2 2 0 002 2h13M7 9h7M7 13h7'),
  play: icon('M3 6.5A1.5 1.5 0 014.5 5h15A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11zm7 2.3l5 3.2-5 3.2V8.8z'),
  dice: icon('M4 8.5l8-4.5 8 4.5v7L12 20l-8-4.5v-7zm8 0v11.5M4 8.5l8 4.5 8-4.5'),
  network: icon('M6.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm11 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-4.2-9.6L11 15.4m6.2-4l-3.2 4M9 6.5h6'),
  spark: icon('M12 3l1.9 5.4L19 10l-5.1 1.6L12 17l-1.9-5.4L5 10l5.1-1.6L12 3zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'),
  cart: icon('M3 4h2l2.2 10.4a1 1 0 001 .8h8.6a1 1 0 001-.8L20 7H6M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z'),
  receipt: icon('M6 3h12a1 1 0 011 1v17l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V4a1 1 0 011-1zm2.5 5h7m-7 4h7'),
  seed: icon('M12 21V9m0 0a5 5 0 00-5-5H4v2a5 5 0 005 5h3zm0 0a5 5 0 015-5h3v2a5 5 0 01-5 5h-3z'),
  handshake: icon('M6 12l3-3 3 2 3-2 3 3M3 10l4-4h4l2 2m-9 8l3 3 2-2 2 2 3-3'),
  grid: icon('M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z'),
  gear: icon('M12 15a3 3 0 100-6 3 3 0 000 6zm8.4-3a8.4 8.4 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a8.4 8.4 0 00-2.1-1.2L15.4 3h-4l-.4 2.6a8.4 8.4 0 00-2.1 1.2l-2.4-1-2 3.4 2 1.6a8.4 8.4 0 000 2.4l-2 1.6 2 3.4 2.4-1a8.4 8.4 0 002.1 1.2l.4 2.6h4l.4-2.6a8.4 8.4 0 002.1-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z'),
  chat: icon('M4 5h16a1 1 0 011 1v9a1 1 0 01-1 1H9l-5 4V6a1 1 0 011-1zm4 5h8M8 13h5'),
};

/**
 * Grouped to mirror the app IA the backend publishes at GET /navigation
 * (5 primary tabs + 14 destinations across zones), extended to cover the
 * rest of the mobile app's feature modules.
 */
export const appNav: { label: string; items: AppNavItem[] }[] = [
  {
    label: 'Main',
    items: [
      { to: '/app', label: 'Home', end: true, icon: I.home },
      { to: '/app/matches', label: 'Match centre', icon: I.ball },
      { to: '/app/standings', label: 'Standings', icon: I.grid },
      { to: '/app/discover', label: 'Discover', icon: I.search },
      { to: '/app/assistant', label: 'Assistant', icon: I.chat },
    ],
  },
  {
    label: 'Football',
    items: [
      { to: '/app/clubs', label: 'Clubs', icon: I.shield },
      { to: '/app/news', label: 'News', icon: I.news },
      { to: '/app/tv', label: 'Afrisport TV', icon: I.play },
      { to: '/app/playzone', label: 'Play zone', icon: I.dice },
    ],
  },
  {
    label: 'Identity',
    items: [
      { to: '/app/passport', label: 'Fan Passport', icon: I.card },
      { to: '/app/membership', label: 'Membership', icon: I.star },
      { to: '/app/wallet', label: 'Wallet & rewards', icon: I.wallet },
      { to: '/app/impact', label: 'Impact', icon: I.chart },
      { to: '/app/challenges', label: 'Challenges', icon: I.spark },
      { to: '/app/awards', label: 'Awards', icon: I.star },
      { to: '/app/badges', label: 'Badges', icon: I.spark },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/app/community', label: 'Community', icon: I.people },
      { to: '/app/feed', label: 'Feed', icon: I.chat },
      { to: '/app/chapters', label: 'Chapters', icon: I.pin },
      { to: '/app/tourism', label: 'Tourism', icon: I.pin },
      { to: '/app/tourism/bookings', label: 'Tourism bookings', icon: I.receipt },
      { to: '/app/events', label: 'Events', icon: I.calendar },
      { to: '/app/network', label: 'Network', icon: I.network },
      { to: '/app/creators', label: 'Creators', icon: I.spark },
      { to: '/app/creators/studio', label: 'Creator studio', icon: I.news },
    ],
  },
  {
    label: 'Opportunity',
    items: [
      { to: '/app/learn', label: 'Learn', icon: I.book },
      { to: '/app/opportunities', label: 'Opportunities', icon: I.seed },
      { to: '/app/talent', label: 'Talent', icon: I.user },
      { to: '/app/talent/me', label: 'My talent profile', icon: I.card },
      { to: '/app/projects', label: 'Impact projects', icon: I.handshake },
      { to: '/app/growth', label: 'Invite & grow', icon: I.network },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      { to: '/app/shop', label: 'Shop', icon: I.bag },
      { to: '/app/cart', label: 'Cart', icon: I.cart },
      { to: '/app/orders', label: 'Orders', icon: I.receipt },
    ],
  },
  {
    label: 'Ecosystem',
    items: [
      { to: '/app/founders', label: 'Founders', icon: I.star },
      { to: '/app/partners', label: 'Partners', icon: I.handshake },
      { to: '/app/stakeholders', label: 'Stakeholders', icon: I.grid },
      { to: '/app/institutions', label: 'Institutions', icon: I.book },
      { to: '/app/sponsor', label: 'Sponsor dashboard', icon: I.chart },
      { to: '/app/verify', label: 'Verify', icon: I.shield },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/app/notifications', label: 'Notifications', icon: I.bell },
      { to: '/app/profile', label: 'Profile', icon: I.user },
      { to: '/app/settings', label: 'Settings', icon: I.gear },
      { to: '/app/security', label: 'Security', icon: I.lock },
      { to: '/app/help', label: 'Help', icon: I.help },
      { to: '/app/support', label: 'Contact support', icon: I.chat },
    ],
  },
];
