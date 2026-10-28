import { expect, test } from '@playwright/test';
import {
  download,
  selectSources,
  setupPreparation,
  starter,
  upload,
  verifySheet,
  editFixed,
  inspectPrintedSheet,
  importTwoBanks,
} from './preparation-helpers.js';
import { phase, setCell } from './helpers.js';

for (const language of ['en', 'cs']) {
  test(`${language}: fixed custom editor, real exports/reimports, print mapping and game lock`, async ({
    page,
    context,
  }, info) => {
    await setupPreparation(page, language);
    const original = await starter(language);
    await page
      .locator('#theme')
      .selectOption(language === 'en' ? 'dark' : 'light');
    await editFixed(page);
    const exported = await download(
      page,
      info,
      '#export-pack',
      'edited-fixed.json',
    );
    const pack = JSON.parse(exported.text);
    expect(pack.questions.map((q) => q.initial)).toEqual(
      original.questions.map((q) => q.initial),
    );
    expect(pack.questions[0].id).toBe(original.questions[0].id);
    const html = await download(
      page,
      info,
      '#answer-sheet',
      'edited-fixed.html',
    );
    await inspectPrintedSheet(context, info, html.path, pack);
    await page.locator('#import-packs').setInputFiles(exported.path);
    await selectSources(page, [pack.id]);
    await page.locator('#prepare-board').click();
    await page.locator('#accept-board').click();
    await page.locator('#start').click();
    await phase(page, 'selecting');
    await expect(
      page.locator(
        '#edit-proposal,#import-packs,#prepare-board,#question-answer',
      ),
    ).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText('Private alias');
    const locked = await download(
      page,
      info,
      '#export-pack',
      'played-fixed.json',
    );
    expect(JSON.parse(locked.text)).toEqual(pack);
    await setCell(page, 1, 'A');
    await setCell(page, 1, 'unclaimed');
    await page.locator('#cell-1').click();
    await expect(page.locator('.question-text')).toHaveText(
      pack.questions[0].text,
    );
    await expect(page.locator('.question-text img')).toHaveCount(0);
    expect(
      (await download(page, info, '#answer-sheet', 'played-fixed.html')).text,
    ).toBe(html.text);
  });
}

test('multi-source numbers use only eligible selected content and preserve private rights through edited reimport', async ({
  page,
  context,
}, info) => {
  await setupPreparation(page);
  await importTwoBanks(page);
  await page.locator('#mode').selectOption('numbers');
  await selectSources(page, ['private-one', 'private-two']);
  await page.locator('#prepare-board').click();
  await expect(page.locator('#acceptance')).toContainText('Not accepted');
  await page.locator('#accept-board').click();
  const generated = JSON.parse(
    (await download(page, info, '#export-pack', 'generated.json')).text,
  );
  expect(generated.questions).toHaveLength(28);
  expect(new Set(generated.questions.map((q) => q.id)).size).toBe(28);
  expect(
    new Set(generated.questions.flatMap((q) => q.origins.map((o) => o.packId))),
  ).toEqual(new Set(['private-one', 'private-two']));
  expect(generated.license).not.toContain('CC BY');
  await page.locator('#prepare-board').click();
  await expect(page.locator('#answer-sheet')).toHaveCount(0);
  await page.locator('#edit-proposal').click();
  await page.locator('#move-down').click();
  await page.locator('#question-aliases').fill('custom typed alias');
  await page.locator('#save-pack').click();
  await page.locator('#accept-board').click();
  const edited = await download(
    page,
    info,
    '#export-pack',
    'edited-numbers.json',
  );
  const pack = JSON.parse(edited.text);
  expect(pack.questions[1].id).toBe(generated.questions[0].id);
  await page.locator('#import-packs').setInputFiles(edited.path);
  await selectSources(page, [pack.id]);
  await page.locator('#use-numbers').click();
  await page.locator('#accept-board').click();
  const html = await download(
    page,
    info,
    '#answer-sheet',
    'numbers-sheet.html',
  );
  const sheet = await context.newPage();
  await sheet.goto(`file://${html.path}`);
  await verifySheet(sheet, pack);
  await sheet.close();
  await page.locator('#answerMode').selectOption('automatic');
  await page.locator('#start').click();
  await page.locator('#cell-2').click();
  await page.locator('#answer').fill('custom typed alias');
  await page.locator('#submit-answer').click();
  await expect(page.locator('#cell-2')).toHaveAttribute('data-owner', 'A');
});

test('insufficient, mixed-language, repeated text and conflicting IDs cannot silently fill the board', async ({
  page,
}) => {
  await setupPreparation(page);
  const short = await starter('en');
  short.id = 'short';
  short.mode = 'source';
  short.questions = short.questions.slice(0, 27);
  await upload(page, [short]);
  await page.locator('#mode').selectOption('numbers');
  await selectSources(page, [short.id]);
  await page.locator('#prepare-board').click();
  await expect(page.locator('#preparation-error')).toContainText(
    'fewer than 28',
  );
  await selectSources(page, [
    (await starter('en')).id,
    (await starter('cs')).id,
  ]);
  await page.locator('#prepare-board').click();
  await expect(page.locator('#preparation-error')).toContainText(
    'chosen question language',
  );
  const repeats = await starter('en');
  repeats.id = 'repeated';
  repeats.questions[27].text = repeats.questions[0].text;
  await upload(page, [repeats]);
  await selectSources(page, [repeats.id]);
  await page.locator('#prepare-board').click();
  await expect(page.locator('#preparation-error')).toContainText(
    'fewer than 28',
  );
  const conflict = await starter('en');
  conflict.id = 'conflict';
  conflict.questions[0].text = 'Different question sharing the same ID?';
  await upload(page, [conflict]);
  await selectSources(page, [(await starter('en')).id, conflict.id]);
  await page.locator('#prepare-board').click();
  await expect(page.locator('#preparation-error')).toContainText(
    'question ID for different content',
  );
  await page.locator('#start').click();
  await expect(page.locator('.game')).toHaveCount(0);
});

test('invalid and conflicting imports preserve the last valid accepted board and local library', async ({
  page,
}, info) => {
  await setupPreparation(page);
  const before = await download(page, info, '#export-pack', 'before.json');
  await page.locator('#import-packs').setInputFiles({
    name: 'broken.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{'),
  });
  await expect(page.locator('#preparation-error')).toContainText(
    'Invalid JSON',
  );
  expect(
    (await download(page, info, '#export-pack', 'after-invalid.json')).text,
  ).toBe(before.text);
  const original = JSON.parse(before.text);
  original.questions[0].answer = 'Athena';
  await page.locator('#import-packs').setInputFiles({
    name: 'conflict.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(original)),
  });
  await expect(page.locator('#preparation-error')).toContainText(
    'already uses this ID',
  );
  expect(
    (await download(page, info, '#export-pack', 'after-conflict.json')).text,
  ).toBe(before.text);
  await page.locator('#start').click();
  await phase(page, 'selecting');
});
