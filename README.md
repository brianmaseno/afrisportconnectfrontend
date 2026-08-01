# Afrisport Connect Marketing Website

Separate Vite + React marketing site under `website/`.
**Not** the Laravel Blade admin (`/admin`). The API host should open admin login, not this SPA.

## Local development

```bash
cd website
npm install
npm run dev
```

Opens at http://localhost:5173

## Production build

```bash
cd website
npm run build
```

Outputs to `website/dist/`. Host that folder on a marketing domain (or CDN) separately from the Laravel API/admin host.

## Routing (API / admin host)

| Path | Served by |
|------|-----------|
| `/` | Redirect → `/admin/login` |
| `/admin/*` | Laravel Blade admin |
| `/privacy`, `/terms` | Laravel legal pages |
| `/api/*` | Laravel API |

## Brand assets

The website uses the **same logo as the Flutter app**
(`mobile/assets/images/afrisport_connect_logo_annotated-Photoroom.png`), cropped into
web-ready variants in `public/brand/`:

| File | Use |
|------|-----|
| `mark-gold.png` | Shield only, gold — nav, ticker, badges |
| `mark-white.png` | Shield only, white — reserved for dark/mono contexts |
| `logo-lockup-gold.png` | Shield + wordmark, all-gold — loader, footer, boot splash |
| `logo-lockup.png` | Shield + wordmark, original colours (dark backgrounds only) |
| `favicon.png` | Browser tab / apple-touch icon |

> The original lockup renders "AFRI" in white, so it only reads correctly on dark
> surfaces. The `-gold` variant recolours every glyph and is safe everywhere — use it
> by default.

If the app logo changes, regenerate these from the Flutter asset rather than
hand-editing them, and keep the filenames stable.

## Imagery

All photography is served locally from `public/images/` (33 optimised JPEGs, ~9 MB
total, max 1600px wide / 2200px for the hero). There are **no external image
requests** — nothing hotlinks a photo CDN.

Import paths through `src/lib/media.ts` rather than hard-coding strings:

```tsx
import { media } from '../lib/media';
<img src={media.nightMatch} alt="" loading="lazy" />
```

## Design system

`src/styles/global.css` holds the tokens — the palette mirrors the Flutter app
(`mobile/lib/core/theme/app_colors.dart`): emerald `#0B6E4F`, royal gold `#D4AF37`,
midnight navy `#0B1F3A`, innovation teal `#00B8D9`.

Stylesheet load order is significant and is set in `src/main.tsx`:

1. `styles/global.css` — tokens, typography, buttons, cards, motion keyframes
2. component stylesheets (pulled in via `App`)
3. `styles/sections.css` — cross-section polish applied last

Shared primitives available to any page: `.shell`, `.plate-dark`, `.grain`, `.display`,
`.accent`, `.eyebrow`, `.button` (`-green` / `-gold` / `-dark` / `-ghost` / `-outline`),
`.card`, `.glass`, `.chip`, `.media-frame`, `.link-arrow`, `.stat-value`, `.rule-gold`.

Headings inherit their colour, so a section that sets `color` (e.g. `.plate-dark`)
carries through to its headings without per-heading overrides.

### Motion

| Component | Purpose |
|-----------|---------|
| `Loader` | Branded first-paint screen; hands over from the inline `#boot` splash in `index.html` |
| `Reveal` | Scroll-triggered entrance — `dir`, `delay`, `stagger` props |
| `Counter` | Counts up when scrolled into view |
| `ScrollProgress` | Reading-progress bar under the nav |
| `useParallax` | Writes a `--parallax` px value for CSS to consume |

Every animation is disabled under `prefers-reduced-motion: reduce`.

## Navigation

`src/lib/navigation.ts` is the single source of truth for the 20 marketing routes,
grouped into Product / Ecosystem / Delivery / Trust. Both the nav mega-menu and the
footer sitemap render from it — add a route there, not in two places.

## Store links

Google Play / App Store CTAs are presented as "coming soon" placeholders (non-clickable)
until real store URLs are provided. Swap the `<span className="store">` elements in
`Download.tsx` and the `.store-badge` elements in `Footer.tsx` for anchors at that point.

---

# Authenticated web app

The marketing site is unchanged. Alongside it there is now a full account area
that talks to the **same Laravel API the Flutter app uses**. No backend code was
modified.

## Configuration

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Where the client calls the API. Relative (`/api/v1`) goes through the Vite proxy; absolute calls the host directly. |
| `VITE_API_PROXY_TARGET` | Dev/preview only — the host `vite.config.ts` proxies `/api` to. |
| `VITE_ENABLE_APP` | `false` hides Sign in / Join and disables `/login`, `/signup` and `/app`. |

Files: `.env` (dev), `.env.production` (build), `.env.example` (template).

### Why the proxy exists

The deployed API sends **no `Access-Control-Allow-Origin` header**, so a browser
cannot call it cross-origin. The Flutter app is unaffected — native apps do not
enforce CORS. Proxying `/api` through Vite makes the call same-origin in
development, so nothing on the backend has to change.

**For production** the API host must allow the site's origin. This is an
environment variable, not a code change:

```
CORS_ALLOWED_ORIGINS=https://your-marketing-domain.com
```

Verify with:

```bash
curl -I -H "Origin: https://your-marketing-domain.com" \
  https://clubconnect-plapt.ondigitalocean.app/api/v1/settings
# must return: access-control-allow-origin: ...
```

Alternatively, serve `dist/` behind a reverse proxy that forwards `/api` to the
Laravel host and keep `VITE_API_BASE_URL=/api/v1`.

## Architecture

| File | Role |
|------|------|
| `src/lib/api.ts` | Fetch client mirroring `mobile/lib/core/network/api_client.dart` — bearer token, `{success, message, data}` envelope, pagination, media URLs, shared error copy |
| `src/lib/auth.tsx` | `AuthProvider` — token persistence, `/auth/me` bootstrap, login/register/MFA/logout |
| `src/lib/useApi.ts` | `useApi` (GET + loading/error/reload) and `useMutation` (pending/error/field errors) |
| `src/lib/types.ts` | API response types |
| `src/app/ui.tsx` | `DataState`, `Panel`, `Row`, `Stat`, `Badge`, skeletons, empty/error states |
| `src/app/nav.tsx` | Sidebar IA, grouped to match the backend's `GET /navigation` |

Every screen renders through `DataState`, so loading, error, empty and content
states are consistent and no page can show a bare spinner forever.

## Routes

**Public:** `/login`, `/signup` (3-step: details → club & location → OTP verify),
`/forgot-password`.

**Protected** (`/app/*`, 50 screens):

| Group | Screens |
|-------|---------|
| Main | Home, Match centre, Match detail, Standings, Discover, Assistant |
| Football | Clubs, Club hub, News, Afrisport TV, Play zone (predictions + fantasy) |
| Identity | Fan Passport, Membership, Wallet & rewards, Impact, Challenges, Awards, Badges |
| Community | Community, Feed, Chapters, Chapter detail, Events, Event detail, Network, Messages, Creators, Creator studio |
| Opportunity | Learn, Course detail, Opportunities, Opportunity detail, Talent, My talent profile, Projects, Project detail, Invite & grow |
| Marketplace | Shop, Product detail, Cart, Orders, Order detail, Payment return |
| Ecosystem | Founders, Partners, Stakeholders, Institutions, Sponsor dashboard, Verify |
| Account | Notifications, Profile, Settings, Security, Help, Contact support |

## API coverage

Of the 226 routes in `backend/routes/api.php`, **197 are wired up**. The
remaining 29 are out of scope for a browser client: cron and webhook endpoints,
the partner/admin API, FCM device registration, deep links, the screen map, and
the marketing-page summary endpoints already rendered as static content.

Re-run the audit any time with the script in the project notes — it diffs
`routes/api.php` against everything referenced under `website/src`.

## Commerce & payments

Paystack is wired end to end:

| Flow | Endpoints |
|------|-----------|
| Checkout | `POST /orders` → `POST /payments/initialize` → hosted checkout → `/app/payment/return` → `POST /payments/verify` |
| Membership upgrade | `POST /membership/subscribe` (free tiers activate immediately) |
| Wallet top-up | `POST /wallet/top-up` |
| Donations | `POST /projects/{slug}/donate` |
| Order payment | `POST /payments/initialize` from the order page |

`src/lib/payments.ts` wraps these and handles the redirect. The reference is
kept in `sessionStorage` so the return page can verify even if the gateway
omits it from the query string.

## Auth contract

Registration mirrors `AuthController::register` and needs a verified OTP:

1. `POST /auth/otp/send` → `{ identifier, channel: email\|phone, purpose: verify }`
2. `POST /auth/register` → name, email\|phone, password + confirmation, `otp_code`,
   `country_id`, `preferred_club_id`, `accept_terms`, `accept_privacy`
   (optional: region, city, occupation, membership tier, referral code)

Login handles the MFA challenge: when `/auth/login` returns `requires_mfa`, the
short-lived `mfa_token` is sent as the bearer for `/auth/mfa/verify-login`.

CAPTCHA is honoured but currently disabled server-side
(`GET /settings` → `security.captcha_enabled: false`).

## Not implemented on web

FCM push notifications, offline caching and certificate pinning stay mobile-only —
they depend on native capabilities the browser does not provide. Everything else,
including Paystack payments, is available on the web.

---

## App UI

The authenticated area shares the marketing site's design system but has its
own layout rules:

- **`.app-content section { padding: 0 }`** — `global.css` gives every
  `<section>` the marketing site's tall rhythm (up to 140px). The app sets its
  own spacing, so that is reset inside the app shell. Anything that needs its
  own padding (the dashboard hero) must beat that selector's specificity.
- **`<Media>`** (`app/ui.tsx`) — every catalogue image goes through it. Much of
  the live catalogue has `image: null` or URLs that 404, so it falls back to a
  branded placeholder (brand gradient + shield watermark + label) both when the
  source is missing and when it fails to load. Never render a bare `<img>` for
  API-supplied artwork.
- **Dashboard hero** — the one branded dark plate inside the app; the stat row
  overlaps it via a negative margin so the two read as a single unit.

## Testing notes

End-to-end tested against the Laravel API in `../backend` run locally
(`php artisan serve`), driven through a real Chrome instance over the DevTools
protocol. Local was used rather than the deployed API because `APP_ENV=local`
turns on `OTP_MOCK_MODE`, so `/auth/otp/send` returns a `debug_code` and the
signup flow can be completed without receiving an email.

`.env.local` (gitignored) points the site at `http://127.0.0.1:8000`. Delete it
to fall back to the deployed API in `.env`.

### Covered

| Flow | Result |
|------|--------|
| Signup — 3 steps incl. OTP | Account created, token stored, lands on `/app` |
| Login | Session restored, `/auth/me` bootstraps the user |
| All 44 app routes | No JS errors, no unexpected API failures |
| Profile update | Value persists across reload |
| Add to cart → cart → checkout | Reaches the real Paystack checkout page (test keys) |
| Predictions | Payload accepted; API enforces its own kick-off cutoff |

### Bugs found and fixed

1. **`useMutation` froze the first render's closure.** `run` was memoised with
   an empty dependency list, so every mutation submitted stale state — signup
   sent an empty OTP identifier, and login would have sent empty credentials.
   Now the callback is held in a ref so `run` stays stable while calling the
   current closure. This affected every write path in the app.
2. **Teams are objects, not strings.** `home_team`/`away_team` come back as
   full team records; rendering them directly crashed Play zone and printed
   `[object Object]` elsewhere. All call sites now use `labelOf()`.
3. **Chapter `city` is an object** and the count field is `member_count`, not
   `members_count` — the former crashed Community, the latter always showed 0.
4. **`GET /cart` returns `{ items: [...] }`**, so `extractList` saw an empty
   cart. It now also recognises `items` and `results`.
5. **Predictions used the wrong contract.** `POST /predictions` needs `type`
   plus `predicted_home_score` / `predicted_away_score` / `predicted_winner`.
6. **Duplicate React keys** on Afrisport TV.
7. **Sponsor dashboard** called role-gated endpoints for every user; the API
   answered with a redirect to the admin login, surfacing as an opaque CORS
   error. Those calls are now gated on the account's roles.
8. **Play zone listed past fixtures** as predictable. Now filtered to matches
   that have not kicked off.

### Known backend issue (not fixed — backend is out of scope)

`GET /api/v1/opportunities` returns **500** on both local and the deployed API:

```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'code' in 'field list'
(SQL: select `id`, `name`, `code` from `countries` ...)
```

The `countries` table has `iso2`/`iso3`, not `code`. The Opportunities page
renders its error state correctly; it will populate once the query is fixed.
