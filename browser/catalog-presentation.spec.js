import { expect, test } from '@playwright/test';
import {
  setupPreparation,
  starter,
  upload,
  download,
  catalogPacks,
} from './preparation-helpers.js';
import { setTheme } from './helpers.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';

async function assertLeftAlignment(page, category = 'general') {
  const folderBox = await page.locator(`#folder-${category}`).boundingBox();
  const folderName = await page
    .locator(`#decks-${category} .folder-name`)
    .boundingBox();
  const rows = page.locator(`#decks-${category} .deck-row`);
  const titleXs = [];
  for (const row of await rows.all()) {
    const checkbox = await row.locator('input').boundingBox();
    const title = await row.locator('strong').boundingBox();
    expect(checkbox.x).toBeCloseTo(folderBox.x, 0);
    expect(title.x).toBeGreaterThan(checkbox.x + checkbox.width);
    expect(title.x).toBeCloseTo(folderName.x, 0);
    titleXs.push(title.x);
    expect(
      await row.evaluate((node) => node.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(44);
    expect(await row.evaluate((node) => getComputedStyle(node).textAlign)).toBe(
      'left',
    );
  }
  expect(Math.max(...titleXs) - Math.min(...titleXs)).toBeLessThan(1);
}

async function assertDeckOrder(folder, general, t) {
  const levels = ['easy', 'medium', 'hard'];
  const count = (level) =>
    general.filter((pack) => pack.difficulty === level).length;
  await expect(folder.locator('.difficulty-symbols')).toHaveText(
    levels.flatMap((level) =>
      Array(count(level)).fill({ easy: '●', medium: '◆', hard: '▲' }[level]),
    ),
  );
  await expect(folder.locator('strong')).toHaveText(
    levels.flatMap((level) =>
      Array.from(
        { length: count(level) },
        (_, index) =>
          `${t.categories.general} · ${t.difficulties[level]} · ${String(index + 1).padStart(2, '0')}`,
      ),
    ),
  );
}

async function openSelectedFolder(page, info, folder, name, count) {
  const summary = folder.locator('summary');
  await expect(summary).toHaveText(`${name}1 / ${count}`);
  await expect(folder.locator('svg.folder-icon')).toBeVisible();
  await page.locator('#catalog-results').screenshot({
    path: info.outputPath('collapsed-folders.png'),
  });
  await page.locator('#folder-general').check();
  await expect(folder).not.toHaveAttribute('open');
  await expect(summary).toHaveText(`${name}${count} / ${count}`);
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(folder).toHaveAttribute('open', '');
}

async function verifyOriginalExport(page, info) {
  await page.locator('#clear-sources').click();
  const first = page.locator('#decks-general input').first();
  const id = await first.getAttribute('value');
  await first.check();
  await expect(first).toBeFocused();
  await page.locator('#prepare-board').click();
  await page.locator('#accept-board').click();
  const exported = JSON.parse(
    (await download(page, info, '#export-pack', 'unchanged.json')).text,
  );
  expect(exported).toEqual(catalogPacks.find((pack) => pack.id === id));
}

for (const language of ['cs', 'en']) {
  for (const theme of ['light', 'dark']) {
    test(`compact folders ${language} ${theme}: alignment, keyboard, order and unchanged exports`, async ({
      page,
    }, info) => {
      await page.setViewportSize(
        theme === 'light'
          ? { width: 1280, height: 720 }
          : { width: 768, height: 1024 },
      );
      await setupPreparation(page, language);
      await setTheme(page, theme);
      const t = preparationStrings[language];
      const general = catalogPacks.filter(
        (pack) =>
          pack.language === language &&
          pack.questions[0].category === 'general',
      );
      const mediumCount = general.filter(
        (pack) => pack.difficulty === 'medium',
      ).length;
      await expect(page.locator('#catalog-results details[open]')).toHaveCount(
        0,
      );
      const folder = page.locator('#decks-general');
      const summary = folder.locator('summary');
      await openSelectedFolder(
        page,
        info,
        folder,
        t.categories.general,
        general.length,
      );
      await assertLeftAlignment(page);
      await assertDeckOrder(folder, general, t);
      await page.locator('#catalog-results').screenshot({
        path: info.outputPath('expanded-folder.png'),
      });
      await page.locator('#catalog-difficulty').selectOption('medium');
      await expect(folder).toHaveAttribute('open', '');
      await expect(summary).toHaveText(
        `${t.categories.general}${mediumCount} / ${mediumCount}`,
      );
      await page.locator('#folder-general').uncheck();
      await expect(page.locator('#catalog-selection > p').first()).toHaveText(
        `${t.selected}: ${general.length - mediumCount}`,
      );
      await page.locator('#reset-catalog').click();
      await expect(page.locator('#folder-general')).toHaveJSProperty(
        'indeterminate',
        true,
      );
      await verifyOriginalExport(page, info);
      await page.screenshot({
        path: info.outputPath('compact-folder.png'),
        fullPage: true,
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(page.viewportSize().width);
    });
  }
}

const lateAdditions = [
  {
    added: 'general-cs-medium-03',
    predecessor: 'general-cs-medium-04',
    language: 'cs',
    level: 'medium',
  },
  {
    added: 'general-cs-hard-03',
    predecessor: 'general-cs-hard-04',
    language: 'cs',
    level: 'hard',
  },
  {
    added: 'general-en-medium-04',
    predecessor: 'general-en-medium-05',
    language: 'en',
    level: 'medium',
  },
].filter((pair) => catalogPacks.some((pack) => pack.id === pair.added));

for (const pair of lateAdditions) {
  for (const theme of ['light', 'dark']) {
    test(`stable delivered display numbering ${pair.added} ${theme}: native IDs, filters and original exports`, async ({
      page,
    }, info) => {
      await setupPreparation(page, pair.language);
      await setTheme(page, theme);
      const t = preparationStrings[pair.language];
      await page.locator('#decks-general summary').click();
      const expected = [
        [pair.predecessor, '03'],
        [pair.added, '04'],
      ];
      for (const level of [pair.level, '']) {
        await page.locator('#catalog-difficulty').selectOption(level);
        for (const [id, number] of expected)
          await expect(
            page
              .locator('.deck-row')
              .filter({ has: page.locator(`[id="source-${id}"]`) })
              .locator('strong'),
          ).toHaveText(
            `${t.categories.general} · ${t.difficulties[pair.level]} · ${number}`,
          );
      }
      await page.locator('#clear-sources').click();
      await page.locator(`[id="source-${pair.predecessor}"]`).check();
      await page.locator('#prepare-board').click();
      await page.locator('#accept-board').click();
      const exported = await download(
        page,
        info,
        '#export-pack',
        'stable-original.json',
      );
      expect(JSON.parse(exported.text)).toEqual(
        catalogPacks.find((pack) => pack.id === pair.predecessor),
      );
    });
  }
}

test('custom folder starts closed, preserves imported titles and sorts names naturally', async ({
  page,
}) => {
  await setupPreparation(page);
  const base = await starter('en');
  await upload(page, [
    { ...base, id: 'z', title: 'Zebra', difficulty: 'easy' },
    { ...base, id: 'a', title: 'Alpha 10', difficulty: 'hard' },
    { ...base, id: 'b', title: 'Alpha 2', difficulty: 'hard' },
    {
      ...base,
      id: 'mixed',
      title: 'Alpha 1',
      mode: 'numbers',
      difficulty: ['easy', 'medium', 'hard'],
      questions: base.questions.map((question, index) => ({
        ...question,
        difficulty: ['easy', 'medium', 'hard'][index % 3],
      })),
    },
  ]);
  const folder = page.locator('#decks-custom');
  await expect(folder).not.toHaveAttribute('open');
  await folder.locator('summary').click();
  await expect(folder.locator('strong')).toHaveText([
    'Alpha 1',
    'Zebra',
    'Alpha 2',
    'Alpha 10',
  ]);
  await expect(folder.locator('.difficulty-symbols')).toHaveText([
    '●◆▲',
    '●',
    '▲',
    '▲',
  ]);
  await assertLeftAlignment(page, 'custom');
});
