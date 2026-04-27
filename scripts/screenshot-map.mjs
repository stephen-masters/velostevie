import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

// Edit PAGE_URL and POST_SLUG together — both should refer to the same article.
const PAGE_URL = 'http://localhost:1313/articles/2025/canal-des-deux-mers/2025-09-01_cdm_day_01/';
const POST_SLUG = '2026-04-26_gps-photo-map-hugo-leaflet-exifr'; // must match the post folder name in Tech Writing
const TECH_WRITING_DIR = '/Users/stevie/dev/gowork/src/github.com/stephen-masters/stevie-writing/Tech Writing';
const OUT_DIR = join(TECH_WRITING_DIR, POST_SLUG, 'assets');

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 30000 });

// Scroll to the map element so Leaflet can size it correctly
const mapDiv = await page.$('.gpx-map');
if (mapDiv) await mapDiv.scrollIntoViewIfNeeded();

// Give scripts time to run and tiles to load
await page.waitForTimeout(5000);

// Screenshot of just the map block
const mapEl = await page.$('.gpx-block');
if (mapEl) {
  await mapEl.screenshot({ path: join(OUT_DIR, 'gpxmap-overview.png') });
  console.log('Saved gpxmap-overview.png');
}

// Full viewport screenshot (shows map in page context)
await page.screenshot({ path: join(OUT_DIR, 'gpxmap-full-page.png') });
console.log('Saved gpxmap-full-page.png');

// Click the first photo marker and screenshot the lightbox
const firstMarker = await page.$('.photo-marker');
if (firstMarker) {
  await firstMarker.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: join(OUT_DIR, 'gpxmap-lightbox.png') });
  console.log('Saved gpxmap-lightbox.png');
} else {
  console.log('No photo markers found on this page');
}

await browser.close();
console.log('Done. Screenshots saved to:', OUT_DIR);
