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

test('false start awards other player; missed targets keep rotating with the same target', async ({
  page,
}) => {
  await start(page, { random: 0.99 });
  await blackDuel(page);
  await page.clock.runFor(2000);
  await expect(page.locator('#duel-target')).toHaveText('Target: Sun');
  await expect(page.locator('#duel-current')).toHaveText('Now: Circle');
  await page.keyboard.press('ShiftRight');
  await page.clock.runFor(8);
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
  await chooser(page, 'B');
  await page.locator('#host-cell').selectOption('1');
  await page.locator('#host-owner').selectOption('black');
  await page.locator('#set-cell').click();
  await page.locator('#cell-1').click();
  await page.clock.runFor(2000 + 6 * 900);
  await expect(page.locator('#duel-current')).toHaveText('Now: Sun');
  await page.clock.runFor(900);
  await phase(page, 'duel-active');
  await expect(page.locator('#duel-target')).toHaveText('Target: Sun');
  await expect(page.locator('#duel-current')).toHaveText('Now: Circle');
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
    await phase(page, 'duel-active');
    await expect(page.locator('#duel-target')).toHaveText('Target: Circle');
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
  await page.clock.runFor(2000 + 6 * 900 - 4);
  await page.keyboard.press('ShiftLeft');
  await page.clock.runFor(8);
  await phase(page, 'duel-active');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'black');
  await expect(page.locator('#duel-current')).toHaveText('Now: Sun');
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
  await expect(page.locator('#restart, #ready-A, #ready-B')).toHaveCount(0);
  await phase(page, 'duel-interrupted');
  await page.keyboard.up('ShiftLeft');
  await page.keyboard.press('ShiftRight');
  await phase(page, 'duel-interrupted');
  await page.keyboard.press('ShiftLeft');
  await phase(page, 'duel-preview');
});

test('three uninterrupted random cycles display every symbol with one fixed target and bounded saves', async ({
  page,
}, info) => {
  await start(page, { random: 0.99 });
  await blackDuel(page);
  await page.clock.runFor(2000);
  const expected = [
    'Circle',
    'Star',
    'Square',
    'Triangle',
    'Hexagon',
    'Heart',
    'Sun',
  ];
  for (let cycle = 0; cycle < 3; cycle += 1) {
    for (const symbol of expected) {
      await phase(page, 'duel-active');
      await expect(page.locator('#duel-target')).toHaveText('Target: Sun');
      await expect(page.locator('#duel-current')).toHaveText(`Now: ${symbol}`);
      await expect(page.locator('#cell-1')).toHaveAttribute(
        'data-owner',
        'black',
      );
      if (cycle === 0)
        await page.screenshot({
          path: info.outputPath(`symbol-${symbol}.png`),
        });
      await page.clock.runFor(900);
    }
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('hexy.game.v1') ?? '{}'),
    );
    expect(saved.game.stage.phase).toBe('duel-active');
    expect(saved.game.stage.round.sequence).toHaveLength(7);
    expect(saved.game.stage.round.target).toBe('sun');
    expect(JSON.stringify(saved.game.stage).length).toBeLessThan(280);
    await chooser(page, 'B');
  }
});

test('remapped fresh presses and releases restart automatically without default Shift authorization', async ({
  page,
}) => {
  await start(page, { keys: { A: 'KeyQ', B: 'KeyP' } });
  await blackDuel(page);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.keyboard.press('ShiftLeft');
  await page.keyboard.press('ShiftRight');
  await phase(page, 'duel-interrupted');
  await page.locator('#theme').click();
  await page.keyboard.press('KeyQ');
  await phase(page, 'duel-interrupted');
  await page.keyboard.down('KeyP');
  await phase(page, 'duel-interrupted');
  await page.keyboard.up('KeyP');
  await phase(page, 'duel-preview');
  await page.clock.runFor(2000);
  await page.keyboard.press('KeyQ');
  await page.clock.runFor(8);
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
});
