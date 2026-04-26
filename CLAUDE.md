# CLAUDE.md

## Project at a glance

This is **Velostevie** — a personal cycling blog by Stephen Masters. It is a Hugo static site with custom layouts (no external theme). Content covers cycling routes, including La Loire à Vélo (2024) and Canal des Deux Mers (2025).

## Language

All content, comments, and documentation should use **British English** (e.g. "colour" not "color", "organise" not "organize", "travelling" not "traveling").

## Architecture

- **Content:** `content/articles/<year>/<series>/<date>_<slug>/index.md` — page bundles with YAML front matter.
- **Images:** `static/images/articles/<year>/<series>/<slug>/` — served at `/images/...` paths. **Not** `assets/images/`.
- **Layouts:** Custom templates in `layouts/` — `_default/`, `articles/`, `partials/`, `shortcodes/`, and `index.html`. No external theme.
- **Styles:** Single SCSS file at `assets/scss/main.scss`, processed via Hugo pipes (dart-sass). CSS custom properties are used as design tokens throughout. The full visual design system — colours, typography, voice, and UI components — is defined in the `velostevie-design` skill at `.claude/skills/velostevie-design/`. Load that skill before making any design or styling changes.
- **JavaScript:** `assets/js/` — loaded via Hugo pipes in `layouts/_default/baseof.html` with fingerprinting. Currently: `lightbox.js`, `gpxmap.js`.
- **Config:** `config/_default/` — `hugo.toml`, `params.toml`, `languages.toml`, `menus/`, etc.
- **Scripts:** `scripts/` — utility shell scripts (e.g. `check-gps.sh`). Run from the project root.
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

## GPX maps — architecture and diagnostics

### How it fits together

```
{{< gpxmap gallery="images/articles/…/gallery" >}}
```

1. **`layouts/shortcodes/gpxmap.html`** runs at Hugo build time:
   - Finds `*.gpx` page-bundle resources → passed as `data-gpx-files="url1|url2"` on the map div.
   - Reads the `gallery` param, lists `static/<gallery>/` → passed as `data-photos="url1|url2"` on the map div.
   - Renders only if at least one GPX file **or** at least one photo URL exists.
   - When no GPX files are present the download section is omitted entirely.

2. **`assets/js/gpxmap.js`** runs in the browser (IIFE, no ES modules):
   - Picks up the map div by `.gpx-map` class.
   - If `data-gpx-files` is present: fetches each GPX, draws a coloured polyline, fits map to route bounds.
   - Calls `addPhotoMarkers()` which reads `data-photos`, then calls `exifr.gps(url)` on each image.
   - Images with GPS get a numbered `L.divIcon` marker; clicking a marker triggers the lightbox for that image.
   - If no GPX files: waits for all photo GPS reads to complete (`onBoundsReady` callback), then fits map to photo bounds.

3. **`static/exifr/exifr-lite.umd.js`** — despite the filename this is the **full** exifr build (supports PNG GPS). It was replaced with `node_modules/exifr/dist/full.umd.js`. Loaded only on pages that use `{{< gpxmap >}}`.

4. **`static/leaflet/`** — Leaflet served locally (not CDN). Loaded only on pages that use `{{< gpxmap >}}`.

### Common failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| Hugo build fails with `readDir: no such file or directory` | `gallery` param in `{{< gpxmap >}}` or `{{< gallery >}}` points to a directory that doesn't exist | Check the path in the shortcode matches the actual directory under `static/`. Common cause: wrong date slug in the path. |
| Map div renders but is blank / tiles don't load | Leaflet JS not loaded, or `L` undefined at script execution time | Check `baseof.html` — Leaflet and gpxmap scripts must have `defer`; gpxmap checks `typeof L !== 'undefined'` |
| Route polyline missing | GPX not in page bundle, or namespace issue | GPX files must be in the article directory alongside `index.md`. Use `getElementsByTagName('trkpt')` not `querySelectorAll` |
| Photo markers don't appear | Images lack GPS metadata, or exifr not loaded | Run `./scripts/check-gps.sh` to find images missing GPS. Check browser console for exifr errors |
| Clicking a marker doesn't open lightbox | URL mismatch between `data-photos` and `data-src` on `.lb-trigger` | `data-photos` uses literal spaces; `data-src` may be percent-encoded. Always use `decodeURIComponent` on both sides before comparing |
| Map fits to wrong location / zoom | `fitBounds` called before async GPS reads complete | In photo-only mode, `fitBounds` is called inside the `onBoundsReady` callback after all images are processed |
| `data-gpx-files` attribute URL-encoded by Hugo | Attribute name contains `"url"` — Go's `html/template` encodes those | Use `data-gpx-files` (no `url` substring) for GPX paths; use `data-photos` for photo paths |

### Diagnostic steps

```bash
# Check which images are missing GPS metadata
./scripts/check-gps.sh

# Inspect GPS tags on a specific image
exiftool -GPSLatitude -GPSLongitude "/path/to/image.png"

# Confirm the built page has the correct data attributes
curl -s http://localhost:1313/<article-url>/ | grep 'data-gpx\|data-photos'

# Check Hugo build output for shortcode errors
npm run start 2>&1 | grep -i "error\|warn"
```

### Key implementation gotchas (hard-won)

- **exifr must be the full build** — the lite build does not support PNG GPS. The file at `static/exifr/exifr-lite.umd.js` is misleadingly named but contains the full build.
- **No `crossorigin=""` on local scripts** — adding it to same-origin Leaflet/exifr script tags causes a CORS preflight that will fail.
- **GPX namespace** — GPX files use a default XML namespace so `querySelectorAll('trkpt')` finds nothing; `getElementsByTagName('trkpt')` works correctly.
- **URL encoding** — literal spaces in `data-photos` vs `%20` in `.lb-trigger[data-src]` will break marker click if not normalised with `decodeURIComponent`.
- **`absURL` requires a path-relative input** — `absURL "/images/foo"` (leading `/`) treats the path as domain-root-relative and strips the base URL subpath, giving the wrong URL on subdomain deployments. Always omit the leading `/`: `absURL "images/foo"` appends correctly to the full base URL. For page bundle resources use `.Permalink` (absolute) not `.RelPermalink` (root-relative).
- **`canonifyURLs = true` does not rewrite `data-*` attributes** — it only rewrites standard HTML URL attributes (`href`, `src`, etc.). URLs passed to JavaScript via `data-gpx-files`, `data-photos`, or any other `data-*` attribute must be made absolute in the Hugo shortcode itself using `absURL "path/..."` or `.Permalink`.

## Playwright tests

Tests live in `tests/`. Run with Node 24 (a `.nvmrc` is present — run `nvm use` to switch).

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

## Deployment

The site is deployed to **Cloudflare Pages** (`velostevie.pages.dev`). Cloudflare builds and deploys automatically on every push to `main` — no manual step required.

| Setting | Value |
|---|---|
| Build command | `npm ci && hugo mod vendor && hugo --gc --minify` |
| Output directory | `public` |
| `HUGO_VERSION` env var | `0.158.0` |
| `HUGO_BASEURL` env var | `https://velostevie.com/` |

`HUGO_VERSION` is required — without it Cloudflare uses an older built-in Hugo that fails on newer config options (e.g. the `modulequeries` cache name).

The `.github/workflows/deploy.yml` is a **build-check only** workflow (no deployment step); it runs on push to catch build errors in CI independently of Cloudflare.

To test a production build locally: `HUGO_BASEURL="https://velostevie.com/" npm run build`

## Guardrails

- Edit source files (`content/`, `config/`, `assets/`, `static/`) — never edit generated `public/` output.
- Custom templates live in `layouts/` — edit these directly to change site structure or appearance.
- Images are stored under `static/images/` (not `assets/images/`), served at root-relative `/images/...` paths.
