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
