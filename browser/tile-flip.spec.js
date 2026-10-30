import { expect, test } from '@playwright/test';
import { start, phase, setCell } from './helpers.js';
import { exit } from './guided-fit.js';

/** @param {import('@playwright/test').Page} page */
async function saved(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('hexy.game.v1')));
}

/** @param {import('@playwright/test').Locator} face @param {number} time */
async function seekFlip(face, time) {
  return face.evaluate((node, position) => {
    for (const animation of node.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = position;
    }
    const before = node.querySelector('.tile-before');
    const initial = node.querySelector('.revealed-initial');
    return {
      transform: getComputedStyle(node).transform,
      before: getComputedStyle(before).opacity,
      initial: getComputedStyle(initial).opacity,
    };
  }, time);
}

test('number selection visibly flips to the initial without delaying or replaying the round', async ({
  page,
}, info) => {
  await start(page, { mode: 'numbers' });
  const initial = (await saved(page)).game.pack.questions[0].initial;
  await expect(page.locator('#cell-1 .cell-label')).toHaveText('1');
  await page.locator('#cell-1').click();
  const deadline = (await saved(page)).game.stage.round.deadline;
  const face = page.locator('#cell-1 .flipping');
  const first = await seekFlip(face, 0);
  expect(first).toMatchObject({ before: '1', initial: '0' });
  expect((await seekFlip(face, 240)).transform).toBe(
    'matrix(0, 0, 0, 1, 0, 0)',
  );
  const back = await seekFlip(face, 400);
  expect(back).toMatchObject({ before: '0', initial: '1' });
  await expect(page.locator('#cell-1 .cell-label')).toHaveText(initial);
  await page.screenshot({ path: info.outputPath('number-flip.png') });
  await page.clock.runFor(1000);
  expect((await saved(page)).game.stage.round.deadline).toBe(deadline);
  await page.locator('#theme').click();
  await expect(page.locator('.flipping')).toHaveCount(0);
  await expect(page.locator('#cell-1 .revealed-initial')).toHaveText(initial);
  await page.locator('#give-up').click();
  await phase(page, 'opponent');
  await expect(page.locator('#cell-1 .revealed-initial')).toHaveText(initial);
  await expect(page.locator('.flipping')).toHaveCount(0);
  await page.locator('#give-up').click();
  await expect(page.locator('#cell-1 .cell-label')).toHaveText('1');
  await page.locator('#cell-1').click();
  await phase(page, 'duel-preview');
  await expect(page.locator('#cell-1 .cell-label')).toHaveText('1');
  await expect(page.locator('.flipping, .revealed-initial')).toHaveCount(0);
});

for (const [language, initial, mode] of [
  ['cs', 'Ch', 'letters'],
  ['en', 'CH', 'letters'],
  ['en', 'SH', 'letters'],
  ['cs', 'Ch', 'numbers'],
  ['en', 'CH', 'numbers'],
  ['en', 'SH', 'numbers'],
]) {
  test(`keyboard ${mode} flip preserves the complete ${language} ${initial} initial`, async ({
    page,
  }, info) => {
    await start(page, { language, mode, theme: 'dark' });
    const questions = (await saved(page)).game.pack.questions;
    const cell =
      questions.findIndex((question) => question.initial === initial) + 1;
    expect(cell).toBeGreaterThan(0);
    await page.locator(`#cell-${cell}`).focus();
    await page.keyboard.press('Enter');
    await phase(page, 'question');
    await expect(page.locator(`#cell-${cell} .flipping`)).toHaveCount(1);
    await expect(page.locator(`#cell-${cell} .revealed-initial`)).toHaveText(
      initial,
    );
    await seekFlip(page.locator(`#cell-${cell} .flipping`), 479);
    await page.screenshot({ path: info.outputPath('digraph-flip.png') });
    await expect(page.locator('#phase-heading')).toBeFocused();
    await page.locator('#judge-correct').click();
    await expect(page.locator(`#cell-${cell} text`)).toHaveCount(0);
    await setCell(page, cell, 'unclaimed');
    await expect(page.locator(`#cell-${cell} .cell-label`)).toHaveText(
      mode === 'letters' ? initial : String(cell),
    );
    await expect(page.locator('.flipping')).toHaveCount(0);
  });
}

test('reloading during a native flip restores the revealed tile, never an animation or extra time', async ({
  page,
}) => {
  await start(page, { mode: 'numbers' });
  await page.locator('#cell-1').click();
  const current = (await saved(page)).game;
  expect((await seekFlip(page.locator('.flipping'), 120)).before).toBe('1');
  await page.reload();
  await phase(page, 'question');
  await expect(page.locator('.flipping, .tile-before')).toHaveCount(0);
  await expect(page.locator('#cell-1 .revealed-initial')).toHaveText(
    current.pack.questions[0].initial,
  );
  expect((await saved(page)).game.stage.round.deadline).toBe(
    current.stage.round.deadline,
  );
  await page.clock.runFor(30000);
  await phase(page, 'opponent');
  await expect(page.locator('.flipping')).toHaveCount(0);
});

test('reduced motion reveals immediately; reload and exit discard presentation without changing deadlines', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page, { mode: 'numbers', answers: 'automatic' });
  await page.locator('#cell-1').focus();
  await page.keyboard.press('Space');
  const initial = (await saved(page)).game.pack.questions[0].initial;
  const deadline = (await saved(page)).game.stage.round.deadline;
  expect(deadline - (await page.evaluate(() => Date.now()))).toBe(30000);
  expect(
    await page
      .locator('.tile-face.flipping')
      .evaluate((node) => node.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await expect(page.locator('.revealed-initial')).toHaveCSS('opacity', '1');
  await expect(page.locator('.tile-before')).toBeHidden();
  await expect(page.locator('#phase-heading')).toBeFocused();
  await page.screenshot({ path: info.outputPath('reduced-motion.png') });
  await page.reload();
  await phase(page, 'question');
  await expect(page.locator('#cell-1 .revealed-initial')).toHaveText(initial);
  await expect(page.locator('.flipping')).toHaveCount(0);
  expect((await saved(page)).game.stage.round.deadline).toBe(deadline);
  await exit(page);
  await page.clock.runFor(31000);
  await expect(page.locator('.game, .flipping')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('#new-game')).toBeVisible();
});
