# Handoff: Vélostevie bike packing blog

## Overview

**Vélostevie** is a personal Hugo blog documenting multi-day bike packing trips. It's a first-person journal — route reports, GPX files, photos, and dry commentary — not a brand or a content business.

This handoff bundles the full design system and a working HTML prototype of the blog for the developer to implement.

## About the design files

The files in `reference/` are **design references, not production code to ship directly.**

- `reference/ui_kit_blog/` is a click-thru prototype built with inline JSX + Babel. It exists to show intended layout, typography, spacing, colors, interactions, and content tone. It is not a built Hugo theme.
- `reference/preview/` contains small HTML specimen cards for each design-system primitive (colors, type, shadows, buttons, etc.).
- `reference/colors_and_type.css` is the canonical token file — this one you **can** ship as-is (or port its values to Sass/Tailwind/whatever the target uses).
- `reference/assets/` contains production-ready SVGs — logo, favicon, map markers.

**Your task:** recreate these designs inside the target codebase. The stated intent is a **Hugo** blog, so the implementation should be Hugo templates (`layouts/`), partials, shortcodes, Sass/CSS, and vanilla JS — no React in production. If the user has specified a particular Hugo theme to start from, adapt that theme's structure rather than replacing it; otherwise build a bespoke theme under `themes/velostevie/` (or equivalent).

## Fidelity

**High-fidelity.** Colors, type scale, spacing, radii, shadows, hover states, and copy are all final. Recreate pixel-for-pixel where reasonable. The one exception is imagery — the prototype uses painted gradient placeholders because no real photos were supplied. The developer should swap those for actual photos from Hugo's page bundles.

---

## Screens / views

The blog has six surfaces. All are visible in `reference/ui_kit_blog/index.html` by clicking the nav.

### 1. Global — top nav

- **Position:** sticky, top of page, `z-index: 10`
- **Height:** 64px
- **Background:** `rgba(251,250,246,0.88)` with `backdrop-filter: blur(8px)` (so it floats over hero images without obliterating them)
- **Border-bottom:** 1px solid `--border` (`#C8C0B0`)
- **Padding:** `0 40px`
- **Left:** wordmark "vélostevie" — italic serif 22px, color `--ink`, with a clay underline (see Logo spec below)
- **Right:** nav links + RSS icon, gap 28px
  - Links: Home, Routes, Map, Gallery, About
  - Link type: Geist 14px / 500 / `--ink-soft`
  - Current link: color `--ink` + underlined (1px, offset 0.35em, color `--clay`)
  - Hover: color transitions to `--clay`
- **RSS icon:** Lucide `rss`, 18px, `--ink-soft`

### 2. Home

Layout, top to bottom (max content width 1200px, horizontal padding 40px):

1. **Nav** (sticky)
2. **Hero text block** — top padding 64px
   - Eyebrow: "Latest route report · {country}" — JetBrains Mono 11px / 500, uppercase, letter-spacing 0.1em, color `--fg-muted`
   - H1: serif 84px / 700, line-height 1.02, letter-spacing −0.025em, max-width 900px, margin-top 12px
   - Lede: serif italic 22px, line-height 1.45, color `--ink-soft`, max-width 640px, margin-top 20px
   - CTA row (margin-top 28px, gap 14px): primary button "Read the report" + mono stat line "237 km · 3,420 m · 4 days"
3. **Hero photo** — margin-top 8px from the hero text, 21:9 ratio, full content width
   - Caption below in Geist 12px, `--fg-muted`, margin-top 10px
4. **Recent route reports** section — margin-top 96px
   - Section header row: H2 serif 32px / 600 left, "All routes →" link (Geist 14px, `--forest`) right, margin-bottom 40px
   - Grid: 4 columns, 32px gap, populated with `RouteCard` components
5. **Footer** (see Global section below)

### 3. Route report (article page)

1. **Nav** (sticky)
2. **Article header** — padding-top 64px, max-width 1200px, padding 40px
   - Eyebrow: "Route report · {country} · {region}"
   - H1: serif 72px / 700, letter-spacing −0.025em, line-height 1.05
   - Lede: serif italic 22px, max-width 640px
3. **Hero photo** — 21:9, full content width
4. **Stat block** — margin-top 40px
   - 4-column grid, top + bottom 1px border `--border`, background `--paper`
   - Per cell: 20px 22px padding, right border except last
   - Label: mono 10px uppercase, letter-spacing 0.1em, `--fg-muted`, margin-bottom 8px
   - Value: serif 32px / 600, line-height 1, letter-spacing −0.01em
   - Unit (km/m): mono 13px / 400, `--fg-muted`, margin-left 4px
5. **CTA row below stat block** (margin-top 20px, gap 12px): primary button "Download GPX" with download icon, secondary button "Open in komoot" with map icon
6. **Prose column** — max-width 680px, centered, margin-top 72px
   - Paragraphs: Geist 18px, line-height 1.65, margin-bottom 18px
   - H2: serif 28px / 600, letter-spacing −0.01em, margin-top 48px, margin-bottom 12px
   - Pull quote: see PullQuote component
7. **Embedded map** — margin-top 40px, full content width (1200px), height 420px
8. **Photo gallery** — margin-top 80px
   - H2 "Photos" serif 28px / 600
   - 3-column grid, 16px gap, 4:3 tiles
9. **Footer**

### 4. Route index (filterable grid)

1. **Nav**
2. **Header** — padding-top 64px
   - Eyebrow "Index"
   - H1 serif 60px / 700
   - Subtitle serif italic 20px with total route count and km sum ("6 trips. Roughly 1,759 km of riding.")
3. **Filter bar** — 1px bottom border, padding-bottom 24px
   - Two filter groups side by side, gap 32px
   - Each group: mono 11px uppercase label (`Country`, `Surface`) + inline `TagPill` controls
   - Active tag: background `--forest`, color `--paper`
   - Inactive tag: background `--paper-deep`, color `--ink-soft`
4. **Route grid** — 3 columns, 40px gap, margin-top 48px, populated with `RouteCard`
5. **Empty state** (if no matches): serif italic 20px centered, `--fg-muted`, 80px vertical padding: "No routes match. Try loosening a filter."
6. **Footer**

### 5. World map

1. **Nav**
2. **Header** — same pattern as Route index: eyebrow "Everywhere", H1 "The map of it all", italic subtitle
3. **Full-width map canvas** — height 560px, no route line, pins scattered per route
4. **Route list** below — 3-column grid, 24px gap, margin-top 40px
   - Each item: 10px forest-green dot (2px paper border, 1px stone-soft outer) + title (serif 17px / 600) + mono meta line ("France · 237 km · Apr 2026")
   - Top border on each row (1px `--border`)
5. **Footer**

### 6. Gallery

1. **Nav**
2. **Header** — eyebrow "Photographs", H1 "Things I saw", italic subtitle
3. **Masonry** — CSS `column-count: 3`, `column-gap: 16px`
   - Each tile: `break-inside: avoid`, margin-bottom 16px
   - Aspect ratios vary: 4:5, 3:2, 1:1 in rotation for visual rhythm
4. **Footer**

### 7. About

1. **Nav**
2. **Centered prose column** — max-width 680px, padding-top 64px
   - Eyebrow "About"
   - H1 "Hello." — serif 60px / 700
   - Body Geist 18px / line-height 1.65
3. **Footer**

### Global — footer

- Margin-top 96px, padding `40px 40px 60px`, border-top 1px `--border`, background `--paper-deep`
- Inside: max-width 1200px container, flex space-between, flex-wrap
- **Left:** wordmark (20px) + small paragraph Geist 13px / `--fg-muted` / line-height 1.5 / max-width 380px. Copy: *"Built on a kitchen table in Rennes. Route reports from bikes, tents, and wrong turns. RSS lives here."*
- **Right:** copyright line — mono 11px uppercase, letter-spacing 0.08em: `© 2026 · no cookies · no tracking`

---

## Components

### Logo / wordmark

Italic serif `vélostevie` with a clay (`#B85C3C`) underline.

```css
font-family: 'Newsreader', Georgia, serif;
font-style: italic;
font-weight: 600;
font-size: 22px; /* or whatever size */
letter-spacing: -0.01em;
color: #1F1B17;
text-decoration: underline;
text-decoration-color: #B85C3C;
text-decoration-thickness: 1.5px; /* scale proportionally at larger sizes */
text-underline-offset: 0.15em;
```

SVG version (for print, social cards, etc.) in `reference/assets/logo.svg`.
Favicon in `reference/assets/favicon.svg`.

### Button

Three variants. All: Geist 15px / 500, padding `10px 18px`, border-radius 4px, transition 200ms cubic-bezier(0.2, 0.7, 0.2, 1).

- **Primary:** background `--forest` (`#2F4A3A`), color `--paper`. Hover: background `--forest-deep` (`#24392D`).
- **Secondary:** transparent background, 1px `--ink` border, color `--ink`. Hover: background `--ink`, color `--paper`.
- **Ghost:** transparent, color `--forest`, no padding-x. Hover: color `--clay`, underline with 4px offset.

Icon + text buttons: `display: inline-flex`, gap 8px, icon 16px, stroke follows text color.

### Route card

A linked card: photo, eyebrow, serif title, mono stat line.

- **Photo:** 3:2 aspect, `overflow: hidden` on wrapper. Inner scale transforms from 1 to 1.03 on hover, 400ms cubic-bezier(0.2, 0.7, 0.2, 1). No border, no shadow, no border-radius.
- **Eyebrow:** mono 11px uppercase, letter-spacing 0.1em, `--fg-muted`, margin-top 14px. Format: `Route report · {country}`
- **Title:** serif 24px / 700, letter-spacing −0.01em, line-height 1.15, margin `6px 0 8px`
- **Stats:** mono 12px / tabular-nums, `--fg-muted`. Format: `237 km · 3,420 m · Apr 2026` (middle-dot separator, thin non-breaking space before units)

### Tag pill

Rounded-full, Geist 12px / 500, padding `5px 12px`, no border. Active state flips to forest bg + paper fg. Only component in the system that uses pill radius.

### Stat block

Always 4 cells. See Route report section above for full spec. Label is uppercase mono, value is big serif, unit is small mono.

### Pull quote

```html
<blockquote style="border-left: 2px solid #B85C3C; padding: 0 0 0 24px; margin: 40px 0;">
  <p style="font-family: serif; font-style: italic; font-size: 24px; line-height: 1.4; color: #3A342D; margin: 0;">…</p>
  <div style="font-family: mono; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #8B8579; margin-top: 12px;">…</div>
</blockquote>
```

### Map embed

Real implementation target: **Leaflet** with a muted OpenStreetMap tile style (or MapTiler with a custom cream/stone theme). The prototype's `MapEmbed.jsx` fakes this with inline SVG — don't ship that.

Styling constraints:
- **Route line:** stroke `#B85C3C`, width 3–4px, `stroke-linecap: round`
- **Start marker:** circle, 9px radius, fill `#2F4A3A`, 2.5px stroke `#FBFAF6`
- **End marker:** circle, 9px radius, fill `#B85C3C`, 2.5px stroke `#FBFAF6`
- **Waypoint marker:** circle, 6px radius, fill `#FBFAF6`, 2px stroke `#2F4A3A`
- **Zoom control:** small 28×28 buttons, `--paper` background, `--border` outline, 4px radius (corner only on outer container)
- **Attribution:** mono 10px, `rgba(31, 27, 23, 0.55)`
- Tile palette: cream base (~#E8E0CD), muted moss greens for parkland, slate blues for water, stone beige roads. Avoid saturated defaults.

SVG marker files in `reference/assets/marker-{start,end,waypoint}.svg`.

### Icons

Use **Lucide** (via `lucide-static` at build time for Hugo, or `<i data-lucide="...">` + the browser script). Always 2px stroke, never filled, inherits `currentColor` from `--fg-2`.

Glyphs used: `map`, `mountain`, `bed` (B&Bs / hotels), `tent` (wild camping), `coffee` (cafés), `bike`, `compass`, `navigation`, `download`, `calendar`, `arrow-up-right`, `ruler`, `rss`, `search`.

---

## Interactions & behavior

- **Link underlines** (body + nav + inline prose): 1px, 0.15em offset. On hover: offset grows to 0.25em and color shifts `--forest` → `--clay`. Transition 200ms.
- **Buttons:** no scale, no translate on hover — only background/color change (200ms). On active/press: scale 0.98 for 50ms.
- **Route cards:** only the inner image scales (1 → 1.03, 400ms). Title/stats don't move.
- **Map pins drop-in:** translate from −8px → 0 over 300ms ease-out on initial paint. Don't re-run on scroll.
- **Sticky nav:** always sticky; the backdrop-blur handles hero overlap. No show/hide on scroll.
- **Page transitions** (if using htmx, barba, or similar): 150ms cross-fade. If standard Hugo full page loads, don't fake it.
- **Focus rings:** 2px `--forest` outline, 2px offset, only on `:focus-visible`.

## State & data

For Hugo:
- Routes are content entries under `content/routes/<slug>/index.md` (page bundles with photos co-located)
- Front-matter fields each route needs:
  ```yaml
  title: "Finistère in four days"
  date: 2026-04-15
  country: "France"
  region: "Brittany"
  distance_km: 237
  elevation_m: 3420
  days: 4
  surface: "mixed"         # one of: paved, gravel, mixed
  hero_image: "hero.jpg"
  gpx: "route.gpx"
  summary: "I rode into Roscoff on the ferry at 6am…"
  coordinates:
    - { lat: 48.7276, lon: -3.9816 }  # start
    - { lat: 47.9960, lon: -4.0975 }  # end
  ```
- Home page uses `first 4` of `where .Site.RegularPages "Section" "routes"`
- Route index page needs a filter UI — since Hugo is static, do this client-side with a tiny vanilla JS filter that reads `data-country` / `data-surface` attributes on the grid cards
- Map page: render an ordered array of route metadata as JSON (Hugo `dict` → `jsonify`) and feed Leaflet from it

## Design tokens

All tokens live in `reference/colors_and_type.css` as CSS custom properties. Port them as-is into the Hugo theme's Sass/CSS:

### Color

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#FBFAF6` | Page background (near-white, warm undertone) |
| `--paper-deep` | `#F3EFE4` | Secondary surface, footer |
| `--ink` | `#1F1B17` | Body text, headings |
| `--ink-soft` | `#3A342D` | Secondary text, lede |
| `--stone` | `#8B8579` | Captions, metadata |
| `--stone-soft` | `#C8C0B0` | Borders, dividers |
| `--stone-faint` | `#E4DECC` | Subtle backgrounds |
| `--forest` | `#2F4A3A` | Primary — buttons, nav accents, marker-start |
| `--forest-deep` | `#24392D` | Primary hover |
| `--moss` | `#6B8A6E` | Soft secondary green |
| `--clay` | `#B85C3C` | Accent — route lines, link hover, pull-quote rule |
| `--clay-deep` | `#9B4A2E` | Clay hover |

### Type

- **Serif (display):** Newsreader (Google Fonts) — weights 400/500/600/700, italic 400/600, optical sizing 6–72pt
- **Sans (body + UI):** Geist (Google Fonts) — weights 400/500/600/700
- **Mono (stats):** JetBrains Mono — weights 400/500/600, `font-variant-numeric: tabular-nums` always on

**Scale:** 12 / 14 / 16 / 18 / 20 / 24 / 32 / 44 / 60 / 84

**Line heights:** 1.1 tight · 1.25 snug · 1.45 normal · 1.65 prose

**Tracking:** −0.02em display · −0.01em tight · 0.1em eyebrow

### Spacing (4px grid)

4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128

### Radii

0 (images) · 2 (subtle) · 4 (default — buttons, inputs, cards) · 8 (larger cards) · 9999 (tag pills only)

### Shadows

- `--shadow-sm`: `0 1px 2px rgba(31, 27, 23, 0.06)` — card resting
- `--shadow-md`: `0 6px 20px rgba(31, 27, 23, 0.10)` — map popover hover

No glows, no colored shadows, no drop-shadow on text.

### Layout

- Content max-width: 1200px
- Prose max-width: 680px (~66ch)
- Nav height: 64px
- Standard horizontal padding: 40px desktop

### Motion

- Default ease: `cubic-bezier(0.2, 0.7, 0.2, 1)`
- Durations: 120ms fast · 200ms default · 300ms slow

---

## Content & voice rules

Non-negotiable (see `reference/README_design_system.md` for full list):

- **First person, past tense** for route reports. Conversational, a bit dry.
- **Sentence case everywhere** — titles, buttons, labels.
- **No emoji.**
- **Metric units.** `237 km · 3,420 m · 4 days`. Middle dot separator, thin non-breaking space before unit.
- **Stats in mono with tabular-nums always on.**
- **Banned phrases:** *embark, journey, unforgettable, adventure awaits, let's dive in, discover, explore (as a verb), game-changer, breathtaking.*

---

## Assets

All in `reference/assets/`:
- `logo.svg` — italic wordmark with clay underline
- `favicon.svg` — 64×64, forest circle with italic 'v' and clay rule
- `marker-start.svg`, `marker-end.svg`, `marker-waypoint.svg` — map markers

Fonts load from Google Fonts CDN (see `@import` at top of `colors_and_type.css`). If you'd rather self-host, download `.woff2` files and replace the `@import` with `@font-face` declarations.

Photos are the user's own — they go in each route's page bundle (`content/routes/<slug>/*.jpg`). The prototype uses gradient placeholders.

---

## Files

**Design system (port as-is):**
- `reference/colors_and_type.css` — all tokens + base element styles
- `reference/assets/*.svg` — logo, favicon, markers

**Prototype (reference only — recreate in Hugo):**
- `reference/ui_kit_blog/index.html` — entry point, screen router
- `reference/ui_kit_blog/Primitives.jsx` — Logo, Button, TagPill, Icon, Eyebrow
- `reference/ui_kit_blog/Nav.jsx` — sticky nav + footer
- `reference/ui_kit_blog/Cards.jsx` — Placeholder, RouteCard, StatBlock, PullQuote
- `reference/ui_kit_blog/MapEmbed.jsx` — faked map (for reference only; use Leaflet in production)
- `reference/ui_kit_blog/HomeScreen.jsx`
- `reference/ui_kit_blog/ReportScreen.jsx`
- `reference/ui_kit_blog/OtherScreens.jsx` — Routes, Map, Gallery, About
- `reference/ui_kit_blog/data.jsx` — sample route data

**Specimen cards (visual reference for individual tokens/components):**
- `reference/preview/*.html` — one file per concept, all open standalone

**Full design system doc:**
- `reference/README_design_system.md` — authoritative source for voice, color, type, iconography, visual foundations

## Opening the prototype

Either open `reference/ui_kit_blog/index.html` directly in a browser, or from the handoff folder run a quick static server:

```bash
cd design_handoff_velostevie/reference/ui_kit_blog
python3 -m http.server 8000
# then visit http://localhost:8000
```
