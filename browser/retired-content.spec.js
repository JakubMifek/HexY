import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import {
  setupPreparation,
  acceptPack,
  download,
  inspectPrintedSheet,
} from './preparation-helpers.js';
import { phase, setTheme } from './helpers.js';

async function reimportSavedPack(page, context, info, source, before) {
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await page.locator('#open-import').click();
  await page
    .locator('#import-game')
    .setInputFiles(info.outputPath('before-reload.json'));
  const importSheet = await download(
    page,
    info,
    '#import-play',
    'reimported-retired.html',
  );
  await inspectPrintedSheet(context, info, importSheet.path, source, 'import-');
  await phase(page, 'question');
  const imported = JSON.parse(
    (await download(page, info, '#save-game', 'reimported-save.json')).text,
  );
  expect(imported.game.pack).toEqual(source);
  expect(imported.game.stage.round.deadline).toBe(
    before.game.stage.round.deadline,
  );
}

for (const language of ['cs', 'en']) {
  test(`retired Entertainment ${language}: actual old pack imports, prints, plays and recovers unchanged`, async ({
    page,
    context,
  }, info) => {
    const sourcePath = `docs/retired/entertainment-${language}-02.json`;
    const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
    await setupPreparation(page, language, 3600);
    await setTheme(page, language === 'cs' ? 'dark' : 'light');
    await expect(page.locator('#decks-entertainment')).toHaveCount(0);
    await page.locator('#import-packs').setInputFiles(sourcePath);
    await expect(page.locator('#preparation-error')).toHaveText('');
    await expect(page.locator('#decks-custom')).toContainText(source.title);
    await acceptPack(page, source.id, 'letters');
    const exported = await download(page, info, '#export-pack', 'retired.json');
    expect(JSON.parse(exported.text)).toEqual(source);
    const printed = await download(page, info, '#start', 'retired.html');
    await inspectPrintedSheet(context, info, printed.path, source);
    await phase(page, 'selecting');
    await page.locator('#cell-28').click();
    const before = JSON.parse(
      (await download(page, info, '#save-game', 'before-reload.json')).text,
    );
    await page.reload();
    await phase(page, 'question');
    const recovered = JSON.parse(
      (await download(page, info, '#save-game', 'after-reload.json')).text,
    );
    expect(recovered.game.pack).toEqual(source);
    expect(recovered.game.stage.round.deadline).toBe(
      before.game.stage.round.deadline,
    );
    await expect(page.locator('.question-text')).toHaveText(
      source.questions[27].text,
    );
    await page.screenshot({ path: info.outputPath('retired-recovered.png') });
    await page.locator('#judge-correct').click();
    await expect(page.locator('#cell-28')).toHaveAttribute('data-owner', 'A');
    await reimportSavedPack(page, context, info, source, before);
  });
}
