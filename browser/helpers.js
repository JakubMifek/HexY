import { expect } from '@playwright/test';

/** @param {import('@playwright/test').Page} page
 * @param {{language?: 'cs'|'en', mode?: 'letters'|'numbers', answers?: 'hosted'|'automatic', theme?: string, seconds?: number, random?: number, starter?: string}} [options] */
export async function start(page, options = {}) {
  const {
    language = 'en',
    mode = 'letters',
    answers = 'hosted',
    theme = 'light',
    seconds = 30,
    random = 0,
    starter = 'A',
  } = options;
  await page.clock.install({ time: new Date('2026-10-28T12:00:00Z') });
  await page.addInitScript((sample) => {
    Math.random = () => sample;
  }, random);
  await page.goto('/');
  await page.clock.pauseAt(new Date('2026-10-28T12:01:00Z'));
  await page.locator('#ui-language').selectOption(language);
  await page.locator('#language').selectOption(language);
  await page.locator('#theme').selectOption(theme);
  await page.locator('#mode').selectOption(mode);
  await page.locator('#answerMode').selectOption(answers);
  await page.locator('#seconds').fill(String(seconds));
  await page.locator('#starter').selectOption(starter);
  await page.locator('#nameA').fill('Ada');
  await page.locator('#nameB').fill('Boris');
  if (mode === 'numbers') {
    await page.locator('#prepare-board').click();
    await page.locator('#accept-board').click();
  }
  await page.locator('#start').click();
  await phase(page, 'selecting');
}

/** @param {import('@playwright/test').Page} page @param {string} value */
export async function phase(page, value) {
  await expect(page.locator('.game')).toHaveAttribute('data-phase', value);
}

/** @param {import('@playwright/test').Page} page @param {number} cell @param {string} owner */
export async function setCell(page, cell, owner) {
  await page.locator('#host-cell').selectOption(String(cell));
  await page.locator('#host-owner').selectOption(owner);
  await page.locator('#set-cell').click();
  await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
    'data-owner',
    owner,
  );
}

/** @param {import('@playwright/test').Page} page @param {string} answer */
export async function answer(page, answer) {
  await page.locator('#answer').fill(answer);
  await page.locator('#submit-answer').click();
}

/** @param {import('@playwright/test').Page} page @param {string} owner */
export async function chooser(page, owner) {
  await expect(page.locator('.player.active strong')).toHaveText(
    owner === 'A' ? 'A · Ada' : 'B · Boris',
  );
}

/** @param {import('@playwright/test').Page} page */
export async function blackDuel(page) {
  await page.locator('#cell-1').click();
  await page.locator('#give-up').click();
  await page.locator('#give-up').click();
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'black');
  await page.locator('#cell-1').click();
  await phase(page, 'duel-preview');
}
