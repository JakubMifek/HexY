import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { start, phase } from './helpers.js';
import { download } from './preparation-helpers.js';
import { exit, verifyFit, verifyRecoveryFit } from './guided-fit.js';

/** @param {import('@playwright/test').Page} page @param {object} data */
async function importGame(page, data) {
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles({
    name: 'full-game.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  if (data.game.config.answerMode === 'hosted') {
    await expect(page.locator('.game')).toHaveCount(0);
    const sheet = page.waitForEvent('download');
    await page.locator('#import-play').click();
    expect((await sheet).suggestedFilename()).toMatch(/\.html$/);
  }
}

const presentations = ['cs', 'en'].flatMap((language) =>
  ['light', 'dark'].flatMap((theme) =>
    ['hosted', 'automatic'].map((answers) => ({ language, theme, answers })),
  ),
);

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
]) {
  for (const { language, theme, answers } of presentations) {
    test(`guided maximum ${viewport.width}x${viewport.height} ${language} ${theme} ${answers}`, async ({
      page,
    }, info) => {
      await page.setViewportSize(viewport);
      await start(page, { language, theme, answers });
      const exported = await download(
        page,
        info,
        '#save-game',
        'complete-game.json',
      );
      const data = JSON.parse(exported.text);
      data.settings.players.A.name = 'W'.repeat(30);
      data.settings.players.B.name = 'M'.repeat(30);
      if (answers === 'automatic') {
        data.settings.players.A.color = '#ffffff';
        data.settings.players.B.color = '#111111';
      }
      data.game.pack.questions[0].text = 'W'.repeat(600);
      data.game.pack.questions[0].answer = 'A'.repeat(120);
      await exit(page);
      await importGame(page, data);
      await phase(page, 'selecting');
      await verifyFit(page);
      await expect(page.locator('.player strong').first()).toHaveText(
        `A · ${'W'.repeat(30)}`,
      );
      await page.locator('#cell-1').click();
      await expect(page.locator('.question-text')).toHaveText('W'.repeat(600));
      const fit = await verifyFit(page);
      await info.attach('maximum-text-bounds', {
        body: JSON.stringify(fit),
        contentType: 'application/json',
      });
      await page.screenshot({
        path: info.outputPath('maximum-question.png'),
      });
      await verifyRecoveryFit(page, answers, info);
      if (answers === 'hosted') await page.locator('#judge-correct').click();
      else {
        await page.locator('#answer').fill('A'.repeat(120));
        await page.locator('#submit-answer').click();
      }
      await phase(page, 'selecting');
      await expect(page.locator('#cell-1 text')).toHaveCount(0);
      await verifyFit(page);
      await page.screenshot({
        path: info.outputPath('maximum-answer.png'),
      });
    });
  }
}

test('guided menu, options, players and Back preserve choices with icon-only accessible theme', async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');
  await expect(page.locator('main button')).toHaveCount(3);
  await expect(page.locator('html')).toHaveCSS(
    'background-repeat',
    /^no-repeat/,
  );
  await expect(page.locator('#theme')).toHaveAccessibleName('Vzhled: Tmavý');
  await expect(page.locator('#theme')).not.toContainText('Vzhled');
  await page.screenshot({ path: info.outputPath('menu.png') });
  await page.locator('#options').click();
  await expect(page.locator('#seconds')).toHaveValue('30');
  await expect(page.locator('#starter')).toHaveValue('random');
  await page.locator('#language').selectOption('en');
  await page.locator('#seconds').fill('45');
  await page.locator('#theme').click();
  await expect(page.locator('html')).toHaveCSS(
    'background-repeat',
    /^no-repeat/,
  );
  await expect(page.locator('html')).toHaveCSS(
    'background-attachment',
    /^fixed/,
  );
  await page.screenshot({ path: info.outputPath('options.png') });
  await page.locator('#back-menu').click();
  await page.locator('#new-game').click();
  await expect(page.locator('#nameA')).toHaveValue('Aragorn');
  await expect(page.locator('#nameB')).toHaveValue('Arwen');
  await expect(page.locator('#colorA')).toHaveValue('#129fb5');
  await page.locator('#nameA').fill('Éowyn');
  await page.locator('#answerMode').selectOption('automatic');
  await page.screenshot({ path: info.outputPath('players.png') });
  await page.locator('#next-setup').click();
  await expect(page.locator('.workspace')).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('board-choices.png') });
  await page.locator('#mode-letters').click();
  await page.locator('#back-players').click();
  await page.locator('#theme').click();
  await expect(page.locator('#nameA')).toHaveValue('Éowyn');
  await page.locator('#next-setup').click();
  await expect(page.locator('#answer-sheet')).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('decks.png'), fullPage: true });
  await page.locator('#start').click();
  await page.locator('#cell-1').click();
  await expect(page.locator('#timer')).toHaveText('45 s');
  await expect(page.locator('.question-text')).toHaveText(
    'Which city is the capital of Greece?',
  );
  await expect(
    page.locator(
      '#input-controls,#fullscreen,#new-game,#export-pack,.workspace',
    ),
  ).toHaveCount(0);
});

for (const answers of ['hosted', 'automatic']) {
  test(`guided ${answers} actual Save Game round trip restores complete progress and mappings`, async ({
    page,
  }, info) => {
    await start(page, {
      answers,
      language: 'cs',
      mode: 'numbers',
      seconds: 45,
      theme: 'dark',
      keys: { A: 'KeyQ', B: 'KeyP' },
    });
    await page.locator('#cell-1').click();
    if (answers === 'hosted') await page.locator('#judge-correct').click();
    else {
      await page.locator('#answer').fill('Berlin');
      await page.locator('#submit-answer').click();
    }
    await page.locator('#cell-2').click();
    const saved = await download(
      page,
      info,
      '#save-game',
      'real-round-trip.json',
    );
    const original = JSON.parse(await readFile(saved.path, 'utf8'));
    expect(original.game.cells[0]).toBe('A');
    expect(original.bindings).toEqual({
      A: { kind: 'keyboard', code: 'KeyQ' },
      B: { kind: 'keyboard', code: 'KeyP' },
    });
    await exit(page);
    await page.reload();
    await expect(page.locator('.game')).toHaveCount(0);
    await page.locator('#open-import').click();
    await page.locator('#import-game').setInputFiles(saved.path);
    if (answers === 'hosted') await page.locator('#import-play').click();
    await phase(page, 'question');
    const restored = JSON.parse(
      (await download(page, info, '#save-game', 'restored-game.json')).text,
    );
    expect(restored.settings).toEqual(original.settings);
    expect(restored.bindings).toEqual(original.bindings);
    expect(restored.game.pack).toEqual(original.game.pack);
    expect(restored.game.cells).toEqual(original.game.cells);
    expect(restored.game.stage).toEqual(original.game.stage);
    expect(restored.game.sessionId).not.toBe(original.game.sessionId);
    await page.clock.setSystemTime(original.game.stage.round.deadline);
    await page.reload();
    await phase(page, 'opponent');
  });
}

test('guided hosted download failure leaves preparation untouched and wrong-format imports preserve data', async ({
  page,
}) => {
  await start(page);
  const original = JSON.parse(
    await page.evaluate(() => localStorage.getItem('hexy.game.v1')),
  );
  await exit(page);
  await page.locator('#open-import').click();
  for (const bad of [
    original.game.pack,
    { ...original, schemaVersion: 999 },
    { ...original, settings: { ...original.settings, language: 'cs' } },
    {
      ...original,
      game: {
        ...original.game,
        pack: { ...original.game.pack, title: 'W'.repeat(2_000_000) },
      },
    },
  ]) {
    await page.locator('#import-game').setInputFiles({
      name: 'bad.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(bad)),
    });
    await expect(page.locator('#recovery-error')).not.toBeEmpty();
    await expect(page.locator('.game')).toHaveCount(0);
    expect(
      await page.evaluate(() => localStorage.getItem('hexy.game.v1')),
    ).toBeNull();
  }
  await page.locator('#back-menu').click();
  await page.locator('#new-game').click();
  await page.locator('#next-setup').click();
  await page.locator('#mode-letters').click();
  await page.evaluate(() => {
    URL.createObjectURL = () => {
      throw new Error('Download unavailable');
    };
  });
  await page.locator('#start').click();
  await expect(page.locator('.game')).toHaveCount(0);
  await expect(page.locator('#preparation-error')).not.toBeEmpty();
});
