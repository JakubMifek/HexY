// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from '../src/app.js';
import { browserClock } from '../src/runtime/clock.js';
import { GAME_KEY } from '../src/runtime/recovery.js';
import { INPUT_KEY } from '../src/runtime/inputs.js';
import { defaultSetup } from '../src/ui/setup.js';
import { act, duel, question } from './fixtures.js';

/** @type {App} */
let app;
/** @type {HTMLElement} */
let root;
let sequence = 0;

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(1000);
  vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  Element.prototype.scrollIntoView = vi.fn();
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
  root = document.createElement('div');
  document.body.append(root);
});
afterEach(() => {
  app?.dispose();
  document.body.replaceChildren();
  Reflect.deleteProperty(navigator, 'getGamepads');
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function mount() {
  app = new App(
    root,
    browserClock,
    () => 0,
    () => `resilience-${++sequence}`,
  );
}
/** @param {string} selector */
function click(selector) {
  const node = document.querySelector(selector);
  if (!node) throw new Error(selector);
  node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}
/** @param {string} selector @param {string} value */
function select(selector, value) {
  const node = document.querySelector(selector);
  if (!(node instanceof HTMLSelectElement)) throw new Error(selector);
  node.value = value;
  node.dispatchEvent(new Event('change'));
}

test.each([30_999, 31_000, 31_001])(
  'remount at %i uses real saved game and immutable content',
  (now) => {
    mount();
    app.start(defaultSetup('en'));
    click('#cell-1');
    const saved = current();
    app.dispose();
    vi.setSystemTime(now);
    mount();
    expect(current().pack).toEqual(saved.pack);
    expect(current().sessionId).not.toBe(saved.sessionId);
    expect(current().stage.phase).toBe(now < 31_000 ? 'question' : 'opponent');
    expect(document.querySelector('#edit-proposal')).toBeNull();
    expect(app.workspace.model.locked).toBe(true);
    click('#judge-correct');
    expect(app.state?.cells[0]).toBe(now < 31_000 ? 'A' : 'B');
    expect(JSON.parse(localStorage.getItem(GAME_KEY) ?? '{}').cells[0]).toBe(
      app.state?.cells[0],
    );
  },
);

function current() {
  if (!app.state) throw new Error('Missing game');
  return app.state;
}

test('a backwards clock after display-only elapsed time cannot accept an answer or increase the displayed countdown', () => {
  mount();
  app.start(defaultSetup('en'));
  click('#cell-1');
  vi.advanceTimersByTime(5000);
  const before = app.state;
  const timer = document.querySelector('#timer')?.textContent;
  vi.setSystemTime(4000);
  app.displayTime(4000);
  click('#judge-correct');
  expect(app.state).toBe(before);
  expect(document.querySelector('#timer')?.textContent).toBe(timer);
  expect(document.querySelector('#error')?.textContent).toContain('Hodiny');
  vi.setSystemTime(31_000);
  click('#judge-correct');
  expect(app.state?.stage.phase).toBe('opponent');
});

test('recovered duels require readiness and observed releases; safe input test cannot play', () => {
  localStorage.setItem(GAME_KEY, JSON.stringify(duel()));
  mount();
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  click('#input-controls');
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft' }));
  window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft' }));
  expect(document.querySelector('#input-test-status')?.textContent).toContain(
    'A',
  );
  click('#close-inputs');
  expect(app.state?.cells[0]).toBe('black');
  for (const code of ['ShiftLeft', 'ShiftRight']) {
    window.dispatchEvent(new KeyboardEvent('keydown', { code }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code }));
  }
  click('#ready-A');
  click('#ready-B');
  document.querySelector('#ready-A')?.dispatchEvent(new Event('change'));
  document.querySelector('#ready-B')?.dispatchEvent(new Event('change'));
  click('#restart');
  expect(app.state?.stage.phase).toBe('duel-preview');
});

test('corrupt protected original stays exportable alongside memory play; discard is explicit and scoped', () => {
  localStorage.setItem(GAME_KEY, '{');
  mount();
  const save = vi
    .spyOn(app.recovery.downloads, 'save')
    .mockImplementation(() => {});
  click('#export-game');
  expect(save.mock.calls[0][0]).toBe('{');
  click('#retry-recovery');
  app.start(defaultSetup('en'));
  expect(app.state).not.toBeNull();
  expect(localStorage.getItem(GAME_KEY)).toBe('{');
  click('#export-original');
  expect(save.mock.calls[1][0]).toBe('{');
  click('#retry-recovery');
  click('#discard-save');
  click('#cancel-new');
  expect(localStorage.getItem(GAME_KEY)).toBe('{');
  click('#discard-save');
  click('#discard-new');
  expect(localStorage.getItem(GAME_KEY)).toBeNull();
  expect(app.state).toBeNull();
  app.start(defaultSetup('en'));
  expect(app.recovery.saved).toBe(true);
});

test('read retry protects unread originals and deletion failure retains the current game', () => {
  const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('denied');
  });
  mount();
  app.start(defaultSetup('en'));
  read.mockRestore();
  click('#retry-recovery');
  expect(app.recovery.saved).toBe(true);
  const before = app.state;
  const remove = vi
    .spyOn(Storage.prototype, 'removeItem')
    .mockImplementation(() => {
      throw new DOMException('denied');
    });
  app.requestNew();
  click('#discard-new');
  expect(app.state).toBe(before);
  expect(document.querySelector('#recovery-error')?.textContent).not.toBe('');
  remove.mockRestore();
  app.dispose();
  app.retryRecovery();
  app.requestNew();
  expect(root.childElementCount).toBe(0);
});

test.each([
  JSON.stringify(question(), null, 2),
  '{ unread corrupt bytes\n',
  '{ "schemaVersion": 99 }\n',
])(
  'changed-to-empty then unread replacement survives retry and gameplay: case %#',
  (bytes) => {
    mount();
    app.start(defaultSetup('en'));
    app.requestNew();
    localStorage.removeItem(GAME_KEY);
    click('#discard-new');
    expect(app.recovery.original).toBeNull();
    expect(app.recovery.writable).toBe(false);
    localStorage.setItem(GAME_KEY, bytes);
    const nativeRead = Storage.prototype.getItem;
    const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      /** @this {Storage} */ function (key) {
        if (key === GAME_KEY) throw new DOMException('denied');
        return nativeRead.call(this, key);
      },
    );
    click('#retry-recovery');
    click('#cell-1');
    click('#judge-correct');
    expect(app.state?.cells[0]).toBe('A');
    expect(nativeRead.call(localStorage, GAME_KEY)).toBe(bytes);
    expect(app.recovery.saved).toBe(false);
    expect(app.recovery.writable).toBe(false);
    expect(document.querySelector('#game-save-status')?.textContent).toContain(
      'není uložena',
    );
    expect(document.querySelector('#recovery-error')?.textContent).toContain(
      'nelze přečíst',
    );
    read.mockRestore();
    click('#retry-recovery');
    expect(localStorage.getItem(GAME_KEY)).toBe(bytes);
    expect(app.recovery.writable).toBe(false);
    localStorage.removeItem(GAME_KEY);
    click('#retry-recovery');
    expect(app.recovery.saved).toBe(true);
    expect(JSON.parse(localStorage.getItem(GAME_KEY) ?? '{}').cells[0]).toBe(
      'A',
    );
  },
);

test('import recovery uses validation, locks content, and rejects late work after new games/disposal', async () => {
  mount();
  await app.importGame(/** @type {File} */ ({ text: async () => '{' }));
  expect(app.state).toBeNull();
  expect(document.querySelector('#recovery-error')).not.toBeNull();
  const interrupted = act(duel(), { type: 'interrupt' });
  await app.importGame(
    /** @type {File} */ ({ text: async () => JSON.stringify(interrupted) }),
  );
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  await app.importGame(
    /** @type {File} */ ({ text: async () => JSON.stringify(question()) }),
  );
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  app.requestNew();
  click('#discard-new');
  const control = document.querySelector('#import-game');
  control?.dispatchEvent(new Event('change'));
  Object.defineProperty(control, 'files', {
    value: [{ text: async () => JSON.stringify(question()) }],
  });
  control?.dispatchEvent(new Event('change'));
  await Promise.resolve();
  await Promise.resolve();
  expect(app.state?.stage.phase).toBe('question');
  app.requestNew();
  click('#discard-new');
  const pending = app.importGame(
    /** @type {File} */ ({ text: async () => JSON.stringify(question()) }),
  );
  app.dispose();
  await pending;
  await app.importGame(/** @type {File} */ ({ text: async () => '{}' }));
  expect(app.state).toBeNull();
});

test('keyboard preferences persist physical mappings; conflicts and storage failures are explicit', () => {
  mount();
  select('#ui-language', 'en');
  click('#input-controls');
  select('#key-A', 'KeyQ');
  select('#key-B', 'KeyQ');
  expect(app.keyboard.mapping).toEqual({ A: 'KeyQ', B: 'ShiftRight' });
  expect(document.querySelector('#input-error')?.textContent).toContain(
    'different',
  );
  select('#key-B', 'KeyP');
  expect(JSON.parse(localStorage.getItem(INPUT_KEY) ?? '{}').keys).toEqual({
    A: 'KeyQ',
    B: 'KeyP',
  });
  const write = vi
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new DOMException('denied');
    });
  select('#key-A', 'KeyA');
  expect(document.querySelector('#input-error')?.textContent).toContain(
    'could not',
  );
  write.mockRestore();
  click('#close-inputs');
  app.dispose();
  mount();
  expect(app.keyboard.mapping).toEqual({ A: 'KeyQ', B: 'KeyP' });
});

test.each([
  '{',
  '{"schemaVersion":9}',
  '{"schemaVersion":1,"keys":{"A":"Tab","B":"KeyP"}}',
])('invalid input preference %s remains protected', (json) => {
  localStorage.setItem(INPUT_KEY, json);
  mount();
  click('#input-controls');
  expect(document.querySelector('#input-error')?.textContent).not.toBe('');
  select('#key-A', 'KeyQ');
  expect(localStorage.getItem(INPUT_KEY)).toBe(json);
  click('#close-inputs');
});

test('mocked controller assignment UI validates buttons and exposes disconnect/release state', () => {
  const device = {
    index: 0,
    id: 'Xbox mock',
    connected: true,
    buttons: [
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
    ],
  };
  /** @type {(import('../src/runtime/gamepad.js').Pad | null)[]} */
  let devices = [device];
  Object.defineProperty(navigator, 'getGamepads', {
    configurable: true,
    value: () => devices,
  });
  mount();
  select('#ui-language', 'en');
  click('#input-controls');
  select('#device-A', '1');
  click('#assign-A');
  vi.advanceTimersByTime(16);
  select('#device-B', '1');
  click('#assign-B');
  expect(document.querySelector('#input-error')?.textContent).toContain(
    'different',
  );
  app.inputs.assign('B', '1', 1);
  device.buttons[0].pressed = true;
  vi.advanceTimersByTime(16);
  expect(document.querySelector('#input-test-status')?.textContent).toContain(
    'Pressed',
  );
  devices = [];
  vi.advanceTimersByTime(16);
  expect(document.querySelector('#gamepad-settings')?.textContent).toContain(
    'disconnected',
  );
  app.inputs.assign('A', '', 0);
  click('#close-inputs');
  const timer = app.inputs.gamepads.timer;
  const cancel = vi.spyOn(browserClock, 'cancel');
  app.dispose();
  app.inputs.open();
  expect(cancel).toHaveBeenCalledWith(timer);
  vi.runOnlyPendingTimers();
  expect(vi.getTimerCount()).toBe(0);
});

test('fullscreen success/exit and failure do not mutate game timing or update disposed UI', async () => {
  mount();
  app.start(defaultSetup('en'));
  click('#cell-1');
  const state = app.state;
  click('#fullscreen');
  await Promise.resolve();
  expect(document.querySelector('#device-error')?.textContent).not.toBe('');
  document.documentElement.requestFullscreen = vi.fn(async () => {});
  await app.inputs.fullscreen();
  expect(document.documentElement.requestFullscreen).toHaveBeenCalledOnce();
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    get: () => document.documentElement,
  });
  document.exitFullscreen = vi.fn(async () => {});
  await app.inputs.fullscreen();
  expect(document.exitFullscreen).toHaveBeenCalledOnce();
  expect(app.state).toBe(state);
  document.exitFullscreen = vi.fn(async () => {
    throw new Error('denied');
  });
  app.dispose();
  await app.inputs.fullscreen();
  expect(root.childElementCount).toBe(0);
});

test.each([
  JSON.stringify(question(), null, 2),
  '{ protected corrupt bytes\n',
  '{ "schemaVersion": 99, "preserve": "exact bytes" }\n',
])(
  'changed-record protection survives retry and gameplay: case %#',
  (replacement) => {
    mount();
    app.start(defaultSetup('en'));
    app.requestNew();
    localStorage.setItem(GAME_KEY, replacement);
    click('#discard-new');
    expect(app.recovery.writable).toBe(false);
    expect(app.recovery.saved).toBe(false);
    const exportFile = vi
      .spyOn(app.recovery.downloads, 'save')
      .mockImplementation(() => {});
    click('#export-original');
    expect(exportFile.mock.calls[0][0]).toBe(replacement);
    click('#cell-1');
    expect(localStorage.getItem(GAME_KEY)).toBe(replacement);
    click('#retry-recovery');
    click('#judge-wrong');
    expect(localStorage.getItem(GAME_KEY)).toBe(replacement);
    expect(app.recovery.writable).toBe(false);
    expect(app.recovery.saved).toBe(false);
    click('#export-original');
    expect(exportFile.mock.calls[1][0]).toBe(replacement);
    app.requestNew();
    click('#cancel-new');
    expect(localStorage.getItem(GAME_KEY)).toBe(replacement);
    app.requestNew();
    click('#discard-new');
    expect(localStorage.getItem(GAME_KEY)).toBeNull();
    app.start(defaultSetup('en'));
    expect(app.recovery.saved).toBe(true);
  },
);

test.each([
  ['startup', 'selecting'],
  ['startup', 'duel-interrupted'],
  ['file', 'selecting'],
  ['file', 'duel-interrupted'],
])(
  'unsupported symbols from %s in %s are rejected before adoption',
  async (source, phase) => {
    const state = act(duel(), { type: 'interrupt' });
    if (phase === 'selecting') state.stage = { phase: 'selecting' };
    state.config.duel.symbols = ['hexagon', 'diamond'];
    const json = JSON.stringify(state, null, 2);
    if (source === 'startup') localStorage.setItem(GAME_KEY, json);
    mount();
    if (source === 'file')
      await app.importGame(/** @type {File} */ ({ text: async () => json }));
    expect(app.state).toBeNull();
    expect(app.recovery.error).toBe('duelCompatibility');
    expect(localStorage.getItem(GAME_KEY)).toBe(
      source === 'startup' ? json : null,
    );
    select('#ui-language', 'en');
    expect(document.querySelector('#recovery-error')?.textContent).toContain(
      'cannot display',
    );
    if (source === 'startup') {
      const exportFile = vi
        .spyOn(app.recovery.downloads, 'save')
        .mockImplementation(() => {});
      click('#export-game');
      expect(exportFile.mock.calls[0][0]).toBe(json);
      click('#retry-recovery');
      expect(localStorage.getItem(GAME_KEY)).toBe(json);
      click('#discard-save');
      click('#discard-new');
    }
    app.start(defaultSetup('en'));
    click('#cell-1');
    expect(app.state?.stage.phase).toBe('question');
  },
);

test.each(['en', 'cs'])(
  '%s gamepad test reports both players releases once without press dispatch',
  (language) => {
    const pad = {
      index: 0,
      id: 'Release test',
      connected: true,
      buttons: [
        { pressed: false, value: 0, touched: false },
        { pressed: false, value: 0, touched: false },
      ],
    };
    Object.defineProperty(navigator, 'getGamepads', {
      configurable: true,
      value: () => [pad],
    });
    mount();
    select('#ui-language', language);
    app.start(defaultSetup('en'));
    const game = app.state;
    click('#input-controls');
    app.inputs.assign('A', '1', 0);
    app.inputs.assign('B', '1', 1);
    vi.advanceTimersByTime(16);
    for (const [index, player] of ['A', 'B'].entries()) {
      const press = vi.spyOn(app.keyboard.batch, 'press');
      const status = document.querySelector('#input-test-status');
      if (!status) throw new Error('Missing diagnostic status');
      const observer = new MutationObserver(() => {});
      observer.observe(status, { subtree: true, childList: true });
      pad.buttons[index].pressed = true;
      vi.advanceTimersByTime(16);
      expect(status.textContent).toBe(
        `${player} · ${language === 'en' ? 'Pressed' : 'Stisknuto'}`,
      );
      expect(press).toHaveBeenCalledOnce();
      pad.buttons[index].pressed = false;
      vi.advanceTimersByTime(16);
      expect(status.textContent).toBe(
        `${player} · ${language === 'en' ? 'Released / ready' : 'Uvolněno / připraveno'}`,
      );
      expect(press).toHaveBeenCalledOnce();
      observer.takeRecords();
      vi.advanceTimersByTime(160);
      expect(observer.takeRecords()).toHaveLength(0);
      observer.disconnect();
      press.mockRestore();
    }
    expect(app.state).toBe(game);
  },
);
