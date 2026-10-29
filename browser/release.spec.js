import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { phase, start } from './helpers.js';

test('production document carries original-code, content and bundled-helper notices', async ({
  request,
}) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain(readFileSync('LICENSE', 'utf8').trim());
  expect(html).toContain('VoidZero Inc. and Vite contributors');
  expect(html).toContain('https://creativecommons.org/licenses/by/4.0/');
  expect(html).toContain('https://github.com/JakubMifek/HexY');
});

for (const language of /** @type {const} */ (['cs', 'en'])) {
  for (const theme of ['light', 'dark']) {
    test(`release ${language}/${theme}: keyboard, accessible answer privacy and same-origin assets`, async ({
      page,
    }, info) => {
      const failures = [];
      const requests = [];
      page.on('pageerror', (error) => failures.push(error.message));
      page.on('requestfailed', (request) => failures.push(request.url()));
      page.on('request', (request) => requests.push(request.url()));
      await start(page, { language, theme, answers: 'automatic', seconds: 3 });
      await page.locator('#cell-1').focus();
      await page.keyboard.press('Space');
      await phase(page, 'question');
      await expect(page.locator('#phase-heading')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator('#answer')).toBeFocused();
      await expect(page.locator('#timer')).toHaveAttribute('aria-live', 'off');
      const answer = language === 'cs' ? 'Amazonka' : 'Athens';
      expect(await page.locator('body').ariaSnapshot()).not.toContain(answer);
      await page.keyboard.type('wrong');
      await page.keyboard.press('Enter');
      await phase(page, 'question');
      await page.clock.runFor(3000);
      await phase(page, 'opponent');
      expect(await page.locator('body').ariaSnapshot()).not.toContain(answer);
      await page.screenshot({
        path: info.outputPath('opponent-accessible.png'),
      });
      await info.attach('opponent-accessibility', {
        body: await page.locator('body').ariaSnapshot(),
        contentType: 'text/plain',
      });
      await page.locator('#answer').fill(answer);
      await page.keyboard.press('Enter');
      await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'B');
      await page.reload();
      await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'B');
      expect(failures).toEqual([]);
      expect(requests.some((url) => /\/assets\/.+\.js$/.test(url))).toBe(true);
      expect(
        requests.every(
          (url) => new URL(url).origin === new URL(page.url()).origin,
        ),
      ).toBe(true);
    });
  }
}
