import { test, expect } from '@playwright/test';
import { start, phase, blackDuel, recordKey } from './helpers.js';
import { enterPreparation } from './preparation-helpers.js';

async function controls(page) {
  await expect(page.locator('#input-controls')).toHaveCount(0);
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await page.locator('#options').click();
  await page.locator('#input-controls').click();
}

async function playAfterControls(page) {
  await page.locator('#back-menu').click();
  await enterPreparation(page);
  await page.locator('#start').click();
}

/** @param {import('@playwright/test').Page} page @param {string} type
 * @param {{player: string, id: number}[]} touches */
async function pointers(page, type, touches) {
  await page.evaluate(
    ({ type, touches }) => {
      const stamp = performance.now();
      for (const { player, id } of touches) {
        const event = new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          pointerId: id,
          pointerType: 'touch',
          button: 0,
        });
        Object.defineProperty(event, 'timeStamp', { value: stamp });
        document.querySelector(`#buzzer-${player}`)?.dispatchEvent(event);
      }
    },
    { type, touches },
  );
}

test('remapping preserves physical sides, rejects conflicts and blocks held/repeat presses in the safe test', async ({
  page,
}) => {
  await start(page);
  await controls(page);
  await recordKey(page, 'A', 'KeyQ');
  await recordKey(page, 'B', 'KeyQ');
  await expect(page.locator('#input-error')).toContainText('different');
  await recordKey(page, 'B', 'KeyP');
  await page.keyboard.press('KeyQ');
  await expect(page.locator('#input-test-status')).toContainText('A');
  await page.keyboard.press('KeyP');
  await page.locator('#close-inputs').click();
  await playAfterControls(page);
  await blackDuel(page);
  await page.keyboard.down('KeyQ');
  await page.clock.runFor(2000);
  await page.keyboard.down('KeyQ');
  await page.clock.runFor(8);
  await phase(page, 'duel-active');
  await page.keyboard.up('KeyQ');
  await page.keyboard.press('KeyQ');
  await page.clock.runFor(8);
  await phase(page, 'selecting');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
  await page.reload();
  await controls(page);
  await expect(page.locator('#binding-A')).toContainText('KeyQ');
  await expect(page.locator('#binding-B')).toContainText('KeyP');
});

test('touch multi-pointer ties, cancel, preview holds and release readiness use the actual engine', async ({
  page,
}) => {
  await start(page);
  await blackDuel(page);
  await pointers(page, 'pointerdown', [{ player: 'A', id: 1 }]);
  await page.clock.runFor(2000);
  await pointers(page, 'pointerdown', [{ player: 'A', id: 1 }]);
  await page.clock.runFor(8);
  await phase(page, 'duel-active');
  await pointers(page, 'pointerup', [{ player: 'A', id: 1 }]);
  const both = [
    { player: 'A', id: 2 },
    { player: 'B', id: 3 },
  ];
  await pointers(page, 'pointerdown', both);
  await page.clock.runFor(8);
  await phase(page, 'duel-active');
  await pointers(page, 'pointerup', both);
  await pointers(page, 'pointerdown', [{ player: 'A', id: 4 }]);
  await pointers(page, 'pointercancel', [{ player: 'A', id: 4 }]);
  await page.clock.runFor(8);
  await phase(page, 'duel-interrupted');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await phase(page, 'duel-interrupted');
  await pointers(page, 'pointerdown', both);
  await pointers(page, 'pointerup', both);
  await phase(page, 'duel-preview');
  await page.clock.runFor(2000);
  await page.locator('#buzzer-A').tap();
  await page.clock.runFor(8);
  await phase(page, 'selecting');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
});

test.use({ hasTouch: true });

test('native Chromium multi-touch starts replay a tie and cancelled gestures do not repeat', async ({
  page,
}) => {
  await start(page);
  await blackDuel(page);
  await page.clock.runFor(2000);
  const points = [];
  for (const [id, player] of ['A', 'B'].entries()) {
    const box = await page.locator(`#buzzer-${player}`).boundingBox();
    if (!box) throw new Error('Missing touch buzzer');
    points.push({ id, x: box.x + box.width / 2, y: box.y + box.height / 2 });
  }
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: points,
  });
  await page.clock.runFor(8);
  await phase(page, 'duel-active');
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchCancel',
    touchPoints: [],
  });
  await page.clock.runFor(2000);
  await phase(page, 'duel-interrupted');
  await page.keyboard.press('ShiftLeft');
  await page.keyboard.press('ShiftRight');
  await phase(page, 'duel-preview');
  await page.clock.runFor(2000);
  await phase(page, 'duel-active');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'black');
  await session.detach();
});

/** @param {import('@playwright/test').Page} page */
async function installGamepad(page) {
  await page.addInitScript(() => {
    const buttons = [
      { pressed: false, value: 0, touched: false },
      { pressed: false, value: 0, touched: false },
    ];
    const pad = {
      id: 'Xbox boundary mock',
      index: 0,
      connected: true,
      buttons,
    };
    Object.defineProperty(navigator, 'getGamepads', {
      value: () => (pad.connected ? [pad] : []),
    });
    window.addEventListener('mock-button', (event) => {
      const detail =
        /** @type {CustomEvent<{button: number, pressed: boolean}>} */ (event)
          .detail;
      buttons[detail.button].pressed = detail.pressed;
    });
    window.addEventListener('mock-disconnect', () => {
      pad.connected = false;
    });
    window.addEventListener('mock-connect', () => {
      pad.connected = true;
    });
  });
}

test('mocked Gamepad API assigns buttons explicitly, suppresses holds and interrupts on loss without reassignment', async ({
  page,
}) => {
  await installGamepad(page);
  await start(page);
  await page.clock.runFor(16);
  await controls(page);
  await recordPad(page, 'A', 0);
  await recordPad(page, 'B', 1);
  await page.clock.runFor(16);
  await page.locator('#close-inputs').click();
  await playAfterControls(page);
  await blackDuel(page);
  await mockButton(page, 0, true);
  await page.clock.runFor(2000);
  await phase(page, 'duel-active');
  await mockButton(page, 0, false);
  await page.clock.runFor(16);
  await page.evaluate(() => {
    for (const button of [0, 1])
      window.dispatchEvent(
        new CustomEvent('mock-button', { detail: { button, pressed: true } }),
      );
  });
  await page.clock.runFor(24);
  await phase(page, 'duel-active');
  await rearmPads(page);
  await page.evaluate(() => window.dispatchEvent(new Event('mock-disconnect')));
  await page.clock.runFor(16);
  await phase(page, 'duel-interrupted');
  await expect(page.locator('#controller-status')).toContainText(
    'disconnected',
  );
  await page.evaluate(() => window.dispatchEvent(new Event('mock-connect')));
  await page.clock.runFor(16);
  await page.keyboard.press('ShiftLeft');
  await page.keyboard.press('ShiftRight');
  await phase(page, 'duel-interrupted');
  await controls(page);
  await expect(page.locator('#binding-A')).toContainText('Record again');
  await expect(page.locator('#binding-B')).toContainText('Record again');
  await expect(page.locator('#controller-status')).toContainText(
    'disconnected',
  );
});

/** @param {import('@playwright/test').Page} page @param {number} button @param {boolean} pressed */
async function mockButton(page, button, pressed) {
  await page.evaluate(
    (detail) =>
      window.dispatchEvent(new CustomEvent('mock-button', { detail })),
    { button, pressed },
  );
}

async function recordPad(page, player, button) {
  await page.locator(`#record-${player}`).click();
  await mockButton(page, button, true);
  await page.clock.runFor(16);
  await mockButton(page, button, false);
  await page.clock.runFor(16);
}

/** @param {import('@playwright/test').Page} page */
async function rearmPads(page) {
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  for (const button of [0, 1]) await mockButton(page, button, false);
  await page.clock.runFor(16);
  await phase(page, 'duel-interrupted');
  for (const button of [0, 1]) await mockButton(page, button, true);
  await page.clock.runFor(16);
  await mockButton(page, 1, false);
  await page.clock.runFor(16);
  await phase(page, 'duel-interrupted');
  await mockButton(page, 0, false);
  await page.clock.runFor(16);
  await phase(page, 'duel-preview');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'black');
}

for (const language of /** @type {const} */ (['en', 'cs'])) {
  test(`${language} safe gamepad test announces releases for both players only on edges`, async ({
    page,
  }, info) => {
    await installGamepad(page);
    await start(page, { language });
    await page.clock.runFor(16);
    await controls(page);
    await recordPad(page, 'A', 0);
    await recordPad(page, 'B', 1);
    await page.clock.runFor(16);
    for (const [index, player] of ['A', 'B'].entries()) {
      await mockButton(page, index, true);
      await page.clock.runFor(16);
      await expect(page.locator('#input-test-status')).toHaveText(
        `${player} · ${language === 'en' ? 'Pressed' : 'Stisknuto'}`,
      );
      await mockButton(page, index, false);
      await page.clock.runFor(16);
      await expect(page.locator('#input-test-status')).toHaveText(
        `${player} · ${language === 'en' ? 'Released / ready' : 'Uvolněno / připraveno'}`,
      );
      await assertQuietPolling(page);
    }
    await page
      .locator('#input-test-status')
      .screenshot({ path: info.outputPath('released-status.png') });
    await expect(page.locator('.game')).toHaveCount(0);
    await page.locator('#close-inputs').click();
    await playAfterControls(page);
    await expect(page.locator('#cell-1')).toHaveAttribute(
      'data-owner',
      'unclaimed',
    );
  });
}

/** @param {import('@playwright/test').Page} page */
async function assertQuietPolling(page) {
  await page.evaluate(() => {
    const node = document.querySelector('#input-test-status');
    if (!(node instanceof HTMLElement)) throw new Error('Missing input status');
    node.dataset.changes = '0';
    const observer = new MutationObserver((records) => {
      node.dataset.changes = String(
        Number(node.dataset.changes) + records.length,
      );
    });
    observer.observe(node, { childList: true, subtree: true });
    window.addEventListener(
      'stop-diagnostic-observer',
      () => observer.disconnect(),
      { once: true },
    );
  });
  await page.clock.runFor(160);
  await page.evaluate(() =>
    window.dispatchEvent(new Event('stop-diagnostic-observer')),
  );
  await expect(page.locator('#input-test-status')).toHaveAttribute(
    'data-changes',
    '0',
  );
}
