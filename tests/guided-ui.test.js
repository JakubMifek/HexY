// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from '../src/app.js';
import { browserClock } from '../src/runtime/clock.js';
import { DomainError } from '../src/domain/errors.js';
import { GAME_KEY } from '../src/runtime/recovery.js';
import { defaultSetup, savedGame } from './fixtures.js';
import { randomPlayers } from '../src/ui/setup.js';

/** @type {App} */
let app;
let sequence = 0;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1000);
  vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  localStorage.clear();
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  app = new App(
    root,
    browserClock,
    () => 0,
    () => `guided-${++sequence}`,
  );
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
});
afterEach(() => {
  app.dispose();
  vi.restoreAllMocks();
  vi.useRealTimers();
  document.body.replaceChildren();
});

/** @param {string} id */
function click(id) {
  const node = document.getElementById(id);
  if (!(node instanceof HTMLElement)) throw new Error(id);
  node.click();
}
/** @param {string} id @param {string} value */
function fill(id, value) {
  const node = document.getElementById(id);
  if (!(node instanceof HTMLInputElement || node instanceof HTMLSelectElement))
    throw new Error(id);
  node.value = value;
  node.dispatchEvent(new Event('input'));
  node.dispatchEvent(new Event('change'));
}
/** @param {string} code @param {'keydown'|'keyup'} type */
function key(code, type) {
  document.activeElement?.dispatchEvent(
    new KeyboardEvent(type, { code, bubbles: true }),
  );
}

test('fresh menu, unified options, random names and draft navigation never reroll during rendering', () => {
  expect(document.querySelector('#start, #nameA, #seconds')).toBeNull();
  click('options');
  expect(document.querySelector('#starter')).toHaveProperty('value', 'random');
  expect(document.querySelector('#seconds')).toHaveProperty('value', '30');
  fill('language', 'en');
  click('back-menu');
  click('theme');
  click('new-game');
  expect(document.querySelector('#nameA')).toHaveProperty('value', 'Aragorn');
  expect(document.querySelector('#nameB')).toHaveProperty('value', 'Arwen');
  expect(document.querySelector('#colorA')).toHaveProperty('value', '#22d3ee');
  fill('nameA', 'Éowyn');
  fill('colorB', '#ffffff');
  fill('answerMode', 'automatic');
  click('next-setup');
  click('mode-letters');
  const pack = app.workspace.model.accepted;
  click('back-players');
  click('theme');
  expect(document.querySelector('#nameA')).toHaveProperty('value', 'Éowyn');
  expect(document.querySelector('#colorB')).toHaveProperty('value', '#ffffff');
  click('next-setup');
  expect(app.workspace.model.accepted).toBe(pack);
  expect(app.settings.language).toBe('en');
  expect(document.documentElement.lang).toBe('en');
  click('start');
  expect(app.state?.pack.language).toBe('en');
  expect(
    document.querySelector(
      '#answer-sheet, #input-controls, #fullscreen, #new-game, .workspace',
    ),
  ).toBeNull();
});

test('blank names block players while random defaults are distinct in either theme', () => {
  for (const theme of ['light', 'dark']) {
    const names = randomPlayers(() => 0.99, theme);
    expect(names.A.name).not.toBe(names.B.name);
  }
  click('new-game');
  fill('nameA', '  ');
  click('next-setup');
  expect(app.navigation.page).toBe('players');
  expect(document.querySelector('#setup-error')?.textContent).not.toBe('');
});

test('hosted start initiates the exact sheet, rejects failed initiation and does not unlock content', () => {
  click('new-game');
  click('next-setup');
  click('mode-letters');
  const download = vi
    .spyOn(app.workspace.downloads, 'save')
    .mockImplementation(() => {
      throw new DomainError('exportFailed');
    });
  click('start');
  expect(app.state).toBeNull();
  expect(document.querySelector('#preparation-error')?.textContent).not.toBe(
    '',
  );
  download.mockImplementation(() => {});
  click('start');
  expect(download.mock.calls.at(-1)?.[0]).toContain(
    app.state?.pack.questions[0].answer,
  );
  expect(app.workspace.model.locked).toBe(true);
  expect(document.querySelector('#answer-sheet, #export-pack')).toBeNull();
});

test('digital play never creates a sheet; Save Game and direct import retain settings and deadlines', async () => {
  app.start({ ...defaultSetup('en'), answerMode: 'automatic' });
  const state = app.state;
  if (!state) throw new Error('game');
  app.send({
    type: 'select',
    cell: 1,
    sessionId: state.sessionId,
    revision: state.revision,
  });
  const download = vi
    .spyOn(app.recovery.downloads, 'save')
    .mockImplementation(() => {});
  click('save-game');
  const json = download.mock.calls[0][0];
  const settings = structuredClone(app.settings);
  click('exit-game');
  click('discard-new');
  expect(localStorage.getItem(GAME_KEY)).toBeNull();
  click('open-import');
  await app.importGame(/** @type {File} */ ({ text: async () => json }));
  expect(app.state?.stage).toMatchObject({
    phase: 'question',
    round: { deadline: 31_000 },
  });
  expect(app.settings).toEqual(settings);
  expect(app.language).toBe('en');
  expect(document.querySelector('#nameA, #start')).toBeNull();
  expect(JSON.parse(localStorage.getItem(GAME_KEY) ?? '{}').settings).toEqual(
    settings,
  );
});

test('hosted import remains outside gameplay until download succeeds, and cancelled pending imports never adopt', async () => {
  app.start(defaultSetup('en'));
  const state = app.state;
  if (!state) throw new Error('game');
  const json = savedGame(state);
  click('exit-game');
  click('discard-new');
  click('open-import');
  const download = vi
    .spyOn(app.workspace.downloads, 'save')
    .mockImplementation(() => {
      throw new DomainError('exportFailed');
    });
  await app.importGame(/** @type {File} */ ({ text: async () => json }));
  expect(app.state).toBeNull();
  click('import-play');
  expect(app.state).toBeNull();
  expect(document.querySelector('#preparation-error')?.textContent).not.toBe(
    '',
  );
  download.mockImplementation(() => {});
  click('import-play');
  expect(app.state?.pack).toEqual(state.pack);
  click('exit-game');
  click('discard-new');
  click('open-import');
  await app.importGame(/** @type {File} */ ({ text: async () => json }));
  click('back-menu');
  app.navigation.adoptImport();
  expect(app.state).toBeNull();
});

test('lone keyup and stale press readiness cannot resume; focused header controls do not swallow the next duel press', async () => {
  app.start(defaultSetup('en'));
  const send = (
    /** @type {import('../src/domain/types.js').ActionBody} */ action,
  ) => {
    const state = app.state;
    if (state)
      app.send({
        ...action,
        sessionId: state.sessionId,
        revision: state.revision,
      });
  };
  send({ type: 'set-cell', cell: 1, owner: 'black' });
  send({ type: 'select', cell: 1 });
  window.dispatchEvent(new Event('blur'));
  document.getElementById('theme')?.focus();
  key('ShiftLeft', 'keyup');
  key('ShiftRight', 'keyup');
  await Promise.resolve();
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  key('ShiftLeft', 'keydown');
  key('ShiftLeft', 'keyup');
  window.dispatchEvent(new Event('blur'));
  key('ShiftRight', 'keydown');
  key('ShiftRight', 'keyup');
  await Promise.resolve();
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  key('ShiftLeft', 'keydown');
  key('ShiftLeft', 'keyup');
  await Promise.resolve();
  expect(app.state?.stage.phase).toBe('duel-preview');
  expect(app.state?.cells[0]).toBe('black');
  vi.advanceTimersByTime(2000);
  key('ShiftRight', 'keydown');
  key('ShiftRight', 'keyup');
  vi.advanceTimersByTime(8);
  expect(app.state?.cells[0]).toBe('B');
});

function interruptedDuel() {
  app.start(defaultSetup('en'));
  for (const action of [
    {
      type: /** @type {const} */ ('set-cell'),
      cell: 1,
      owner: /** @type {const} */ ('black'),
    },
    { type: /** @type {const} */ ('select'), cell: 1 },
  ]) {
    const state = app.state;
    if (!state) throw new Error('game');
    app.send({
      ...action,
      sessionId: state.sessionId,
      revision: state.revision,
    });
  }
  window.dispatchEvent(new Event('blur'));
}

test('controller rearming rejects unobserved-neutral holds and revoked callbacks, then restarts automatically', async () => {
  interruptedDuel();
  const pads = app.inputs.gamepads;
  const pad = {
    index: 0,
    id: 'boundary mock',
    connected: true,
    buttons: [false, false].map((pressed) => ({
      pressed,
      touched: false,
      value: 0,
    })),
  };
  pads.sample([pad]);
  pads.assign('A', '1', 0);
  pads.assign('B', '1', 1);
  pads.sample([pad]);
  window.dispatchEvent(new Event('blur'));
  vi.mocked(document.hasFocus).mockReturnValue(false);
  pad.buttons.forEach((button) => {
    button.pressed = true;
  });
  pads.sample([pad]);
  vi.mocked(document.hasFocus).mockReturnValue(true);
  pads.sample([pad]);
  pad.buttons.forEach((button) => {
    button.pressed = false;
  });
  pads.sample([pad]);
  await Promise.resolve();
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  pad.buttons.forEach((button) => {
    button.pressed = true;
  });
  pads.sample([pad]);
  pad.buttons.forEach((button) => {
    button.pressed = false;
  });
  pads.sample([pad]);
  window.dispatchEvent(new Event('blur'));
  await Promise.resolve();
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  pads.sample([pad]);
  pad.buttons.forEach((button) => {
    button.pressed = true;
  });
  pads.sample([pad]);
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  pad.buttons.forEach((button) => {
    button.pressed = false;
  });
  pads.sample([pad]);
  await Promise.resolve();
  expect(app.state?.stage.phase).toBe('duel-preview');
  expect(app.state?.cells[0]).toBe('black');
});

test('disposal rejects an already queued automatic restart', async () => {
  interruptedDuel();
  document.getElementById('theme')?.focus();
  for (const code of ['ShiftLeft', 'ShiftRight']) {
    key(code, 'keydown');
    key(code, 'keyup');
  }
  const original = localStorage.getItem(GAME_KEY);
  app.dispose();
  await Promise.resolve();
  expect(app.state).toBeNull();
  expect(localStorage.getItem(GAME_KEY)).toBe(original);
});

test.each(['exit-game', 'open-recovery'])(
  'a %s dialog cannot restart a hidden duel or retain readiness after closing',
  async (launcher) => {
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
      setTimeout(() => this.dispatchEvent(new Event('close')), 0);
    };
    const write = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      /** @this {Storage} */ function (name, value) {
        if (name === GAME_KEY)
          throw new DOMException('full', 'QuotaExceededError');
        write.call(this, name, value);
      },
    );
    interruptedDuel();
    click(launcher);
    document
      .getElementById(
        launcher === 'exit-game' ? 'cancel-new' : 'close-recovery',
      )
      ?.focus();
    for (const code of ['ShiftLeft', 'ShiftRight']) {
      key(code, 'keydown');
      key(code, 'keyup');
    }
    await Promise.resolve();
    expect(app.state?.stage.phase).toBe('duel-interrupted');
    expect(app.inputs.rearmed.size).toBe(0);
    const revision = app.state?.revision;
    click(launcher === 'exit-game' ? 'cancel-new' : 'close-recovery');
    key('ShiftLeft', 'keydown');
    key('ShiftLeft', 'keyup');
    await Promise.resolve();
    expect(app.state?.stage.phase).toBe('duel-interrupted');
    expect(app.state?.revision).toBe(revision);
    vi.advanceTimersByTime(0);
    key('ShiftRight', 'keydown');
    key('ShiftRight', 'keyup');
    await Promise.resolve();
    expect(app.state?.stage.phase).toBe('duel-preview');
  },
);

test('recovery controls do not pause time and export the current opportunity, not their opening snapshot', () => {
  app.start(defaultSetup('en'));
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });
  document
    .getElementById('cell-1')
    ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  click('open-recovery');
  vi.advanceTimersByTime(30_000);
  expect(app.state?.stage.phase).toBe('opponent');
  const download = vi
    .spyOn(app.recovery.downloads, 'save')
    .mockImplementation(() => {});
  click('export-game');
  expect(JSON.parse(download.mock.calls[0][0]).game.stage.phase).toBe(
    'opponent',
  );
  click('close-recovery');
  expect(app.state?.stage.phase).toBe('opponent');
});

test('native cancel, fallback close and disposal release only the owned game dialog', () => {
  app.start(defaultSetup('en'));
  const state = app.state;
  click('exit-game');
  const dialog = app.dialog;
  const cancel = new Event('cancel', { cancelable: true });
  dialog?.dispatchEvent(cancel);
  expect(cancel.defaultPrevented).toBe(true);
  expect(dialog?.isConnected).toBe(false);
  expect(app.dialog).toBeNull();
  expect(app.state).toBe(state);
  click('exit-game');
  app.dialog?.close();
  expect(app.dialog).toBeNull();
  click('exit-game');
  app.dispose();
  expect(document.querySelector('dialog')).toBeNull();
  expect(app.dialog).toBeNull();
});

test('blocking errors take the feedback strip without losing the previous result or game', () => {
  app.start(defaultSetup('en'));
  document.getElementById('cell-1')?.dispatchEvent(new MouseEvent('click'));
  click('judge-correct');
  const feedback = document.querySelector('#feedback')?.textContent;
  const state = app.state;
  vi.setSystemTime(999);
  document.getElementById('cell-2')?.dispatchEvent(new MouseEvent('click'));
  expect(document.querySelector('#error')?.textContent).toContain('clock');
  expect(document.querySelector('#feedback')?.textContent).toBe('');
  expect(app.state).toBe(state);
  vi.setSystemTime(1000);
  click('theme');
  expect(document.querySelector('#feedback')?.textContent).toBe(feedback);
  expect(document.querySelector('#error')?.textContent).toBe('');
  expect(app.state).toBe(state);
});

test.each(['pad', 'touch'])(
  'modal %s feedback cannot authorize a later restart',
  async (source) => {
    interruptedDuel();
    click('exit-game');
    const gesture = (/** @type {'A'|'B'} */ player) => {
      app.inputs.feedback(player, true, source);
      app.inputs.feedback(player, false, source);
    };
    gesture('A');
    gesture('B');
    expect(app.inputs.rearmed.size).toBe(0);
    click('cancel-new');
    gesture('A');
    await Promise.resolve();
    expect(app.state?.stage.phase).toBe('duel-interrupted');
    gesture('B');
    await Promise.resolve();
    expect(app.state?.stage.phase).toBe('duel-preview');
    expect(app.state?.cells[0]).toBe('black');
  },
);
