// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from '../src/app.js';
import { browserClock } from '../src/runtime/clock.js';
import { INPUT_KEY } from '../src/runtime/input-settings.js';
import {
  defaultBindings,
  validateBindings,
  validateInputPreferences,
} from '../src/domain/controls.js';
import { portableGame, recoverPortable } from '../src/domain/portable.js';
import { defaultSetup, game } from './fixtures.js';

/** @type {App} */
let app;
let focused = true;
let connected = true;
const pad = {
  index: 0,
  id: 'Boundary only',
  connected: true,
  mapping: 'standard',
  axes: [0, 0],
  buttons: Array.from({ length: 16 }, () => ({
    pressed: false,
    value: 0,
    touched: false,
  })),
};
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1000);
  localStorage.clear();
  focused = true;
  connected = true;
  pad.axes = [0, 0];
  pad.buttons.forEach((button) => {
    button.pressed = false;
  });
  vi.spyOn(document, 'hasFocus').mockImplementation(() => focused);
  Object.defineProperty(navigator, 'getGamepads', {
    configurable: true,
    value: () => (connected ? [pad] : []),
  });
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
});
afterEach(() => {
  app?.dispose();
  document.body.replaceChildren();
  Reflect.deleteProperty(navigator, 'getGamepads');
  vi.restoreAllMocks();
  vi.useRealTimers();
});
function mount() {
  const root = document.createElement('main');
  document.body.append(root);
  app = new App(
    root,
    browserClock,
    () => 0,
    () => 'recorded-controls',
  );
  app.language = 'en';
  app.inputs.language = 'en';
}
/** @param {string} code @param {boolean} [repeat] */
function down(code, repeat = false) {
  const event = new KeyboardEvent('keydown', {
    code,
    repeat,
    bubbles: true,
    cancelable: true,
  });
  window.dispatchEvent(event);
  return event;
}
/** @param {string} code */
function up(code) {
  window.dispatchEvent(new KeyboardEvent('keyup', { code }));
}
/** @param {number} button @param {boolean} held */
function press(button, held) {
  pad.buttons[button].pressed = held;
  vi.advanceTimersByTime(16);
}
/** @param {string} id */
function click(id) {
  document.getElementById(id)?.click();
}

test('recording ignores held/repeated, initiating and stale keys; Escape, blur and close preserve old bindings', () => {
  mount();
  app.inputs.open();
  down('KeyQ');
  click('record-A');
  down('KeyQ', true);
  expect(app.inputs.controls.bindings).toEqual(defaultBindings());
  up('KeyQ');
  down('KeyQ');
  up('KeyQ');
  expect(app.keyboard.mapping.A).toBe('KeyQ');
  click('record-A');
  down('Escape');
  up('Escape');
  expect(app.inputs.controls.recorder.player).toBeNull();
  expect(app.keyboard.mapping.A).toBe('KeyQ');
  click('record-B');
  window.dispatchEvent(new Event('blur'));
  down('KeyP');
  up('KeyP');
  expect(app.keyboard.mapping.B).toBe('ShiftRight');
  click('record-B');
  const stale = new KeyboardEvent('keydown', { code: 'KeyP' });
  Object.defineProperty(stale, 'timeStamp', { value: -1 });
  window.dispatchEvent(stale);
  expect(app.keyboard.mapping.B).toBe('ShiftRight');
  up('KeyP');
  click('close-inputs');
  down('KeyP');
  expect(app.keyboard.mapping.B).toBe('ShiftRight');
  expect(document.querySelector('dialog')).toBeNull();
});

test('reserved keys and duplicate bindings preserve prior values; outside capture shortcuts are untouched', () => {
  mount();
  app.inputs.open();
  click('record-A');
  for (const code of ['ArrowRight', 'Enter', 'Tab', 'F5']) {
    down(code);
    up(code);
    expect(document.getElementById('input-error')?.textContent).toContain(
      'reserved',
    );
  }
  down('ShiftRight');
  up('ShiftRight');
  expect(document.getElementById('input-error')?.textContent).toContain(
    'different',
  );
  expect(app.keyboard.mapping.A).toBe('ShiftLeft');
  down('Digit7');
  up('Digit7');
  expect(app.keyboard.mapping.A).toBe('Digit7');
  const data = JSON.parse(localStorage.getItem(INPUT_KEY) ?? '{}');
  expect(data.schemaVersion).toBe(2);
  expect(data.bindings.A).toEqual({ kind: 'keyboard', code: 'Digit7' });
  expect(down('KeyW').defaultPrevented).toBe(false);
  up('KeyW');
  click('record-B');
  window.dispatchEvent(
    new KeyboardEvent('keydown', { code: 'KeyW', ctrlKey: true }),
  );
  up('KeyW');
  expect(app.keyboard.mapping.B).toBe('ShiftRight');
});

test('recording snapshots a button held between the last poll and Record before accepting a new edge', () => {
  mount();
  app.inputs.open();
  vi.advanceTimersByTime(16);
  pad.buttons[0].pressed = true;
  click('record-A');
  vi.advanceTimersByTime(16);
  expect(app.keyboard.mapping.A).toBe('ShiftLeft');
  expect(app.inputs.controls.recorder.player).toBe('A');
  expect(localStorage.getItem(INPUT_KEY)).toBeNull();
  press(0, false);
  press(0, true);
  expect(app.inputs.controls.bindings.A).toEqual({
    kind: 'gamepad',
    button: 0,
  });
  expect(app.inputs.controls.recorder.player).toBeNull();
});

test('controller recording requires a fresh edge and replaces keyboard, duplicate rejection and disconnect do not reassign', () => {
  mount();
  app.inputs.open();
  press(0, true);
  click('record-A');
  vi.advanceTimersByTime(32);
  expect(app.keyboard.mapping.A).toBe('ShiftLeft');
  press(0, false);
  press(0, true);
  expect(app.keyboard.mapping.A).toBeNull();
  expect(app.inputs.controls.bindings.A).toEqual({
    kind: 'gamepad',
    button: 0,
  });
  press(0, false);
  click('record-B');
  press(0, true);
  expect(document.getElementById('input-error')?.textContent).toContain(
    'different',
  );
  expect(app.keyboard.mapping.B).toBe('ShiftRight');
  press(0, false);
  expect(document.getElementById('input-error')?.textContent).toContain(
    'different',
  );
  press(1, true);
  expect(app.keyboard.mapping.B).toBeNull();
  click('record-A');
  connected = false;
  vi.advanceTimersByTime(16);
  expect(app.inputs.controls.recorder.player).toBeNull();
  expect(app.inputs.gamepads.assignments).toEqual({});
  connected = true;
  vi.advanceTimersByTime(16);
  expect(app.inputs.gamepads.assignments).toEqual({});
  expect(app.inputs.controls.label('A')).toContain('Record again');
  click('record-A');
  down('ShiftLeft');
  up('ShiftLeft');
  expect(app.inputs.controls.bindings.A).toEqual({
    kind: 'keyboard',
    code: 'ShiftLeft',
  });
  expect(app.inputs.gamepads.assignments.A).toBeUndefined();
});

test('legacy preferences migrate on recording and portable controller choices restore unassigned without identity', () => {
  localStorage.setItem(
    INPUT_KEY,
    JSON.stringify({ schemaVersion: 1, keys: { A: 'KeyQ', B: 'KeyP' } }),
  );
  mount();
  expect(app.keyboard.mapping).toEqual({ A: 'KeyQ', B: 'KeyP' });
  const bindings = {
    A: { kind: 'gamepad', button: 0 },
    B: { kind: 'keyboard', code: 'KeyP' },
  };
  const valid = validateBindings(bindings);
  app.inputs.controls.restore(valid);
  expect(app.inputs.gamepads.assignments).toEqual({});
  expect(app.keyboard.mapping).toEqual({ A: null, B: 'KeyP' });
  const state = game();
  const settings = {
    ...defaultSetup('en'),
    mode: /** @type {const} */ ('numbers'),
  };
  const output = portableGame(state, settings, valid);
  expect(output.schemaVersion).toBe(2);
  expect(recoverPortable(JSON.stringify(output), 1000, 'new').bindings).toEqual(
    valid,
  );
  expect(JSON.stringify(output.bindings)).not.toContain('Boundary');
  for (const value of [
    { A: { kind: 'gamepad', button: -1 }, B: valid.B },
    { A: { kind: 'gamepad', button: 64 }, B: valid.B },
    { A: { kind: 'other' }, B: valid.B },
  ])
    expect(() => validateBindings(value)).toThrow();
  expect(() => validateInputPreferences({ schemaVersion: 99 })).toThrow();
});

test('recording is cancelled on hidden/disposed capture and protects concurrently changed preferences', () => {
  mount();
  app.inputs.open();
  click('record-A');
  focused = false;
  down('KeyQ');
  up('KeyQ');
  expect(app.keyboard.mapping.A).toBe('ShiftLeft');
  focused = true;
  const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  document.dispatchEvent(new Event('visibilitychange'));
  expect(app.inputs.controls.recorder.player).toBeNull();
  hidden.mockRestore();
  localStorage.setItem(INPUT_KEY, '{ protected');
  click('record-A');
  down('KeyQ');
  up('KeyQ');
  expect(localStorage.getItem(INPUT_KEY)).toBe('{ protected');
  expect(app.inputs.storageError).toBe(true);
  click('record-B');
  app.dispose();
  down('KeyP');
  up('KeyP');
  expect(app.keyboard.mapping.B).toBe('ShiftRight');
  vi.runOnlyPendingTimers();
  expect(vi.getTimerCount()).toBe(0);
});

test('standard controllers share row-major keyboard selection, skip owned cells, repeat with hysteresis and confirm once', () => {
  mount();
  app.start(defaultSetup('en'));
  const state = app.state;
  if (!state) throw new Error('No game');
  app.send({
    type: 'set-cell',
    cell: 2,
    owner: 'A',
    sessionId: state.sessionId,
    revision: state.revision,
  });
  document.getElementById('phase-heading')?.focus();
  vi.advanceTimersByTime(16);
  press(15, true);
  expect(activeId()).toBe('cell-1');
  vi.advanceTimersByTime(320);
  expect(document.activeElement?.id).toBe('cell-1');
  vi.advanceTimersByTime(32);
  expect(document.activeElement?.id).toBe('cell-3');
  press(15, false);
  pad.axes = [-0.7, 0];
  vi.advanceTimersByTime(16);
  expect(document.activeElement?.id).toBe('cell-1');
  pad.axes = [-0.4, 0];
  vi.advanceTimersByTime(100);
  expect(document.activeElement?.id).toBe('cell-1');
  pad.axes = [0, 0];
  vi.advanceTimersByTime(16);
  press(0, true);
  expect(app.state?.stage.phase).toBe('question');
  const selected = app.state;
  vi.advanceTimersByTime(500);
  expect(app.state).toBe(selected);
});

test('navigation requires neutral across modal/phase/focus and ignores unsupported mappings or form controls', () => {
  mount();
  app.start(defaultSetup('en'));
  document.getElementById('phase-heading')?.focus();
  press(0, true);
  expect(app.state?.stage.phase).toBe('selecting');
  press(0, false);
  press(0, true);
  expect(document.activeElement?.id).toBe('cell-1');
  press(0, false);
  app.requestNew();
  press(15, true);
  click('cancel-new');
  vi.advanceTimersByTime(32);
  expect(app.state?.stage.phase).toBe('selecting');
  expect(activeId()).toBe('exit-game');
  document.getElementById('phase-heading')?.focus();
  vi.advanceTimersByTime(32);
  expect(activeId()).toBe('phase-heading');
  press(15, false);
  press(15, true);
  expect(activeId()).toBe('cell-1');
  pad.mapping = '';
  press(0, true);
  expect(app.state?.stage.phase).toBe('selecting');
  pad.mapping = 'standard';
  document.getElementById('host-cell')?.focus();
  press(0, false);
  press(0, true);
  expect(app.state?.stage.phase).toBe('selecting');
  connected = false;
  vi.advanceTimersByTime(16);
});

function activeId() {
  return document.activeElement?.id;
}

test('focus loss between polls revokes board navigation and recorded shortcuts do not capture browser commands', () => {
  mount();
  app.inputs.controls.set('A', { kind: 'keyboard', code: 'KeyQ' });
  app.start(defaultSetup('en'));
  document.getElementById('cell-1')?.focus();
  vi.advanceTimersByTime(16);
  window.dispatchEvent(new Event('blur'));
  press(0, true);
  expect(app.state?.stage.phase).toBe('selecting');
  press(0, false);
  const state = app.state;
  if (!state) throw new Error('No game');
  app.send({
    type: 'set-cell',
    cell: 1,
    owner: 'black',
    sessionId: state.sessionId,
    revision: state.revision,
  });
  document
    .getElementById('cell-1')
    ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  vi.advanceTimersByTime(2000);
  expect(app.state?.stage.phase).toBe('duel-active');
  for (const modifier of ['ctrlKey', 'altKey', 'metaKey']) {
    const event = new KeyboardEvent('keydown', {
      code: 'KeyQ',
      [modifier]: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    up('KeyQ');
    vi.advanceTimersByTime(8);
    expect(app.state?.stage.phase).toBe('duel-active');
  }
  down('KeyQ');
  vi.advanceTimersByTime(8);
  expect(app.state?.stage.phase).toBe('selecting');
});
