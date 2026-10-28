import { test, expect } from '@playwright/test';
import { start, phase, setCell, blackDuel } from './helpers.js';

const KEY = 'hexy.game.v1';
/** @param {import('@playwright/test').Page} page */
async function saved(page) {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) ?? '{}'),
    KEY,
  );
}

for (const delta of [-1, 0, 1]) {
  test(`real reload ${delta}ms from deadline preserves one opponent opportunity`, async ({
    page,
  }) => {
    await start(page, { answers: 'automatic' });
    await page.locator('#cell-1').click();
    const before = await saved(page);
    await page.clock.setSystemTime(before.stage.round.deadline + delta);
    await page.reload();
    await phase(page, delta < 0 ? 'question' : 'opponent');
    const recovered = await saved(page);
    expect(recovered.sessionId).not.toBe(before.sessionId);
    expect(recovered.stage.round.deadline).toBe(before.stage.round.deadline);
    expect(recovered.pack).toEqual(before.pack);
    await expect(page.locator('#pack-editor')).toHaveCount(0);
    if (delta < 0) await page.clock.runFor(1);
    await phase(page, 'opponent');
    await page.reload();
    await phase(page, 'opponent');
    await page.locator('#answer').fill('Athens');
    await page.locator('#submit-answer').click();
    await phase(page, 'selecting');
    await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'B');
    await expect(page.locator('.player.active strong')).toHaveText('A · Ada');
  });
}

test('selection, host-created win and post-win removal recover locked content and independent chooser', async ({
  page,
}) => {
  await start(page);
  await page.locator('#host-chooser').selectOption('B');
  await page.locator('#set-chooser').click();
  for (const cell of [1, 2, 4, 7, 11, 16, 22]) await setCell(page, cell, 'A');
  await phase(page, 'won');
  const before = await saved(page);
  await page.reload();
  await phase(page, 'won');
  expect((await saved(page)).pack).toEqual(before.pack);
  await setCell(page, 11, 'unclaimed');
  await phase(page, 'selecting');
  await page.reload();
  await phase(page, 'selecting');
  expect((await saved(page)).chooser).toBe('B');
  await page.locator('#cell-11').click();
  const after = await saved(page);
  expect(after.pack).toEqual(before.pack);
  expect(after.stage.round.originalChooser).toBe('B');
});

for (const stage of ['duel-preview', 'duel-active', 'duel-interrupted']) {
  test(`${stage} reload invalidates without award and restarts only after releases and readiness`, async ({
    page,
  }) => {
    await start(page);
    await blackDuel(page);
    if (stage !== 'duel-preview') await page.clock.runFor(2000);
    if (stage === 'duel-interrupted')
      await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    const before = await saved(page);
    await page.reload();
    await phase(page, 'duel-interrupted');
    const recovered = await saved(page);
    expect(recovered.cells).toEqual(before.cells);
    expect(recovered.chooser).toBe(before.chooser);
    await page.locator('#ready-A').check();
    await page.locator('#ready-B').check();
    await page.locator('#restart').click();
    await phase(page, 'duel-interrupted');
    await expect(page.locator('#restart-feedback')).not.toBeEmpty();
    for (const code of ['ShiftLeft', 'ShiftRight'])
      await page.keyboard.press(code);
    await page.locator('#restart').click();
    await phase(page, 'duel-preview');
    expect((await saved(page)).cells).toEqual(before.cells);
  });
}

test('controls, focus loss, fullscreen and reload never add time; new-game confirmation removes recovery', async ({
  page,
}) => {
  await start(page);
  await page.locator('#cell-1').click();
  const before = await saved(page);
  await page.locator('#input-controls').click();
  await page.clock.runFor(10_000);
  await page.locator('#close-inputs').click();
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.locator('#fullscreen').click();
  expect((await saved(page)).stage.round.deadline).toBe(
    before.stage.round.deadline,
  );
  await page.locator('#new-game').click();
  await page.clock.runFor(20_000);
  await phase(page, 'opponent');
  await page.locator('#cancel-new').click();
  await page.reload();
  await phase(page, 'opponent');
  await page.locator('#new-game').click();
  await page.locator('#discard-new').click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), KEY),
  ).toBeNull();
  await page.clock.runFor(60_000);
  await page.reload();
  await expect(page.locator('#start')).toBeVisible();
  await expect(page.locator('.game')).toHaveCount(0);
});

for (const language of ['en', 'cs']) {
  test(`${language} corrupt and incompatible saves have raw export and confirmed safe discard`, async ({
    page,
  }, info) => {
    await start(page, { language: /** @type {'en'|'cs'} */ (language) });
    for (const json of ['{', '{"schemaVersion":9}']) {
      await page.evaluate(({ key, json }) => localStorage.setItem(key, json), {
        key: KEY,
        json,
      });
      await page.reload();
      await expect(page.locator('#recovery-error')).toBeVisible();
      const download = page.waitForEvent('download');
      await page.locator('#export-game').click();
      await (
        await download
      ).saveAs(
        info.outputPath(`original-${json === '{' ? 'corrupt' : 'newer'}.json`),
      );
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(
        json,
      );
      await page.locator('#discard-save').click();
      await page.locator('#cancel-new').click();
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(
        json,
      );
      await page.locator('#discard-save').click();
      await page.locator('#discard-new').click();
      expect(
        await page.evaluate((key) => localStorage.getItem(key), KEY),
      ).toBeNull();
      await expect(page.locator('#import-game')).toBeAttached();
    }
  });
}

test('game export/reimport uses the actual format, retains deadline, and does not overwrite a protected original', async ({
  page,
}, info) => {
  await start(page);
  await page.locator('#cell-1').click();
  const before = await saved(page);
  const pending = page.waitForEvent('download');
  await page.locator('#export-game').click();
  const path = info.outputPath('saved-game.json');
  await (await pending).saveAs(path);
  await page.locator('#new-game').click();
  await page.locator('#discard-new').click();
  await page.clock.setSystemTime(before.stage.round.deadline);
  await page.locator('#import-game').setInputFiles(path);
  await phase(page, 'opponent');
  expect((await saved(page)).pack).toEqual(before.pack);
  await page.reload();
  await phase(page, 'opponent');
});

test('write quota failure keeps the saved deadline/original and reports unsaved status until successful retry', async ({
  page,
}) => {
  await start(page);
  const original = await page.evaluate((key) => localStorage.getItem(key), KEY);
  await page.evaluate((key) => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('full', 'QuotaExceededError');
      write.call(this, name, value);
    };
  }, KEY);
  await page.locator('#cell-1').click();
  await expect(page.locator('#game-save-status')).toContainText('not saved');
  await expect(page.locator('#recovery-error')).toContainText('NOT saved');
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(
    original,
  );
  await page.reload();
  await phase(page, 'selecting');
  await page.locator('#cell-1').click();
  await expect(page.locator('#game-save-status')).toContainText(
    'saved locally',
  );
});

test('clock rollback on reload preserves the original save until the clock is restored', async ({
  page,
}) => {
  await start(page);
  await page.locator('#cell-1').click();
  await page.clock.runFor(10_000);
  await page.locator('#judge-wrong').click();
  const original = await saved(page);
  await page.clock.setSystemTime(original.lastNow - 1);
  await page.reload();
  await expect(page.locator('#recovery-error')).toContainText(
    'clock moved backwards',
  );
  expect(await saved(page)).toEqual(original);
  await page.clock.setSystemTime(original.stage.round.deadline);
  await page.locator('#retry-recovery').click();
  await phase(page, 'opponent');
});

for (const language of /** @type {const} */ (['en', 'cs'])) {
  test(`${language} unread saved games stay protected during memory play and can be recovered without site tools`, async ({
    page,
  }) => {
    await start(page, { language });
    await page.locator('#cell-1').click();
    const original = await saved(page);
    await page.addInitScript(() => {
      const read = Storage.prototype.getItem;
      Storage.prototype.getItem = function (key) {
        if (
          key === 'hexy.game.v1' &&
          sessionStorage.getItem('deny-game') === 'yes'
        )
          throw new DOMException('denied');
        return read.call(this, key);
      };
    });
    await page.evaluate(() => sessionStorage.setItem('deny-game', 'yes'));
    await page.reload();
    await expect(page.locator('#recovery-error')).toContainText(
      language === 'en' ? 'could not be read' : 'nelze přečíst',
    );
    await page.locator('#start').click();
    await phase(page, 'selecting');
    await expect(page.locator('#game-save-status')).toContainText(
      language === 'en' ? 'not saved' : 'není uložena',
    );
    await page.evaluate(() => sessionStorage.setItem('deny-game', 'no'));
    await page.locator('#retry-recovery').click();
    expect(await saved(page)).toEqual(original);
    await expect(page.locator('#export-original')).toBeVisible();
    await page.reload();
    await phase(page, 'question');
    expect((await saved(page)).pack).toEqual(original.pack);
  });
}
