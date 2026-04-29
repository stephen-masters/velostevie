// Fast watermark check that runs a Hugo build and inspects the output.
// Uses the image cache so the build is fast after the first run.
// No browser or running server needed.
//
// Run with Node 24:
//   NVM_DIR="$HOME/.nvm" source "$NVM_DIR/nvm.sh" && nvm use
//   npm run test:watermark

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

// Images >= 1200px wide are watermarked (lightbox 1920px, hero 1400px,
// inline 1200px). Thumbnails (800px, 640px) are not.
const WATERMARK_MIN_WIDTH = 1200;

async function* walkWebp(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // directory may not exist yet
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkWebp(full);
    } else if (entry.isFile() && entry.name.endsWith('.webp')) {
      yield full;
    }
  }
}

// Count pixels with R, G, B all > 200 in the watermark region.
// Watermark position: x = (width - 260), y = (height - 26), size 16.
// We sample a 240×20 box anchored a few pixels above that baseline.
async function nearWhitePixelCount(filePath, width, height) {
  const { data } = await sharp(filePath)
    .extract({ left: width - 260, top: height - 34, width: 240, height: 20 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let count = 0;
  for (let i = 0; i < data.length; i += 3) {
    if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) count++;
  }
  return count;
}

test('all large images in the Hugo build have a copyright watermark', async () => {
  // Build the site. --cleanDestinationDir ensures public/ only contains
  // images from the current build, not stale pre-watermark artefacts.
  // The image cache in resources/_gen/ makes this fast after the first run.
  const hugo = join(import.meta.dirname, '..', 'node_modules', '.bin', 'hugo');
  await execFileAsync(hugo, ['--cleanDestinationDir', '--quiet'], { timeout: 120_000 });

  let checked = 0;
  let skipped = 0;

  for await (const filePath of walkWebp('public/images')) {
    const { width, height } = await sharp(filePath).metadata();

    if (width < WATERMARK_MIN_WIDTH) {
      skipped++;
      continue;
    }

    const count = await nearWhitePixelCount(filePath, width, height);
    assert.ok(
      count > 50,
      `Missing watermark in ${filePath} — expected >50 near-white pixels, got ${count}`,
    );
    checked++;
  }

  assert.ok(checked > 0, 'No large images found in public/images — something went wrong with the build');
  console.log(`  Watermark present in ${checked} large images; ${skipped} thumbnails skipped`);
});
