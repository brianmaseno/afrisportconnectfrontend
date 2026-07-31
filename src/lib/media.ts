/**
 * Local marketing imagery. Everything lives in `public/images` so the site has no
 * runtime dependency on an external photo CDN.
 */
const img = (name: string) => `/images/${name}.jpg`;

export const media = {
  // Stadium & atmosphere
  heroStadium: img('hero-stadium'),
  stadiumWide: img('stadium-wide'),
  stadiumEmpty: img('stadium-empty'),
  stadiumTunnel: img('stadium-tunnel'),
  nightMatch: img('night-match'),
  fansCelebrate: img('fans-celebrate'),
  pitchAerial: img('pitch-aerial'),
  pitchLine: img('pitch-line'),

  // The game
  matchAction: img('match-action'),
  duelAction: img('duel-action'),
  streetFootball: img('street-football'),
  womenFootball: img('women-football'),
  youthFootball: img('youth-football'),
  grassrootsHuddle: img('grassroots-huddle'),
  ballMacro: img('ball-macro'),
  ballNet: img('ball-net'),
  ballPitch: img('ball-pitch'),
  bootsBall: img('boots-ball'),
  bootsTurf: img('boots-turf'),

  // Commerce, product & people
  commerceMerch: img('commerce-merch'),
  ticketQr: img('ticket-qr'),
  phoneApp: img('phone-app'),
  deliveryTeam: img('delivery-team'),
  governanceMeeting: img('governance-meeting'),
  handshakePartner: img('handshake-partner'),
  learningClassroom: img('learning-classroom'),
  referenceLibrary: img('reference-library'),
  investmentCapital: img('investment-capital'),
  legalJustice: img('legal-justice'),
  technologyCode: img('technology-code'),
  trustSecurity: img('trust-security'),
  designUi: img('design-ui'),
  africaLandscape: img('africa-landscape'),
} as const;

export const brand = {
  mark: '/brand/mark-gold.png',
  markWhite: '/brand/mark-white.png',
  lockup: '/brand/logo-lockup-gold.png',
  lockupOriginal: '/brand/logo-lockup.png',
} as const;
