import { expect, test } from '@playwright/test';
import {
  download,
  setupPreparation,
  verifySheet,
  inspectPrintedSheet,
  nextPreparation,
  acceptPack,
  catalogPacks as packs,
} from './preparation-helpers.js';
import { phase, setCell, setTheme } from './helpers.js';

/** @param {import('@playwright/test').Page} page @param {string} id */
async function chooseBoard(page, id) {
  await page.locator('#clear-sources').click();
  await page.locator(`#source-${id}`).check();
  await page.locator('#prepare-board').click();
  await page.locator('#accept-board').click();
}

async function verifySelectedNumbers(page, info, pack) {
  await page.locator('#mode-numbers').click();
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

async function startFixedGame(page, context, info, pack) {
  if (
    pack.id === `geography-${pack.language}-02` ||
    [
      'history',
      'politics',
      'science',
      'programming',
      'arts',
      'games',
      'movies',
      'sports',
    ].includes(pack.questions[0].category)
  ) {
    const html = await download(page, info, '#start', 'fixed-sheet.html');
    await inspectPrintedSheet(context, info, html.path, pack);
  } else await page.locator('#start').click();
}

for (const pack of packs) {
  test(`catalog ${pack.id}: fixed export, selected-only numbers, recovery and host-reset lock`, async ({
    page,
    context,
  }, info) => {
    await setupPreparation(page, pack.language);
    await expect(
      page.locator(`#decks-${pack.questions[0].category} input`),
    ).toHaveCount(
      packs.filter(
        (source) =>
          source.language === pack.language &&
          source.questions[0].category === pack.questions[0].category,
      ).length,
    );
    await expect(
      page.locator('#catalog-results input[id^="source-"]'),
    ).toHaveCount(
      packs.filter((source) => source.language === pack.language).length,
    );
    await chooseBoard(page, pack.id);
    const fixed = await download(page, info, '#export-pack', 'fixed.json');
    expect(JSON.parse(fixed.text)).toEqual(pack);
    await page.locator('#import-packs').setInputFiles(fixed.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    await verifySelectedNumbers(page, info, pack);
    await page.locator('#mode-letters').click();
    await chooseBoard(page, pack.id);
    await startFixedGame(page, context, info, pack);
    await phase(page, 'selecting');
    await page.reload();
    await phase(page, 'selecting');
    expect(
      JSON.parse(
        (await download(page, info, '#save-game', 'recovered-fixed.json')).text,
      ).game.pack,
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
    await page.locator('#mode-numbers').click();
    await page.locator('#clear-sources').click();
    await page.locator(`#source-nature-${language}-02`).check();
    await expect(page.locator('#catalog-selection')).toContainText(
      `nature-${language}-02`,
    );
    await page.locator(`#source-geography-${language}-02`).check();
    await page.locator('#catalog-origin').selectOption('custom');
    await expect(
      page.locator('#catalog-results input[id^="source-"]'),
    ).toHaveCount(0);
    await page.locator('#prepare-board').click();
    await page.locator('#accept-board').click();
    const exported = await download(
      page,
      info,
      '#export-pack',
      'chosen-mix.json',
    );
    const generated = JSON.parse(exported.text);
    const expectedIds = [`nature-${language}-02`, `geography-${language}-02`];
    expect(
      new Set(
        generated.questions.flatMap((q) => q.origins.map((o) => o.packId)),
      ),
    ).toEqual(new Set(expectedIds));
    expect(new Set(generated.questions.map((q) => q.id)).size).toBe(28);
    const html = await download(page, info, '#start', 'chosen-mix.html');
    const sheet = await context.newPage();
    await sheet.goto(`file://${html.path}`);
    await verifySheet(sheet, generated);
    await sheet.close();
    await nextPreparation(page, 'numbers', 'automatic');
    await page.locator('#reset-catalog').click();
    await expect(page.locator(`#source-${generated.id}`)).toHaveCount(0);
    await page.locator('#import-packs').setInputFiles(exported.path);
    await acceptPack(page, generated.id, 'numbers');
    await expect(page.locator('#answer-sheet')).toHaveCount(0);
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
        await setTheme(page, theme);
        await page.locator('#catalog-origin').focus();
        await page.keyboard.press('b');
        await expect(page.locator('#catalog-origin')).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(page.locator('#catalog-difficulty')).toBeFocused();
        await page.locator('#catalog-difficulty').selectOption('easy');
        await expect(
          page.locator('#catalog-results input[id^="source-"]'),
        ).toHaveCount(
          packs.filter(
            (pack) => pack.language === language && pack.difficulty === 'easy',
          ).length,
        );
        expect(
          (await page.locator('#catalog-results label').first().boundingBox())
            ?.height,
        ).toBeGreaterThanOrEqual(44);
        await expect(page.locator('#start')).toBeEnabled();
        await page.locator('.catalog').scrollIntoViewIfNeeded();
        for (const id of [
          'catalog-origin',
          'catalog-difficulty',
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
        await expect(
          page.locator('#catalog-results input[id^="source-"]'),
        ).toHaveCount(
          packs.filter((pack) => pack.language === language).length,
        );
      });
    }
  }
}
