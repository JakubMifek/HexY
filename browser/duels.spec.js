import { expect, test } from '@playwright/test';
import { blackDuel, chooser, phase, start } from './helpers.js';

test('held preview input and repeats cannot capture; fresh target press awards once', async ({
  page,
}) => {
  await start(page);
  await blackDuel(page);
  await page.keyboard.down('ShiftLeft');
  await page.clock.runFor(2000);
  await phase(page, 'duel-active');
  await page.keyboard.down('ShiftLeft');
  await page.clock.runFor(10);
  await phase(page, 'duel-active');
  await page.keyboard.up('ShiftLeft');
  await page.keyboard.press('ShiftLeft');
  await page.clock.runFor(8);
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
  await chooser(page, 'B');
  await page.keyboard.press('ShiftRight');
  await page.clock.runFor(10_000);
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
});

test('false start awards other player; target is guaranteed and missed targets replay', async ({
  page,
}) => {
  await start(page, { random: 0.99 });
  await blackDuel(page);
  await page.clock.runFor(2000);
  await expect(page.locator('#duel-target')).toHaveText('Target: Star');
  await expect(page.locator('#duel-current')).toHaveText('Now: Square');
  await page.keyboard.press('ShiftRight');
  await page.clock.runFor(8);
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
  await chooser(page, 'B');
  await page.locator('#host-cell').selectOption('1');
  await page.locator('#host-owner').selectOption('black');
  await page.locator('#set-cell').click();
  await page.locator('#cell-1').click();
  await page.clock.runFor(2000 + 4 * 900);
  await expect(page.locator('#duel-current')).toHaveText('Now: Star');
  await page.clock.runFor(900);
  await phase(page, 'duel-preview');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'black');
});

for (const order of [
  ['ShiftLeft', 'ShiftRight'],
  ['ShiftRight', 'ShiftLeft'],
]) {
  test(`indistinguishable ${order.join('/')} tie replays without keyboard-order bias`, async ({
    page,
  }) => {
    await start(page);
    await blackDuel(page);
    await page.clock.runFor(2000);
    await page.evaluate((codes) => {
      for (const code of codes)
        window.dispatchEvent(
          new KeyboardEvent('keydown', { code, key: 'Shift' }),
        );
    }, order);
    await page.clock.runFor(8);
    await phase(page, 'duel-preview');
    await expect(page.locator('#cell-1')).toHaveAttribute(
      'data-owner',
      'black',
    );
    await chooser(page, 'B');
  });
}

test('a queued boundary press is not reinterpreted for the next symbol', async ({
  page,
}) => {
  await start(page, { random: 0.99 });
  await blackDuel(page);
  await page.clock.runFor(2000 + 4 * 900 - 4);
  await page.keyboard.press('ShiftLeft');
  await page.clock.runFor(8);
  await phase(page, 'duel-active');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'black');
  await expect(page.locator('#duel-current')).toHaveText('Now: Star');
  await page.keyboard.press('ShiftRight');
  await page.clock.runFor(8);
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'B');
});

test('focus interruption cancels pending presses; both players must be ready with keys released', async ({
  page,
}) => {
  await start(page, {
    language: 'cs',
    theme: 'dark',
    answers: 'automatic',
    mode: 'numbers',
  });
  await blackDuel(page);
  await page.clock.runFor(2000);
  await page.keyboard.down('ShiftLeft');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.clock.runFor(10_000);
  await phase(page, 'duel-interrupted');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'black');
  await expect(page.locator('#restart')).toBeDisabled();
  await page.locator('#ready-A').check();
  await expect(page.locator('#restart')).toBeDisabled();
  await page.locator('#ready-B').check();
  await page.locator('#restart').click();
  await phase(page, 'duel-interrupted');
  await page.keyboard.up('ShiftLeft');
  await page.keyboard.press('ShiftRight');
  await page.locator('#restart').click();
  await phase(page, 'duel-preview');
});
