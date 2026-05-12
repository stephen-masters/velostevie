import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'http://localhost:1313';
const wcag = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const staticPages = [
  { name: 'home',         path: '/' },
  { name: 'articles',     path: '/articles/' },
  { name: 'tags',         path: '/tags/' },
];

for (const { name, path } of staticPages) {
  test(`${name} has no WCAG 2.1 AA violations`, async ({ page }) => {
    await page.goto(`${BASE_URL}${path}`);
    const results = await new AxeBuilder({ page }).withTags(wcag).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('article page has no WCAG 2.1 AA violations', async ({ page }) => {
  await page.goto(`${BASE_URL}/articles/2025/canal-des-deux-mers/2025-09-01_cdm_day_01/`);
  const results = await new AxeBuilder({ page }).withTags(wcag).analyze();
  expect(results.violations).toEqual([]);
});
