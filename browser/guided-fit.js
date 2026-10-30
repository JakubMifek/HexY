import { expect } from '@playwright/test';
import { phase } from './helpers.js';

/** @param {import('@playwright/test').Page} page @param {string} answers
 * @param {import('@playwright/test').TestInfo} info */
export async function verifyRecoveryFit(page, answers, info) {
  await page.evaluate(() => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === 'hexy.game.v1')
        throw new DOMException('full', 'QuotaExceededError');
      write.call(this, name, value);
    };
  });
  if (answers === 'hosted') await page.locator('#judge-wrong').click();
  else {
    await page.locator('#answer').fill('not correct');
    await page.locator('#submit-answer').click();
  }
  await phase(page, 'question');
  await expect(page.locator('#open-recovery')).toBeVisible();
  await verifyFit(page);
  await page.locator('#open-recovery').click();
  await expect(page.locator('#recovery-error')).not.toBeEmpty();
  const fit = await page.locator('.recovery-dialog').evaluate((dialog) => {
    const rect = dialog.getBoundingClientRect();
    const visible = [...dialog.querySelectorAll('button,p,h2')].every(
      (node) => {
        const box = node.getBoundingClientRect();
        const hit = document.elementFromPoint(
          box.x + box.width / 2,
          box.y + box.height / 2,
        );
        return (
          box.top >= 0 &&
          box.bottom <= innerHeight &&
          box.left >= 0 &&
          box.right <= innerWidth &&
          node.contains(hit)
        );
      },
    );
    return (
      rect.top >= 0 &&
      rect.bottom <= innerHeight &&
      visible &&
      dialog.scrollHeight <= dialog.clientHeight &&
      dialog.scrollWidth <= dialog.clientWidth
    );
  });
  expect(fit).toBe(true);
  await page.screenshot({ path: info.outputPath('maximum-recovery.png') });
  await page.locator('#close-recovery').click();
  await verifyFit(page);
}

/** @param {import('@playwright/test').Page} page */
export async function exit(page) {
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await expect(page.locator('#new-game')).toBeVisible();
}

/** @param {import('@playwright/test').Page} page */
export async function verifyFit(page) {
  const measured = await page.evaluate(() => {
    const boxes = [
      ...document.querySelectorAll('html,body,#app,main,.game,.panel,.player'),
    ];
    const overflow = boxes
      .filter(
        (node) =>
          node.scrollHeight > node.clientHeight + 1 ||
          node.scrollWidth > node.clientWidth + 1,
      )
      .map((node) => ({
        tag: node.id || node.className || node.tagName,
        width: [node.scrollWidth, node.clientWidth],
        height: [node.scrollHeight, node.clientHeight],
      }));
    const controls = [
      ...document.querySelectorAll(
        '.header button,.game button,.game input,.game select,.player strong,.player-role',
      ),
    ];
    const hidden = controls
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        const hit = document.elementFromPoint(
          rect.x + rect.width / 2,
          rect.y + rect.height / 2,
        );
        return (
          rect.x < 0 ||
          rect.y < 0 ||
          rect.right > innerWidth ||
          rect.bottom > innerHeight ||
          !node.contains(hit)
        );
      })
      .map((node) => node.id);
    return { overflow, hidden };
  });
  const text = await questionFit(page);
  expect(measured.overflow).toEqual([]);
  expect(measured.hidden).toEqual([]);
  expect(text.clipped).toBe(false);
  return { ...measured, ...text };
}

/** @param {import('@playwright/test').Page} page */
async function questionFit(page) {
  return page.evaluate(() => {
    const range = document.createRange();
    const question = document.querySelector('.question-text');
    if (question) range.selectNodeContents(question);
    const lines = question ? [...range.getClientRects()] : [];
    const host = [...document.querySelectorAll('.host button')].map((node) =>
      node.getBoundingClientRect(),
    );
    const clipped = lines.some(
      (line) =>
        line.x < 0 ||
        line.y < 0 ||
        line.right > innerWidth ||
        line.bottom > innerHeight ||
        host.some(
          (box) =>
            line.left < box.right &&
            line.right > box.left &&
            line.top < box.bottom &&
            line.bottom > box.top,
        ),
    );
    return {
      clipped,
      lines: lines.map((line) => line.toJSON()),
    };
  });
}
