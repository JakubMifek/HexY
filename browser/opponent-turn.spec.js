import { expect, test } from '@playwright/test';
import { answer, chooser, phase, start } from './helpers.js';

for (const language of /** @type {const} */ (['cs', 'en'])) {
  for (const answers of /** @type {const} */ (['hosted', 'automatic'])) {
    test(`${language}/${answers}: explicit half-time opponent attempt spends its turn`, async ({
      page,
    }, info) => {
      await page.setViewportSize(
        answers === 'hosted'
          ? { width: 1280, height: 720 }
          : { width: 768, height: 1024 },
      );
      await start(page, {
        language,
        answers,
        seconds: 5,
        theme: language === 'cs' ? 'dark' : 'light',
      });
      await page.locator('#cell-1').click();
      await page.locator('#give-up').click();
      await phase(page, 'opponent-offer');
      await chooser(page, 'B');
      await assertChoiceFit(page);
      await expect(page.locator('#timer, #answer, #judge-correct')).toHaveCount(
        0,
      );
      await expect(page.locator('.question-panel')).not.toContainText(
        language === 'cs' ? 'Amazonka' : 'Athens',
      );
      await page.clock.runFor(60_000);
      await phase(page, 'opponent-offer');
      await page.locator('#accept-opponent').focus();
      await page.keyboard.press('Enter');
      await phase(page, 'opponent');
      await expect(page.locator('#timer')).toHaveText('3 s');
      await expect(
        page.locator('.tile-countdown circle:last-child'),
      ).toHaveAttribute('stroke', '#FBA123');
      const before = await saved(page);
      expect(before.stage.round.deadline - before.stage.round.startedAt).toBe(
        2500,
      );
      if (answers === 'hosted') await page.locator('#judge-wrong').click();
      else await answer(page, 'wrong');
      await phase(page, 'opponent');
      await expect(page.locator('#feedback')).not.toBeEmpty();
      expect((await saved(page)).stage.round.deadline).toBe(
        before.stage.round.deadline,
      );
      await page.screenshot({
        path: info.outputPath('timed-opponent.png'),
        fullPage: true,
      });
      await page.clock.runFor(2499);
      await phase(page, 'opponent');
      await page.clock.runFor(1);
      await phase(page, 'selecting');
      await expect(page.locator('#cell-1')).toHaveAttribute(
        'data-owner',
        'black',
      );
      await chooser(page, 'A');
      await expect(page.locator('#timer, .tile-countdown')).toHaveCount(0);
    });

    test(`${language}/${answers}: decline, accepted give-up and successful steal have distinct turn costs`, async ({
      page,
    }) => {
      await start(page, { language, answers });
      await page.locator('#cell-1').click();
      await page.locator('#give-up').click();
      await page.locator('#decline-opponent').click();
      await chooser(page, 'B');
      await expect(page.locator('#cell-1')).toHaveAttribute(
        'data-owner',
        'black',
      );
      await page.locator('#cell-2').click();
      await page.locator('#give-up').click();
      await page.locator('#accept-opponent').click();
      await expect(
        page.locator('.tile-countdown circle:last-child'),
      ).toHaveAttribute('stroke', '#129FB5');
      await page.locator('#give-up').click();
      await chooser(page, 'B');
      await expect(page.locator('#cell-2')).toHaveAttribute(
        'data-owner',
        'black',
      );
      await page.locator('#cell-3').click();
      await page.locator('#give-up').click();
      await page.locator('#accept-opponent').click();
      if (answers === 'hosted') await page.locator('#judge-correct').click();
      else await answer(page, language === 'cs' ? 'cin' : 'Cello');
      await expect(page.locator('#cell-3')).toHaveAttribute('data-owner', 'A');
      await chooser(page, 'B');
    });
  }
}

test('accepted opponent deadline survives reload and expires behind an open exit dialog', async ({
  page,
}) => {
  await start(page, { seconds: 3, answers: 'automatic' });
  await page.locator('#cell-1').click();
  await page.locator('#give-up').click();
  await page.locator('#accept-opponent').click();
  const before = await saved(page);
  await page.clock.runFor(500);
  await page.reload();
  await phase(page, 'opponent');
  const recovered = await saved(page);
  expect(recovered.stage).toEqual(before.stage);
  expect(recovered.sessionId).not.toBe(before.sessionId);
  await page.locator('#exit-game').click();
  await page.clock.runFor(999);
  await phase(page, 'opponent');
  await page.clock.runFor(1);
  await phase(page, 'selecting');
  await page.locator('#cancel-new').click();
  await chooser(page, 'A');
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'black');
  await page.reload();
  await chooser(page, 'A');
});

/** @param {import('@playwright/test').Page} page */
async function saved(page) {
  return page.evaluate(
    () => JSON.parse(localStorage.getItem('hexy.game.v1')).game,
  );
}

/** @param {import('@playwright/test').Page} page */
async function assertChoiceFit(page) {
  const viewport = page.viewportSize();
  for (const id of ['accept-opponent', 'decline-opponent']) {
    const box = await page.locator(`#${id}`).boundingBox();
    expect(box).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
}
