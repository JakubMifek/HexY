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
  ['nature-cs-easy-01', 2, ['bříza bradavičnatá', 'bříza bílá'], 'buk'],
  ['nature-cs-easy-01', 4, ['česnek setý'], 'cibule'],
  ['nature-cs-easy-02', 2, ['sosna'], 'smrk'],
  ['nature-cs-easy-02', 10, ['špargl'], 'pórek'],
  ['nature-cs-medium-01', 3, ['celulosa'], 'škrob'],
  ['nature-en-easy-01', 3, ['cactuses'], 'aloe'],
  ['nature-en-easy-01', 10, ['European ivy'], 'poison ivy'],
  ['nature-en-easy-01', 15, ["bird's nest", 'bird’s nest'], 'burrow'],
  ['nature-en-easy-01', 22, ['bole'], 'branch'],
  ['nature-en-easy-02', 22, ['terrapin'], 'crocodile'],
  [
    'nature-en-easy-02',
    25,
    ['spiderweb', "spider's web", 'spider’s web', 'cobweb'],
    'cocoon',
  ],
  ['nature-en-hard-01', 19, ['rootstalk', 'creeping rootstalk'], 'taproot'],
  [
    'nature-en-hard-01',
    23,
    ['Urochordata', 'Tunicata', 'tunicates', 'Urochorda'],
    'Cephalochordata',
  ],
];

async function checkAnswers(page, info, cell, source, answers, wrong) {
  const question = source.questions[Number(cell) - 1];
  await page.locator(`#cell-${cell}`).click();
  await expect(page.locator('.question-text')).toHaveText(question.text);
  await page.screenshot({
    path: info.outputPath('corrected-question.png'),
    fullPage: true,
  });
  await page.locator('#answer').fill(wrong);
  await page.locator('#submit-answer').click();
  await phase(page, 'question');
  await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
    'data-owner',
    'unclaimed',
  );
  for (const [index, answer] of answers.entries()) {
    if (index) {
      await nextPreparation(page, 'letters', 'automatic');
      await acceptPack(page, source.id, 'letters');
      await page.locator('#start').click();
      await page.reload();
      await phase(page, 'selecting');
      await page.locator(`#cell-${cell}`).click();
    }
    await page.locator('#answer').fill(answer);
    await page.locator('#submit-answer').click();
    await phase(page, 'selecting');
    await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
      'data-owner',
      'A',
    );
  }
}

for (const [id, cell, answers, wrong] of corrections) {
  test(`P11-NR1/NR2 ${id}-${cell}: actual answers, reimport, print and locked recovery`, async ({
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
    await checkAnswers(page, info, cell, source, answers, wrong);
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
