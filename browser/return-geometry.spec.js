import { expect, test } from '@playwright/test';
import { createGame } from '../src/domain/game.js';
import { boardPack, config, savedGame } from '../tests/fixtures.js';
import { phase, setCell, start } from './helpers.js';
import { verifyFit } from './guided-fit.js';

/** @param {import('@playwright/test').Page} page @param {string} selector @param {number} time */
async function frame(page, selector, time) {
  return page.locator(selector).evaluate(async (face, position) => {
    const animations = face.getAnimations({ subtree: true });
    for (const animation of animations) animation.pause();
    await Promise.all(animations.map((animation) => animation.ready));
    for (const animation of animations) animation.currentTime = position;
    const polygon = face.querySelector('.hex-base');
    const box = polygon.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height };
  }, time);
}

for (const time of [120, 240]) {
  test(`an immediate judgment preserves the in-flight selection footprint at ${time}ms`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await start(page, { mode: 'numbers' });
    await page.locator('#cell-28').click();
    const selected = await frame(page, '.selected-tile .tile-face', time);
    await page.locator('#judge-correct').click();
    const returning = await frame(page, '.returning', 0);
    for (const property of ['x', 'y', 'width', 'height'])
      expect(returning[property]).toBeCloseTo(selected[property], 1);
    const end = await frame(page, '.returning', 560);
    expect(returning.height).toBeGreaterThan(end.height);
  });
}

/** @param {import('@playwright/test').Page} page */
async function highlightedFit(page) {
  await verifyFit(page);
  const geometry = await page.evaluate(() => {
    const selected = document
      .querySelector('.selected-tile .hex-base')
      .getBoundingClientRect();
    const panel = document
      .querySelector('.question-panel')
      .getBoundingClientRect();
    const players = document
      .querySelector('.player-bar')
      .getBoundingClientRect();
    const board = document.querySelector('.board').getBoundingClientRect();
    return {
      long: document.querySelector('.long-question') !== null,
      selected: selected.toJSON(),
      panel: panel.toJSON(),
      players: players.toJSON(),
      board: board.toJSON(),
      font: parseFloat(
        getComputedStyle(document.querySelector('.question-text')).fontSize,
      ),
    };
  });
  expect(geometry.selected.y).toBeGreaterThanOrEqual(geometry.players.bottom);
  if (!geometry.long) {
    expect(geometry.selected.bottom).toBeLessThanOrEqual(geometry.panel.y);
    expect(geometry.board.bottom).toBeLessThanOrEqual(geometry.panel.y);
  }
  expect(geometry.font).toBeGreaterThanOrEqual(18);
  return geometry;
}

/** @param {import('@playwright/test').Page} page @param {string} outcome */
async function resolve(page, outcome) {
  if (outcome !== 'award') {
    await page.locator('#give-up').click();
    await phase(page, 'opponent-offer');
    await highlightedFit(page);
  }
  if (outcome === 'opponent') {
    await page.locator('#accept-opponent').click();
    await phase(page, 'opponent');
    await highlightedFit(page);
    await expect(page.locator('.tile-countdown')).toHaveCount(1);
  }
  const origin = await frame(page, '.selected-tile .tile-face', 480);
  if (outcome === 'black') await page.locator('#decline-opponent').click();
  else await page.locator('#judge-correct').click();
  return origin;
}

async function prepare(page, { width, height, mode, cell, maximum }) {
  const pack = boardPack(mode, maximum ? 'cs' : 'en');
  for (const [index, question] of pack.questions.entries())
    question.text += ` ${index + 1}`;
  if (maximum) pack.questions[cell - 1].text = 'W'.repeat(600);
  const data = JSON.parse(
    savedGame(createGame(pack, config('hosted'), 1000, 'return-geometry')),
  );
  if (maximum) {
    data.settings.players.A.name = 'W'.repeat(30);
    data.settings.players.B.name = 'M'.repeat(30);
  }
  await page.setViewportSize({ width, height });
  await page.clock.install({ time: new Date('2026-10-29T12:00:00Z') });
  await page.goto('/');
  await page.clock.pauseAt(new Date('2026-10-29T12:01:00Z'));
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles({
    name: 'return-geometry.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await page.locator('#import-play').click();
  await phase(page, 'selecting');
  return data;
}

async function verifyReturn(page, cell, selected, screenshot) {
  const frames = [];
  for (const time of [0, 140, 280, 420, 559, 560]) {
    frames.push(await frame(page, `#cell-${cell} .tile-face`, time));
    if (screenshot)
      await page.screenshot({
        path: test.info().outputPath(`return-${time}.png`),
      });
  }
  for (const property of ['x', 'y', 'width', 'height'])
    expect(frames[0][property]).toBeCloseTo(selected[property], 1);
  expect(frames[0].height).toBeGreaterThan(frames[5].height * 1.1);
  for (let index = 1; index < frames.length; index++)
    expect(frames[index].height).toBeLessThanOrEqual(frames[index - 1].height);
  expect(frames[2].height).toBeLessThan(frames[0].height);
  expect(frames[2].height).toBeGreaterThan(frames[5].height);
  expect(await frame(page, `#cell-${cell} .tile-face`, 600)).toEqual(frames[5]);
  return frames;
}

async function verifyOutcome(page, scenario, data, outcome) {
  const { cell, width } = scenario;
  const screenshot = width === 1280 && cell === 28 && outcome === 'award';
  await page.locator(`#cell-${cell}`).click();
  await expect(page.locator('#phase-heading')).toBeFocused();
  const selected = await frame(page, '.selected-tile .tile-face', 480);
  const layout = await highlightedFit(page);
  if (screenshot)
    await page.screenshot({ path: test.info().outputPath('selected.png') });
  const before = await page.evaluate(
    () => JSON.parse(localStorage.getItem('hexy.game.v1')).game,
  );
  await expect(
    page.locator('.tile-countdown circle:last-child'),
  ).toHaveAttribute('stroke', data.settings.players[before.chooser].color);
  await page.clock.runFor(1000);
  const timed = await page.evaluate(
    () => JSON.parse(localStorage.getItem('hexy.game.v1')).game,
  );
  expect(timed.stage.round.deadline).toBe(before.stage.round.deadline);
  const origin = await resolve(page, outcome);
  const opponent = before.chooser === 'A' ? 'B' : 'A';
  const owner = { black: 'black', award: before.chooser, opponent }[outcome];
  await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
    'data-owner',
    owner,
  );
  const frames = await verifyReturn(page, cell, origin, screenshot);
  const back = page.locator('.return-back');
  await expect(back.locator('.hex-base')).toHaveAttribute(
    'fill',
    owner === 'black'
      ? 'var(--cell-black)'
      : data.settings.players[owner].color,
  );
  await expect(back.locator('text')).toHaveCount(owner === 'black' ? 1 : 0);
  if (outcome === 'award')
    await page.screenshot({ path: test.info().outputPath('resolved.png') });
  await setCell(page, cell, 'unclaimed');
  return { outcome, selected, origin, layout, frames };
}

const scenarios = [
  [1280, 720],
  [1366, 768],
  [1920, 1080],
  [1024, 768],
  [768, 1024],
].flatMap(([width, height]) =>
  ['numbers', 'letters'].flatMap((mode) =>
    [1, 28].flatMap((cell) =>
      [false, true].map((maximum) => ({ width, height, mode, cell, maximum })),
    ),
  ),
);
for (const scenario of scenarios) {
  const { width, height, mode, cell, maximum } = scenario;
  test(`${width}x${height} ${mode} cell ${cell} ${maximum ? 'maximum' : 'ordinary'} returns shrink in screen space`, async ({
    page,
  }, info) => {
    const data = await prepare(page, scenario);
    const measurements = [];
    for (const outcome of ['award', 'opponent', 'black'])
      measurements.push(await verifyOutcome(page, scenario, data, outcome));
    await info.attach('screen-space.json', {
      body: JSON.stringify(measurements),
      contentType: 'application/json',
    });
  });
}
