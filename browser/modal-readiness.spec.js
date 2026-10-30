import { expect, test } from '@playwright/test';
import { game, savedGame } from '../tests/fixtures.js';
import { phase } from './helpers.js';

/** @param {import('@playwright/test').Page} page @param {string} launcher */
async function prepare(page, launcher) {
  const state = game('automatic');
  state.cells[0] = 'black';
  state.config.duel.previewMs = 2000;
  state.stage = {
    phase: 'duel-interrupted',
    round: { cell: 1, originalChooser: 'A' },
  };
  await page.goto('/');
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles({
    name: 'interrupted.json',
    mimeType: 'application/json',
    buffer: Buffer.from(savedGame(state)),
  });
  await phase(page, 'duel-interrupted');
  if (launcher === 'open-recovery') {
    await page.evaluate(() => {
      URL.createObjectURL = () => {
        throw new Error('download denied');
      };
    });
    await page.locator('#save-game').click();
  }
  await page.evaluate(() => {
    const write = Storage.prototype.setItem;
    document.documentElement.dataset.previews = '0';
    Storage.prototype.setItem = function (name, value) {
      if (
        name === 'hexy.game.v1' &&
        JSON.parse(value).game.stage.phase === 'duel-preview'
      ) {
        const root = document.documentElement;
        root.dataset.previews = String(Number(root.dataset.previews) + 1);
      }
      write.call(this, name, value);
    };
  });
}

/** @param {import('@playwright/test').Page} page */
async function stored(page) {
  return page.evaluate(() => localStorage.getItem('hexy.game.v1'));
}

for (const [launcher, closer] of [
  ['exit-game', 'cancel-new'],
  ['open-recovery', 'close-recovery'],
]) {
  test(`native ${launcher} Cancel accepts exactly two fresh real Shift gestures`, async ({
    page,
  }) => {
    await prepare(page, launcher);
    await page.locator(`#${launcher}`).click();
    await page.keyboard.press('ShiftLeft');
    await page.keyboard.press('ShiftRight');
    const before = await stored(page);
    await phase(page, 'duel-interrupted');
    await page.locator(`#${closer}`).click();
    await page.keyboard.press('ShiftLeft');
    expect(await stored(page)).toBe(before);
    await expect(page.locator('html')).toHaveAttribute('data-previews', '0');
    await page.keyboard.press('ShiftRight');
    await phase(page, 'duel-preview');
    await expect(page.locator('html')).toHaveAttribute('data-previews', '1');
    const after = JSON.parse(await stored(page)).game;
    expect(after.cells).toEqual(JSON.parse(before).game.cells);
    expect(after.chooser).toBe(JSON.parse(before).game.chooser);
    expect(after.revision).toBe(JSON.parse(before).game.revision + 1);
  });

  test(`native ${launcher} close-event gap cannot reuse modal readiness or invalidate fresh A`, async ({
    page,
  }) => {
    await prepare(page, launcher);
    await page.locator(`#${launcher}`).click();
    const dialog = await page.locator('dialog').elementHandle();
    await page.keyboard.press('ShiftLeft');
    await page.keyboard.press('ShiftRight');
    const before = await stored(page);
    const gap = await page.evaluate(async (id) => {
      const dialog = document.querySelector('dialog');
      let closed = false;
      dialog.addEventListener(
        'close',
        () => {
          closed = true;
        },
        { once: true },
      );
      document.getElementById(id).click();
      for (const type of ['keydown', 'keyup'])
        document.activeElement.dispatchEvent(
          new KeyboardEvent(type, { code: 'ShiftLeft', bubbles: true }),
        );
      await Promise.resolve();
      return { closed, saved: localStorage.getItem('hexy.game.v1') };
    }, closer);
    expect(JSON.parse(gap.saved).game.stage.phase).toBe('duel-interrupted');
    expect(gap).toEqual({ closed: false, saved: before });
    await page.keyboard.press('ShiftRight');
    await phase(page, 'duel-preview');
    await expect(page.locator('html')).toHaveAttribute('data-previews', '1');
    await page.locator('#exit-game').click();
    const next = await stored(page);
    await dialog.evaluate((node) => node.dispatchEvent(new Event('close')));
    expect(await stored(page)).toBe(next);
    await expect(page.locator('dialog[open]')).toHaveCount(1);
    await page.locator('#cancel-new').click();
    await page.keyboard.press('ShiftRight');
    expect(await stored(page)).toBe(next);
    await page.keyboard.press('ShiftLeft');
    await phase(page, 'duel-preview');
    await expect(page.locator('html')).toHaveAttribute('data-previews', '2');
  });

  test(`${launcher} cancels queued restart and Escape requires a new complete handshake`, async ({
    page,
  }) => {
    await prepare(page, launcher);
    const before = await stored(page);
    await page.evaluate((id) => {
      for (const code of ['ShiftLeft', 'ShiftRight'])
        for (const type of ['keydown', 'keyup'])
          document.activeElement.dispatchEvent(
            new KeyboardEvent(type, { code, bubbles: true }),
          );
      document.getElementById(id).click();
    }, launcher);
    await expect(page.locator('dialog[open]')).toHaveCount(1);
    expect(await stored(page)).toBe(before);
    await page.keyboard.press('Escape');
    await page.keyboard.press('ShiftLeft');
    expect(await stored(page)).toBe(before);
    await page.keyboard.press('ShiftRight');
    await phase(page, 'duel-preview');
    await expect(page.locator('html')).toHaveAttribute('data-previews', '1');
  });

  test(`${launcher} rejects the release of a key held inside the modal`, async ({
    page,
  }) => {
    await prepare(page, launcher);
    await page.locator(`#${launcher}`).click();
    await page.keyboard.press('ShiftLeft');
    await page.keyboard.down('ShiftRight');
    const before = await stored(page);
    await page.locator(`#${closer}`).click();
    await page.keyboard.press('ShiftLeft');
    await page.keyboard.up('ShiftRight');
    expect(await stored(page)).toBe(before);
    await expect(page.locator('html')).toHaveAttribute('data-previews', '0');
    await page.keyboard.press('ShiftRight');
    await phase(page, 'duel-preview');
    await expect(page.locator('html')).toHaveAttribute('data-previews', '1');
  });
}
