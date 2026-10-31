import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import {
  setupPreparation,
  acceptPack,
  download,
  inspectPrintedSheet,
  nextPreparation,
} from './preparation-helpers.js';
import { phase, setCell, setTheme } from './helpers.js';

const corrections = [
  ['geography-en-easy-02', 23, ['Great Britain', 'England']],
  ['geography-en-easy-01', 19, ['artificial canal', 'canal']],
  ['geography-en-hard-01', 14, ['till', 'glacial till']],
  ['geography-cs-hard-01', 15, ['till', 'ledovcový sediment']],
  ['geography-en-hard-01', 10, ['plain', 'plateau']],
];

async function checkAnswers(page, info, cell, source, wrong) {
  const question = source.questions[Number(cell) - 1];
  const answers = [question.answer, ...question.aliases];
  for (const [index, answer] of answers.entries()) {
    if (index) {
      await nextPreparation(page, 'letters', 'automatic');
      await acceptPack(page, source.id, 'letters');
      await page.locator('#start').click();
      await page.reload();
      await phase(page, 'selecting');
    }
    await page.locator(`#cell-${cell}`).click();
    await expect(page.locator('.question-text')).toHaveText(question.text);
    if (!index)
      await page.screenshot({
        path: info.outputPath('corrected-question.png'),
        fullPage: true,
      });
    await page.locator('#answer').fill(wrong[index % wrong.length]);
    await page.locator('#submit-answer').click();
    await phase(page, 'question');
    await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
      'data-owner',
      'unclaimed',
    );
    await page.locator('#answer').fill(answer);
    await page.locator('#submit-answer').click();
    await phase(page, 'selecting');
    await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
      'data-owner',
      'A',
    );
  }
}

for (const [id, cell, wrong] of corrections) {
  test(`P11-GEO-R1–R4 ${id}-${cell}: actual answers, reimport, print and locked recovery`, async ({
    page,
    context,
  }, info) => {
    const source = JSON.parse(readFileSync(`src/content/${id}.json`, 'utf8'));
    await page.setViewportSize(
      source.language === 'cs'
        ? { width: 1024, height: 768 }
        : { width: 1280, height: 720 },
    );
    await setupPreparation(page, source.language);
    await setTheme(page, source.language === 'cs' ? 'dark' : 'light');
    await acceptPack(page, String(id), 'letters');
    const fixed = await download(page, info, '#export-pack', 'corrected.json');
    expect(JSON.parse(fixed.text)).toEqual(source);
    await page.locator('#import-packs').setInputFiles(fixed.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    const sheet = await download(page, info, '#start', 'corrected.html');
    await inspectPrintedSheet(context, info, sheet.path, source);
    await phase(page, 'selecting');
    await page.reload();
    await phase(page, 'selecting');
    await setCell(page, Number(cell), 'A');
    await setCell(page, Number(cell), 'unclaimed');
    await expect(
      page.locator('#catalog-results,#import-packs,#prepare-board'),
    ).toHaveCount(0);
    await nextPreparation(page, 'letters', 'automatic');
    await acceptPack(page, String(id), 'letters');
    await page.locator('#start').click();
    await page.reload();
    await phase(page, 'selecting');
    await expect(
      page.locator('#catalog-results,#import-packs,#prepare-board'),
    ).toHaveCount(0);
    await checkAnswers(page, info, cell, source, wrong);
    const saved = await download(
      page,
      info,
      '#save-game',
      'corrected-game.json',
    );
    expect(JSON.parse(saved.text).game.pack).toEqual(source);
    await page.reload();
    await phase(page, 'selecting');
    await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
      'data-owner',
      'A',
    );
  });
}
