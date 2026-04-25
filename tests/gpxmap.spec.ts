import { test, expect } from '@playwright/test';

const GPX_PAGE = 'http://localhost:1313/articles/2025/canal-des-deux-mers/2025-09-01_cdm_day_01/';

test('gpx map renders with leaflet tiles', async ({ page }) => {
  const consoleErrors: string[] = [];
  const cspViolations: string[] = [];

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
