import { afterEach, expect, test, vi } from 'vitest';
import { RoundClock, nextBoundary } from '../src/runtime/clock.js';
import { act, duel, question } from './fixtures.js';

afterEach(() => vi.useRealTimers());

test('question timer rebinds revisions without resetting deadline and disposes pending work', () => {
  vi.useFakeTimers();
  vi.setSystemTime(1000);
  const tick = vi.fn();
  const display = vi.fn();
  /** @type {import('../src/runtime/clock.js').Clock} */
  const clock = {
    now: () => Date.now(),
    later: (callback, delay) => Number(setTimeout(callback, delay)),
    cancel: (id) => clearTimeout(id),
  };
  const timer = new RoundClock(clock, tick, display);
  const first = question();
  timer.bind(first);
  vi.advanceTimersByTime(10_000);
  const wrong = act(first, { type: 'judge', correct: false }, 11_000);
  timer.bind(wrong);
  vi.advanceTimersByTime(19_999);
  expect(tick).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(tick).toHaveBeenCalledExactlyOnceWith(wrong);
  timer.bind(act(wrong, { type: 'tick' }, 31_000));
  expect(vi.getTimerCount()).toBe(0);
  timer.bind(first);
  timer.dispose();
  expect(vi.getTimerCount()).toBe(0);
  expect(display).toHaveBeenCalled();
});

test('duel boundaries follow rendered sequence context rather than independent display time', () => {
  const preview = duel(() => 0.99);
  expect(nextBoundary(preview)).toBe(1100);
  const active = act(preview, { type: 'tick' }, 1100);
  expect(nextBoundary(active)).toBe(1200);
  expect(nextBoundary(act(active, { type: 'tick' }, 1200))).toBe(1300);
  expect(nextBoundary(act(active, { type: 'interrupt' }, 1150))).toBeNull();
});
