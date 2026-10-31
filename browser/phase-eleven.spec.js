import { expect, test } from '@playwright/test';
import {
  setupPreparation,
  download,
  starter,
  upload,
  verifySheet,
  catalogPacks,
} from './preparation-helpers.js';
import { setTheme, phase } from './helpers.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';

async function selectCollapsedFolder(page, language) {
  await expect(
    page.locator('#catalog-language,#catalog-category,#catalog-search'),
  ).toHaveCount(0);
  await expect(
    page.locator('#catalog-results input[id^="source-"]'),
  ).toHaveCount(
    catalogPacks.filter((pack) => pack.language === language).length,
  );
  await expect(page.locator('#folder-general')).toHaveJSProperty(
    'indeterminate',
    true,
  );
  const summary = page.locator('#decks-general summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#decks-general')).not.toHaveAttribute('open');
  await expect(summary).toBeFocused();
  await page.locator('#catalog-origin').selectOption('bundled');
  await expect(page.locator('#decks-general')).not.toHaveAttribute('open');
  await page.locator('#folder-general').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#folder-general')).toBeFocused();
  await expect(page.locator('#folder-general')).toBeChecked();
  return summary;
}

async function checkVisibleEasyDecks(page, language) {
  await expect(page.locator('#decks-general')).not.toHaveAttribute('open');
  await expect(
    page.locator('#catalog-results input[id^="source-"]'),
  ).toHaveCount(
    catalogPacks.filter(
      (pack) => pack.language === language && pack.difficulty === 'easy',
    ).length,
  );
}

for (const language of ['cs', 'en']) {
  for (const theme of ['light', 'dark']) {
    test(`phase-eleven ${language} ${theme}: native folder keyboard, filtered selection and fixed guard`, async ({
      page,
    }, info) => {
      await page.setViewportSize(
        theme === 'light'
          ? { width: 1280, height: 720 }
          : { width: 768, height: 1024 },
      );
      await setupPreparation(page, language);
      await setTheme(page, theme);
      await expect(
        page.locator(`#source-general-${language}-01`),
      ).toBeChecked();
      const summary = await selectCollapsedFolder(page, language);
      await page.locator('#prepare-board').click();
      await expect(page.locator('#preparation-error')).toContainText(
        language === 'cs' ? 'právě jednu' : 'exactly one',
      );
      await page.locator('#catalog-difficulty').selectOption('easy');
      await checkVisibleEasyDecks(page, language);
      await page.locator('#folder-general').uncheck();
      const easy = language === 'cs' ? '01' : '02';
      const other = language === 'cs' ? '02' : '01';
      await expect(page.locator('#catalog-selection')).not.toContainText(
        `general-${language}-${easy}`,
      );
      await expect(page.locator('#catalog-selection')).toContainText(
        `general-${language}-${other}`,
      );
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#decks-general')).toHaveAttribute('open', '');
      await expect(page.locator('#decks-general')).toContainText(
        preparationStrings[language].difficulties.easy,
      );
      await page.screenshot({
        path: info.outputPath('folder-filter-keyboard.png'),
        fullPage: true,
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual((await page.viewportSize()).width);
      await page.locator('#reset-catalog').click();
      await page.locator('#clear-sources').click();
      await page.locator(`#source-general-${language}-${other}`).check();
      await page.locator('#prepare-board').click();
      await page.locator('#accept-board').click();
      expect(
        JSON.parse(
          (await download(page, info, '#export-pack', 'single-fixed.json'))
            .text,
        ).id,
      ).toBe(`general-${language}-${other}`);
    });
  }

  test(`phase-eleven ${language}: imported difficulty errors preserve valid bytes; custom folder and editor round trip`, async ({
    page,
  }, info) => {
    await setupPreparation(page, language);
    const pack = await starter(language);
    pack.id = 'private-valid';
    await upload(page, [pack]);
    const stored = await page.evaluate(() =>
      localStorage.getItem('hexy.library.v1'),
    );
    const invalid = { ...pack, id: 'private-invalid', difficulty: undefined };
    await page.locator('#import-packs').setInputFiles({
      name: 'missing-difficulty.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(invalid)),
    });
    await expect(page.locator('#preparation-error')).toContainText(
      language === 'cs' ? 'Uveďte difficulty' : 'Declare difficulty',
    );
    expect(
      await page.evaluate(() => localStorage.getItem('hexy.library.v1')),
    ).toBe(stored);
    await page.locator('#catalog-origin').selectOption('custom');
    await expect(page.locator('#catalog-results details')).toHaveCount(1);
    await expect(page.locator('#decks-custom')).toContainText(pack.title);
    await page.locator('#clear-sources').click();
    await page.locator('#folder-custom').check();
    await page.locator('#edit-source').click();
    await page.locator('#pack-difficulty').selectOption('hard');
    await page.locator('#save-pack').click();
    await page.locator('#accept-board').click();
    const output = JSON.parse(
      (await download(page, info, '#export-pack', 'edited-difficulty.json'))
        .text,
    );
    expect(output.difficulty).toBe('hard');
    expect(
      output.questions.every((question) => question.difficulty === 'hard'),
    ).toBe(true);
    await page.locator('#import-packs').setInputFiles({
      name: 'edited.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(output)),
    });
    await expect(page.locator('#preparation-error')).toHaveText('');
    await page.locator('#start').click();
    await phase(page, 'selecting');
    await page.reload();
    await phase(page, 'selecting');
    expect(
      JSON.parse(
        (await download(page, info, '#save-game', 'recovered.json')).text,
      ).game.pack,
    ).toEqual(output);
  });
}

test('phase-eleven: pre-difficulty game and library remain protected with actual exact-byte downloads', async ({
  page,
}, info) => {
  await setupPreparation(page, 'en');
  await page.locator('#start').click();
  await page.locator('#cell-1').click();
  const saved = JSON.parse(
    (await download(page, info, '#save-game', 'new-save.json')).text,
  );
  saved.game.pack.schemaVersion = 1;
  delete saved.game.pack.difficulty;
  const gameBytes = ` \n${JSON.stringify(saved, null, 3)}\n `;
  const libraryBytes = ` \n${JSON.stringify(
    {
      schemaVersion: 1,
      packs: [{ ...saved.game.pack, id: 'legacy-custom' }],
      preferences: { language: 'en', theme: 'light', setup: saved.settings },
    },
    null,
    3,
  )}\n `;
  await page.evaluate(
    ({ gameBytes, libraryBytes }) => {
      localStorage.setItem('hexy.game.v1', gameBytes);
      localStorage.setItem('hexy.library.v1', libraryBytes);
    },
    { gameBytes, libraryBytes },
  );
  await page.reload();
  await expect(page.locator('.game')).toHaveCount(0);
  await expect(page.locator('#recovery-error')).toContainText(
    'schemaVersion 2',
  );
  expect(
    (await download(page, info, '#export-game', 'protected-game.json')).text,
  ).toBe(gameBytes);
  await page.locator('#options').click();
  expect(
    (
      await download(
        page,
        info,
        '#export-library-original',
        'protected-library.json',
      )
    ).text,
  ).toBe(libraryBytes);
  await page.locator('#language').selectOption('en');
  await expect(page.locator('#storage-error')).toContainText('not overwritten');
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem('hexy.game.v1'))).toBe(
    gameBytes,
  );
  expect(
    await page.evaluate(() => localStorage.getItem('hexy.library.v1')),
  ).toBe(libraryBytes);
});

test('phase-eleven: actual mixed JSON, printed sheet and active deadline recover with exact levels', async ({
  page,
  context,
}, info) => {
  await setupPreparation(page, 'en');
  await page.evaluate(() => {
    Math.random = () => 0.41;
  });
  await page.locator('#mode-numbers').click();
  await page.locator('#clear-sources').click();
  await page.locator('#source-general-en-01').check();
  await page.locator('#source-general-en-02').check();
  await page.locator('#prepare-board').click();
  await page.locator('#accept-board').click();
  const pack = JSON.parse(
    (await download(page, info, '#export-pack', 'mixed-difficulty.json')).text,
  );
  expect(pack.difficulty).toEqual(['easy', 'medium']);
  for (const question of pack.questions)
    expect(question.difficulty).toBe(
      question.id.startsWith('general-en-01') ? 'medium' : 'easy',
    );
  const html = await download(page, info, '#start', 'mixed-difficulty.html');
  const sheet = await context.newPage();
  await sheet.goto(`file://${html.path}`);
  await verifySheet(sheet, pack);
  await expect(sheet.locator('body')).toContainText(
    'Difficulty: Easy / Medium',
  );
  await sheet.screenshot({
    path: info.outputPath('mixed-print.png'),
    fullPage: true,
  });
  await sheet.close();
  await page.locator('#cell-1').click();
  const before = JSON.parse(
    (await download(page, info, '#save-game', 'before-reload.json')).text,
  );
  await page.reload();
  await phase(page, 'question');
  const after = JSON.parse(
    (await download(page, info, '#save-game', 'after-reload.json')).text,
  );
  expect(after.game.pack).toEqual(pack);
  expect(after.game.stage.round.deadline).toBe(
    before.game.stage.round.deadline,
  );
});
