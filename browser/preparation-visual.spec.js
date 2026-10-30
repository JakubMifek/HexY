import { expect, test } from '@playwright/test';
import { setupPreparation } from './preparation-helpers.js';
import { setTheme } from './helpers.js';

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
]) {
  for (const theme of ['light', 'dark']) {
    test(`preparation ${viewport.width}x${viewport.height} ${theme}: keyboard, touch targets, bilingual editor`, async ({
      page,
    }, info) => {
      await page.setViewportSize(viewport);
      await setupPreparation(page, viewport.width < 1280 ? 'cs' : 'en');
      await setTheme(page, theme);
      await page.locator('.preparation').scrollIntoViewIfNeeded();
      await page.screenshot({
        path: info.outputPath('preparation.png'),
        fullPage: true,
      });
      await page.locator('#edit-proposal').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#pack-title')).toBeVisible();
      await page
        .locator('#question-text')
        .fill('Žluťoučká otázka s dlouhým zněním a diakritikou. '.repeat(8));
      await page.locator('#question-aliases').focus();
      await page.keyboard.type('Keyboard alias');
      await expect(page.locator('#question-aliases')).toHaveValue(
        /Keyboard alias/,
      );
      await expect(page.locator('#question-aliases')).toBeFocused();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(viewport.width);
      for (const selector of [
        '#pack-title',
        '#question-aliases',
        '#save-pack',
        '#edit-position',
      ]) {
        expect(
          (await page.locator(selector).boundingBox())?.height,
        ).toBeGreaterThanOrEqual(44);
      }
      await page.screenshot({ path: info.outputPath('editor-viewport.png') });
      await page.screenshot({
        path: info.outputPath('editor-full.png'),
        fullPage: true,
      });
      await page.locator('#cancel-edit').click();
      await expect(page.locator('#answer-sheet')).toHaveCount(0);
      await page.locator('#accept-board').click();
      await expect(page.locator('#start')).toBeEnabled();
    });
  }
}
