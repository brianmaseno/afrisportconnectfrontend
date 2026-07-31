export type NavItem = {
  to: string;
  label: string;
  blurb: string;
};

export type NavGroup = {
  label: string;
  /** Route that the group header itself links to. */
  to: string;
  items: NavItem[];
};

/**
 * Grouping for the 20 marketing routes. A flat bar of twenty links reads as a
 * sitemap; four themes with a mega-menu reads as a product.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Product',
    to: '/platform',
    items: [
      { to: '/platform', label: 'Platform', blurb: 'Matches, clubs, learning and journeys in one app.' },
      { to: '/commerce', label: 'Commerce', blurb: 'Tickets, merchandise, memberships and marketplace.' },
      { to: '/technology', label: 'Technology', blurb: 'Architecture, AI and the engineering behind it.' },
      { to: '/design', label: 'Design system', blurb: 'One visual language across mobile and web.' },
    ],
  },
  {
    label: 'Ecosystem',
    to: '/ecosystem',
    items: [
      { to: '/ecosystem', label: 'Ecosystem', blurb: 'Twelve stakeholder domains, connected.' },
      { to: '/growth', label: 'Growth', blurb: 'How adoption compounds across the continent.' },
      { to: '/impact', label: 'Impact & ESG', blurb: 'Outcomes measured beyond downloads.' },
      { to: '/analytics', label: 'Analytics', blurb: 'The intelligence layer for clubs and partners.' },
    ],
  },
  {
    label: 'Delivery',
    to: '/delivery',
    items: [
      { to: '/roadmap', label: 'Roadmap', blurb: 'Eight phases from mobilisation to scale.' },
      { to: '/delivery', label: 'Delivery playbook', blurb: 'Discover to operate, in one handbook.' },
      { to: '/resilience', label: 'Resilience', blurb: 'Risk, continuity and recovery by design.' },
      { to: '/reference', label: 'Reference', blurb: 'Frameworks, models and the master index.' },
    ],
  },
  {
    label: 'Trust',
    to: '/trust',
    items: [
      { to: '/trust', label: 'Security & privacy', blurb: 'Identity and protection built in from day one.' },
      { to: '/governance', label: 'Governance', blurb: 'Board, committees and the PMO.' },
      { to: '/legal', label: 'Legal framework', blurb: 'Compliance across every market we enter.' },
      { to: '/investment', label: 'Investment', blurb: 'Funding, CapEx/OpEx and sustainability.' },
    ],
  },
];

/** Flat list used by the footer sitemap. */
export const allRoutes: NavItem[] = navGroups.flatMap((group) => group.items);
