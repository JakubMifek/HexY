import { expect, test } from '@playwright/test';
import { createGame } from '../src/domain/game.js';
import { boardPack, config, savedGame } from '../tests/fixtures.js';
import { phase } from './helpers.js';
import { verifyFit } from './guided-fit.js';

for (const [width, height, language] of [
  [1024, 768, 'en'],
  [768, 1024, 'cs'],
]) {
  test(`maximum offer preserves whole role and host text ${width}x${height} ${language}`, async ({
    page,
  }, info) => {
    const pack = boardPack('numbers', language);
    for (const [index, question] of pack.questions.entries())
      question.text += ` ${index + 1}`;
    pack.questions[0].text = 'W'.repeat(600);
    const data = JSON.parse(
      savedGame(createGame(pack, config('hosted'), 1000, 'offer-layout')),
    );
    data.settings.players.A.name = 'W'.repeat(30);
    data.settings.players.B.name = 'M'.repeat(30);
    await page.setViewportSize({ width, height });
    await page.clock.install({ time: new Date('2026-10-29T12:00:00Z') });
    await page.goto('/');
    await page.clock.pauseAt(new Date('2026-10-29T12:01:00Z'));
    await page.locator('#open-import').click();
    await page.locator('#import-game').setInputFiles({
      name: 'offer-layout.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(data)),
    });
    await page.locator('#import-play').click();
    await page.locator('#cell-1').click();
    await page.locator('#give-up').click();
    await phase(page, 'opponent-offer');
    await verifyFit(page);
    await expect(page.locator('.question-text')).toHaveText('W'.repeat(600));
    const role = await page
      .locator('.player.active .player-role')
      .boundingBox();
    const panel = await page.locator('.question-panel').boundingBox();
    expect(role).not.toBeNull();
    expect(panel).not.toBeNull();
    expect(panel.y).toBeGreaterThanOrEqual(role.y + role.height);
    for (const control of ['#accept-opponent', '#decline-opponent']) {
      const box = await page.locator(control).boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    const covered = await page.locator('.host').evaluate((host) => {
      const box = host.getBoundingClientRect();
      return [...document.querySelectorAll('.question-panel h2,.question-text')]
        .flatMap((node) => {
          const range = document.createRange();
          range.selectNodeContents(node);
          return [...range.getClientRects()];
        })
        .filter(
          (line) =>
            line.left < box.right &&
            line.right > box.left &&
            line.top < box.bottom &&
            line.bottom > box.top,
        )
        .map((line) => line.toJSON());
    });
    expect(covered).toEqual([]);
    await page.screenshot({ path: info.outputPath('maximum-offer.png') });
  });
}
