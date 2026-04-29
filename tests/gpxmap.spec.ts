import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:1313';
const GPX_PAGE = `${BASE_URL}/articles/2025/canal-des-deux-mers/2025-09-01_cdm_day_01/`;

test('gpx map renders with leaflet tiles', async ({ page }) => {
  const consoleErrors: string[] = [];

  // canonifyURLs rewrites all asset URLs to https://velostevie.com/…, so scripts
  // and styles are cross-origin from localhost's perspective.  Cross-origin SRI requires
  // a crossorigin attribute on the tag, which Hugo doesn't add, so the browser blocks
  // those resources.  Fix by:
  //   1. Stripping integrity attributes from HTML served by localhost (disables SRI).
  //   2. Intercepting velostevie.com requests and serving them from localhost instead.
  // Only intercept HTML page navigations — non-HTML resources pass through unchanged.
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

  // Check for CSP violations
  const violations = await page.evaluate(() => (window as any).__cspViolations || []);
  console.log('CSP violations:', violations);

  // Check console errors
  console.log('Console errors:', consoleErrors);

  // Check Leaflet loaded
  const leafletLoaded = await page.evaluate(() => typeof (window as any).L !== 'undefined');
  console.log('Leaflet loaded:', leafletLoaded);

  // Check the gpx-map div exists
  const mapDiv = page.locator('.gpx-map');
  await expect(mapDiv).toBeAttached();

  // Check data-gpx-files is populated
  const gpxFiles = await mapDiv.getAttribute('data-gpx-files');
  console.log('data-gpx-files:', gpxFiles);
  expect(gpxFiles).toBeTruthy();

  // Wait for Leaflet canvas/SVG to appear inside the map div (indicates map rendered)
  const leafletPane = mapDiv.locator('.leaflet-map-pane');
  await expect(leafletPane).toBeAttached({ timeout: 15000 });

  // Check tile images loaded
  const tiles = mapDiv.locator('img.leaflet-tile');
  const tileCount = await tiles.count();
  console.log('Tile count:', tileCount);
  expect(tileCount).toBeGreaterThan(0);
});
