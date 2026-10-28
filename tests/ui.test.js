// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from '../src/app.js';
import { browserClock } from '../src/runtime/clock.js';
import { defaultSetup } from '../src/ui/setup.js';

/** @type {App} */
let app;
/** @type {HTMLElement} */
let root;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1000);
  root = document.createElement('div');
  document.body.append(root);
  Element.prototype.scrollIntoView = vi.fn();
  app = new App(
    root,
    browserClock,
    () => 0,
    () => 'ui-test-session',
  );
  // jsdom has no dialog implementation; real modal behavior is covered in Playwright.
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
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

test('the entry point mounts the real app and pagehide disposes its resources', async () => {
  app.dispose();
  root.id = 'app';
  await import('../src/main.js');
  expect(document.querySelector('#start')).not.toBeNull();
  document.querySelector('form')?.requestSubmit();
  click('#cell-1');
  expect(document.querySelector('#timer')).not.toBeNull();
  window.dispatchEvent(new Event('pagehide'));
  vi.advanceTimersByTime(60_000);
  expect(root.childElementCount).toBe(0);
  expect(vi.getTimerCount()).toBe(0);
});

test('invalid setup and empty typed answers have localized errors without advancing play', () => {
  set('#seconds', '0');
  document.querySelector('form')?.requestSubmit();
  expect(app.state).toBeNull();
  expect(document.querySelector('#setup-error')?.textContent).toContain(
    'Zadejte',
  );
  set('#ui-language', 'en');
  document.querySelector('form')?.requestSubmit();
  expect(document.querySelector('#setup-error')?.textContent).toContain(
    'Enter',
  );
  set('#seconds', '30');
  set('#answerMode', 'automatic');
  document.querySelector('form')?.requestSubmit();
  click('#cell-1');
  document.querySelector('form')?.requestSubmit();
  expect(app.state?.stage.phase).toBe('question');
  expect(document.querySelector('#answer-error')?.textContent).toContain(
    'Enter an answer',
  );
});

test('a delayed distinguishable second key retains its old context after the first key resolves', () => {
  app.start(defaultSetup('en'));
  correct(1, 'black');
  click('#cell-1');
  vi.advanceTimersByTime(2000);
  for (const [code, stamp] of [
    ['ShiftLeft', 10],
    ['ShiftRight', 30],
  ]) {
    const event = new KeyboardEvent('keydown', { code: String(code) });
    Object.defineProperty(event, 'timeStamp', { value: stamp });
    window.dispatchEvent(event);
  }
  vi.advanceTimersByTime(8);
  expect(app.state?.cells[0]).toBe('A');
  expect(app.state?.chooser).toBe('B');
  expect(document.querySelector('#error')?.textContent).toBe('');
});

/** @param {string} selector */
function click(selector) {
  const node = document.querySelector(selector);
  if (!node) throw new Error(`Missing control ${selector}`);
  node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

/** @param {string} selector @param {string} value */
function set(selector, value) {
  const node = document.querySelector(selector);
  if (!(node instanceof HTMLInputElement || node instanceof HTMLSelectElement))
    throw new Error(selector);
  node.value = value;
  node.dispatchEvent(new Event('input', { bubbles: true }));
  node.dispatchEvent(new Event('change', { bubbles: true }));
}

/** @param {import('../src/domain/types.js').ActionBody} action */
function send(action) {
  const state = app.state;
  if (!state) throw new Error('No active game');
  app.send({ ...action, sessionId: state.sessionId, revision: state.revision });
}

/** @param {number} cell @param {import('../src/domain/types.js').Owner} owner */
function correct(cell, owner) {
  set('#host-cell', String(cell));
  set('#host-owner', owner);
  click('#set-cell');
}

test('setup preserves edits through language/theme changes and locks content at start', () => {
  set('#nameA', '<b>Ada</b>');
  set('#nameB', 'Boris');
  set('#colorA', '#ffffff');
  set('#colorB', '#ffffff');
  set('#mode', 'numbers');
  set('#answerMode', 'automatic');
  set('#language', 'en');
  set('#seconds', '5');
  set('#starter', 'random');
  set('#ui-language', 'en');
  set('#theme', 'dark');
  expect(document.documentElement.lang).toBe('en');
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(document.querySelector('#nameA')).toHaveProperty(
    'value',
    '<b>Ada</b>',
  );
  document.querySelector('form')?.requestSubmit();
  expect(app.state?.config).toMatchObject({
    answerMode: 'automatic',
    timeLimitMs: 5000,
    starter: 'A',
  });
  expect(app.state?.pack.mode).toBe('numbers');
  expect(document.querySelector('#mode')).toBeNull();
  expect(document.querySelector('.player b')).toBeNull();
  expect(document.querySelector('.player strong')?.textContent).toBe(
    'A · <b>Ada</b>',
  );
});

test('hosted wrong attempts retain deadline, opponent gets one untimed opportunity', () => {
  app.start(defaultSetup('en'));
  click('#cell-1');
  const stage = app.state?.stage;
  vi.advanceTimersByTime(10_000);
  click('#judge-wrong');
  expect(app.state?.stage).toEqual(stage);
  expect(document.querySelector('#feedback')?.textContent).toContain(
    'Nepřijato',
  );
  expect(document.querySelector('#set-cell')).toBeNull();
  vi.advanceTimersByTime(20_000);
  expect(app.state?.stage.phase).toBe('opponent');
  expect(document.querySelector('#timer')).toBeNull();
  expect(root.textContent).not.toContain('Athens');
  click('#judge-correct');
  expect(app.state?.cells[0]).toBe('B');
  expect(app.state?.chooser).toBe('A');
  expect(document.querySelector('#feedback')?.textContent).toContain('Athens');
});

test('typed aliases, unsuccessful attempts and give-up follow recipient-based turns', () => {
  app.start({ ...defaultSetup('en'), answerMode: 'automatic' });
  click('#cell-1');
  set('#answer', 'wrong');
  document.querySelector('form')?.requestSubmit();
  expect(app.state?.stage.phase).toBe('question');
  set('#answer', '  ATHENS  ');
  document.querySelector('form')?.requestSubmit();
  expect(app.state?.cells[0]).toBe('A');
  expect(app.state?.chooser).toBe('B');
  click('#cell-2');
  click('#give-up');
  set('#answer', 'wrong');
  document.querySelector('form')?.requestSubmit();
  expect(app.state?.cells[1]).toBe('black');
  expect(app.state?.chooser).toBe('A');
  expect(
    document.querySelector('#cell-2')?.getAttribute('aria-label'),
  ).toContain('Černé');
});

test('host corrections are independent, immediately detect wins, reopen and reuse questions', () => {
  app.start(defaultSetup('en'));
  for (const cell of [1, 2, 4, 7, 11, 16, 22]) correct(cell, 'A');
  expect(app.state?.stage.phase).toBe('won');
  expect(document.querySelectorAll('.winning')).toHaveLength(7);
  set('#host-chooser', 'B');
  click('#set-chooser');
  correct(28, 'B');
  expect(app.state?.stage.phase).toBe('won');
  correct(1, 'unclaimed');
  expect(app.state?.stage.phase).toBe('selecting');
  expect(app.state?.chooser).toBe('B');
  click('#cell-1');
  expect(document.querySelector('.question-text')?.textContent).toContain(
    'capital of Greece',
  );
  click('#judge-correct');
  expect(app.state?.cells[0]).toBe('B');
  expect(document.querySelector('#cell-1 text')?.textContent).toBe('B');
});

test('duel interruption never awards; readiness must be separate, released and focused', () => {
  app.start(defaultSetup('en'));
  correct(1, 'black');
  click('#cell-1');
  expect(document.querySelector('#duel-target')?.textContent).toContain('Kruh');
  vi.advanceTimersByTime(2000);
  expect(document.querySelector('#duel-current')?.textContent).toContain(
    'Kruh',
  );
  window.dispatchEvent(new Event('blur'));
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  expect(document.querySelector('#set-cell')).toBeNull();
  const a = document.querySelector('#ready-A');
  const b = document.querySelector('#ready-B');
  if (!(a instanceof HTMLInputElement) || !(b instanceof HTMLInputElement))
    throw new Error('readiness');
  a.checked = true;
  a.dispatchEvent(new Event('change'));
  expect(document.querySelector('#restart')).toHaveProperty('disabled', true);
  b.checked = true;
  b.dispatchEvent(new Event('change'));
  vi.spyOn(document, 'hasFocus').mockReturnValue(false);
  click('#restart');
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  for (const code of ['ShiftLeft', 'ShiftRight']) {
    window.dispatchEvent(new KeyboardEvent('keydown', { code }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code }));
  }
  click('#restart');
  expect(app.state?.stage.phase).toBe('duel-preview');
  expect(app.state?.cells[0]).toBe('black');
});

test.each(['question', 'opponent'])(
  'presentation changes preserve only the current %s draft',
  (phase) => {
    app.start({ ...defaultSetup('en'), answerMode: 'automatic' });
    click('#cell-1');
    if (phase === 'opponent') click('#give-up');
    const opportunity = app.state;
    set('#answer', '  Ath? <test>  ');
    set('#theme', 'dark');
    expect(document.querySelector('#answer')).toHaveProperty(
      'value',
      '  Ath? <test>  ',
    );

    set('#ui-language', 'en');
    expect(document.querySelector('#answer')).toHaveProperty(
      'value',
      '  Ath? <test>  ',
    );
    expect(app.state).toBe(opportunity);
    expect(
      document.querySelector('.question-panel')?.textContent,
    ).not.toContain('Athens');
    click('#give-up');
    if (phase === 'question') {
      expect(document.querySelector('#answer')).toHaveProperty('value', '');
      click('#give-up');
    }
    click('#cell-2');
    expect(document.querySelector('#answer')).toHaveProperty('value', '');
  },
);

test('another focus loss invalidates release confirmations even while already interrupted', () => {
  app.start(defaultSetup('en'));
  correct(1, 'black');
  click('#cell-1');
  const previous = app.state;
  if (!previous) throw new Error('Missing duel');
  window.dispatchEvent(new Event('blur'));
  app.send({
    type: 'restart',
    sessionId: previous.sessionId,
    revision: previous.revision,
  });
  expect(document.querySelector('#restart-feedback')?.textContent).toBe('');
  vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  for (const code of ['ShiftLeft', 'ShiftRight']) {
    window.dispatchEvent(new KeyboardEvent('keydown', { code }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code }));
  }
  window.dispatchEvent(new Event('blur'));
  click('#ready-A');
  click('#ready-B');
  click('#restart');
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  expect(document.querySelector('#restart-feedback')?.textContent).toContain(
    'stiskněte a pusťte',
  );
  expect(app.state?.cells[0]).toBe('black');
});

test('new game confirmation does not pause questions and discarded callbacks cannot revive a game', () => {
  app.start(defaultSetup('en'));
  click('#cell-1');
  const oldJudge = document.querySelector('#judge-correct');
  click('#new-game');
  app.requestNew();
  expect(document.querySelectorAll('dialog')).toHaveLength(1);
  vi.advanceTimersByTime(30_000);
  expect(app.state?.stage.phase).toBe('opponent');
  click('#cancel-new');
  expect(document.querySelector('dialog')).toBeNull();
  click('#new-game');
  click('#discard-new');
  oldJudge?.dispatchEvent(new MouseEvent('click'));
  vi.advanceTimersByTime(60_000);
  expect(app.state).toBeNull();
  expect(document.querySelector('#start')).not.toBeNull();
  expect(vi.getTimerCount()).toBe(0);
});

test('opening new-game controls invalidates a duel and cancel keeps it interrupted', () => {
  app.start(defaultSetup('en'));
  correct(1, 'black');
  click('#cell-1');
  click('#new-game');
  click('#cancel-new');
  expect(app.state?.stage.phase).toBe('duel-interrupted');
  expect(app.state?.cells[0]).toBe('black');
});

test('unavailable corrections and backwards clock errors are localized without corruption', () => {
  app.start(defaultSetup('en'));
  click('#cell-1');
  const state = app.state;
  send({ type: 'set-cell', cell: 1, owner: 'A' });
  expect(app.state).toBe(state);
  expect(document.querySelector('#error')?.textContent).toContain(
    'Úpravy hostitele',
  );
  vi.setSystemTime(999);
  click('#judge-correct');
  expect(app.state).toBe(state);
  expect(document.querySelector('#error')?.textContent).toContain('Hodiny');
  vi.setSystemTime(1000);
  click('#judge-correct');
  expect(app.state?.cells[0]).toBe('A');
});

test('SVG selection keyboard handles activation and ignores unrelated or unavailable keys', () => {
  app.start(defaultSetup('en'));
  const cell = document.querySelector('#cell-1');
  cell?.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'x', bubbles: true }),
  );
  expect(app.state?.stage.phase).toBe('selecting');
  cell?.dispatchEvent(
    new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
  );
  expect(app.state?.stage.phase).toBe('question');
  click('#cell-2');
  expect(app.state?.stage).toMatchObject({ round: { cell: 1 } });
  click('#judge-correct');
  click('#cell-1');
  expect(app.state?.stage.phase).toBe('selecting');
});

test('dispose removes timers, input listeners and old controls; queued actions remain inert', () => {
  app.start(defaultSetup('en'));
  click('#cell-1');
  const state = app.state;
  if (!state) throw new Error('game');
  const judge = document.querySelector('#judge-correct');
  app.dispose();
  app.send({
    type: 'judge',
    correct: true,
    sessionId: state.sessionId,
    revision: state.revision,
  });
  app.start(defaultSetup('cs'));
  app.render();
  app.interrupt();
  judge?.dispatchEvent(new MouseEvent('click'));
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft' }));
  window.dispatchEvent(new Event('blur'));
  vi.runAllTimers();
  expect(root.childElementCount).toBe(0);
  expect(app.state).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
  expect(app.keyboard.held.size).toBe(0);
});
