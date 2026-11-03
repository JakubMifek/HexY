import { expect, test } from '@playwright/test';
import { contentData } from '../scripts/content-data.js';
import { setupPreparation } from './preparation-helpers.js';

/** @param {import('@playwright/test').Page} page */
async function names(page) {
  return page.locator('.deck-row').evaluateAll((rows) =>
    rows.map((row) => {
      const input = row.querySelector('input');
      const name = row.querySelector('strong');
      if (!input || !name) throw new Error('Missing deck label');
      return /** @type {[string, string]} */ ([
        input.id,
        name.textContent ?? '',
      ]);
    }),
  );
}

test('a data response adds a discoverable deck after reload without changing application assets', async ({
  page,
}) => {
  const catalog = contentData(process.cwd());
  const extra = structuredClone(
    catalog.packs.find((pack) => pack.language === 'en'),
  );
  extra.id = 'runtime-test-extra';
  extra.title = 'Runtime-only deck';
  extra.questions.forEach((question, index) => {
    question.id = `runtime-test-extra-${index}`;
  });
  let updated = false;
  await page.route('**/catalog.json', (route) =>
    route.fulfill({
      json: updated
        ? { schemaVersion: 1, packs: [...catalog.packs, extra] }
        : catalog,
    }),
  );
  await setupPreparation(page, 'en');
  const previousNames = await names(page);
  const scripts = await page
    .locator('script[src]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src')));
  await expect(page.locator('[id="source-runtime-test-extra"]')).toHaveCount(0);
  updated = true;
  await setupPreparation(page, 'en');
  const currentNames = new Map(await names(page));
  for (const [id, name] of previousNames)
    expect(currentNames.get(id)).toBe(name);
  await expect(page.locator('[id="source-runtime-test-extra"]')).toHaveCount(1);
  expect(
    await page
      .locator('script[src]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src'))),
  ).toEqual(scripts);
});

test('unavailable catalog offers a retry and preserves browser-local data', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('test-retained', 'unchanged'),
  );
  let unavailable = true;
  await page.route('**/catalog.json', (route) =>
    unavailable
      ? route.fulfill({ status: 503, body: 'unavailable' })
      : route.continue(),
  );
  await page.goto('/');
  await expect(page.locator('#retry-catalog')).toBeVisible();
  await expect(page.locator('#new-game')).toHaveCount(0);
  unavailable = false;
  await page.locator('#retry-catalog').click();
  await expect(page.locator('#new-game')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('test-retained'))).toBe(
    'unchanged',
  );
});
