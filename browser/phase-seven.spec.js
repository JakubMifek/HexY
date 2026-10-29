import { readFileSync, readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { preparationStrings } from '../src/ui/preparation-strings.js';
import {
  download,
  inspectPrintedSheet,
  setupPreparation,
} from './preparation-helpers.js';
import { answer, phase, setCell } from './helpers.js';

const categories = [
  'general',
  'nature',
  'geography',
  'history',
  'politics',
  'science',
  'programming',
  'arts',
  'entertainment',
];
const packs = readdirSync('src/content')
  .filter((file) => /^(programming|arts|entertainment)-.*\.json$/.test(file))
  .map((file) => JSON.parse(readFileSync(`src/content/${file}`, 'utf8')));

for (const [mode, accepted] of [
  ['letters', 'Orwell'],
  ['numbers', 'George Orwell'],
]) {
  test(`P7-01 ${mode}: publishing surname matches automatic play and actual exports`, async ({
    page,
    context,
  }, info) => {
    await setupPreparation(page, 'en');
    await page.locator('#answerMode').selectOption('automatic');
    await page.locator('#mode').selectOption(mode);
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
    const html = await download(page, info, '#answer-sheet', 'corrected.html');
    await inspectPrintedSheet(context, info, html.path, pack);
    await page.locator('#import-packs').setInputFiles(exported.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
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
    await page.locator('#mode').selectOption('numbers');
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
    const html = await download(page, info, '#answer-sheet', 'numbers.html');
    await inspectPrintedSheet(context, info, html.path, pack);
    await page.locator('#import-packs').setInputFiles(exported.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    await page.locator('#start').click();
    await phase(page, 'selecting');
    await page.reload();
    await phase(page, 'selecting');
    expect(
      JSON.parse(
        (await download(page, info, '#export-pack', 'recovered-numbers.json'))
          .text,
      ),
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
      await page.locator('#mode').selectOption('numbers');
      await page.locator('#clear-sources').click();
      const selected =
        scope === 'full'
          ? categories.flatMap((category) =>
              ['01', '02'].map((n) => `${category}-${language}-${n}`),
            )
          : ['general', 'programming', 'arts', 'entertainment'].map(
              (category) => `${category}-${language}-02`,
            );
      for (const id of selected) await page.locator(`#source-${id}`).check();
      await page.locator('#catalog-search').fill('nothing matches');
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
      }
      expect(new Set(pack.questions.map((q) => q.category))).toEqual(
        new Set(selected.map((id) => id.split('-')[0])),
      );
      const html = await download(page, info, '#answer-sheet', `${scope}.html`);
      await inspectPrintedSheet(context, info, html.path, pack);
      await page.locator('#import-packs').setInputFiles(exported.path);
      await expect(page.locator('#preparation-error')).toHaveText('');
      await page.locator('#start').click();
      await phase(page, 'selecting');
      await page.reload();
      await phase(page, 'selecting');
      expect(
        JSON.parse(
          (await download(page, info, '#export-pack', 'recovered-mix.json'))
            .text,
        ),
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
        await page.locator('#theme').selectOption(theme);
        await expect(page.locator('#catalog-status')).toContainText('36 / 36');
        await expect(page.locator('#catalog-results input')).toHaveCount(36);
        await page.locator('.catalog').scrollIntoViewIfNeeded();
        await page.screenshot({
          path: info.outputPath('full-catalog.png'),
          fullPage: true,
        });
        await page.locator('#catalog-language').selectOption(language);
        for (const category of categories) {
          await page.locator('#catalog-category').selectOption(category);
          await expect(page.locator('#catalog-results input')).toHaveCount(2);
          await expect(page.locator('#catalog-results')).toContainText(
            preparationStrings[language].categories[category],
          );
        }
        await page.locator('#catalog-search').fill('Voldemort');
        await expect(page.locator('#catalog-results input')).toHaveCount(0);
        await expect(page.locator('#catalog-selection')).toContainText(
          `general-${language}-01`,
        );
        await page.locator('#reset-catalog').click();
        await expect(
          page.locator('#catalog-results input:checked'),
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
