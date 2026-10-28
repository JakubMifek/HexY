// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { DuelKeyboard } from '../src/runtime/keyboard.js';
import { browserClock } from '../src/runtime/clock.js';
import { act, duel } from './fixtures.js';

/** @type {DuelKeyboard} */
let keyboard;
const send = vi.fn();
const interrupt = vi.fn();
beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  send.mockClear();
  interrupt.mockClear();
  keyboard = new DuelKeyboard(window, browserClock, send, interrupt);
});

test('missed outside releases require observed in-window keyups, not a cleared held set', () => {
  down('ShiftLeft', 1);
  keyboard.requireReleases();
  vi.spyOn(document, 'hasFocus').mockReturnValue(false);
  window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft' }));
  expect(keyboard.releasesRequired).toEqual(
    new Set(['ShiftLeft', 'ShiftRight']),
  );
  vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftRight' }));
  expect(keyboard.releasesRequired.size).toBe(2);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  down('ShiftLeft', 2, true);
  expect(keyboard.releasesRequired.size).toBe(2);
  for (const code of ['ShiftLeft', 'ShiftRight']) {
    down(code, 3);
    window.dispatchEvent(new KeyboardEvent('keyup', { code }));
  }
  vi.advanceTimersByTime(8);
  expect(keyboard.releasesRequired.size).toBe(0);
  expect(keyboard.held.size).toBe(0);
  expect(send).not.toHaveBeenCalled();
  keyboard.bind(act(duel(), { type: 'tick' }, 1100));
  down('ShiftLeft', 10, true);
  vi.advanceTimersByTime(8);
  expect(send).not.toHaveBeenCalled();
  down('ShiftLeft', 20);
  vi.advanceTimersByTime(8);
  expect(send).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ players: ['A'] }),
  );
});
afterEach(() => {
  keyboard.dispose();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

/** @param {string} code @param {number} stamp @param {boolean} [repeat] */
function down(code, stamp, repeat = false) {
  const event = new KeyboardEvent('keydown', { code, repeat });
  Object.defineProperty(event, 'timeStamp', { value: stamp });
  window.dispatchEvent(event);
}

test('only fresh Shift rising edges in active visual context reach the engine boundary', () => {
  down('KeyA', 1);
  down('ShiftLeft', 2);
  keyboard.bind(duel());
  down('ShiftRight', 3);
  keyboard.bind(act(duel(), { type: 'tick' }, 1100));
  down('ShiftLeft', 4);
  down('ShiftRight', 5, true);
  vi.advanceTimersByTime(20);
  expect(send).not.toHaveBeenCalled();
  window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft' }));
  down('ShiftLeft', 6);
  vi.advanceTimersByTime(8);
  expect(send).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ type: 'press', players: ['A'], revision: 3 }),
  );
});

test.each([
  ['ShiftLeft', 'ShiftRight'],
  ['ShiftRight', 'ShiftLeft'],
])('same timestamp %s/%s is one atomic tie batch', (first, second) => {
  keyboard.bind(act(duel(), { type: 'tick' }, 1100));
  down(first, 10);
  down(second, 10);
  vi.advanceTimersByTime(8);
  expect(send).toHaveBeenCalledTimes(1);
  expect(new Set(send.mock.calls[0][0].players)).toEqual(new Set(['A', 'B']));
});

test('distinguishable event timestamps are never merged even if callbacks are delayed', () => {
  keyboard.bind(act(duel(), { type: 'tick' }, 1100));
  down('ShiftRight', 10);
  down('ShiftLeft', 30);
  expect(send).toHaveBeenCalledTimes(1);
  expect(send.mock.calls[0][0].players).toEqual(['B']);
  vi.advanceTimersByTime(8);
  expect(send.mock.calls[1][0].players).toEqual(['A']);
});

test('symbol revision, blur, hidden tab and disposal cancel pending input', () => {
  const active = act(
    duel(() => 0.99),
    { type: 'tick' },
    1100,
  );
  keyboard.bind(active);
  down('ShiftLeft', 10);
  keyboard.bind(act(active, { type: 'tick' }, 1200));
  vi.advanceTimersByTime(8);
  expect(send).not.toHaveBeenCalled();
  down('ShiftRight', 20);
  window.dispatchEvent(new Event('blur'));
  expect(interrupt).toHaveBeenCalledOnce();
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  document.dispatchEvent(new Event('visibilitychange'));
  expect(interrupt).toHaveBeenCalledOnce();
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  document.dispatchEvent(new Event('visibilitychange'));
  expect(interrupt).toHaveBeenCalledTimes(2);
  keyboard.dispose();
  window.dispatchEvent(new Event('blur'));
  vi.runAllTimers();
  expect(send).not.toHaveBeenCalled();
  expect(interrupt).toHaveBeenCalledTimes(2);
  expect(vi.getTimerCount()).toBe(0);
});
