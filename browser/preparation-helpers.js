import { readFile } from 'node:fs/promises';
import { expect } from '@playwright/test';
import { verifyPrintedSheet } from './pdf-helpers.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';

/** @param {import('@playwright/test').Page} page
 * @param {'en'|'cs'} [language] @param {number} [seconds] */
export async function setupPreparation(page, language = 'en', seconds = 30) {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');
  await page.locator('#options').click();
  await page.locator('#language').selectOption(language);
  await page.locator('#starter').selectOption('A');
  await page.locator('#seconds').fill(String(seconds));
  await page.locator('#back-menu').click();
  await page.locator('#new-game').click();
  await page.locator('#next-setup').click();
  await page.locator('#mode-letters').click();
  await page.locator('#catalog-language').selectOption('');
}

/** @param {import('@playwright/test').Page} page @param {string} mode @param {string} answers */
export async function nextPreparation(page, mode, answers) {
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await page.locator('#new-game').click();
  await page.locator('#answerMode').selectOption(answers);
  await page.locator('#next-setup').click();
  await page.locator(`#mode-${mode}`).click();
}

/** @param {import('@playwright/test').Page} page @param {string} id @param {string} mode */
export async function acceptPack(page, id, mode) {
  await page.locator('#reset-catalog').click();
  await page.locator('#clear-sources').click();
  await page.locator(`#source-${id}`).check();
  await page
    .locator(mode === 'numbers' ? '#use-numbers' : '#prepare-board')
    .click();
  await page.locator('#accept-board').click();
}

/** @param {import('@playwright/test').Page} page @param {string} [mode] */
export async function enterPreparation(page, mode = 'letters') {
  await page.locator('#new-game').click();
  await page.locator('#next-setup').click();
  await page.locator(`#mode-${mode}`).click();
}

/** @param {'cs'|'en'} language */
export async function starter(language) {
  return JSON.parse(
    await readFile(`src/content/general-${language}-01.json`, 'utf8'),
  );
}

/** @param {import('@playwright/test').Page} page @param {object[]} packs */
export async function upload(page, packs) {
  await page.locator('#import-packs').setInputFiles(
    packs.map((pack, index) => ({
      name: `pack-${index}.json`,
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(pack)),
    })),
  );
  await expect(page.locator('#preparation-error')).toHaveText('');
}

/** @param {import('@playwright/test').Page} page @param {string[]} ids */
export async function selectSources(page, ids) {
  await page.locator('#catalog-language').selectOption('');
  const selected = await page
    .locator('.pack-sources input:checked')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('id')));
  for (const id of selected) await page.locator(`[id="${id}"]`).uncheck();
  for (const id of ids) await page.locator(`[id="source-${id}"]`).check();
}

/** @param {import('@playwright/test').Page} page @param {import('@playwright/test').TestInfo} info
 * @param {string} selector @param {string} name */
export async function download(page, info, selector, name) {
  const pending = page.waitForEvent('download');
  await page.locator(selector).click();
  const result = await pending;
  const path = info.outputPath(name);
  await result.saveAs(path);
  return { text: await readFile(path, 'utf8'), path };
}

/** @param {import('@playwright/test').Page} sheet @param {object} pack */
export async function verifySheet(sheet, pack) {
  const rows = await sheet
    .locator('tbody tr')
    .evaluateAll((rows) =>
      rows.map((row) =>
        Array.from(row.children).map((cell) => cell.textContent),
      ),
    );
  expect(rows).toEqual(
    pack.questions.map((q, i) => [
      String(i + 1),
      q.id,
      q.initial,
      q.text,
      q.answer,
      q.aliases.join('\n'),
    ]),
  );
  await expect(sheet.locator('button,input,select,script,link')).toHaveCount(0);
  await sheet.emulateMedia({ media: 'print' });
  await expect(sheet.locator('.screen-only')).toBeHidden();
  await expect(sheet.locator('tbody tr')).toHaveCount(28);
  const credits = new Set(
    pack.questions
      .flatMap((q) => q.origins ?? [])
      .flatMap((origin) => [origin.packId, ...origin.authors, origin.license]),
  );
  for (const credit of credits)
    await expect(sheet.locator('ul')).toContainText(credit);
  await verifySheetSources(sheet, pack);
}

/** @param {import('@playwright/test').Page} sheet @param {object} pack */
export async function verifySheetSources(sheet, pack) {
  const language = await sheet.locator('html').getAttribute('lang');
  const t = preparationStrings[language];
  await expect(sheet.locator('#source-appendix h2')).toHaveText(t.provenance);
  const sources = await sheet
    .locator('.source-entry')
    .evaluateAll((entries) =>
      entries.map((entry) => [
        entry.querySelector('h3').textContent,
        entry.querySelector('p').textContent,
      ]),
    );
  expect(sources).toEqual(
    pack.questions.map((q, index) => [
      `${t.number}: ${index + 1} · ${t.id}: ${q.id}`,
      q.sources.join('\n'),
    ]),
  );
  await expect(
    sheet.locator('#source-appendix a,img,iframe,object'),
  ).toHaveCount(0);
}

/** @param {import('@playwright/test').Page} page */
export async function editFixed(page) {
  await page.locator('#edit-proposal').click();
  await expect(page.locator('#answer-sheet')).toHaveCount(0);
  await page.locator('#pack-title').fill('Private <b>custom</b>');
  await page
    .locator('#question-text')
    .fill('<img src=x onerror=alert(1)> Host-authored question?');
  await page
    .locator('#question-aliases')
    .fill('Private alias\nAccepted alternative');
  await page
    .locator('#question-sources')
    .fill('Original host wording; fact checked separately');
  await expect(page.locator('#question-initial')).toBeDisabled();
  await page.locator('#save-pack').click();
  await page.locator('#accept-board').click();
}

/** @param {import('@playwright/test').BrowserContext} context
 * @param {import('@playwright/test').TestInfo} info @param {string} path @param {object} pack */
export async function inspectPrintedSheet(context, info, path, pack) {
  const sheet = await context.newPage();
  await sheet.goto(`file://${path}`);
  await verifySheet(sheet, pack);
  await sheet.screenshot({
    path: info.outputPath('answer-sheet-print.png'),
    fullPage: true,
  });
  await sheet.pdf({
    path: info.outputPath('answer-sheet.pdf'),
    landscape: true,
  });
  verifyPrintedSheet(
    info.outputPath('answer-sheet.pdf'),
    pack,
    await sheet.locator('html').getAttribute('lang'),
  );
  await sheet.close();
}

/** @param {import('@playwright/test').Page} page */
export async function importTwoBanks(page) {
  const first = await starter('en');
  first.id = 'private-one';
  first.mode = 'source';
  first.authors = ['First author'];
  first.license = 'Private rights one';
  first.questions = first.questions.slice(0, 14);
  const second = await starter('en');
  second.id = 'private-two';
  second.mode = 'source';
  second.authors = ['Second author'];
  second.license = 'Private rights two';
  second.questions = second.questions.slice(14);
  await upload(page, [first, second]);
}
