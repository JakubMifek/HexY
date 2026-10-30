import { expect, test } from '@playwright/test';
import { start, phase, setCell } from './helpers.js';
import { download } from './preparation-helpers.js';
import { installPads, padEvent } from './controller-helpers.js';
import { verifyFit } from './guided-fit.js';

for (const kind of ['valid', 'corrupt', 'future', 'removed']) {
  test(`write-detected ${kind} replacement protects exact bytes and never adopts another game`, async ({
    page,
  }, info) => {
    await start(page, { answers: 'automatic' });
    const replacement = await page.evaluate((kind) => {
      const key = 'hexy.game.v1';
      const data = JSON.parse(localStorage.getItem(key));
      data.game.sessionId = 'protected-other-tab';
      const bytes =
        kind === 'valid'
          ? JSON.stringify(data, null, 2) + '\n'
          : kind === 'corrupt'
            ? '{ corrupt protected bytes\n'
            : kind === 'future'
              ? '{ "format": "hexy-game", "schemaVersion": 99 }\n'
              : null;
      if (bytes === null) localStorage.removeItem(key);
      else localStorage.setItem(key, bytes);
      return bytes;
    }, kind);
    await page.locator('#cell-1').click();
    await phase(page, 'question');
    await page.locator('#open-recovery').click();
    await expect(page.locator('#recovery-error')).toContainText(
      'changed since',
    );
    if (replacement === null)
      await expect(page.locator('#export-original')).toHaveCount(0);
    else {
      const protectedFile = await download(
        page,
        info,
        '#export-original',
        `protected-${kind}.json`,
      );
      expect(protectedFile.text).toBe(replacement);
    }
    const current = await download(
      page,
      info,
      '#export-game',
      `current-${kind}.json`,
    );
    expect(JSON.parse(current.text).game.sessionId).not.toBe(
      'protected-other-tab',
    );
    expect(JSON.parse(current.text).game.stage.phase).toBe('question');
    await page.locator('#close-recovery').click();
    await page.locator('#exit-game').click();
    await page.locator('#discard-new').click();
    await page.locator('#discard-new').click();
    await expect(page.locator('#exit-error')).not.toBeEmpty();
    await phase(page, 'question');
    expect(
      await page.evaluate(() => localStorage.getItem('hexy.game.v1')),
    ).toBe(replacement);
  });
}

test('imported gamepad binding has no durable identity and can be re-recorded safely inside an interrupted duel', async ({
  page,
}, info) => {
  await installPads(page);
  await page.setViewportSize({ width: 1024, height: 768 });
  await start(page);
  await setCell(page, 1, 'black');
  await page.locator('#cell-1').click();
  const saved = await download(
    page,
    info,
    '#save-game',
    'before-controller.json',
  );
  const data = JSON.parse(saved.text);
  data.bindings.A = { kind: 'gamepad', button: 0 };
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles({
    name: 'controller-save.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await page.locator('#import-play').click();
  await phase(page, 'duel-interrupted');
  await expect(page.locator('.duel-inputs')).toContainText('Record again');
  await verifyFit(page);
  await page.screenshot({ path: '.artifacts/phase-10-controller-rebind.png' });
  await padEvent(page, { button: 0, held: true });
  await padEvent(page, { button: 0, held: false });
  await phase(page, 'duel-interrupted');
  await page.locator('#rebind-controls').click();
  await page.locator('#record-A').click();
  await padEvent(page, { button: 0, held: true });
  await expect(page.locator('#binding-A')).toContainText('Button 0');
  await padEvent(page, { button: 0, held: false });
  await page.locator('#close-inputs').click();
  await page.clock.runFor(16);
  await padEvent(page, { button: 0, held: true });
  await padEvent(page, { button: 0, held: false });
  await page.keyboard.press('ShiftRight');
  await phase(page, 'duel-preview');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'black');
  const after = await download(
    page,
    info,
    '#save-game',
    'recorded-controller.json',
  );
  expect(JSON.parse(after.text).bindings).toEqual(data.bindings);
  await padEvent(page, { connected: false });
  await phase(page, 'duel-interrupted');
  await page.locator('#buzzer-A').click();
  await page.locator('#buzzer-B').click();
  await phase(page, 'duel-preview');
});

test('legacy complete portable files migrate keys without extending deadlines and remain exportable', async ({
  page,
}, info) => {
  await start(page, { answers: 'automatic', keys: { A: 'KeyQ', B: 'KeyP' } });
  await page.locator('#cell-1').click();
  const saved = await download(page, info, '#save-game', 'new-format.json');
  const data = JSON.parse(saved.text);
  data.schemaVersion = 1;
  data.keys = { A: 'KeyQ', B: 'KeyP' };
  delete data.bindings;
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles({
    name: 'phase-nine.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await phase(page, 'question');
  const exported = await download(page, info, '#save-game', 'migrated.json');
  const restored = JSON.parse(exported.text);
  expect(restored.schemaVersion).toBe(2);
  expect(restored.game.stage.round.deadline).toBe(
    data.game.stage.round.deadline,
  );
  expect(restored.settings).toEqual(data.settings);
  expect(restored.bindings).toEqual({
    A: { kind: 'keyboard', code: 'KeyQ' },
    B: { kind: 'keyboard', code: 'KeyP' },
  });
});
