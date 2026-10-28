import { expect, test } from '@playwright/test';
import { setCell, start } from './helpers.js';

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
]) {
  for (const theme of ['light', 'dark']) {
    test(`${viewport.width}x${viewport.height} ${theme}: readable board, long question and ownership`, async ({
      page,
    }, info) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await start(page, { language: 'cs', theme, answers: 'automatic' });
      await expect(page.locator('.board [role="button"]')).toHaveCount(28);
      const box = await page.locator('#cell-28').boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      await page.locator('#cell-7').click();
      const board = await page.locator('.board').boundingBox();
      const panel = await page.locator('.question-panel').boundingBox();
      if (!board || !panel) throw new Error('Missing layout');
      expect(panel.y).toBeGreaterThanOrEqual(board.y + board.height);
      await expect(page.locator('.question-text')).toContainText(
        'organických látek',
      );
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width);
      const snapshot = await page.locator('body').ariaSnapshot();
      expect(snapshot).not.toContain('Fotosyntéza');
      await page.screenshot({
        path: info.outputPath('question-full.png'),
        fullPage: true,
      });
      await page.screenshot({ path: info.outputPath('question-viewport.png') });
      await page.locator('#answer').fill('fotosynteza');
      await page.locator('#submit-answer').click();
      await expect(page.locator('#cell-7 .owner-mark')).toHaveText('A');
      await page.locator('.board').scrollIntoViewIfNeeded();
      await page.screenshot({
        path: info.outputPath('board-captured.png'),
        fullPage: true,
      });
    });
  }
}

test('browser page lifecycle disposes active timers and pending keyboard edges', async ({
  page,
}) => {
  await start(page);
  await page.locator('#cell-1').click();
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await page.clock.runFor(60_000);
  await page.keyboard.press('ShiftLeft');
  await page.clock.runFor(8);
  await expect(page.locator('#app')).toBeEmpty();
});

test('English hosted numbers keep custom white ownership and black fields distinguishable', async ({
  page,
}, info) => {
  await start(page, { mode: 'numbers', theme: 'dark' });
  await page.locator('#new-game').click();
  await page.locator('#discard-new').click();
  await page.locator('#colorA').fill('#ffffff');
  await page.locator('#colorB').fill('#ffffff');
  await page.screenshot({
    path: info.outputPath('setup-english-dark.png'),
    fullPage: true,
  });
  await page.locator('#start').click();
  await setCell(page, 1, 'A');
  await setCell(page, 2, 'B');
  await setCell(page, 3, 'black');
  await expect(page.locator('#cell-1 .owner-mark')).toHaveText('A');
  await expect(page.locator('#cell-2 .owner-mark')).toHaveText('B');
  await expect(page.locator('#cell-1 .hex-base')).toHaveAttribute(
    'fill',
    '#ffffff',
  );
  await expect(page.locator('#cell-2 .hex-base')).toHaveAttribute(
    'fill',
    '#ffffff',
  );
  await expect(page.locator('#cell-3')).toHaveAccessibleName(/3.*Black/);
  await page.locator('.board').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: info.outputPath('custom-colors-numbers.png'),
    fullPage: true,
  });
  await page.locator('#cell-3').click();
  await expect(page.locator('#set-cell')).toHaveCount(0);
  await page.screenshot({
    path: info.outputPath('duel-preview.png'),
    fullPage: true,
  });
});
