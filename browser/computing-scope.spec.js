import { expect, test } from '@playwright/test';
import {
  setupPreparation,
  download,
  catalogPacks,
  acceptPack,
  inspectPrintedSheet,
} from './preparation-helpers.js';
import { phase, setTheme } from './helpers.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';

for (const language of ['cs', 'en']) {
  test(`P11-COMP ${language}: stable category, localized folder, authoring, export and answer sheet`, async ({
    page,
    context,
  }, info) => {
    const name = preparationStrings[language].categories.programming;
    const source = catalogPacks.find(
      (pack) => pack.id === `programming-${language}-01`,
    );
    await page.setViewportSize(
      language === 'cs'
        ? { width: 768, height: 1024 }
        : { width: 1280, height: 720 },
    );
    await setupPreparation(page, language);
    await setTheme(page, language === 'cs' ? 'dark' : 'light');
    await expect(page.locator('#decks-programming summary')).toContainText(
      name,
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize().width);
    await page.screenshot({
      path: info.outputPath('computing-folder.png'),
      fullPage: true,
    });
    await page.locator('#clear-sources').click();
    await page.locator(`#source-${source.id}`).check();
    await page.locator('#edit-source').click();
    await expect(
      page.getByLabel(`${preparationStrings[language].category} · ${name}`, {
        exact: true,
      }),
    ).toHaveValue('programming');
    await expect(page.locator('#pack-title')).toHaveValue(new RegExp(name));
    await page.locator('#cancel-edit').click();
    await acceptPack(page, source.id, 'letters');
    expect(
      JSON.parse(
        (await download(page, info, '#export-pack', 'computing.json')).text,
      ),
    ).toEqual(source);
    const html = await download(page, info, '#start', 'computing.html');
    const sheet = await context.newPage();
    await sheet.goto(`file://${html.path}`);
    await expect(sheet.locator('body')).toContainText(
      `${preparationStrings[language].category}: ${name}`,
    );
    await sheet.close();
    await inspectPrintedSheet(context, info, html.path, source, 'computing-');
    await phase(page, 'selecting');
    await page.reload();
    expect(
      JSON.parse(
        (await download(page, info, '#save-game', 'recovered.json')).text,
      ).game.pack,
    ).toEqual(source);
  });
}
