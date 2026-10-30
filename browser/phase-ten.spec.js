import { expect, test } from '@playwright/test';
import { start, phase, setCell, recordKey } from './helpers.js';
import { download } from './preparation-helpers.js';
import { installPads, padEvent } from './controller-helpers.js';

async function exit(page) {
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
}

for (const language of ['en', 'cs']) {
  for (const theme of ['light', 'dark']) {
    test(`recorded controls fit two rows ${language} ${theme}`, async ({
      page,
    }) => {
      const viewport =
        theme === 'light'
          ? { width: 1280, height: 720 }
          : { width: 768, height: 1024 };
      await page.setViewportSize(viewport);
      await start(page, { language, theme });
      await exit(page);
      await page.locator('#options').click();
      const back = await page.locator('#back-menu').boundingBox();
      const controls = await page.locator('#input-controls').boundingBox();
      expect(controls.y - back.y - back.height).toBeGreaterThanOrEqual(12);
      await page.screenshot({
        path: `.artifacts/phase-10-options-${language}-${theme}.png`,
      });
      await page.locator('#input-controls').click();
      await expect(page.locator('.binding-row')).toHaveCount(2);
      await expect(page.locator('dialog select, dialog input')).toHaveCount(0);
      await page.locator('#record-A').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#record-status')).toContainText('A');
      await expect(page.locator('#binding-A')).toContainText('Shift');
      await page.keyboard.press('Digit5');
      await expect(page.locator('#binding-A')).toContainText('Digit5');
      await page.locator('#record-B').focus();
      await page.keyboard.press('Space');
      await expect(page.locator('#record-status')).toContainText('B');
      await expect(page.locator('#binding-B')).toContainText('Shift');
      await page.keyboard.press('Escape');
      await recordKey(page, 'B', 'Digit5');
      await expect(page.locator('#input-error')).not.toBeEmpty();
      await page.keyboard.press('Escape');
      await expect(page.locator('dialog')).toBeVisible();
      await expect(page.locator('#binding-B')).toContainText('Shift');
      await page.locator('#record-B').click();
      const box = await page.locator('dialog').boundingBox();
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      await page.screenshot({
        path: `.artifacts/phase-10-controls-${language}-${theme}.png`,
      });
      await page.locator('#cancel-record').click();
      await page.evaluate(() => {
        document.querySelector('#close-inputs').click();
        document.querySelector('#input-controls').click();
      });
      await expect(page.locator('dialog')).toBeVisible();
      await recordKey(page, 'B', 'KeyP');
      await expect(page.locator('#binding-B')).toContainText('KeyP');
      await page.locator('#close-inputs').click();
    });
  }
}

test('Record snapshots a controller held between polls and requires release before a fresh capture', async ({
  page,
}) => {
  await installPads(page);
  await start(page);
  await exit(page);
  await page.locator('#options').click();
  await page.locator('#input-controls').click();
  await page.clock.runFor(16);
  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent('phase-ten-pad', { detail: { button: 0, held: true } }),
    );
    document.getElementById('record-A').click();
  });
  await page.clock.runFor(16);
  await expect(page.locator('#binding-A')).toContainText('Left Shift');
  await expect(page.locator('#record-status')).toContainText('A');
  await padEvent(page, { button: 0, held: false });
  await padEvent(page, { button: 0, held: true });
  await expect(page.locator('#binding-A')).toContainText('Button 0');
});

test('standard D-pad and stick navigate the real board without duel assignment, with neutral and one confirmation', async ({
  page,
}) => {
  await installPads(page);
  await start(page);
  await setCell(page, 2, 'A');
  await page.locator('#phase-heading').focus();
  await page.clock.runFor(16);
  await padEvent(page, { button: 15, held: true });
  await expect(page.locator('#cell-1')).toBeFocused();
  await page.clock.runFor(352);
  await expect(page.locator('#cell-3')).toBeFocused();
  await padEvent(page, { button: 15, held: false });
  await padEvent(page, { axes: [-0.8, 0] });
  await expect(page.locator('#cell-1')).toBeFocused();
  await padEvent(page, { axes: [-0.4, 0] }, 100);
  await expect(page.locator('#cell-1')).toBeFocused();
  await padEvent(page, { axes: [0, 0] });
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#cell-3')).toBeFocused();
  await padEvent(page, { button: 0, held: true, index: 1 });
  await phase(page, 'question');
  await padEvent(page, { button: 0, held: true });
  await page.locator('#judge-correct').click();
  await phase(page, 'selecting');
  await page.locator('#phase-heading').focus();
  await page.clock.runFor(32);
  await phase(page, 'selecting');
  await expect(page.locator('#cell-3')).toHaveAttribute('data-owner', 'A');
  await page.locator('#host-cell').focus();
  await padEvent(page, { button: 0, held: false });
  await padEvent(page, { button: 0, held: true });
  await phase(page, 'selecting');
});

test('gamepad navigation cannot replay through a modal or unsupported device and A may be the duel binding', async ({
  page,
}) => {
  await installPads(page);
  await start(page);
  await exit(page);
  await page.locator('#options').click();
  await page.locator('#input-controls').click();
  await padEvent(page, { button: 0, held: true });
  await page.locator('#record-A').click();
  await page.clock.runFor(32);
  await expect(page.locator('#binding-A')).toContainText('Shift');
  await padEvent(page, { button: 0, held: false });
  await padEvent(page, { button: 0, held: true });
  await expect(page.locator('#binding-A')).toContainText('Button 0');
  await padEvent(page, { button: 0, held: false });
  await page.locator('#close-inputs').click();
  await page.locator('#back-menu').click();
  await page.locator('#new-game').click();
  await page.locator('#next-setup').click();
  await page.locator('#mode-letters').click();
  await page.locator('#start').click();
  await setCell(page, 1, 'black');
  await page.locator('#phase-heading').focus();
  await page.clock.runFor(16);
  await padEvent(page, { button: 15, held: true });
  await padEvent(page, { button: 15, held: false });
  await page.locator('#exit-game').click();
  await padEvent(page, { button: 0, held: true });
  await page.locator('#cancel-new').click();
  await page.locator('#cell-1').focus();
  await page.clock.runFor(32);
  await phase(page, 'selecting');
  await padEvent(page, { button: 0, held: false });
  await padEvent(page, { mapping: '', button: 0, held: true });
  await phase(page, 'selecting');
  await padEvent(page, { mapping: 'standard', button: 0, held: false });
  await padEvent(page, { button: 0, held: true });
  await phase(page, 'duel-preview');
  await page.clock.runFor(2000);
  await phase(page, 'duel-active');
  await page.keyboard.press('ShiftLeft');
  await page.clock.runFor(16);
  await phase(page, 'duel-active');
  await padEvent(page, { button: 0, held: false });
  await padEvent(page, { button: 0, held: true }, 24);
  await phase(page, 'selecting');
});

test('final export downloads click-time state and reimports new bindings without storing generated mixes', async ({
  page,
}, info) => {
  await start(page, {
    mode: 'numbers',
    answers: 'automatic',
    keys: { A: 'Digit5', B: 'KeyP' },
  });
  const packs = await page.evaluate(
    () => JSON.parse(localStorage.getItem('hexy.library.v1')).packs,
  );
  expect(packs).toEqual([]);
  await page.locator('#cell-1').click();
  await page.locator('#exit-game').click();
  await page.clock.runFor(31_000);
  await page.screenshot({ path: '.artifacts/phase-10-final-export-en.png' });
  const exported = await download(
    page,
    info,
    '#save-return',
    'final-game.json',
  );
  const data = JSON.parse(exported.text);
  expect(data.schemaVersion).toBe(2);
  expect(data.game.stage.phase).toBe('opponent');
  expect(data.bindings.A).toEqual({ kind: 'keyboard', code: 'Digit5' });
  expect(
    await page.evaluate(() => localStorage.getItem('hexy.game.v1')),
  ).toBeNull();
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles(exported.path);
  await phase(page, 'opponent');
  const recovered = JSON.parse(
    await page.evaluate(() => localStorage.getItem('hexy.game.v1')),
  );
  expect(recovered.game.pack).toEqual(data.game.pack);
  expect(recovered.game.stage.round.deadline).toBe(
    data.game.stage.round.deadline,
  );
  expect(recovered.bindings).toEqual(data.bindings);
});

test('failed final export retains recovery and a retryable localized dialog, including Czech portrait', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await start(page, { language: 'cs', theme: 'dark' });
  const before = await page.evaluate(() =>
    localStorage.getItem('hexy.game.v1'),
  );
  await page.evaluate(() => {
    URL.createObjectURL = () => {
      throw new Error('Denied');
    };
  });
  await page.locator('#exit-game').click();
  await page.locator('#save-return').click();
  await expect(page.locator('#exit-error')).toContainText(
    'Stažený soubor nelze vytvořit',
  );
  await expect(page.locator('dialog')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('hexy.game.v1'))).toBe(
    before,
  );
  await page.screenshot({ path: '.artifacts/phase-10-final-export-cs.png' });
  await page.locator('#cancel-new').click();
  await phase(page, 'selecting');
  await exit(page);
  await expect(page.locator('#new-game')).toBeVisible();
});
