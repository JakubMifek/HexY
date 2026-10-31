import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import {
  setupPreparation,
  acceptPack,
  download,
  inspectPrintedSheet,
  nextPreparation,
  verifySheet,
} from './preparation-helpers.js';
import { phase, setTheme } from './helpers.js';

const corrections = [
  ['general-cs-easy-01', 13, 'jízdní kolo', 'koloběžka'],
  ['general-cs-medium-01', 16, 'numizmatika', 'notafilie'],
  ['general-cs-hard-02', 18, 'pandántiv', 'tambur'],
  ['general-en-hard-01', 7, "Foucault's pendulum", 'gyroscope'],
  ['general-en-hard-01', 9, 'hapax', 'dis legomenon'],
  ['general-en-hard-01', 16, 'ogam', 'runes'],
  ['general-en-hard-02', 21, 'sheqel', 'dinar'],
  ['general-en-hard-02', 26, 'zebec', 'galley'],
  ['history-en-medium-01', 7, 'Feudal system', 'Capitalism'],
  ['history-cs-hard-01', 21, 'Sokol pražský', 'Česká obec sokolská'],
  [
    'history-cs-hard-01',
    21,
    'Pražská tělocvičná jednota Sokol',
    'Česká obec sokolská',
  ],
  ['history-en-medium-01', 28, 'Zululand', 'British Empire'],
  ['history-en-medium-01', 28, 'Kingdom of Zululand', 'British Empire'],
  ['history-cs-easy-01', 8, 'Tajná státní policie', 'Stasi'],
  ['history-cs-hard-02', 16, 'Japonská kronika', 'Kodžiki'],
  ['history-en-easy-02', 25, 'Great War', 'Second World War'],
  ['science-cs-medium-01', 4, 'Hřídelový čep', 'Čárový kód'],
  ['science-cs-hard-01', 19, 'Ramanův jev', 'Brillouinův rozptyl'],
  ['science-en-easy-01', 27, 'International yard', 'Yarn'],
  ['science-cs-easy-02', 18, 'Pneumatický plášť', 'Duše'],
  ['science-cs-easy-02', 28, 'Žárové pozinkování', 'Elektrolytické zinkování'],
  ['science-en-easy-02', 18, 'Caustic lime', 'Calcium hydroxide'],
  ['science-en-easy-02', 18, 'Calcia', 'Calcium hydroxide'],
  ['science-en-easy-02', 18, 'Oxide of calcium', 'Calcium hydroxide'],
  ['science-en-medium-02', 12, 'kW h', 'Kilowatt'],
  ['science-en-medium-02', 12, 'kW⋅h', 'Kilowatt'],
  ['science-en-medium-02', 12, 'kW·h', 'Kilowatt'],
  ['science-en-medium-02', 21, 'Shunt resistor', 'Resistor'],
  ['science-en-medium-02', 21, 'Ammeter shunt', 'Resistor'],
  ['politics-cs-hard-02', 6, 'Exekvatur', 'Agrément'],
  ['politics-en-easy-01', 3, 'Council of ministers', 'Parliament'],
  ['politics-en-medium-01', 26, 'X-Article', 'The Sources of Soviet Conduct'],
  ['politics-en-easy-02', 28, 'Zapatista', 'EZLN'],
  ['arts-cs-hard-01', 16, 'Nartex', 'Atrium'],
  ['arts-cs-hard-01', 24, 'oushak', 'Veduta'],
  ['arts-en-easy-01', 12, 'The Tragedy of King Lear', 'Hamlet'],
  ['arts-en-easy-01', 24, 'poetry', 'Prose'],
  ['arts-en-easy-01', 25, 'watercolour painting', 'Gouache'],
  ['arts-cs-easy-02', 12, 'Hansel', 'Mařenka'],
  ['arts-cs-hard-02', 10, 'sbor', 'Orchestr'],
  ['arts-en-easy-02', 11, 'Giulietta Capuleti', 'Romeo'],
  ['arts-en-medium-02', 26, 'freehand brush work', 'Gongbi'],
  ['programming-en-easy-01', 1, 'Application program', 'Operating system'],
  ['programming-en-easy-01', 1, 'Software application', 'Operating system'],
  ['programming-en-easy-01', 2, 'Data backup', 'File shortcut'],
  ['programming-en-easy-01', 12, 'Hotkey', 'Mouse gesture'],
  ['programming-en-easy-01', 12, 'Hot key', 'Mouse gesture'],
  ['programming-en-easy-01', 15, 'Push notification', 'Email'],
  ['programming-en-easy-01', 17, 'Passcode', 'Username'],
  ['programming-en-medium-01', 15, 'NN', 'CPU'],
  ['programming-en-medium-01', 19, 'Random-access memory', 'ROM'],
  ['programming-en-medium-02', 8, 'GitHub.com', 'GitLab'],
  ['games-cs-medium-02', 10, 'Vláďa Chvátil', 'Reiner Knizia'],
  ['games-cs-hard-02', 3, 'Caverna: Sedláci z jeskyní', 'Agricola'],
  ['movies-cs-easy-02', 23, 'Tom and Jerry', 'Tom and Friends'],
  ['movies-cs-hard-02', 4, 'Černá kočka bílý kocour', 'Underground'],
  ['movies-cs-hard-02', 4, 'Crna mačka beli mačor', 'Underground'],
  ['movies-cs-hard-02', 4, 'Black Cat White Cat', 'Underground'],
  ['movies-cs-hard-02', 5, 'Dekalog:The Ten Commandments', 'Three Colours'],
  ['movies-cs-hard-02', 15, 'Mulholland Dr', 'Lost Highway'],
  ['sports-cs-hard-02', 22, 'Anna Ščerbakovová', 'Kamila Valijevová'],
];

async function checkPrint(context, info, path, source, browserName) {
  if (browserName === 'chromium') {
    await inspectPrintedSheet(context, info, path, source);
    return;
  }
  const sheet = await context.newPage();
  await sheet.goto(`file://${path}`);
  await verifySheet(sheet, source);
  await sheet.screenshot({
    path: info.outputPath('answer-sheet-print.png'),
    fullPage: true,
  });
  await sheet.close();
}

for (const [id, cell, answer, wrong] of corrections) {
  const label =
    new Map([
      ['history', 'P11-HIS'],
      ['science', 'P11-SCI'],
      ['politics', 'P11-POL'],
      ['arts', 'P11-ART'],
      ['programming', 'P11-COMP'],
      ['games', 'P11-GAMES'],
      ['movies', 'P11-MOVIES'],
      ['sports', 'P11-SPORTS'],
    ]).get(String(id).split('-')[0]) ?? 'P11-GR1/GR2';
  test(`${label} ${id}-${cell} ${answer}: actual alias, JSON reimport and print`, async ({
    page,
    context,
    browserName,
  }, info) => {
    const source = JSON.parse(readFileSync(`src/content/${id}.json`, 'utf8'));
    const question = source.questions[Number(cell) - 1];
    await page.setViewportSize(
      source.language === 'cs'
        ? { width: 1024, height: 768 }
        : { width: 1280, height: 720 },
    );
    await setupPreparation(page, source.language);
    await setTheme(page, source.language === 'cs' ? 'dark' : 'light');
    await acceptPack(page, String(id), 'letters');
    const fixed = await download(page, info, '#export-pack', 'corrected.json');
    expect(JSON.parse(fixed.text)).toEqual(source);
    await page.locator('#import-packs').setInputFiles(fixed.path);
    await expect(page.locator('#preparation-error')).toHaveText('');
    const sheet = await download(page, info, '#start', 'corrected.html');
    await checkPrint(context, info, sheet.path, source, browserName);
    await phase(page, 'selecting');
    await nextPreparation(page, 'letters', 'automatic');
    await acceptPack(page, String(id), 'letters');
    await page.locator('#start').click();
    await page.reload();
    await phase(page, 'selecting');
    await page.locator(`#cell-${cell}`).click();
    await expect(page.locator('.question-text')).toHaveText(question.text);
    await page.screenshot({
      path: info.outputPath('corrected-question.png'),
      fullPage: true,
    });
    await page.locator('#answer').fill(String(wrong));
    await page.locator('#submit-answer').click();
    await phase(page, 'question');
    await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
      'data-owner',
      'unclaimed',
    );
    await page.locator('#answer').fill(String(answer));
    await page.locator('#submit-answer').click();
    await phase(page, 'selecting');
    await expect(page.locator(`#cell-${cell}`)).toHaveAttribute(
      'data-owner',
      'A',
    );
    const saved = await download(
      page,
      info,
      '#save-game',
      'corrected-game.json',
    );
    expect(JSON.parse(saved.text).game.pack).toEqual(source);
  });
}
