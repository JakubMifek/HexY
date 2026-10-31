import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { createGame } from '../src/domain/game.js';
import { boardPack, config, savedGame } from '../tests/fixtures.js';
import { phase } from './helpers.js';
import { verifyFit } from './guided-fit.js';

const published = JSON.parse(
  readFileSync(
    new URL('../src/content/sports-en-hard-01.json', import.meta.url),
    'utf8',
  ),
).questions.find((question) => question.id === 'sports-en-hard-01-04');

async function prepare(page, scenario) {
  const { width, height, answers, names, cell, wording } = scenario;
  const pack = boardPack('numbers', 'en');
  for (const [index, question] of pack.questions.entries())
    question.text += ` ${index + 1}`;
  pack.questions[cell - 1] = { ...published };
  if (wording === 'boundary') pack.questions[cell - 1].text = 'W'.repeat(240);
  const data = JSON.parse(
    savedGame(createGame(pack, config(answers), 1000, 'ordinary-offer')),
  );
  data.settings.players.A.name = names === 'long' ? 'W'.repeat(30) : 'Ada';
  data.settings.players.B.name = names === 'long' ? 'M'.repeat(30) : 'Boris';
  await page.setViewportSize({ width, height });
  await page.clock.install({ time: new Date('2026-10-29T12:00:00Z') });
  await page.goto('/');
  await page.clock.pauseAt(new Date('2026-10-29T12:01:00Z'));
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles({
    name: 'ordinary-offer.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  if (answers === 'hosted') await page.locator('#import-play').click();
  await phase(page, 'selecting');
  return pack.questions[cell - 1].text;
}

async function frame(page, selector = '.selected-tile .tile-face', time = 480) {
  return page.locator(selector).evaluate(async (face, position) => {
    const animations = face.getAnimations({ subtree: true });
    for (const animation of animations) animation.pause();
    await Promise.all(animations.map((animation) => animation.ready));
    for (const animation of animations) animation.currentTime = position;
    return face.querySelector('.hex-base').getBoundingClientRect().toJSON();
  }, time);
}

async function finish(page, answers, cell) {
  const origin = await frame(page);
  if (answers === 'hosted') await page.locator('#judge-correct').click();
  else {
    await page.locator('#answer').fill(published.answer);
    await page.locator('#submit-answer').click();
  }
  await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
    'data-owner',
    'B',
  );
  const frames = [];
  for (const time of [0, 280, 560, 600])
    frames.push(await frame(page, `#cell-${cell} .tile-face`, time));
  for (const property of ['x', 'y', 'width', 'height'])
    expect(frames[0][property]).toBeCloseTo(origin[property], 1);
  expect(frames[0].height).toBeGreaterThan(frames[2].height * 1.1);
  expect(frames[1].height).toBeLessThan(frames[0].height);
  expect(frames[1].height).toBeGreaterThan(frames[2].height);
  expect(frames[2]).toEqual(frames[3]);
  await test.info().attach('return.json', {
    body: JSON.stringify({ origin, frames }),
    contentType: 'application/json',
  });
}

async function measure(page, text, stage) {
  await phase(page, stage);
  await expect(page.locator('.long-question')).toHaveCount(0);
  await expect(page.locator('.question-text')).toHaveText(text);
  await verifyFit(page);
  const result = await page.evaluate(() => {
    const box = (selector) =>
      document.querySelector(selector).getBoundingClientRect();
    const tile = box('.selected-tile .hex-base');
    const initial = document.querySelector('.revealed-initial');
    const label = initial.getBoundingClientRect();
    const hit = document.elementFromPoint(
      label.x + label.width / 2,
      label.y + label.height / 2,
    );
    const controls = [
      ...document.querySelectorAll('.question-panel button,.host button'),
    ];
    return {
      tile: tile.toJSON(),
      board: box('.board').toJSON(),
      panel: box('.question-panel').toJSON(),
      players: box('.player-bar').toJSON(),
      host: document.querySelector('.host')?.getBoundingClientRect().toJSON(),
      font: parseFloat(
        getComputedStyle(document.querySelector('.question-text')).fontSize,
      ),
      initialVisible: initial.closest('.selected-tile').contains(hit),
      controlHeights: controls.map(
        (node) => node.getBoundingClientRect().height,
      ),
    };
  });
  await test.info().attach(`${stage}.json`, {
    body: JSON.stringify(result),
    contentType: 'application/json',
  });
  expect(result.panel.y).toBeGreaterThanOrEqual(result.tile.bottom);
  expect(result.panel.y).toBeGreaterThanOrEqual(result.board.bottom);
  expect(result.tile.y).toBeGreaterThanOrEqual(result.players.bottom);
  expect(result.initialVisible).toBe(true);
  if (result.host)
    expect(result.panel.y).toBeGreaterThanOrEqual(result.host.bottom);
  expect(result.font).toBeGreaterThanOrEqual(20);
  for (const height of result.controlHeights)
    expect(height).toBeGreaterThanOrEqual(44);
  return result;
}

const scenarios = [
  [1280, 720],
  [1366, 768],
  [1920, 1080],
  [1024, 768],
  [768, 1024],
].flatMap(([width, height]) =>
  ['hosted', 'automatic'].flatMap((answers) =>
    [22, 28].flatMap((cell) =>
      [
        { names: 'short', wording: 'published' },
        { names: 'long', wording: 'published' },
        { names: 'long', wording: 'boundary' },
      ].map((variant) => ({ width, height, answers, cell, ...variant })),
    ),
  ),
);

for (const scenario of scenarios) {
  const { width, height, answers, cell, names, wording } = scenario;
  test(`${width}x${height} ${answers} cell ${cell} ${names} names ${wording}: ordinary stages reserve the visible initial`, async ({
    page,
  }, info) => {
    expect(published.text.length).toBe(189);
    const text = await prepare(page, scenario);
    await page.locator(`#cell-${cell}`).click();
    await frame(page);
    await measure(page, text, 'question');
    if (width === 1024 && cell === 22)
      await page.screenshot({ path: info.outputPath('ordinary-question.png') });
    await page.locator('#give-up').click();
    await measure(page, text, 'opponent-offer');
    await page.screenshot({ path: info.outputPath('ordinary-offer.png') });
    await page.locator('#accept-opponent').click();
    await measure(page, text, 'opponent');
    if (width === 1024 && cell === 22)
      await page.screenshot({ path: info.outputPath('ordinary-opponent.png') });
    await expect(
      page.locator('.tile-countdown circle:last-child'),
    ).toHaveAttribute('stroke', '#FBA123');
    await finish(page, answers, cell);
  });
}
