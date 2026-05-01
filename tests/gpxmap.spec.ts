import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:1313';
const GPX_PAGE = `${BASE_URL}/articles/2025/canal-des-deux-mers/2025-09-01_cdm_day_01/`;

// canonifyURLs rewrites all asset URLs to https://velostevie.com/…, so scripts
// and styles are cross-origin from localhost's perspective.  Cross-origin SRI requires
// a crossorigin attribute on the tag, which Hugo doesn't add, so the browser blocks
// those resources.  Fix by:
//   1. Stripping integrity attributes from HTML served by localhost (disables SRI).
//   2. Intercepting velostevie.com requests and serving them from localhost instead.
async function setupInterceptors(page: Page) {
  await page.route(`${BASE_URL}/**`, async (route) => {
    const accept = route.request().headers()['accept'] || '';
    if (!accept.includes('text/html')) {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    let body = await response.text();
    body = body.replace(/ integrity="[^"]*"/g, '');
    await route.fulfill({ response, body });
  });

  await page.route('https://velostevie.com/**', async (route) => {
    const localUrl = route.request().url().replace('https://velostevie.com', BASE_URL);
    const response = await fetch(localUrl);
    const body = Buffer.from(await response.arrayBuffer());
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => { headers[key] = value; });
    await route.fulfill({ status: response.status, headers, body });
  });
}

test('gpx map renders with leaflet tiles', async ({ page }) => {
  const consoleErrors: string[] = [];

  await setupInterceptors(page);

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  page.on('response', response => {
    if (!response.ok() && response.url().includes('unpkg.com')) {
      consoleErrors.push(`Failed to load: ${response.url()} (${response.status()})`);
    }
  });

  // Capture CSP violations via securitypolicyviolation event
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e: SecurityPolicyViolationEvent) => {
      (window as any).__cspViolations = (window as any).__cspViolations || [];
      (window as any).__cspViolations.push(`${e.violatedDirective}: ${e.blockedURI}`);
    });
  });

  await page.goto(GPX_PAGE, { waitUntil: 'networkidle' });

  const violations = await page.evaluate(() => (window as any).__cspViolations || []);
  console.log('CSP violations:', violations);
  console.log('Console errors:', consoleErrors);

  const leafletLoaded = await page.evaluate(() => typeof (window as any).L !== 'undefined');
  console.log('Leaflet loaded:', leafletLoaded);

  const mapDiv = page.locator('.gpx-map');
  await expect(mapDiv).toBeAttached();

  const gpxFiles = await mapDiv.getAttribute('data-gpx-files');
  console.log('data-gpx-files:', gpxFiles);
  expect(gpxFiles).toBeTruthy();

  const leafletPane = mapDiv.locator('.leaflet-map-pane');
  await expect(leafletPane).toBeAttached({ timeout: 15000 });

  const tiles = mapDiv.locator('img.leaflet-tile');
  const tileCount = await tiles.count();
  console.log('Tile count:', tileCount);
  expect(tileCount).toBeGreaterThan(0);
});

test.describe('photo markers', () => {
  test.beforeEach(async ({ page }) => {
    await setupInterceptors(page);
    await page.goto(GPX_PAGE, { waitUntil: 'networkidle' });
    // Wait for Leaflet to finish rendering markers before each test
    await expect(page.locator('.photo-marker-label').first()).toBeVisible({ timeout: 15000 });
  });

  test('data-photo-markers JSON contains required fields', async ({ page }) => {
    const mapDiv = page.locator('.gpx-map');
    const raw = await mapDiv.getAttribute('data-photo-markers');
    expect(raw).toBeTruthy();

    const markers = JSON.parse(raw!);
    expect(markers.length).toBeGreaterThan(0);

    const first = markers[0];
    expect(first).toHaveProperty('url');
    expect(first).toHaveProperty('thumb');
    expect(first).toHaveProperty('lat');
    expect(first).toHaveProperty('lng');
    expect(first).toHaveProperty('caption');
    expect(first.thumb).toMatch(/\.webp/);
  });

  test('numbered marker buttons render inside the leaflet map', async ({ page }) => {
    const markers = page.locator('.photo-marker-label');
    const count = await markers.count();
    expect(count).toBeGreaterThan(0);

    // Markers are numbered sequentially from 1
    await expect(markers.first()).toHaveText('1');
    await expect(markers.nth(1)).toHaveText('2');
  });

  test('hovering a marker shows the preview tooltip with caption', async ({ page }) => {
    const firstMarker = page.locator('.photo-marker-label').first();
    await firstMarker.hover();

    // Preview appears after the 80ms hover-in delay
    const preview = page.locator('.velo-preview');
    await expect(preview).toHaveClass(/is-visible/, { timeout: 2000 });

    const captionText = await page.locator('.velo-preview__caption').textContent();
    expect(captionText!.trim().length).toBeGreaterThan(0);
  });

  test('preview tooltip shows the thumbnail image for the hovered marker', async ({ page }) => {
    // Get the expected thumb filename from the first marker's JSON data
    const raw = await page.locator('.gpx-map').getAttribute('data-photo-markers');
    const markers = JSON.parse(raw!);
    const thumbFilename = markers[0].thumb.split('/').pop();

    const firstMarker = page.locator('.photo-marker-label').first();
    await firstMarker.hover();

    await expect(page.locator('.velo-preview')).toHaveClass(/is-visible/, { timeout: 2000 });

    const src = await page.locator('.velo-preview__img').getAttribute('src');
    expect(src).toContain(thumbFilename);
  });

  test('clicking a marker opens the lightbox', async ({ page }) => {
    await page.locator('.photo-marker-label').first().click();

    const lightbox = page.locator('.lb-overlay');
    await expect(lightbox).toBeVisible({ timeout: 5000 });
    await expect(lightbox).toHaveClass(/lb-active/);
  });
});
