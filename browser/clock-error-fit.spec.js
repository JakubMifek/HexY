import { expect, test } from '@playwright/test';
import { createGame } from '../src/domain/game.js';
import { boardPack, config, savedGame } from '../tests/fixtures.js';
import { verifyFit } from './guided-fit.js';
import { phase, setTheme } from './helpers.js';

/** @param {import('@playwright/test').Page} page @param {string} language
 * @param {string} mode @param {string} theme @param {boolean} maximum */
async function prepare(page, language, mode, theme, maximum) {
  const pack = boardPack('numbers', language);
  for (const [index, question] of pack.questions.entries())
    question.text += ` ${index + 1}`;
  pack.questions[0].text = maximum
    ? 'W'.repeat(600)
    : language === 'cs'
      ? 'Kterým písmenem začíná slovo Alfa?'
      : 'Which letter begins the word Alpha?';
  const data = JSON.parse(
    savedGame(createGame(pack, config(mode), 1000, 'clock-fit')),
  );
  data.settings.players.A.name = 'W'.repeat(30);
  data.settings.players.B.name = 'M'.repeat(30);
  await page.clock.install({ time: new Date('2026-10-29T12:00:00Z') });
  await page.goto('/');
  await page.clock.pauseAt(new Date('2026-10-29T12:01:00Z'));
  await setTheme(page, theme);
  await page.locator('#open-import').click();
  await page.locator('#import-game').setInputFiles({
    name: 'clock-fit.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  if (mode === 'hosted') await page.locator('#import-play').click();
  await phase(page, 'selecting');
  await page.locator('#cell-1').click();
}

/** @param {import('@playwright/test').Page} page */
async function errorFit(page) {
  await verifyFit(page);
  const errors = await page.locator('#error').evaluate((node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    return [...range.getClientRects()]
      .filter((line) => {
        const hit = document.elementFromPoint(
          line.x + line.width / 2,
          line.y + line.height / 2,
        );
        return (
          line.left < 0 ||
          line.top < 0 ||
          line.right > innerWidth ||
          line.bottom > innerHeight ||
          !node.contains(hit)
        );
      })
      .map((line) => line.toJSON());
  });
  expect(errors).toEqual([]);
}

const variants = ['cs', 'en'].flatMap((language) =>
  ['hosted', 'automatic'].flatMap((mode) =>
    ['light', 'dark'].flatMap((theme) =>
      [false, true].map((maximum) => ({ language, mode, theme, maximum })),
    ),
  ),
);
for (const [width, height] of [
  [1280, 720],
  [1366, 768],
  [1920, 1080],
  [1024, 768],
  [768, 1024],
]) {
  for (const { language, mode, theme, maximum } of variants) {
    test(`clock error ${width}x${height} ${language} ${mode} ${theme} ${maximum ? 'maximum' : 'ordinary'}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height });
      await prepare(page, language, mode, theme, maximum);
      const before = await page.evaluate(() =>
        localStorage.getItem('hexy.game.v1'),
      );
      const now = await page.evaluate(() => Date.now());
      await page.clock.setSystemTime(now - 1000);
      await page.locator('#give-up').click();
      await expect(page.locator('#error')).toContainText(
        language === 'cs' ? 'Hodiny' : 'clock',
      );
      expect(
        await page.evaluate(() => localStorage.getItem('hexy.game.v1')),
      ).toBe(before);
      await errorFit(page);
      await page.screenshot({ path: info.outputPath('clock-error.png') });
      await page.clock.setSystemTime(now + 1000);
      await page.locator('#give-up').click();
      await phase(page, 'opponent');
      await expect(page.locator('#error')).toBeEmpty();
      const restored = await page.evaluate(
        () => JSON.parse(localStorage.getItem('hexy.game.v1')).game,
      );
      expect(restored.stage.round.deadline).toBe(
        JSON.parse(before).game.stage.round.deadline,
      );
      await verifyFit(page);
    });
  }
}
