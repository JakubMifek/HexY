import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { start, phase, setCell } from './helpers.js';
import { enterPreparation } from './preparation-helpers.js';

const key = 'hexy.game.v1';
/** @param {import('@playwright/test').Page} page */
const rawSave = (page) =>
  page.evaluate((key) => localStorage.getItem(key), key);

for (const kind of ['valid', 'corrupt', 'newer']) {
  test(`changed ${kind} replacement remains protected through retries and normal gameplay`, async ({
    page,
  }, info) => {
    await start(page);
    const prior = JSON.parse(await rawSave(page));
    prior.game.sessionId = 'replacement-scope';
    const replacement = replacementBytes(kind, prior);
    await page.locator('#exit-game').click();
    await page.evaluate(
      ({ key, replacement }) => localStorage.setItem(key, replacement),
      { key, replacement },
    );
    await page.locator('#discard-new').click();
    await page.locator('#cancel-new').click();
    await page.locator('#open-recovery').click();
    await expect(page.locator('#recovery-error')).toContainText(
      'changed since',
    );
    await expect(page.locator('#game-save-status')).toContainText('not saved');
    await page.locator('#close-recovery').click();
    await page.locator('#cell-1').click();
    expect(await rawSave(page)).toBe(replacement);
    await page.locator('#open-recovery').click();
    await page.locator('#retry-recovery').click();
    await page.locator('#close-recovery').click();
    await page.locator('#judge-wrong').click();
    expect(await rawSave(page)).toBe(replacement);
    await page.locator('#open-recovery').click();
    const pending = page.waitForEvent('download');
    await page.locator('#export-original').click();
    const file = info.outputPath('protected-replacement.json');
    await (await pending).saveAs(file);
    expect(await readFile(file, 'utf8')).toBe(replacement);
    await page
      .locator('.recovery')
      .screenshot({ path: info.outputPath('protected-replacement.png') });
    await page.locator('#close-recovery').click();
    await page.locator('#exit-game').click();
    await page.locator('#cancel-new').click();
    expect(await rawSave(page)).toBe(replacement);
    await page.locator('#open-recovery').click();
    await page.locator('#discard-save').click();
    await page.locator('#discard-new').click();
    expect(await rawSave(page)).toBeNull();
    await enterPreparation(page);
    await page.locator('#start').click();
    await phase(page, 'selecting');
    expect(await rawSave(page)).not.toBe(replacement);
  });
}

/** @param {string} kind @param {unknown} state */
function replacementBytes(kind, state) {
  if (kind === 'valid') return `${JSON.stringify(state, null, 2)}\n`;
  return kind === 'corrupt'
    ? '{ damaged replacement\n'
    : '{ "schemaVersion": 99 }\n';
}

for (const language of ['en', 'cs']) {
  for (const kind of ['valid', 'corrupt', 'newer']) {
    test(`${language} unread ${kind} replacement cannot inherit stale empty permission`, async ({
      page,
    }, info) => {
      await start(page, { language });
      const bytes = replacementBytes(kind, JSON.parse(await rawSave(page)));
      await page.locator('#exit-game').click();
      await page.evaluate((key) => localStorage.removeItem(key), key);
      await page.locator('#discard-new').click();
      await page.locator('#cancel-new').click();
      await page.locator('#open-recovery').click();
      await expect(page.locator('#recovery-error')).toContainText(
        language === 'en' ? 'changed since' : 'se od načtení změnila',
      );
      await denyGameRead(page, bytes);
      await page.locator('#retry-recovery').click();
      await expectUnread(page, language, bytes);
      await page.locator('#close-recovery').click();
      await page.locator('#cell-1').click();
      await page.locator('#judge-correct').click();
      await phase(page, 'selecting');
      await page.locator('#open-recovery').click();
      await expectUnread(page, language, bytes);
      await page.locator('.recovery').screenshot({
        path: info.outputPath('unread-replacement.png'),
      });
      await page.evaluate(() => sessionStorage.removeItem('deny-game-read'));
      await page.locator('#retry-recovery').click();
      expect(await rawSave(page)).toBe(bytes);
      const download = page.waitForEvent('download');
      await page.locator('#export-original').click();
      const file = info.outputPath('unread-replacement.json');
      await (await download).saveAs(file);
      expect(await readFile(file, 'utf8')).toBe(bytes);
      await page.locator('#close-recovery').click();
      await page.locator('#exit-game').click();
      await page.locator('#cancel-new').click();
      expect(await rawSave(page)).toBe(bytes);
      await page.evaluate((key) => localStorage.removeItem(key), key);
      await page.locator('#open-recovery').click();
      await page.locator('#retry-recovery').click();
      await expect(page.locator('#recovery-error')).toHaveCount(0);
      expect(JSON.parse(await rawSave(page)).game.cells[0]).toBe('A');
      await page.reload();
      await phase(page, 'selecting');
      expect(JSON.parse(await rawSave(page)).game.cells[0]).toBe('A');
    });
  }
}

/** @param {import('@playwright/test').Page} page @param {string} bytes */
async function denyGameRead(page, bytes) {
  await page.evaluate(
    ({ key, bytes }) => {
      localStorage.setItem(key, bytes);
      sessionStorage.setItem('deny-game-read', 'true');
      const read = Storage.prototype.getItem;
      Storage.prototype.getItem = function (name) {
        if (
          this === localStorage &&
          name === key &&
          sessionStorage.getItem('deny-game-read') === 'true'
        )
          throw new DOMException('Game reads denied', 'SecurityError');
        return read.call(this, name);
      };
    },
    { key, bytes },
  );
}

/** @param {import('@playwright/test').Page} page @param {string} language @param {string} bytes */
async function expectUnread(page, language, bytes) {
  expect(await page.evaluate((key) => localStorage[key], key)).toBe(bytes);
  await expect(page.locator('#game-save-status')).toContainText(
    language === 'en' ? 'not saved' : 'není uložena',
  );
  await expect(page.locator('#recovery-error')).toContainText(
    language === 'en' ? 'could not be read' : 'nelze přečíst',
  );
}

for (const source of ['startup', 'file']) {
  for (const stage of ['selecting', 'duel-interrupted']) {
    test(`${source} ${stage} unsupported symbols fail before adoption without dead UI`, async ({
      page,
    }, info) => {
      const language = stage === 'selecting' ? 'en' : 'cs';
      await start(page, { language });
      await setCell(page, 1, 'black');
      const state = JSON.parse(await rawSave(page));
      state.game.config.duel.symbols[0] = 'diamond';
      if (stage === 'duel-interrupted')
        state.game.stage = {
          phase: stage,
          round: { cell: 1, originalChooser: state.game.chooser },
        };
      const json = JSON.stringify(state, null, 2);
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await tryUnsupported(page, source, json);
      await expect(page.locator('#recovery-error')).toContainText(
        language === 'en' ? 'cannot display' : 'neumí zobrazit',
      );
      await expect(page.locator('.game')).toHaveCount(0);
      expect(await rawSave(page)).toBe(source === 'startup' ? json : null);
      await page
        .locator('.recovery')
        .screenshot({ path: info.outputPath('unsupported-symbols.png') });
      if (source === 'startup') {
        await page.locator('#retry-recovery').click();
        expect(await rawSave(page)).toBe(json);
        await page.locator('#discard-save').click();
        await page.locator('#discard-new').click();
      }
      if (source === 'file') await page.locator('#back-menu').click();
      await enterPreparation(page);
      await page.locator('#start').click();
      await setCell(page, 1, 'black');
      await page.locator('#cell-1').click();
      await phase(page, 'duel-preview');
      await expect(page.locator('.duel-symbol')).toHaveText('●');
      expect(errors).toEqual([]);
    });
  }
}

/** @param {import('@playwright/test').Page} page @param {string} source @param {string} json */
async function tryUnsupported(page, source, json) {
  if (source === 'startup') {
    await page.evaluate(({ key, json }) => localStorage.setItem(key, json), {
      key,
      json,
    });
    await page.reload();
    return;
  }
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles({
    name: 'unsupported-game.json',
    mimeType: 'application/json',
    buffer: Buffer.from(json),
  });
}
