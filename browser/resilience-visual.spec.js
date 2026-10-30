import { test, expect } from '@playwright/test';
import { start, blackDuel, phase } from './helpers.js';

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
]) {
  for (const language of /** @type {const} */ (['en', 'cs'])) {
    for (const theme of ['light', 'dark']) {
      test(`${viewport.width}x${viewport.height} ${language} ${theme} touch, focus, recovery and controls`, async ({
        browser,
      }, info) => {
        const context = await browser.newContext({
          viewport,
          hasTouch: true,
          baseURL: 'http://127.0.0.1:4182',
        });
        const page = await context.newPage();
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await start(page, { language, theme });
        await blackDuel(page);
        for (const player of ['A', 'B']) {
          const box = await page.locator(`#buzzer-${player}`).boundingBox();
          expect(box?.width).toBeGreaterThanOrEqual(44);
          expect(box?.height).toBeGreaterThanOrEqual(44);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(viewport.width);
        await page.screenshot({ path: info.outputPath('duel-viewport.png') });
        await page.screenshot({
          path: info.outputPath('duel-full.png'),
          fullPage: true,
        });
        await page.clock.runFor(2000);
        await page.locator('#buzzer-B').tap();
        await page.clock.runFor(8);
        await phase(page, 'selecting');
        await expect(page.locator('#cell-1')).toHaveAttribute(
          'data-owner',
          'B',
        );
        await page.reload();
        await phase(page, 'selecting');
        await expect(page.locator('#input-controls')).toHaveCount(0);
        await page.locator('#exit-game').click();
        await page.locator('#discard-new').click();
        await page.locator('#options').click();
        await page.locator('#input-controls').click();
        await expect(page.locator('dialog')).toBeVisible();
        const dialog = await page.locator('dialog').boundingBox();
        expect(dialog?.width).toBeLessThanOrEqual(viewport.width);
        await page.screenshot({ path: info.outputPath('input-controls.png') });
        await page.locator('#close-inputs').click();
        await expect(page.locator('#input-controls')).toBeFocused();
        await context.close();
      });
    }
  }
}
