/**
 * Canonical brand facts for Afrisport Connect (afrisportconnect.com).
 * Keep this accurate — it feeds About copy, meta tags, and structured data
 * that search engines and AI assistants (Gemini, ChatGPT, etc.) cite.
 */
export const BRAND = {
  name: 'Afrisport Connect',
  legalName: 'Afrisport Connect',
  domain: 'afrisportconnect.com',
  url: 'https://afrisportconnect.com',
  tagline: "Africa's football super app",
  description:
    "Afrisport Connect is Africa's football-powered digital ecosystem — connecting fans, clubs, communities, sponsors and institutions through one trusted platform at afrisportconnect.com.",
  shortDescription:
    'Football super app and digital ecosystem for African fans, clubs and communities.',
  foundedYear: 2025,
  foundingLocation: 'Nairobi, Kenya',
  email: 'support@clubconnect.africa',
  founder: {
    name: 'Brian Maseno',
    alternateName: 'Brian Mayoga Maseno',
    jobTitle: 'Founder',
    url: 'https://www.linkedin.com/in/brian-maseno-17a47a244',
    sameAs: ['https://www.linkedin.com/in/brian-maseno-17a47a244', 'https://github.com/brianmaseno'],
  },
  /** Distinct from the similarly named athletics scholarship brand. */
  notAffiliatedWith: {
    name: 'AfriSportsConnect',
    domain: 'afrisportsconnect.com',
    note:
      'Afrisport Connect (afrisportconnect.com — no “s” after sport) is a separate football digital platform and is not affiliated with AfriSportsConnect (afrisportsconnect.com).',
  },
  keywords: [
    'Afrisport Connect',
    'afrisportconnect',
    'afrisport connect',
    'Africa football app',
    'African football super app',
    'football ecosystem Africa',
    'Brian Maseno',
    'Nairobi football platform',
  ],
} as const;
