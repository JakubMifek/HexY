import { expect, test } from '@playwright/test';
import { preparationStrings } from '../src/ui/preparation-strings.js';
import {
  download,
  inspectPrintedSheet,
  setupPreparation,
  nextPreparation,
  acceptPack,
  catalogPacks,
} from './preparation-helpers.js';
import { answer, phase, setCell, setTheme } from './helpers.js';

const categories = [
  ...new Set(catalogPacks.map((pack) => pack.questions[0].category)),
];
const packs = catalogPacks.filter((pack) =>
  ['programming', 'arts', 'games', 'movies', 'sports'].includes(
    pack.questions[0].category,
  ),
);

for (const [mode, accepted] of [
  ['letters', 'Orwell'],
  ['numbers', 'George Orwell'],
]) {
  test(`P7-01 ${mode}: publishing surname matches automatic play and actual exports`, async ({
    page,
    context,
  }, info) => {
    await setupPreparation(page, 'en');
    await page.locator(`#mode-${mode}`).click();
    await page.locator('#clear-sources').click();
    await page.locator('#source-arts-en-01').check();
    await page.locator('#prepare-board').click();
    await page.locator('#accept-board').click();
    const exported = await download(
      page,
      info,
      '#export-pack',
      'corrected.json',
    );
    const pack = JSON.parse(exported.text);
    const index = pack.questions.findIndex((q) => q.id === 'arts-en-01-16');
    expect(index).toBeGreaterThanOrEqual(0);
    if (mode === 'letters') expect(index).toBe(15);
    expect(pack.questions[index].initial).toBe('O');
    expect(pack.questions[index].text).toBe(
      'Under which surname did Eric Arthur Blair publish Animal Farm and Nineteen Eighty-Four?',
    );
    const html = await download(page, info, '#start', 'corrected.html');
    await inspectPrintedSheet(context, info, html.path, pack);
    await nextPreparation(page, mode, 'automatic');
    await page.locator('#import-packs').setInputFiles(exported.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    await acceptPack(page, pack.id, mode);
    await page.locator('#start').click();
    await phase(page, 'selecting');
    await page.locator(`#cell-${index + 1}`).click();
    await expect(page.locator('.question-text')).toHaveText(
      pack.questions[index].text,
    );
    for (const realName of ['Eric Arthur Blair', 'Eric Blair']) {
      await answer(page, realName);
      await phase(page, 'question');
      await expect(page.locator(`#cell-${index + 1}`)).toHaveAttribute(
        'data-owner',
        'unclaimed',
      );
    }
    await page.screenshot({ path: info.outputPath('surname-scope.png') });
    await answer(page, accepted);
    await expect(page.locator(`#cell-${index + 1}`)).toHaveAttribute(
      'data-owner',
      'A',
    );
  });
}

for (const source of packs) {
  test(`phase-seven ${source.id}: numbers print, reimport and recovered host-reset lock`, async ({
    page,
    context,
  }, info) => {
    await setupPreparation(page, source.language);
    await page.locator('#mode-numbers').click();
    await page.locator('#clear-sources').click();
    await page.locator(`#source-${source.id}`).check();
    await page.locator('#prepare-board').click();
    await page.locator('#accept-board').click();
    const exported = await download(page, info, '#export-pack', 'numbers.json');
    const pack = JSON.parse(exported.text);
    expect(pack.questions).toHaveLength(28);
    expect(new Set(pack.questions.map((q) => q.id))).toEqual(
      new Set(source.questions.map((q) => q.id)),
    );
    for (const question of pack.questions) {
      const original = source.questions.find((q) => q.id === question.id);
      expect(question).toMatchObject(original);
      expect(question.origins[0].packId).toBe(source.id);
    }
    await page.locator('#import-packs').setInputFiles(exported.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    const html = await download(page, info, '#start', 'numbers.html');
    await inspectPrintedSheet(context, info, html.path, pack);
    await phase(page, 'selecting');
    await page.reload();
    await phase(page, 'selecting');
    expect(
      JSON.parse(
        (await download(page, info, '#save-game', 'recovered-numbers.json'))
          .text,
      ).game.pack,
    ).toEqual(pack);
    await expect(page.locator('#import-packs,#prepare-board')).toHaveCount(0);
    await setCell(page, 1, 'A');
    await setCell(page, 1, 'unclaimed');
    await page.locator('#cell-1').click();
    await expect(page.locator('.question-text')).toHaveText(
      pack.questions[0].text,
    );
  });
}

function mixedSourceIds(localized, language, scope) {
  if (scope === 'full') return localized.map((pack) => pack.id);
  return [
    'general',
    'programming',
    'arts',
    'entertainment',
    'games',
    'movies',
    'sports',
  ].flatMap((category) => {
    const source = localized.find(
      (pack) =>
        pack.questions[0].category === category &&
        (pack.id === `${category}-${language}-02` ||
          pack.id === `${category}-${language}-easy-02`),
    );
    return source ? [source.id] : [];
  });
}

for (const language of ['cs', 'en']) {
  for (const scope of ['mixed', 'full']) {
    test(`phase-seven ${language} ${scope}: selected-only generation survives export, print and recovery`, async ({
      page,
      context,
    }, info) => {
      await setupPreparation(page, language);
      await page.evaluate(() => {
        let state = 20261029;
        Math.random = () => {
          state = (state * 16807) % 2147483647;
          return (state - 1) / 2147483646;
        };
      });
      await page.locator('#mode-numbers').click();
      await page.locator('#clear-sources').click();
      const localized = catalogPacks.filter(
        (pack) => pack.language === language,
      );
      const selected = mixedSourceIds(localized, language, scope);
      for (const id of selected) await page.locator(`#source-${id}`).check();
      await page.locator('#catalog-origin').selectOption('custom');
      for (const id of selected)
        await expect(page.locator('#catalog-selection')).toContainText(id);
      await page.locator('#prepare-board').click();
      await page.locator('#accept-board').click();
      const exported = await download(
        page,
        info,
        '#export-pack',
        `${scope}.json`,
      );
      const pack = JSON.parse(exported.text);
      expect(pack.questions).toHaveLength(28);
      expect(new Set(pack.questions.map((q) => q.id)).size).toBe(28);
      for (const question of pack.questions) {
        expect(question.language).toBe(language);
        expect(selected).toContain(question.origins[0].packId);
        const source = localized.find(
          (source) => source.id === question.origins[0].packId,
        );
        expect(question).toMatchObject(
          source.questions.find((entry) => entry.id === question.id),
        );
      }
      expect(
        new Set(pack.questions.map((q) => q.category)).size,
      ).toBeGreaterThan(1);
      await page.locator('#import-packs').setInputFiles(exported.path);
      await expect(page.locator('#preparation-error')).toHaveText('');
      const html = await download(page, info, '#start', `${scope}.html`);
      await inspectPrintedSheet(context, info, html.path, pack);
      await phase(page, 'selecting');
      await page.reload();
      await phase(page, 'selecting');
      expect(
        JSON.parse(
          (await download(page, info, '#save-game', 'recovered-mix.json')).text,
        ).game.pack,
      ).toEqual(pack);
    });
  }

  for (const theme of ['light', 'dark']) {
    for (const viewport of [
      { width: 1920, height: 1080 },
      { width: 1024, height: 768 },
    ]) {
      test(`phase-seven catalog ${language} ${theme} ${viewport.width}: all categories, no answer search`, async ({
        page,
      }, info) => {
        await page.setViewportSize(viewport);
        await setupPreparation(page, language);
        await setTheme(page, theme);
        const localized = catalogPacks.filter(
          (pack) => pack.language === language,
        );
        await expect(page.locator('#catalog-status')).toContainText(
          `${localized.length} / ${localized.length}`,
        );
        await expect(
          page.locator('#catalog-results input[id^="source-"]'),
        ).toHaveCount(localized.length);
        await page.locator('.catalog').scrollIntoViewIfNeeded();
        await page.screenshot({
          path: info.outputPath('full-catalog.png'),
          fullPage: true,
        });
        for (const category of categories) {
          await expect(page.locator(`#decks-${category} input`)).toHaveCount(
            localized.filter((pack) => pack.questions[0].category === category)
              .length,
          );
          await expect(page.locator(`#decks-${category}`)).toContainText(
            preparationStrings[language].categories[category],
          );
        }
        await expect(page.locator('#catalog-search')).toHaveCount(0);
        await page.locator('#catalog-origin').selectOption('custom');
        await expect(
          page.locator('#catalog-results input[id^="source-"]'),
        ).toHaveCount(0);
        await expect(page.locator('#catalog-selection')).toContainText(
          `general-${language}-01`,
        );
        await page.locator('#reset-catalog').click();
        await expect(
          page.locator('#catalog-results input[id^="source-"]:checked'),
        ).toHaveCount(1);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(viewport.width);
        expect(
          JSON.parse(
            (
              await download(
                page,
                info,
                '#export-pack',
                'unchanged-default.json',
              )
            ).text,
          ).id,
        ).toBe(`general-${language}-01`);
      });
    }
  }
}
