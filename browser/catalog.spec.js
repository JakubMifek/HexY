import { readFileSync, readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import {
  download,
  setupPreparation,
  verifySheet,
  inspectPrintedSheet,
} from './preparation-helpers.js';
import { phase, setCell } from './helpers.js';

const packs = readdirSync('src/content')
  .filter((name) => name.endsWith('.json'))
  .map((name) => JSON.parse(readFileSync(`src/content/${name}`, 'utf8')));

/** @param {import('@playwright/test').Page} page @param {string} id */
async function chooseBoard(page, id) {
  await page.locator('#clear-sources').click();
  await page.locator(`#source-${id}`).check();
  await page.locator('#prepare-board').click();
  await page.locator('#accept-board').click();
}

async function verifySelectedNumbers(page, info, pack) {
  await page.locator('#mode').selectOption('numbers');
  await chooseBoard(page, pack.id);
  const exported = await download(page, info, '#export-pack', 'numbers.json');
  const numbers = JSON.parse(exported.text);
  expect(numbers.mode).toBe('numbers');
  expect(new Set(numbers.questions.map((q) => q.id))).toEqual(
    new Set(pack.questions.map((q) => q.id)),
  );
  expect(numbers.questions.every((q) => q.origins[0].packId === pack.id)).toBe(
    true,
  );
  await page.locator('#import-packs').setInputFiles(exported.path);
  await expect(page.locator('#preparation-error')).toHaveText('');
}

for (const pack of packs) {
  test(`catalog ${pack.id}: fixed export, selected-only numbers, recovery and host-reset lock`, async ({
    page,
    context,
  }, info) => {
    await setupPreparation(page, pack.language);
    await page.locator('#catalog-language').selectOption(pack.language);
    await page
      .locator('#catalog-category')
      .selectOption(pack.questions[0].category);
    await page.locator('#catalog-search').fill(pack.id);
    await expect(page.locator('#catalog-results input')).toHaveCount(1);
    await chooseBoard(page, pack.id);
    const fixed = await download(page, info, '#export-pack', 'fixed.json');
    expect(JSON.parse(fixed.text)).toEqual(pack);
    await page.locator('#import-packs').setInputFiles(fixed.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    await verifySelectedNumbers(page, info, pack);
    await page.locator('#mode').selectOption('letters');
    await chooseBoard(page, pack.id);
    if (
      pack.id === `geography-${pack.language}-02` ||
      ['history', 'politics', 'science'].includes(pack.questions[0].category)
    ) {
      const html = await download(
        page,
        info,
        '#answer-sheet',
        'fixed-sheet.html',
      );
      await inspectPrintedSheet(context, info, html.path, pack);
    }
    await page.locator('#start').click();
    await phase(page, 'selecting');
    await page.reload();
    await phase(page, 'selecting');
    expect(
      JSON.parse(
        (await download(page, info, '#export-pack', 'recovered-fixed.json'))
          .text,
      ),
    ).toEqual(pack);
    await expect(
      page.locator('#catalog-results,#import-packs,#prepare-board'),
    ).toHaveCount(0);
    await setCell(page, 1, 'A');
    await setCell(page, 1, 'unclaimed');
    await page.locator('#cell-1').click();
    await expect(page.locator('.question-text')).toHaveText(
      pack.questions[0].text,
    );
  });
}

for (const language of ['cs', 'en']) {
  test(`catalog ${language}: hidden selections stay explicit and only chosen categories generate`, async ({
    page,
    context,
  }, info) => {
    await setupPreparation(page, language);
    await page.locator('#mode').selectOption('numbers');
    await page.locator('#clear-sources').click();
    await page.locator('#catalog-language').selectOption(language);
    await page.locator('#catalog-category').selectOption('nature');
    await page.locator(`#source-nature-${language}-02`).check();
    await page.locator('#catalog-category').selectOption('geography');
    await expect(page.locator('#catalog-selection')).toContainText(
      `nature-${language}-02`,
    );
    await page.locator(`#source-geography-${language}-02`).check();
    await page.locator('#catalog-search').fill('no matching pack');
    await expect(page.locator('#catalog-results input')).toHaveCount(0);
    await page.locator('#prepare-board').click();
    await page.locator('#accept-board').click();
    const generated = JSON.parse(
      (await download(page, info, '#export-pack', 'chosen-mix.json')).text,
    );
    const expectedIds = [`nature-${language}-02`, `geography-${language}-02`];
    expect(
      new Set(
        generated.questions.flatMap((q) => q.origins.map((o) => o.packId)),
      ),
    ).toEqual(new Set(expectedIds));
    expect(new Set(generated.questions.map((q) => q.id)).size).toBe(28);
    const html = await download(page, info, '#answer-sheet', 'chosen-mix.html');
    const sheet = await context.newPage();
    await sheet.goto(`file://${html.path}`);
    await verifySheet(sheet, generated);
    await sheet.close();
    await page.locator('#reset-catalog').click();
    await expect(page.locator('#answer-sheet')).toBeEnabled();
    await page.locator('#answerMode').selectOption('automatic');
    await page.locator('#start').click();
    await page.locator('#cell-1').click();
    await page.locator('#answer').fill(generated.questions[0].answer);
    await page.locator('#submit-answer').click();
    await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
  });
}

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
]) {
  for (const language of ['cs', 'en']) {
    for (const theme of ['light', 'dark']) {
      test(`catalog ${viewport.width}x${viewport.height} ${language} ${theme}: keyboard filtering and layout`, async ({
        page,
      }, info) => {
        await page.setViewportSize(viewport);
        await setupPreparation(page, language);
        await page.locator('#theme').selectOption(theme);
        await page.locator('#catalog-search').focus();
        await page.keyboard.type('geography');
        await expect(page.locator('#catalog-search')).toBeFocused();
        await expect(page.locator('#catalog-results input')).toHaveCount(4);
        await page.keyboard.press('Tab');
        await expect(page.locator('#catalog-language')).toBeFocused();
        await page.locator('#catalog-language').selectOption(language);
        await expect(page.locator('#catalog-results input')).toHaveCount(2);
        expect(
          (await page.locator('#catalog-results label').first().boundingBox())
            ?.height,
        ).toBeGreaterThanOrEqual(44);
        await expect(page.locator('#answer-sheet')).toBeEnabled();
        await page.locator('.catalog').scrollIntoViewIfNeeded();
        for (const id of [
          'catalog-search',
          'catalog-language',
          'catalog-category',
          'catalog-origin',
          'clear-sources',
          'reset-catalog',
        ]) {
          const bounds = await page.locator(`#${id}`).boundingBox();
          expect(bounds?.height).toBeGreaterThanOrEqual(44);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(viewport.width);
        await page.screenshot({
          path: info.outputPath('catalog-full.png'),
          fullPage: true,
        });
        await page.locator('#reset-catalog').focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#catalog-results input')).toHaveCount(24);
      });
    }
  }
}
