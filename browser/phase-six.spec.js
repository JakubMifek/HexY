import { expect, test } from '@playwright/test';
import { preparationStrings } from '../src/ui/preparation-strings.js';
import {
  download,
  inspectPrintedSheet,
  setupPreparation,
} from './preparation-helpers.js';
import { phase } from './helpers.js';

async function selectMixedSources(page, language) {
  await page.locator('#mode').selectOption('numbers');
  await page.locator('#clear-sources').click();
  const selected = ['geography', 'history', 'politics', 'science'].map(
    (category) => `${category}-${language}-02`,
  );
  await page.locator('#catalog-language').selectOption(language);
  for (const id of selected) {
    await page.locator('#catalog-category').selectOption(id.split('-')[0]);
    await page.locator(`#source-${id}`).check();
  }
  await page.locator('#catalog-search').fill('no such source');
  await expect(page.locator('#catalog-results input')).toHaveCount(0);
  for (const id of selected)
    await expect(page.locator('#catalog-selection')).toContainText(id);
  return selected;
}

for (const entry of [
  {
    finding: 'P6-R1',
    pack: 'politics-cs-02',
    cell: 6,
    accepted: ['Exekutiva'],
    rejected: ['výkonná moc'],
  },
  {
    finding: 'P6-R2',
    pack: 'history-en-01',
    cell: 23,
    accepted: ['U-boat', 'U boat'],
    rejected: ['Unterseeboot'],
  },
  {
    finding: 'P6-R3',
    pack: 'politics-en-02',
    cell: 14,
    accepted: ['Motion of no confidence', 'no-confidence motion'],
    rejected: ['Motion of confidence', 'vote of no confidence'],
  },
  {
    finding: 'P6-R4',
    pack: 'history-cs-01',
    cell: 26,
    accepted: ['Washington', 'George Washington'],
    rejected: ['Westfálský mír', 'Vestfálský mír'],
  },
]) {
  for (const accepted of entry.accepted) {
    test(`${entry.finding}/${accepted}: automatic play enforces the corrected question scope`, async ({
      page,
    }, info) => {
      await page.clock.install({ time: new Date('2026-10-28T12:00:00Z') });
      const language = entry.pack.includes('-cs-') ? 'cs' : 'en';
      await setupPreparation(page, language);
      await page.clock.pauseAt(new Date('2026-10-28T12:01:00Z'));
      await page.locator('#answerMode').selectOption('automatic');
      await page.locator('#starter').selectOption('A');
      await page.locator('#clear-sources').click();
      await page.locator(`#source-${entry.pack}`).check();
      await page.locator('#prepare-board').click();
      await page.locator('#accept-board').click();
      await page.locator('#start').click();
      await page.locator(`#cell-${entry.cell}`).click();
      for (const rejected of entry.rejected) {
        await page.locator('#answer').fill(rejected);
        await page.locator('#submit-answer').click();
        await phase(page, 'question');
        await expect(page.locator(`#cell-${entry.cell}`)).toHaveAttribute(
          'data-owner',
          'unclaimed',
        );
      }
      await page.locator('#answer').fill(accepted);
      await page.locator('#submit-answer').click();
      await expect(page.locator(`#cell-${entry.cell}`)).toHaveAttribute(
        'data-owner',
        'A',
      );
      await phase(page, 'selecting');
      await page.screenshot({
        path: info.outputPath(`${entry.finding}-corrected.png`),
        fullPage: true,
      });
    });
  }
}
for (const language of ['cs', 'en']) {
  for (const theme of ['light', 'dark']) {
    test(`phase-six full catalog ${language} ${theme}: counts, categories and immutable default`, async ({
      page,
    }, info) => {
      const width = theme === 'light' ? 1280 : 768;
      await page.setViewportSize({
        width,
        height: theme === 'light' ? 720 : 1024,
      });
      await setupPreparation(page, language);
      await page.locator('#theme').selectOption(theme);
      await expect(page.locator('#catalog-status')).toContainText('24 / 24');
      await expect(page.locator('#catalog-results input')).toHaveCount(24);
      await page.locator('#catalog-language').selectOption(language);
      await expect(page.locator('#catalog-results input')).toHaveCount(12);
      await expect(page.locator('#catalog-category option')).toHaveCount(7);
      for (const category of [
        'general',
        'nature',
        'geography',
        'history',
        'politics',
        'science',
      ]) {
        await page.locator('#catalog-category').selectOption(category);
        await expect(page.locator('#catalog-results input')).toHaveCount(2);
        await expect(page.locator('#catalog-status')).toContainText('2 / 24');
        await expect(page.locator('#catalog-results')).toContainText(
          preparationStrings[language].categories[category],
        );
      }
      await page.locator('.catalog').scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: info.outputPath('phase-six-catalog.png'),
        fullPage: true,
      });
      const pack = JSON.parse(
        (await download(page, info, '#export-pack', 'unchanged-default.json'))
          .text,
      );
      expect(pack.id).toBe(`general-${language}-01`);
      await page.locator('#reset-catalog').click();
      await expect(page.locator('#catalog-results input')).toHaveCount(24);
      await expect(page.locator('#catalog-results input:checked')).toHaveCount(
        1,
      );
    });
  }

  test(`phase-six ${language}: old/new mixed sources retain provenance through prints, reimport and recovery`, async ({
    page,
    context,
  }, info) => {
    await setupPreparation(page, language);
    await page.evaluate(() => {
      Math.random = () => 0.41;
    });
    const selected = await selectMixedSources(page, language);
    await page.locator('#prepare-board').click();
    await page.locator('#accept-board').click();
    const exported = await download(
      page,
      info,
      '#export-pack',
      'phase-six-mixed.json',
    );
    const pack = JSON.parse(exported.text);
    expect(new Set(pack.questions.map((q) => q.id)).size).toBe(28);
    expect(
      new Set(
        pack.questions.flatMap((q) => q.origins.map((origin) => origin.packId)),
      ),
    ).toEqual(new Set(selected));
    for (const question of pack.questions) {
      expect(question.sources.length).toBeGreaterThan(0);
      expect(question.origins[0].authors).toEqual(['HexY contributors']);
      expect(question.origins[0].license).toBe('CC BY 4.0');
    }
    const html = await download(
      page,
      info,
      '#answer-sheet',
      'phase-six-mixed.html',
    );
    await inspectPrintedSheet(context, info, html.path, pack);
    await page.locator('#import-packs').setInputFiles(exported.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    await page.locator('#start').click();
    await phase(page, 'selecting');
    await page.reload();
    await phase(page, 'selecting');
    expect(
      JSON.parse(
        (await download(page, info, '#export-pack', 'phase-six-recovered.json'))
          .text,
      ),
    ).toEqual(pack);
    await page.locator('#cell-1').click();
    await expect(page.locator('.question-text')).toHaveText(
      pack.questions[0].text,
    );
  });
}
