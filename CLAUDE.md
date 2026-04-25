# CLAUDE.md

## Project at a glance

This is **Velostevie** — a personal cycling blog by Stephen Masters. It is a Hugo static site with custom layouts (no external theme). Content covers cycling routes, including La Loire à Vélo (2024) and Canal des Deux Mers (2025).

## Architecture

- **Content:** `content/articles/<year>/<series>/<date>_<slug>/index.md` — page bundles with YAML front matter.
- **Images:** `static/images/articles/<year>/<series>/<slug>/` — served at `/images/...` paths. **Not** `assets/images/`.
- **Layouts:** Custom templates in `layouts/` — `_default/`, `articles/`, `partials/`, `shortcodes/`, and `index.html`. No external theme.
- **Styles:** Single SCSS file at `assets/scss/main.scss`, processed via Hugo pipes (dart-sass). CSS custom properties are used as design tokens throughout.
- **JavaScript:** `assets/js/` — loaded via Hugo pipes in `layouts/_default/baseof.html` with fingerprinting. Currently: `lightbox.js`.
- **Config:** `config/_default/` — `hugo.toml`, `params.toml`, `languages.toml`, `menus/`, etc.
- **Build output:** `public/` — generated, do not edit directly.

## Developer commands

```bash
npm install          # first-time setup
npm run start        # local dev server at http://localhost:1313
npm run build        # production build → public/
```

## Content conventions

- Articles live at `content/articles/<year>/<series>/<YYYY-MM-DD>_<slug>/index.md`.
- Use **YAML front matter** (`---`) — existing content uses YAML throughout.
- Standard front matter fields: `date`, `title`, `tags`, `image`, `thumbnail.url`.
- Images are stored in a `gallery/` subfolder within each article's image directory: `static/images/articles/<year>/<series>/<slug>/gallery/`. This separation allows individual images to live at the slug level (e.g. hero/thumbnail images placed directly in the slug folder) while gallery images live in `gallery/`.
- Images are referenced with root-relative paths: `/images/articles/<year>/<series>/<slug>/gallery/filename.png`.
- Images are embedded using the custom `{{< image >}}` shortcode defined in `layouts/shortcodes/image.html`, e.g.:
  ```
  {{< image caption="Caption text"
  src="/images/articles/2024/loire-a-velo/lav_day_10/gallery/filename.png"
  ratio="4x3" wrapper="text-center" class="rounded col-6 col-md-6">}}
  ```
- For portrait images, add `portrait=true` to the shortcode.
- Photo galleries use the `{{< gallery >}}` shortcode defined in `layouts/shortcodes/gallery.html`, e.g.:
  ```
  {{< gallery dir="images/articles/2025/canal-des-deux-mers/2025-09-01_cdm_day_01/gallery" >}}
  ```
  The `dir` path is relative to `static/`. The shortcode reads the directory at build time and renders all non-hidden files as a grid. Clicking any image opens a lightbox (powered by `assets/js/lightbox.js`) with prev/next navigation and an auto-generated caption derived from the filename.

## JavaScript assets

- `assets/js/lightbox.js` — gallery lightbox, loaded on all pages via Hugo pipes with fingerprinting.
- `assets/js/gpxmap.js` — Leaflet map renderer for GPX route overlays, loaded only on pages using `{{< gpxmap >}}`.
- Leaflet is served **locally** from `static/leaflet/` (not from a CDN). Source: `node_modules/leaflet/dist/`. To upgrade: `npm install leaflet`, then `cp -r node_modules/leaflet/dist static/leaflet`.
- Do **not** add `crossorigin=""` to locally-served scripts — it forces a CORS request that will fail for same-origin files.
- Go's `html/template` URL-encodes any attribute whose name contains `"url"`. Use a different attribute name (e.g. `data-gpx-files`) for data passed to JavaScript.
- GPX files use a default XML namespace; use `getElementsByTagName('trkpt')` not `querySelectorAll('trkpt')`.

## Playwright tests

Tests live in `tests/`. Run with Node 22 (a `.nvmrc` is present — run `nvm use` to switch).

```bash
# Run all tests (requires dev server running on :1313)
NVM_DIR="$HOME/.nvm" source "$NVM_DIR/nvm.sh" && nvm use
npx playwright test --project=chromium --reporter=line

# Run a specific test file
npx playwright test tests/gpxmap.spec.ts --project=chromium --reporter=line
```

- `tests/gpxmap.spec.ts` — validates that the Leaflet map renders tiles and the GPX polyline loads.
- The dev server must be running (`npm run start`) before executing tests.
- `tests/example.spec.ts` is the Playwright scaffold — ignore or delete.

## Guardrails

- Edit source files (`content/`, `config/`, `assets/`, `static/`) — never edit generated `public/` output.
- Custom templates live in `layouts/` — edit these directly to change site structure or appearance.
- Images are stored under `static/images/` (not `assets/images/`), served at root-relative `/images/...` paths.
