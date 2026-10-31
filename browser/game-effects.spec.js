import { expect, test } from '@playwright/test';
import { start, phase } from './helpers.js';

/** @param {import('@playwright/test').Page} page @param {number} position */
async function seekReturn(page, position) {
  return page.locator('.returning').evaluate(async (face, time) => {
    const animations = face.getAnimations({ subtree: true });
    for (const animation of animations) animation.pause();
    await Promise.all(animations.map((animation) => animation.ready));
    for (const animation of animations) animation.currentTime = time;
    return {
      front: getComputedStyle(face.querySelector('.return-front')).opacity,
      back: getComputedStyle(face.querySelector('.return-back')).opacity,
      matrix: getComputedStyle(face).transform,
      fill: face.querySelector('.return-back .hex-base').getAttribute('fill'),
    };
  }, position);
}

for (const theme of ['light', 'dark']) {
  test(`${theme}: return flips the initial into the actual owner while shrinking to the grid`, async ({
    page,
  }, info) => {
    await start(page, { theme, mode: 'numbers' });
    await page.locator('#cell-28').click();
    await page.locator('#judge-correct').click();
    await phase(page, 'selecting');
    await expect(page.locator('#cell-28')).toHaveAttribute('data-owner', 'A');
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('hexy.game.v1')),
    );
    expect(saved.game.cells[27]).toBe('A');
    expect(saved.game.chooser).toBe('B');
    const front = await seekReturn(page, 0);
    expect(front).toMatchObject({ front: '1', back: '0' });
    await page.screenshot({ path: info.outputPath('return-front.png') });
    const back = await seekReturn(page, 420);
    expect(back).toMatchObject({
      front: '0',
      back: '1',
      fill: saved.settings.players.A.color,
    });
    await page.screenshot({ path: info.outputPath('return-back.png') });
    expect((await seekReturn(page, 560)).matrix).toBe('none');
    await page.locator('#theme').click();
    await expect(page.locator('.returning, .return-front')).toHaveCount(0);
    await page.reload();
    await expect(page.locator('.returning, .flipping')).toHaveCount(0);
  });
}

test('reduced motion presents the final face at normal size immediately', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  await page.locator('#cell-1').click();
  await page.locator('#judge-correct').click();
  const presentation = await page
    .locator('#cell-1 .tile-face')
    .evaluate((face) => ({
      animation: getComputedStyle(face).animationName,
      transform: getComputedStyle(face).transform,
      front: face.querySelector('.return-front'),
      back: getComputedStyle(face.querySelector('.return-back')).opacity,
    }));
  expect(presentation).toEqual({
    animation: 'none',
    transform: 'none',
    front: null,
    back: '1',
  });
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
});

/** @param {import('@playwright/test').Page} page */
async function observeNativeAudio(page) {
  await page.addInitScript(() => {
    window.audioEvents = [];
    window.audioContexts = [];
    window.audioActivations = [];
    window.audioResumes = 0;
    window.audioResumeActivations = [];
    const NativeContext = AudioContext;
    window.AudioContext = class extends NativeContext {
      constructor(...args) {
        super(...args);
        window.audioContexts.push(this);
        window.audioActivations.push(navigator.userActivation.isActive);
      }
      resume() {
        window.audioResumes += 1;
        window.audioResumeActivations.push(navigator.userActivation.isActive);
        return super.resume();
      }
    };
    const original = OscillatorNode.prototype.start;
    OscillatorNode.prototype.start = function (...args) {
      window.audioEvents.push(this.frequency.value);
      return original.apply(this, args);
    };
  });
}

/** @param {import('@playwright/test').Page} page */
async function audioProbe(page) {
  const probe = await page.evaluate(() => ({
    states: window.audioContexts.map((context) => context.state),
    activations: window.audioActivations,
    resumes: window.audioResumes,
    resumeActivations: window.audioResumeActivations,
    notes: window.audioEvents,
  }));
  await test.info().attach('native-audio.json', {
    body: JSON.stringify(probe),
    contentType: 'application/json',
  });
  return probe;
}

test('trusted gestures schedule native cues or report a genuinely suspended audio device without changing game time', async ({
  page,
  browserName,
}) => {
  await observeNativeAudio(page);
  await start(page, { seconds: 4 });
  await page.locator('#cell-1').click();
  const probe = await audioProbe(page);
  expect(probe.activations).toEqual([true]);
  if (browserName === 'firefox' && probe.states[0] === 'suspended') {
    expect(probe.resumes).toBeGreaterThan(0);
    expect(probe.resumeActivations.every(Boolean)).toBe(true);
    expect(probe.notes).toEqual([]);
    await expect(page.locator('#sound-status')).toContainText('Audio paused');
    await expect(page.locator('#sound-status')).toHaveAttribute(
      'title',
      /Audio is suspended/,
    );
    await page.clock.runFor(4000);
    await phase(page, 'opponent-offer');
    expect(await page.evaluate(() => window.audioEvents)).toEqual([]);
    test.info().annotations.push({
      type: 'limitation',
      description:
        'Native Firefox AudioContext stayed suspended after an activated gesture and resume(); device output could not be verified. Localized fallback and unchanged deadline verified.',
    });

    return;
  }
  expect(await page.evaluate(() => window.audioEvents)).toEqual([440, 660]);
  await page.clock.runFor(1000);
  expect(await page.evaluate(() => window.audioEvents)).toEqual([
    440, 660, 880,
  ]);
  await page.locator('#judge-wrong').click();
  await page.locator('#theme').click();
  expect(await page.evaluate(() => window.audioEvents)).toEqual([
    440, 660, 880,
  ]);
  await page.locator('#judge-correct').click();
  expect(await page.evaluate(() => window.audioEvents)).toEqual([
    440, 660, 880, 523.25, 659.25, 783.989990234375,
  ]);
  await expect(page.locator('#sound-status')).toBeEmpty();
});

test('native Shift before the first click cannot strand audio or replay old cues', async ({
  page,
  browserName,
}) => {
  await observeNativeAudio(page);
  await page.goto('/');
  await page.keyboard.press('Shift');
  expect((await audioProbe(page)).states).toEqual([]);
  await page.locator('#options').click();
  const first = await audioProbe(page);
  expect(first.activations).toEqual([true]);
  expect(first.resumes).toBeLessThanOrEqual(1);
  await page.locator('#language').selectOption('en');
  await page.locator('#back-menu').click();
  await page.locator('#new-game').click();
  await page.locator('#answerMode').selectOption('hosted');
  await page.locator('#next-setup').click();
  await page.locator('#mode-letters').click();
  await page.locator('#start').click();
  await page.locator('#cell-1').click();
  const probe = await audioProbe(page);
  expect(probe.resumeActivations.every(Boolean)).toBe(true);
  if (browserName === 'firefox' && probe.states[0] === 'suspended') {
    expect(probe.resumes).toBeGreaterThan(first.resumes);
    expect(probe.notes).toEqual([]);
    await expect(page.locator('#sound-status')).toContainText('Audio paused');
    test.info().annotations.push({
      type: 'limitation',
      description:
        'Headless Firefox remained suspended despite fresh activated-click retries; no native notes were queued.',
    });
    return;
  }
  expect(probe.states).toEqual(['running']);
  expect(probe.notes).toEqual([440, 660]);
  await page.locator('#judge-correct').click();
  expect((await audioProbe(page)).notes).toEqual([
    440, 660, 523.25, 659.25, 783.989990234375,
  ]);
});

test('Options sound toggle is localized, keyboard accessible and persists separately from games', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#options').click();
  const toggle = page.locator('#sound-enabled');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle).toHaveText('Herní zvuky: zapnuté');
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.locator('#language').selectOption('en');
  await expect(toggle).toHaveText('Game sounds: off');
  await page.reload();
  await page.locator('#options').click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('hexy.library.v1')).preferences.setup
          .sound,
    ),
  ).toBeUndefined();
});

test('opponent offer keeps the raised initial, then a timed steal reveals the opponent color', async ({
  page,
}, info) => {
  await start(page, { mode: 'numbers', seconds: 4 });
  await page.locator('#cell-1').focus();
  await page.keyboard.press('Enter');
  await page.locator('#give-up').click();
  await phase(page, 'opponent-offer');
  await expect(page.locator('#cell-1.selected-tile')).toHaveCount(1);
  await expect(page.locator('.tile-countdown')).toHaveCount(0);
  const raised = await page
    .locator('.selected-tile .tile-face')
    .evaluate((face) => {
      const matrix = new DOMMatrix(getComputedStyle(face).transform);
      return matrix.d;
    });
  expect(raised).toBeGreaterThan(1);
  await page.locator('#accept-opponent').click();
  await expect(
    page.locator('.tile-countdown circle:last-child'),
  ).toHaveAttribute('stroke', '#FBA123');
  await page.locator('#judge-wrong').click();
  await phase(page, 'opponent');
  await page.locator('#judge-correct').click();
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'B');
  expect(await seekReturn(page, 400)).toMatchObject({
    front: '0',
    back: '1',
    fill: '#FBA123',
  });
  await page.screenshot({ path: info.outputPath('opponent-return.png') });
  await expect(page.locator('.return-front')).toHaveCSS('opacity', '0');
  await expect(page.locator('.return-back')).toHaveCSS('opacity', '1');
});

for (const outcome of ['decline', 'timeout']) {
  test(`${outcome}: black return retains only the original board label on its final face`, async ({
    page,
  }) => {
    await start(page, { mode: 'numbers', seconds: 2 });
    await page.locator('#cell-1').click();
    await page.locator('#give-up').click();
    if (outcome === 'decline') await page.locator('#decline-opponent').click();
    else {
      await page.locator('#accept-opponent').click();
      await page.clock.runFor(1000);
    }
    await expect(page.locator('#cell-1')).toHaveAttribute(
      'data-owner',
      'black',
    );
    expect(await seekReturn(page, 400)).toMatchObject({
      front: '0',
      back: '1',
      fill: 'var(--cell-black)',
    });
    await expect(page.locator('.return-back text')).toHaveText('1');
    await expect(page.locator('.return-back')).not.toContainText('×');
    await page.locator('#cell-1').focus();
    await page.keyboard.press('Enter');
    await phase(page, 'duel-preview');
    await expect(
      page.locator('.returning, .return-front, .selected-tile'),
    ).toHaveCount(0);
  });
}
