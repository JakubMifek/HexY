import { expect, test } from '@playwright/test';
import {
  download,
  setupPreparation,
  enterPreparation,
} from './preparation-helpers.js';
import { setAnswers, setTheme } from './helpers.js';

test('custom pack and complete settings persist across reload while game recovery remains absent', async ({
  page,
}, info) => {
  await setupPreparation(page, 'cs', 45);
  await page.locator('#back-players').click();
  await page.locator('#nameA').fill('Alena');
  await page.locator('#next-setup').click();
  await setTheme(page, 'dark');
  await page.locator('#edit-proposal').click();
  await page.locator('#pack-title').fill('Moje uložená sada');
  await page.locator('#save-pack').click();
  const saved = await download(page, info, '#export-pack', 'saved-custom.json');
  await page.reload();
  await expect(page.locator('#new-game')).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('hexy.library.v1')).preferences.setup
          .players.A.name,
    ),
  ).toBe('Alena');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#options').click();
  await expect(page.locator('#seconds')).toHaveValue('45');
  await page.locator('#back-menu').click();
  await enterPreparation(page);
  await expect(page.locator('.pack-sources')).toContainText(
    'Moje uložená sada',
  );
  await expect(
    page.locator(`[id="source-${JSON.parse(saved.text).id}"]`),
  ).toHaveCount(1);
  await expect(page.locator('.game')).toHaveCount(0);
});

for (const [name, value, message] of [
  ['corrupt', '{', 'not overwritten'],
  [
    'incompatible',
    '{"schemaVersion":999}',
    'Unsupported local library version',
  ],
]) {
  test(`${name} storage is preserved and localized while memory editing/play/export works`, async ({
    page,
  }, info) => {
    await page.addInitScript(
      (value) => localStorage.setItem('hexy.library.v1', value),
      value,
    );
    await setupPreparation(page);
    await expect(page.locator('#storage-error')).toContainText(message);
    await page.locator('#edit-proposal').click();
    await page.locator('#save-pack').click();
    const copy = JSON.parse(
      (await download(page, info, '#export-pack', 'memory-copy.json')).text,
    );
    expect(copy.questions).toHaveLength(28);
    expect(
      await page.evaluate(() => localStorage.getItem('hexy.library.v1')),
    ).toBe(value);
    await expect(page.locator('#language, #ui-language')).toHaveCount(0);
    await page.locator('#accept-board').click();
    await page.locator('#start').click();
    await expect(page.locator('.game')).toHaveAttribute(
      'data-phase',
      'selecting',
    );
  });
}

for (const failure of ['unavailable', 'quota']) {
  test(`${failure} local storage failure is actionable and never destroys a custom pack`, async ({
    page,
  }, info) => {
    await page.addInitScript((failure) => {
      if (failure === 'unavailable')
        Object.defineProperty(window, 'localStorage', {
          get() {
            throw new DOMException('Denied', 'SecurityError');
          },
        });
      else
        Storage.prototype.setItem = () => {
          throw new DOMException('Full', 'QuotaExceededError');
        };
    }, failure);
    await setupPreparation(page);
    await expect(page.locator('#storage-error')).toContainText(
      failure === 'quota' ? 'storage is full' : 'storage could not be read',
    );
    await page.locator('#edit-proposal').click();
    await page.locator('#question-aliases').fill('remember this alias');
    await page.locator('#save-pack').click();
    const copy = JSON.parse(
      (await download(page, info, '#export-pack', 'unsaved-copy.json')).text,
    );
    expect(copy.questions[0].aliases).toEqual(['remember this alias']);
    await page.locator('#accept-board').click();
    await page.locator('#start').click();
    await expect(page.locator('.game')).toHaveAttribute(
      'data-phase',
      'selecting',
    );
  });
}

test('an import finishing after game start cannot change its locked content', async ({
  page,
}, info) => {
  await setupPreparation(page);
  const original = await download(page, info, '#export-pack', 'original.json');
  await page.evaluate(() => {
    window.releaseImport = null;
    File.prototype.text = function () {
      return new Promise((resolve) => {
        window.releaseImport = resolve;
      });
    };
  });
  await page.locator('#import-packs').setInputFiles({
    name: 'delayed.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{}'),
  });
  await page.locator('#start').click();
  await page.evaluate((json) => window.releaseImport(json), original.text);
  const played = await download(page, info, '#save-game', 'played.json');
  expect(JSON.parse(played.text).game.pack).toEqual(JSON.parse(original.text));
  await expect(page.locator('#import-packs')).toHaveCount(0);
});

test('downloads during a typed opportunity retain the unsent draft and original deadline', async ({
  page,
}, info) => {
  await page.clock.install({ time: new Date('2026-10-28T12:00:00Z') });
  await setupPreparation(page);
  await page.clock.pauseAt(new Date('2026-10-28T12:01:00Z'));
  await setAnswers(page, 'automatic');
  await page.locator('#start').click();
  await page.locator('#cell-1').click();
  await page.locator('#answer').fill('Unsent answer');
  await expect(page.locator('#answer-sheet')).toHaveCount(0);
  await download(page, info, '#save-game', 'active-game.json');
  await expect(page.locator('#answer')).toHaveValue('Unsent answer');
  await page.clock.runFor(30_000);
  await expect(page.locator('.game')).toHaveAttribute('data-phase', 'opponent');
  await expect(page.locator('#answer')).toHaveValue('');
});
