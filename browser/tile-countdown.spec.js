import { expect, test } from '@playwright/test';
import { start, phase } from './helpers.js';
import { exit, verifyFit } from './guided-fit.js';

/** @param {import('@playwright/test').Page} page */
async function saved(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('hexy.game.v1')));
}

/** @param {import('@playwright/test').Page} page @param {number} position */
async function seekFlip(page, position) {
  return page.locator('.flipping').evaluate((face, time) => {
    for (const animation of face.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = time;
    }
    const matrix = new DOMMatrix(getComputedStyle(face).transform);
    return {
      x: matrix.a,
      y: matrix.d,
      height: face.getBoundingClientRect().height,
    };
  }, position);
}

/** @param {import('@playwright/test').Page} page */
async function paintedQuadrants(page) {
  return page.locator('.tile-countdown').evaluate(async (ring) => {
    const image = new Image();
    image.src = `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="-30 -30 60 60">${ring.outerHTML}</svg>`,
    )}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 240;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return [45, 135, 225, 315].map((degrees) => {
      const angle = (degrees * Math.PI) / 180;
      const x = Math.round(120 + 84 * Math.sin(angle));
      const y = Math.round(120 - 84 * Math.cos(angle));
      return context.getImageData(x, y, 1, 1).data[3] > 128;
    });
  });
}

/** @param {import('@playwright/test').Page} page */
async function verifyEnlargedFit(page) {
  expect(
    await page
      .locator('.flipping')
      .evaluate((face) => getComputedStyle(face).animationName),
  ).toBe('none');
  await verifyFit(page);
  const inside = await page
    .locator('.question-tile .tile-face')
    .evaluate((face) => {
      const tile = face.getBoundingClientRect();
      const board = face.closest('svg').getBoundingClientRect();
      const panel = document
        .querySelector('.question-panel')
        .getBoundingClientRect();
      return (
        tile.top >= board.top &&
        tile.left >= board.left &&
        tile.right <= board.right &&
        tile.bottom <= board.bottom &&
        tile.bottom <= panel.top
      );
    });
  expect(inside).toBe(true);
}

/** @param {import('@playwright/test').Page} page */
async function verifyDetachedFlip(page) {
  const face = await page.locator('.flipping').elementHandle();
  await page.locator('#theme').click();
  expect(
    await face.evaluate((node) => ({
      connected: node.isConnected,
      animations: node.getAnimations({ subtree: true }).length,
    })),
  ).toEqual({ connected: false, animations: 0 });
  await expect(page.locator('.flipping')).toHaveCount(0);
}

for (const theme of ['light', 'dark']) {
  test(`${theme}: grows during native flip and painted missing arc advances clockwise to deadline`, async ({
    page,
  }, info) => {
    await start(page, { theme, mode: 'numbers', seconds: 4 });
    await page.locator('#cell-1').click();
    const deadline = (await saved(page)).game.stage.round.deadline;
    const ring = page.locator('.tile-countdown');
    await expect(ring).toHaveAttribute('stroke-dasharray', '100 100');
    await expect(ring.locator('circle:last-child')).toHaveAttribute(
      'stroke',
      '#129FB5',
    );
    expect(await paintedQuadrants(page)).toEqual([true, true, true, true]);
    const before = await seekFlip(page, 0);
    const during = await seekFlip(page, 120);
    expect(during.y).toBeGreaterThan(before.y);
    expect(during.x).toBeLessThan(before.x);
    expect(during.height).toBeGreaterThan(before.height);
    expect((await seekFlip(page, 240)).x).toBeCloseTo(0);
    await seekFlip(page, 400);
    await page.screenshot({ path: info.outputPath('growth-during-flip.png') });
    await seekFlip(page, 480);
    await page.clock.runFor(1000);
    await expect(ring).toHaveAttribute('stroke-dasharray', '75 100');
    await expect(ring).toHaveAttribute('stroke-dashoffset', '-25');
    expect(await paintedQuadrants(page)).toEqual([false, true, true, true]);
    await expect(page.locator('#timer')).toHaveText('3 s');
    await page.screenshot({ path: info.outputPath('clockwise-quarter.png') });
    await page.clock.runFor(1000);
    expect(await paintedQuadrants(page)).toEqual([false, false, true, true]);
    await verifyDetachedFlip(page);
    await expect(ring).toHaveAttribute('stroke-dasharray', '50 100');
    expect((await saved(page)).game.stage.round.deadline).toBe(deadline);
    await page.clock.runFor(1900);
    await phase(page, 'question');
    await expect(ring).toHaveAttribute('stroke-dasharray', '2.5 100');
    await page.clock.runFor(100);
    await phase(page, 'opponent');
    await expect(
      page.locator('.tile-countdown, #timer, .question-tile'),
    ).toHaveCount(0);
    await page.clock.runFor(60000);
    await phase(page, 'opponent');
    await page.locator('#give-up').click();
    await page.locator('#cell-1').click();
    await phase(page, 'duel-preview');
    await expect(page.locator('.tile-countdown, .question-tile')).toHaveCount(
      0,
    );
  });

  test(`${theme}: player B uses its default color and theme changes never replace a custom draft`, async ({
    page,
  }) => {
    await start(page, { theme, starter: 'B', seconds: 1 });
    await page.locator('#cell-1').click();
    await expect(
      page.locator('.tile-countdown circle:last-child'),
    ).toHaveAttribute('stroke', '#FBA123');
    await page.clock.runFor(1000);
    await expect(page.locator('.tile-countdown')).toHaveCount(0);
    await exit(page);
    await page.locator('#new-game').click();
    await page.locator('#colorB').fill('#ab12cd');
    await page.locator('#theme').click();
    await expect(page.locator('#colorB')).toHaveValue('#ab12cd');
  });
}

for (const [theme, language, player, color, viewport] of [
  ['light', 'cs', 'A', '#ffffff', { width: 1366, height: 768 }],
  ['dark', 'en', 'B', '#000000', { width: 1024, height: 768 }],
  ['light', 'en', 'B', '#a13de0', { width: 768, height: 1024 }],
  ['dark', 'cs', 'A', '#22d3ee', { width: 1280, height: 720 }],
]) {
  test(`${theme} ${language} ${player}: custom color, recovery and enlarged edge tiles fit ${viewport.width}x${viewport.height}`, async ({
    page,
  }, info) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await start(page, {
      theme,
      language,
      starter: player,
      answers: 'automatic',
    });
    await exit(page);
    await page.locator('#new-game').click();
    await expect(page.locator('#colorA')).toHaveValue('#129fb5');
    await expect(page.locator('#colorB')).toHaveValue('#fba123');
    await page.locator(`#color${player}`).fill(color);
    await page.locator('#next-setup').click();
    await page.locator('#mode-letters').click();
    await page.locator('#start').click();
    await page.locator('#cell-28').focus();
    await page.keyboard.press('Enter');
    await phase(page, 'question');
    await expect(page.locator('#phase-heading')).toBeFocused();
    const deadline = (await saved(page)).game.stage.round.deadline;
    await expect(
      page.locator('.tile-countdown circle:last-child'),
    ).toHaveAttribute('stroke', color);
    await verifyEnlargedFit(page);
    await page.clock.runFor(12000);
    await page.reload();
    await phase(page, 'question');
    await expect(page.locator('.flipping')).toHaveCount(0);
    await expect(page.locator('.tile-countdown')).toHaveAttribute(
      'stroke-dasharray',
      '60 100',
    );
    await expect(
      page.locator('.tile-countdown circle:last-child'),
    ).toHaveAttribute('stroke', color);
    expect((await saved(page)).game.stage.round.deadline).toBe(deadline);
    await expect(page.locator('#timer')).toHaveAttribute('aria-live', 'off');
    await expect(page.locator('.tile-countdown')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await page.screenshot({
      path: info.outputPath('custom-recovered-fit.png'),
    });
    await page.clock.runFor(18000);
    await phase(page, 'opponent');
    await expect(page.locator('.tile-countdown')).toHaveCount(0);
  });
}

test('import preserves saved colors and elapsed progress; host judgment and disposal detach stale presentation', async ({
  page,
}) => {
  await start(page, { starter: 'B' });
  await page.locator('#cell-1').click();
  await page.clock.runFor(7500);
  const data = await saved(page);
  data.settings.players.B.color = '#d97706';
  await exit(page);
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles({
    name: 'custom-game.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await page.locator('#import-play').click();
  await phase(page, 'question');
  await expect(page.locator('.tile-countdown')).toHaveAttribute(
    'stroke-dasharray',
    '75 100',
  );
  await expect(
    page.locator('.tile-countdown circle:last-child'),
  ).toHaveAttribute('stroke', '#d97706');
  await expect(page.locator('.flipping')).toHaveCount(0);
  await page.locator('#judge-correct').click();
  await expect(page.locator('.tile-countdown, .question-tile')).toHaveCount(0);
  await page.locator('#cell-2').click();
  await expect(page.locator('.tile-countdown')).toHaveAttribute(
    'stroke-dasharray',
    '100 100',
  );
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await page.clock.runFor(60000);
  await expect(page.locator('#app')).toBeEmpty();
});
