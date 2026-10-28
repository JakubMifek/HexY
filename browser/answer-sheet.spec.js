import { expect, test } from '@playwright/test';
import {
  download,
  inspectPrintedSheet,
  selectSources,
  setupPreparation,
  starter,
  upload,
} from './preparation-helpers.js';

for (const language of ['cs', 'en']) {
  for (const mode of ['letters', 'numbers']) {
    test(`P5-R3 ${language}/${mode}: imported source notes stay inert in actual HTML/PDF`, async ({
      page,
      context,
    }, info) => {
      await setupPreparation(page, language);
      const source = await starter(language);
      source.id = 'private-sources';
      source.questions[0].sources = [
        '<img src=x onerror="alert(1)"> & \'quoted\'',
        'javascript:alert(1)',
        'https://example.org/?x=<script>alert(1)</script>&y="test"',
      ];
      source.questions[27].sources = [
        'Last cell note',
        'https://example.org/last',
      ];
      await upload(page, [source]);
      await page.locator('#mode').selectOption(mode);
      await selectSources(page, [source.id]);
      await page.locator('#prepare-board').click();
      await page.locator('#accept-board').click();
      const pack = JSON.parse(
        (await download(page, info, '#export-pack', 'sheet-pack.json')).text,
      );
      expect(pack.mode).toBe(mode);
      if (mode === 'numbers')
        expect(pack.questions[0].id).not.toBe(source.questions[0].id);
      const sheet = await download(
        page,
        info,
        '#answer-sheet',
        'source-sheet.html',
      );
      await inspectPrintedSheet(context, info, sheet.path, pack);
      await expect(page.locator('#answer-sheet')).toBeEnabled();
    });
  }
}
