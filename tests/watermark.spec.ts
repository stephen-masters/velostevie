import { test, expect, Page } from '@playwright/test';

// Day 1 CDM article has both a hero image and a gallery with lightbox images.
const ARTICLE_PAGE = 'http://localhost:1313/articles/2025/canal-des-deux-mers/2025-09-01_cdm_day_01/';
const BASE_URL = 'http://localhost:1313';

function toAbsolute(url: string): string {
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
}

// Counts pixels with R, G, B all above 200 within the watermark region.
// Watermark parameters (from gallery.html / single.html):
//   x = width - 260,  y = height - 26,  font size 16
// We sample a 240×20 box anchored just above that baseline.
async function nearWhitePixelCount(page: Page, imageUrl: string): Promise<number> {
  return page.evaluate(async (url: string) => {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const wmX = img.naturalWidth - 260;
    const wmY = img.naturalHeight - 34; // a few pixels above the text baseline
    const { data } = ctx.getImageData(wmX, wmY, 240, 20);

    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) count++;
    }
    return count;
  }, imageUrl);
}

test('hero image has copyright watermark', async ({ page }) => {
  await page.goto(ARTICLE_PAGE, { waitUntil: 'networkidle' });

  const heroImg = page.locator('.article-hero-image img');
  await expect(heroImg).toBeAttached();

  const src = await heroImg.getAttribute('src');
  expect(src).toBeTruthy();

  const count = await nearWhitePixelCount(page, toAbsolute(src!));
  console.log(`Hero watermark: ${count} near-white pixels in watermark region`);
  expect(count).toBeGreaterThan(50);
});

test('gallery lightbox images have copyright watermark', async ({ page }) => {
  await page.goto(ARTICLE_PAGE, { waitUntil: 'networkidle' });

  // data-src on .lb-trigger is rewritten to absolute by canonifyURLs
  const trigger = page.locator('.lb-trigger').first();
  await expect(trigger).toBeAttached();

  const dataSrc = await trigger.getAttribute('data-src');
  expect(dataSrc).toBeTruthy();

  const count = await nearWhitePixelCount(page, toAbsolute(dataSrc!));
  console.log(`Lightbox watermark: ${count} near-white pixels in watermark region`);
  expect(count).toBeGreaterThan(50);
});
