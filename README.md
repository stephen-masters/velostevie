# Velostevie

A personal cycling blog by Stephen Masters, built with [Hugo](https://gohugo.io).

I might convert this into a Hugo theme at some point, but for now, feel free to use this site as a template for your own.

## Licensing

The **code and configuration** (Hugo templates, layouts, scripts, SCSS, JavaScript) are released under the [MIT Licence](LICENSE) — use them freely to build your own travel blog.

The **written content and photographs** (`content/` and `assets/images/`) are © Stephen Masters, all rights reserved, and are not available for reuse. See [LICENSE-CONTENT](LICENSE-CONTENT) for details.

## Prerequisites

- [Git](https://git-scm.com)
- [Go](https://go.dev/dl/)
- [Node.js](https://nodejs.org) (includes npm)

## Setup

Install dependencies and Hugo modules:

```bash
npm install && npm run mod:update
```

## Running locally

Start the development server:

```bash
npm run start
```

The site will be available at `http://localhost:1313`.

## Building for production

```bash
npm run build
```

Output is written to the `public/` directory.

## GitHub Actions build

`.github/workflows/deploy.yml` has been modified based on the assumption it is using a self-hosted runner.

On my mac, this can be found in: `/Users/stevie/dev/utils/actions-runner`

Start a shell in that directory and run: `./run-helper.sh run`

## GPX Maps

Articles can include an interactive Leaflet map using the `{{< gpxmap >}}` shortcode. The map can display a GPX route polyline, numbered photo markers derived from gallery image GPS metadata, or both.

### Adding a map to an article

Place the shortcode in the article's `index.md`. If the article's page bundle contains one or more `.gpx` files, they are drawn as a route polyline automatically — no extra parameter is needed for the route.

To overlay photo markers, pass the `gallery` parameter pointing to the article's gallery directory (relative to `assets/`):

```
{{< gpxmap gallery="images/articles/2025/canal-des-deux-mers/2025-09-01_cdm_day_01/gallery" >}}
```

If no `.gpx` file is present, the map will still render and fit its view to the bounds of whichever gallery images have GPS coordinates — useful for rest days or travel days with no cycling route.

### How photo markers work

GPS coordinates are extracted from image EXIF data at build time by `scripts/extract-gps.mjs`, which writes them to `data/photo-gps.json`. Hugo's `gpxmap` shortcode reads that file and embeds the coordinates directly into the page HTML as a `data-photo-markers` JSON attribute — no browser-side GPS reading happens at all.

When the page loads, the map script reads the pre-embedded coordinates and places a numbered circle marker for each image that has a location. Clicking a marker opens the lightbox directly to that image.

Images without GPS metadata are shown in the gallery as normal but do not appear on the map.

### Gallery GPS metadata

To find gallery images that are missing GPS data, run:

```bash
./scripts/check-gps.sh
```

This scans all `gallery/` folders under `assets/images/` and lists any images that do not have a `GPSLatitude` property, along with a total count.

## Other commands

| Command | Description |
|---|---|
| `npm run start:prod` | Run dev server in production mode |
| `npm run mod:update` | Update Hugo modules and vendors |
| `npm run lint` | Lint scripts, styles, and markdown |
| `npm run upgrade` | Upgrade npm packages and Hugo modules |
