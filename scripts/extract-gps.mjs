/**
 * extract-gps.mjs
 *
 * Reads GPS EXIF data from every image under assets/images/ and writes the
 * results to data/photo-gps.json as a flat map of image path → { lat, lng }.
 *
 * Hugo's gpxmap shortcode reads this file at build time to embed photo marker
 * coordinates directly in the page HTML, so no GPS reading happens in the
 * browser.
 *
 * Run:  node scripts/extract-gps.mjs
 *       (or via `npm run extract-gps`)
 *
 * This script runs automatically before every `npm run start` and
 * `npm run build`, so data/photo-gps.json is always up to date.
 */

import exifr from 'exifr';
import { readdir, writeFile, mkdir } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

async function walkDir(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkDir(fullPath));
    } else if (/\.(png|jpe?g|heic|tiff?)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  const assetsDir = join(ROOT, 'assets');
  const imagesDir = join(assetsDir, 'images');
  const dataDir = join(ROOT, 'data');
  const outputFile = join(dataDir, 'photo-gps.json');

  const files = await walkDir(imagesDir);
  const gpsData = {};
  let count = 0;

  for (const file of files) {
    try {
      const gps = await exifr.gps(file);
      if (gps && gps.latitude && gps.longitude) {
        const key = relative(assetsDir, file).replace(/\\/g, '/');
        gpsData[key] = { lat: gps.latitude, lng: gps.longitude };
        count++;
      }
    } catch {
      // No GPS data or unreadable — skip
    }
  }

  await mkdir(dataDir, { recursive: true });
  await writeFile(outputFile, JSON.stringify(gpsData, null, 2));
  console.log(`GPS extracted for ${count} of ${files.length} images → data/photo-gps.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
