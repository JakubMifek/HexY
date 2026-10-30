import { expect, test } from '@playwright/test';
import {
  download,
  selectSources,
  setupPreparation,
  starter,
  upload,
  enterPreparation,
} from './preparation-helpers.js';
import { setCell } from './helpers.js';

const key = 'hexy.library.v1';

/** @param {import('@playwright/test').Page} page */
async function stored(page) {
  return page.evaluate((key) => localStorage.getItem(key), key);
}

/** @param {import('@playwright/test').Page} page @param {string} id */
async function exclude(page, id) {
  await page.locator(`[data-pack-id="${id}"] summary`).click();
  await page.locator(`#library-exclude-${id}`).click();
}

/** @param {import('@playwright/test').Page} page @param {'en'|'cs'} language */
async function prepareNormal(page, language) {
  await setupPreparation(page, language);
  const normal = await starter(language);
  normal.id = 'retained-normal';
  await upload(page, [normal]);
  await selectSources(page, [normal.id]);
  await page.locator('#prepare-board').click();
  await page.locator('#accept-board').click();
  return normal;
}

/** @param {import('@playwright/test').Page} page @param {'en'|'cs'} language
 * @param {import('@playwright/test').TestInfo} info */
async function exhaustQuota(page, language, info) {
  const normal = await prepareNormal(page, language);
  const before = await stored(page);
  const oversized = structuredClone(normal);
  oversized.id = 'oversized-copy';
  oversized.mode = 'source';
  oversized.questions = oversized.questions.slice(0, 1);
  oversized.questions[0].sources = ['X'.repeat(6 * 1024 * 1024)];
  await upload(page, [oversized]);
  await expect(page.locator('#storage-error')).toContainText(
    language === 'en' ? 'storage is full' : 'je plné',
  );
  expect(await stored(page)).toBe(before);
  const exported = await download(
    page,
    info,
    '#library-export-oversized-copy',
    'oversized-export.json',
  );
  expect(JSON.parse(exported.text)).toEqual(oversized);
  return normal;
}

for (const language of ['en', 'cs']) {
  test(`${language}: real quota recovery excludes only the confirmed copy and preserves locked play`, async ({
    page,
  }, info) => {
    const normal = await exhaustQuota(page, language, info);
    await page.locator('[data-pack-id="oversized-copy"] summary').click();
    await page.locator('#library-keep-oversized-copy').click();
    await expect(
      page.locator('[data-pack-id="oversized-copy"] details'),
    ).not.toHaveAttribute('open');
    await expect(page.locator('#storage-error')).toBeVisible();
    const before = await download(
      page,
      info,
      '#export-pack',
      'locked-before.json',
    );
    await exclude(page, 'oversized-copy');
    await expect(page.locator('#storage-error')).toHaveCount(0);
    expect(JSON.parse(await stored(page)).packs).toEqual([normal]);
    await expect(page.locator('#library-include-oversized-copy')).toBeVisible();
    await page.locator('#library-include-oversized-copy').click();
    await expect(page.locator('#storage-error')).toBeVisible();
    await exclude(page, 'oversized-copy');
    const after = await download(
      page,
      info,
      '#export-pack',
      'locked-after.json',
    );
    expect(after.text).toBe(before.text);
    await page
      .locator('.library-management')
      .screenshot({ path: info.outputPath('quota-recovered.png') });
    await page.locator('#start').click();
    await expect(
      page.locator('#import-packs,#edit-proposal,#prepare-board'),
    ).toHaveCount(0);
    await setCell(page, 1, 'A');
    await setCell(page, 1, 'unclaimed');
    await page.locator('#cell-1').click();
    await expect(page.locator('.question-text')).toHaveText(
      normal.questions[0].text,
    );
    await page.reload();
    await returnFromRecoveredGame(page, normal);
    expect(JSON.parse(await stored(page)).packs).toEqual([normal]);
    await expect(page.locator('#source-retained-normal')).toHaveCount(1);
    await expect(page.locator('#source-oversized-copy')).toHaveCount(0);
  });

  test(`${language}: restored read access follows export, reload and reimport without overwriting unread data`, async ({
    page,
  }, info) => {
    const normal = await prepareNormal(page, language);
    const before = await stored(page);
    await denyInitialRead(page);
    await page.locator('#options').click();
    await page.locator('#language').selectOption(language);
    await page.locator('#back-menu').click();
    await enterPreparation(page);
    const guidance =
      language === 'en'
        ? 'reload, then reimport'
        : 'obnovte stránku a znovu importujte';
    await expect(page.locator('#storage-error')).toContainText(guidance);
    await page.locator('#edit-proposal').click();
    await page.locator('#pack-title').fill('Work created during denied read');
    await page.locator('#save-pack').click();
    const exported = await download(
      page,
      info,
      '#export-pack',
      'unread-memory-copy.json',
    );
    const copy = JSON.parse(exported.text);
    await page.evaluate(() => sessionStorage.setItem('read-denied', 'no'));
    await page.locator('#back-players').click();
    await page.locator('#nameA').fill('Retry without reload');
    await page.locator('#next-setup').click();
    await expect(page.locator('#storage-error')).toContainText(guidance);
    expect(await stored(page)).toBe(before);
    await page
      .locator('.workspace')
      .screenshot({ path: info.outputPath('read-access-guidance.png') });
    await page.reload();
    await expect(page.locator('#storage-error')).toHaveCount(0);
    expect(JSON.parse(await stored(page)).packs).toEqual([normal]);
    await enterPreparation(page);
    await page.locator('#import-packs').setInputFiles(exported.path);
    await expect(page.locator('#storage-error')).toHaveCount(0);
    await expect(page.locator('#preparation-error')).toHaveText('');
    expect(JSON.parse(await stored(page)).packs).toEqual([normal, copy]);
    await page.reload();
    expect(JSON.parse(await stored(page)).packs).toEqual([normal, copy]);
  });
}

/** @param {import('@playwright/test').Page} page
 * @param {import('../src/domain/types.js').Pack} pack */
async function returnFromRecoveredGame(page, pack) {
  await expect(page.locator('.game')).toHaveAttribute('data-phase', 'question');
  await expect(page.locator('.question-text')).toHaveText(
    pack.questions[0].text,
  );
  await expect(
    page.locator('#import-packs,#edit-proposal,#prepare-board'),
  ).toHaveCount(0);
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await enterPreparation(page);
}

/** @param {import('@playwright/test').Page} page */
async function denyInitialRead(page) {
  await page.evaluate(() => sessionStorage.setItem('read-denied', 'yes'));
  await page.addInitScript(() => {
    const getItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      if (
        this === localStorage &&
        key === 'hexy.library.v1' &&
        getItem.call(sessionStorage, 'read-denied') === 'yes'
      ) {
        throw new DOMException('Read denied', 'SecurityError');
      }
      return getItem.call(this, key);
    };
  });
  await page.reload();
}
