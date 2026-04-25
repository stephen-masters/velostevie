# Vélostevie Design System

A design system for **Vélostevie** — a personal Hugo blog documenting multi-day bike packing trips. Clean, editorial, photo-forward. A first-person journal, not a brand.

## Context

- **Product:** A single Hugo-powered blog.
- **Primary content:** Route reports from multi-day bike packing trips — writeups with embedded interactive maps, GPX downloads, and mixed landscape/detail photography.
- **Audience:** The author first (it's a personal journal), plus fellow bike packers looking for real route beta.
- **Voice:** First-person, conversational, a bit dry.
- **Starting point:** Built from scratch — no existing assets, codebase, or Figma were provided. The aesthetic direction ("editorial, magazine-like, serif headlines, earthy palette") was chosen by the author.

## Sources

None — this system was designed from a brief. A Hugo theme URL may be supplied later; the kit should adapt to match it.

## Index

- `README.md` — this file (context, content fundamentals, visual foundations, iconography)
- `colors_and_type.css` — design tokens: color, type, spacing, radii, shadows
- `fonts/` — self-hosted webfonts (Newsreader, Geist, JetBrains Mono — via Google Fonts CDN, see note)
- `assets/` — logo, icons, map markers, sample imagery
- `preview/` — small HTML specimen cards that render in the Design System tab
- `ui_kits/blog/` — Hugo blog UI kit (home, route report, route index, map, gallery)
- `SKILL.md` — cross-compatible skill manifest

---

## Content fundamentals

**Voice.** First-person singular. Conversational. A little dry, occasionally funny, never try-hard. The writer has been cold, wet, and lost, and isn't trying to sell you anything.

**Tense.** Past tense for route reports (it already happened). Present for gear notes and opinions.

**Casing.** Sentence case for everything — titles, buttons, labels, nav. Never Title Case. Never ALL CAPS except for very small eyebrow labels (`ROUTE REPORT`, `FRANCE`) where the caps act as a typographic accent, tracked +0.1em.

**Numbers are treated with respect.** Distances, elevation gain, dates, and day counts are always set in the monospace face, tabular-nums on. `237 km · 3,420 m · 4 days`. Middle dot separator, not pipe or slash.

**Units.** Metric. `km`, `m`, `kg`. Lowercase, thin non-breaking space before the unit.

**Emoji.** No. The palette and iconography carry the warmth; emoji would cheapen it.

**Examples of good copy:**

- Route title: *"Finistère in four days"* (not: "An unforgettable Brittany adventure 🚴‍♂️")
- Intro line: *"I rode into Roscoff on the ferry at 6am, ate a croissant that changed my life, and pointed the bike south."*
- Stat block header: *"The numbers"* (not: "Trip Statistics")
- Gear note: *"The tent leaked. It always leaks. I bring it anyway."*
- Button: *"Download GPX"* (not: "📥 Get the GPX file!")
- Empty state: *"No routes here yet. Soon."*
- Footer: *"Built on a kitchen table in Rennes. RSS lives here."*

**Banned phrases:** *embark, journey, unforgettable, adventure awaits, let's dive in, discover, explore (as a verb), game-changer, breathtaking.*

---

## Visual foundations

**Color vibe.** Earthy and warm. The page background is a near-white with a warm undertone (`#FBFAF6`), so photos and ink pop without feeling clinical. Body copy is dark ink — not pure black, a warm near-black (`#1F1B17`). The primary is a deep, slightly desaturated forest green (`#2F4A3A`). The accent is a clay/terracotta (`#B85C3C`) used for route lines on maps, and nothing else except occasional pull-quote marks. Neutrals are warm stones (`#8B8579`, `#C8C0B0`).

**Typography.**
- **Display:** Newsreader (Google Fonts) — editorial serif, 700 weight at large sizes, optical size enabled. Used for post titles and section headers. Tight tracking at display sizes (−0.02em).
- **Body:** Geist (Google Fonts) — clean modern sans. 400 for body, 500 for UI, 600 for emphasis. Default line-height 1.65 for articles.
- **Mono:** JetBrains Mono — for stats, GPX coordinates, dates, and the eyebrow labels above titles.
- **Scale:** 14 / 16 / 18 / 20 / 24 / 32 / 44 / 60 / 84. Editorial scale, meaning headlines are big and brave — 84px for hero route titles on desktop.

**Spacing.** A 4px base grid. Tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Editorial layouts breathe — a 96px gap above a section header is normal.

**Layout.** 12-column grid, max content width 1200px, article prose column capped at 680px (around 66ch — the classic readable measure). Generous side margins on desktop.

**Backgrounds.** Mostly solid cream. No gradients. No glassmorphism. Photos are shown full-bleed or in disciplined aspect ratios (3:2 or 16:9). Optional: a very subtle paper noise texture at 3% opacity on hero sections — can be toggled off.

**Borders.** Hairlines, 1px, in warm stone (`--fg-faint`). Used to separate stat rows, the footer, and within the nav. Never dotted or dashed.

**Corners.** Subtle, not soft. `4px` is the default radius for buttons, inputs, and cards. Images are unrounded — photos are rectangles. `0px` on the hero image.

**Shadows.** Used sparingly. Two elevation steps only:
- `sm`: `0 1px 2px rgba(31,27,23,0.06)` — card resting state
- `md`: `0 6px 20px rgba(31,27,23,0.10)` — hover on map pin popovers
No glow, no color-tinted shadows, no drop-shadow on text.

**Hover states.** Links: underline-offset grows from 0.15em to 0.25em and the accent color deepens slightly. Buttons: background shifts one step darker (no scale, no translate). Cards: image gains a 200ms subtle 1.02× scale inside its fixed frame (content doesn't move).

**Press states.** 50ms snap to 0.98 scale on buttons only. Links and cards don't animate on press.

**Animation.** Quiet. 200ms ease-out is the default. No bouncing, no spring physics. Page transitions are cross-fades at 150ms. Map pins drop with a 300ms ease-out translate from -8px. That's it.

**Transparency & blur.** Almost never. The one exception: the sticky top nav gets `backdrop-filter: blur(8px)` with `rgba(246,241,231,0.85)` so it floats over hero images without obliterating them.

**Imagery.** Landscape-heavy, color photography — not overly processed. Slightly warm-leaning, natural saturation. No filters, no grain overlay. A mix of wide landscapes and tight detail shots (bike, gear, food, hands, signage). Photos never have text overlaid on them directly — captions sit underneath in mono, left-aligned.

**Cards (route cards).** A rectangular photo (3:2) with the title in serif and a mono stat line below. No heavy shadow, no border. The whole card is a link; only the photo scales on hover.

**Maps.** The accent terracotta is reserved for drawn route lines over map tiles. Map tiles use a muted, desaturated style (OpenStreetMap with a custom light theme). Pins are small circular markers, forest green fill with a cream outline.

**Fixed elements.** A single top nav bar (height 64px), becoming sticky with blur after scroll. No floating action buttons. No cookie banner unless legally required (and if so, bottom-anchored and dismissible, matching the palette).

---

## Iconography

**Approach: restrained, line-based, outdoor-adjacent.** Icons are a supporting voice, not a lead.

**System used:** [**Lucide**](https://lucide.dev/) — loaded via CDN. Chosen because:
- 24×24 canvas, 2px stroke weight — reads editorial, not app-y
- Outdoor/travel glyphs cover the needs: `map`, `mountain`, `bed` (B&Bs / hotels), `tent` (wild camping / campsites), `coffee` (cafés, breakfast stops), `bike`, `compass`, `navigation`, `download`, `calendar`, `arrow-up-right` (for elevation gain), `ruler` (for distance)
- Free, open source, actively maintained

**Usage rules:**
- Size: `16px`, `20px`, or `24px`. Never larger than the adjacent text.
- Color: inherits from `currentColor`, usually `--fg-2` (secondary ink).
- Stroke: always the default 2px — never filled.
- Alignment: optically centered with mono/sans metadata lines.

**Emoji:** Not used anywhere.

**Unicode:** Used for the middle dot separator (`·`) in stat lines, em-dashes (`—`) in prose, and the degree symbol in GPX coordinates. Never for iconography.

**Logo / wordmark:** A wordmark in Newsreader italic, lowercase — *"vélostevie"* — with a small terracotta circle (the same color as route lines) replacing the dot on the 'i'. The circle is a 6px SVG. See `assets/logo.svg`.

**Map markers:** Custom inline SVGs (`assets/marker-start.svg`, `assets/marker-end.svg`, `assets/marker-waypoint.svg`) — small circles with 2px cream outlines, filled forest green (start), terracotta (end), or outlined only (waypoint).

---

## Font substitution notice

**Because no custom fonts were provided, I've selected from Google Fonts:**

- **Newsreader** (editorial serif) — stands in for what would typically be a licensed face like GT Sectra or Tiempos. Has real character at display sizes.
- **Geist** (sans) — Vercel's open-source sans. Clean and modern.
- **JetBrains Mono** (monospace) — for stats and coordinates.

**If you'd like different faces — please share `.woff2` files and I'll swap them in.** Happy recommendations: Söhne (sans), Portrait (serif), ABC Monument Grotesk (sans), GT Alpina (serif).
