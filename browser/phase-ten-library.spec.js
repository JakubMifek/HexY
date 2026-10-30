import { expect, test } from '@playwright/test';
import { start } from './helpers.js';
import { download } from './preparation-helpers.js';

for (const language of ['en', 'cs']) {
  test(`Options ${language} keeps ambiguous legacy entries and confirms adjacent Delete without a disclosure`, async ({
    page,
  }, info) => {
    await start(page, { mode: 'numbers', language });
    const exported = await download(
      page,
      info,
      '#save-game',
      'library-fixture.json',
    );
    const pack = JSON.parse(exported.text).game.pack;
    await page.locator('#exit-game').click();
    await page.locator('#discard-new').click();
    await page.evaluate((pack) => {
      const library = JSON.parse(localStorage.getItem('hexy.library.v1'));
      library.packs = [
        { ...pack, id: 'legacy' },
        { ...pack, id: 'explicit' },
      ];
      localStorage.setItem('hexy.library.v1', JSON.stringify(library));
    }, pack);
    await page.reload();
    await page.locator('#options').click();
    await expect(page.locator('.library-management article')).toHaveCount(2);
    const before = await page.evaluate(() =>
      localStorage.getItem('hexy.library.v1'),
    );
    await verifyDeleteControls(page, language);
    expect(
      await page.evaluate(() => localStorage.getItem('hexy.library.v1')),
    ).toBe(before);
    await page.locator('#library-confirm-delete-legacy').focus();
    await page.keyboard.press('Enter');
    const ids = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('hexy.library.v1')).packs.map(
        (pack) => pack.id,
      ),
    );
    expect(ids).toEqual(['explicit']);
    await page.reload();
    await page.locator('#options').click();
    await expect(page.locator('.library-management article')).toHaveCount(1);
    await expect(page.locator('[data-pack-id="explicit"]')).toBeVisible();
  });
}

async function verifyDeleteControls(page, language) {
  const label = language === 'en' ? 'Delete' : 'Smazat';
  await expect(
    page.locator('.library-management details, .library-management summary'),
  ).toHaveCount(0);
  const download = page.locator('#library-export-legacy');
  const remove = page.locator('#library-delete-legacy');
  await expect(remove).toHaveText(label);
  const left = await download.boundingBox();
  const right = await remove.boundingBox();
  expect(Math.abs(left.y - right.y)).toBeLessThan(2);
  expect(right.x).toBeGreaterThanOrEqual(left.x + left.width);
  expect(right.height).toBeGreaterThanOrEqual(44);
  await download.focus();
  await page.keyboard.press('Tab');
  await expect(remove).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(remove).toBeFocused();
  await page.keyboard.press('Space');
  await page.locator('#library-cancel-delete-legacy').click();
  await expect(remove).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#library-confirm-delete-legacy')).toHaveText(
    label,
  );
  await page.screenshot({
    path: `.artifacts/phase-10-rereview-delete-${language}.png`,
    fullPage: true,
  });
}
