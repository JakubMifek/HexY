import { expect, test } from '@playwright/test';
import {
  setupPreparation,
  download,
  inspectPrintedSheet,
  nextPreparation,
  acceptPack,
  catalogPacks,
} from './preparation-helpers.js';
import { phase, setTheme } from './helpers.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';

const additions = catalogPacks.filter((pack) =>
  /^(general|nature|geography|history|politics|science|programming|arts|games|movies|sports)-(cs|en)-(easy|medium|hard)-\d{2}$/.test(
    pack.id,
  ),
);

async function prepare(page, ids) {
  await page.locator('#clear-sources').click();
  for (const id of ids) await page.locator(`#source-${id}`).check();
  await page.locator('#prepare-board').click();
  await page.locator('#accept-board').click();
}

async function fixedJourney(page, context, info, source) {
  const fixed = await download(page, info, '#export-pack', 'fixed.json');
  expect(JSON.parse(fixed.text)).toEqual(source);
  await page.locator('#import-packs').setInputFiles(fixed.path);
  await expect(page.locator('#preparation-error')).toHaveText('');
  const sheet = await download(page, info, '#start', 'fixed.html');
  await inspectPrintedSheet(context, info, sheet.path, source, 'fixed-');
  await phase(page, 'selecting');
  await page.reload();
  await phase(page, 'selecting');
  const saved = await download(
    page,
    info,
    '#save-game',
    'fixed-recovered.json',
  );
  expect(JSON.parse(saved.text).game.pack).toEqual(source);
  await page.locator('#cell-1').click();
  await expect(page.locator('.question-text')).toHaveText(
    source.questions[0].text,
  );
  await page.screenshot({
    path: info.outputPath('fixed-question.png'),
    fullPage: true,
  });
}

function verifyMixture(mixed, sources, expectedLevels) {
  const levels = ['easy', 'medium', 'hard'];
  const drawnLevels = new Set(mixed.questions.map((q) => q.difficulty));
  expect(mixed.difficulty).toEqual(
    levels.filter((level) => drawnLevels.has(level)),
  );
  expect(mixed.difficulty).toEqual(expectedLevels);
  for (const question of mixed.questions) {
    const source = sources.find(
      (pack) => pack.id === question.origins[0].packId,
    );
    expect(source).toBeDefined();
    expect(question).toMatchObject(
      source.questions.find((q) => q.id === question.id),
    );
    expect(question.difficulty).toBe(source.difficulty);
  }
}

for (const source of additions) {
  const category = source.questions[0].category;
  const label = preparationStrings.en.categories[category];
  test(`${label} addition ${source.id}: fixed and numbers, real JSON/HTML/PDF and recovery`, async ({
    page,
    context,
  }, info) => {
    await page.setViewportSize(
      source.language === 'cs'
        ? { width: 1024, height: 768 }
        : { width: 1280, height: 720 },
    );
    await setupPreparation(page, source.language);
    await setTheme(page, source.language === 'cs' ? 'dark' : 'light');
    await page.locator('#catalog-difficulty').selectOption(source.difficulty);
    await expect(page.locator(`#decks-${category} input`)).toHaveCount(2);
    await prepare(page, [source.id]);
    await fixedJourney(page, context, info, source);
    await nextPreparation(page, 'numbers', 'hosted');
    await prepare(page, [source.id]);
    const output = await download(page, info, '#export-pack', 'numbers.json');
    const numbers = JSON.parse(output.text);
    expect(numbers.mode).toBe('numbers');
    expect(numbers.difficulty).toBe(source.difficulty);
    expect(numbers.questions.map((q) => q.id).sort()).toEqual(
      source.questions.map((q) => q.id).sort(),
    );
    for (const question of numbers.questions) {
      expect(question.difficulty).toBe(source.difficulty);
      expect(question.origins[0].packId).toBe(source.id);
    }
    await page.locator('#import-packs').setInputFiles(output.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    await acceptPack(page, numbers.id, 'numbers');
    const html = await download(page, info, '#start', 'numbers.html');
    await inspectPrintedSheet(context, info, html.path, numbers, 'numbers-');
    await phase(page, 'selecting');
    await page.reload();
    const restored = await download(
      page,
      info,
      '#save-game',
      'numbers-recovered.json',
    );
    expect(JSON.parse(restored.text).game.pack).toEqual(numbers);
  });
}

const combinations = [
  ...new Set(
    additions.map((pack) => `${pack.questions[0].category}:${pack.language}`),
  ),
].map((key) => key.split(':'));
for (const [category, language] of combinations) {
  const label = preparationStrings.en.categories[category];
  const sources = additions.filter(
    (pack) =>
      pack.language === language && pack.questions[0].category === category,
  );
  test(`${label} ${language}: new-only mixture, actual-draw metadata, print and automatic play`, async ({
    page,
    context,
  }, info) => {
    expect(sources).toHaveLength(
      ['games', 'movies', 'sports'].includes(category) ? 6 : 4,
    );
    await setupPreparation(page, language);
    await page.locator('#mode-numbers').click();
    await page.evaluate(() => {
      let state = 20261030;
      Math.random = () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
      };
    });
    await prepare(
      page,
      sources.map((pack) => pack.id),
    );
    const output = await download(
      page,
      info,
      '#export-pack',
      'new-only-mix.json',
    );
    const mixed = JSON.parse(output.text);
    verifyMixture(
      mixed,
      sources,
      ['easy', 'medium', 'hard'].filter((level) =>
        sources.some((source) => source.difficulty === level),
      ),
    );
    const html = await download(page, info, '#start', 'new-only-mix.html');
    await inspectPrintedSheet(context, info, html.path, mixed);
    await nextPreparation(page, 'numbers', 'automatic');
    await page.locator('#import-packs').setInputFiles(output.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    await acceptPack(page, mixed.id, 'numbers');
    await page.locator('#start').click();
    await phase(page, 'selecting');
    await page.reload();
    await page.locator('#cell-1').click();
    await page.locator('#answer').fill(mixed.questions[0].answer);
    await page.locator('#submit-answer').click();
    await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
    const recovered = await download(
      page,
      info,
      '#save-game',
      'mix-recovered.json',
    );
    expect(JSON.parse(recovered.text).game.pack).toEqual(mixed);
    await page.screenshot({
      path: info.outputPath('new-only-mixture.png'),
      fullPage: true,
    });
  });
}
