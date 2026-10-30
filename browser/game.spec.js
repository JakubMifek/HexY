import { expect, test } from '@playwright/test';
import { answer, chooser, phase, setCell, start } from './helpers.js';

for (const language of /** @type {const} */ (['cs', 'en'])) {
  for (const mode of /** @type {const} */ (['letters', 'numbers'])) {
    for (const answers of /** @type {const} */ (['hosted', 'automatic'])) {
      test(`${language}/${mode}/${answers}: all three turn cases and no answer leaks`, async ({
        page,
      }) => {
        await start(page, {
          language,
          mode,
          answers,
          theme: language === 'cs' ? 'dark' : 'light',
        });
        const values =
          language === 'cs'
            ? ['Amazonka', 'Berlin', 'cin', 'Capek']
            : ['Athens', 'Basalt', 'Cello', 'Chess'];
        const offset = mode === 'numbers' ? 1 : 0;
        await page.locator('#cell-1').click();
        await phase(page, 'question');
        await expect(page.locator('.question-panel')).not.toContainText(
          values[offset],
        );
        await expect(page.locator('#feedback')).toBeEmpty();
        await expect(page.locator('#set-cell')).toHaveCount(0);
        if (answers === 'hosted') await page.locator('#judge-wrong').click();
        else await answer(page, 'deliberately wrong');
        await phase(page, 'question');
        await expect(page.locator('#feedback')).not.toContainText(
          values[offset],
        );
        if (answers === 'hosted') await page.locator('#judge-correct').click();
        else await answer(page, `  ${values[offset].toUpperCase()}  `);
        await expect(page.locator('#cell-1')).toHaveAttribute(
          'data-owner',
          'A',
        );
        await chooser(page, 'B');
        await page.locator('#cell-2').click();
        await page.locator('#give-up').click();
        await phase(page, 'opponent');
        await expect(page.locator('#timer')).toHaveCount(0);
        await expect(page.locator('#feedback')).toBeEmpty();
        if (answers === 'hosted') await page.locator('#judge-wrong').click();
        else await answer(page, 'wrong');
        await expect(page.locator('#cell-2')).toHaveAttribute(
          'data-owner',
          'black',
        );
        await chooser(page, 'A');
        await page.locator('#cell-3').click();
        await page.locator('#give-up').click();
        if (answers === 'hosted') await page.locator('#judge-correct').click();
        else await answer(page, values[2 + offset]);
        await expect(page.locator('#cell-3')).toHaveAttribute(
          'data-owner',
          'B',
        );
        await chooser(page, 'A');
        await expect(page.locator('#mode, #language')).toHaveCount(0);
        await expect(
          page.locator('.workspace, #export-pack, #answer-sheet'),
        ).toHaveCount(0);
      });
    }
  }
}

test('deadline is exact after wrong answers, theme/language changes, focus loss and modal controls', async ({
  page,
}) => {
  await start(page, { seconds: 3 });
  await page.locator('#cell-1').click();
  await page.clock.runFor(1000);
  await page.locator('#judge-wrong').click();
  await page.locator('#theme').click();
  await expect(page.locator('#ui-language')).toHaveCount(0);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.locator('#exit-game').click();
  await page.clock.runFor(1999);
  await phase(page, 'question');
  await expect(page.locator('#timer')).toHaveText('1 s');
  await page.clock.runFor(1);
  await phase(page, 'opponent');
  await page.locator('#cancel-new').click();
  await page.clock.runFor(60_000);
  await phase(page, 'opponent');
  await expect(page.locator('.question-panel')).not.toContainText('Athens');
  await page.locator('#judge-correct').click();
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'B');
});

test('host corrections create/reopen victory, preserve chooser, restore the original locked question', async ({
  page,
}, info) => {
  await start(page);
  for (const cell of [1, 2, 4, 7, 11, 16, 22]) await setCell(page, cell, 'A');
  await phase(page, 'won');
  await expect(page.locator('.winning')).toHaveCount(7);
  await page.screenshot({
    path: info.outputPath('winning-connection.png'),
    fullPage: true,
  });
  await page.locator('#choose-B').click();
  await phase(page, 'won');
  await setCell(page, 1, 'unclaimed');
  await phase(page, 'selecting');
  await chooser(page, 'B');
  await page.locator('#cell-1').click();
  await expect(page.locator('.question-text')).toHaveText(
    'Which city is the capital of Greece?',
  );
  await page.locator('#judge-correct').click();
  await chooser(page, 'A');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'B');
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await expect(page.locator('#new-game')).toBeVisible();
  await page.clock.runFor(60_000);
  await expect(page.locator('.game')).toHaveCount(0);
});

test('keyboard field navigation, long text and non-color black cues', async ({
  page,
}) => {
  await start(page, { language: 'cs' });
  await page.locator('#cell-1').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#cell-2')).toBeFocused();
  await page.keyboard.press('Enter');
  await phase(page, 'question');
  await page.locator('#give-up').click();
  await page.locator('#give-up').click();
  await expect(page.locator('#cell-2')).toHaveAccessibleName(/Černé/);
  await page.locator('#cell-7').click();
  await expect(page.locator('.question-text')).toContainText(
    'oxidu uhličitého',
  );
  await expect(page.locator('#phase-heading')).toBeFocused();
});

test('late queued initial action cannot answer on behalf of the opponent', async ({
  page,
}) => {
  await start(page, { answers: 'automatic', seconds: 1 });
  await page.locator('#cell-1').click();
  await page.locator('#answer').fill('Athens');
  const oldSubmit = await page.locator('#submit-answer').elementHandle();
  await page.clock.runFor(1000);
  await oldSubmit?.evaluate((node) => node.click());
  await phase(page, 'opponent');
  await expect(page.locator('#cell-1')).toHaveAttribute(
    'data-owner',
    'unclaimed',
  );
  await expect(page.locator('#feedback')).toBeEmpty();
});

test('manual and random starters honor configuration', async ({ page }) => {
  await start(page, { starter: 'random', random: 0.99 });
  await chooser(page, 'B');
  await page.locator('#exit-game').click();
  await page.locator('#discard-new').click();
  await page.locator('#options').click();
  await page.locator('#starter').selectOption('B');
  await page.locator('#back-menu').click();
  await page.locator('#new-game').click();
  await page.locator('#nameB').fill('Boris');
  await page.locator('#next-setup').click();
  await page.locator('#mode-letters').click();
  await page.locator('#start').click();
  await chooser(page, 'B');
});
