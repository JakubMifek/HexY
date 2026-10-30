import { expect, test } from '@playwright/test';
import { blackDuel, phase, start } from './helpers.js';

for (const language of /** @type {const} */ (['cs', 'en'])) {
  test(`${language}: missing outside Shift release has safe actionable rearming`, async ({
    page,
  }, info) => {
    await start(page, { language });
    await blackDuel(page);
    await page.clock.runFor(2000);
    await page.keyboard.down('ShiftLeft');
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    // Release while suppressing delivery, reproducing a keyup missed outside the page.
    await page.evaluate(() =>
      window.addEventListener(
        'keyup',
        (event) => event.stopImmediatePropagation(),
        { capture: true, once: true },
      ),
    );
    await page.keyboard.up('ShiftLeft');
    await phase(page, 'duel-interrupted');
    await expect(page.locator('.question-panel')).toContainText(
      language === 'en' ? 'press and release' : 'stiskněte a pusťte',
    );
    await page.screenshot({
      path: info.outputPath('release-rearming-feedback.png'),
      fullPage: true,
    });
    await page.keyboard.press('ShiftLeft');
    await phase(page, 'duel-interrupted');
    await page.keyboard.press('ShiftRight');
    await page.clock.runFor(8);
    await expect(page.locator('#cell-1')).toHaveAttribute(
      'data-owner',
      'black',
    );
    await phase(page, 'duel-preview');
    await page.keyboard.down('ShiftRight');
    await page.clock.runFor(2000);
    await page.keyboard.down('ShiftRight');
    await page.clock.runFor(8);
    await expect(page.locator('#cell-1')).toHaveAttribute(
      'data-owner',
      'black',
    );
    await page.keyboard.up('ShiftRight');
    await page.keyboard.press('ShiftRight');
    await page.clock.runFor(8);
    await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'B');
  });
}

for (const opportunity of ['question', 'opponent']) {
  test(`${opportunity}: theme and language preserve draft but the next opportunity is empty`, async ({
    page,
  }, info) => {
    await start(page, { answers: 'automatic', seconds: 3 });
    await page.locator('#cell-1').click();
    if (opportunity === 'opponent') await page.locator('#give-up').click();
    await page.locator('#answer').fill('  Ath? <draft>  ');
    await page.clock.runFor(1000);
    await page.locator('#theme').click();
    await expect(page.locator('#answer')).toHaveValue('  Ath? <draft>  ');
    await page.locator('#theme').click();
    await expect(page.locator('#answer')).toHaveValue('  Ath? <draft>  ');
    await expect(page.locator('body')).not.toContainText('Athens');
    await page.screenshot({
      path: info.outputPath('preserved-draft.png'),
      fullPage: true,
    });
    if (opportunity === 'question') {
      await page.clock.runFor(1999);
      await phase(page, 'question');
      await expect(page.locator('#answer')).toHaveValue('  Ath? <draft>  ');
      await page.clock.runFor(1);
      await phase(page, 'opponent');
      await expect(page.locator('#answer')).toHaveValue('');
    } else {
      await page.clock.runFor(60_000);
      await phase(page, 'opponent');
      await expect(page.locator('#answer')).toHaveValue('  Ath? <draft>  ');
    }
    await page.locator('#give-up').click();
    await page.locator('#cell-2').click();
    await expect(page.locator('#answer')).toHaveValue('');
    await expect(page.locator('.question-text')).toContainText(
      'mid-ocean ridges',
    );
  });
}

/** @param {string} color */
function luminance(color) {
  const channels = color
    .match(/\d+(\.\d+)?/g)
    ?.slice(0, 3)
    .map(Number);
  if (!channels || channels.length !== 3)
    throw new Error(`Unsupported color ${color}`);
  const linear = channels.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

/** @param {string} first @param {string} second */
function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** @param {import('@playwright/test').Locator} control */
async function controlColors(control) {
  return control.evaluate((node) => {
    const style = getComputedStyle(node);
    let parent = node.parentElement;
    while (
      parent &&
      getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)'
    )
      parent = parent.parentElement;
    if (!parent) throw new Error('Missing painted background');
    return {
      border: style.borderTopColor,
      width: parseFloat(style.borderTopWidth),
      inside: style.backgroundColor,
      outside: getComputedStyle(parent).backgroundColor,
    };
  });
}

for (const theme of ['light', 'dark']) {
  test(`${theme}: actual control borders exceed 3:1 on both adjacent surfaces`, async ({
    page,
  }, info) => {
    await start(page, { theme, answers: 'automatic' });
    await page.locator('#exit-game').click();
    await page.locator('#discard-new').click();
    await page.locator('#options').click();
    const measured = [];
    for (const selector of ['#seconds', '#starter', '#language']) {
      const colors = await controlColors(page.locator(selector));
      expect(colors.width).toBeGreaterThanOrEqual(1);
      expect(contrast(colors.border, colors.inside)).toBeGreaterThanOrEqual(3);
      expect(contrast(colors.border, colors.outside)).toBeGreaterThanOrEqual(3);
      measured.push({
        selector,
        ...colors,
        insideRatio: contrast(colors.border, colors.inside),
        outsideRatio: contrast(colors.border, colors.outside),
      });
    }
    await page.locator('#back-menu').click();
    await page.locator('#new-game').click();
    const nameColors = await controlColors(page.locator('#nameA'));
    expect(
      contrast(nameColors.border, nameColors.inside),
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrast(nameColors.border, nameColors.outside),
    ).toBeGreaterThanOrEqual(3);
    await page.locator('#next-setup').click();
    await page.locator('#mode-letters').click();
    await page.locator('#start').click();
    await page.locator('#cell-1').click();
    const colors = await controlColors(page.locator('#answer'));
    expect(contrast(colors.border, colors.inside)).toBeGreaterThanOrEqual(3);
    expect(contrast(colors.border, colors.outside)).toBeGreaterThanOrEqual(3);
    measured.push({
      selector: '#answer',
      ...colors,
      insideRatio: contrast(colors.border, colors.inside),
      outsideRatio: contrast(colors.border, colors.outside),
    });
    await info.attach('computed-control-contrast', {
      body: JSON.stringify(measured, null, 2),
      contentType: 'application/json',
    });
    await page.screenshot({
      path: info.outputPath('input-boundaries.png'),
      fullPage: true,
    });
  });
}
