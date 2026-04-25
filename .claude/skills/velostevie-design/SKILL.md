---
name: velostevie-design
description: Use this skill to generate well-branded interfaces and assets for Vélostevie, a personal Hugo blog about multi-day bike packing trips. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping route reports, home pages, maps, and galleries.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code (e.g. a Hugo theme), you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- `README.md` — the source of truth for voice, color, type, iconography, and visual foundations
- `colors_and_type.css` — drop-in CSS variables and base element styles; import this once at the top of any HTML file
- `assets/` — logo, favicon, map markers
- `ui_kits/blog/` — React (Babel inline) recreation of the blog. `index.html` is a working click-thru prototype
- `preview/` — small HTML specimen cards for every design-system concept

## Non-negotiables
- Voice: first-person, dry, conversational. No embark/journey/unforgettable language.
- No emoji.
- Sentence case, always. Metric units with thin-space + lowercase `km`/`m`.
- Stats in monospace (JetBrains Mono), tabular-nums on.
- Photos are rectangles with subtle corners (max 4px) — never pill-rounded.
- Accent clay (`#B85C3C`) is reserved for route lines, link hover, and pull-quote rules. Primary actions use forest green.
