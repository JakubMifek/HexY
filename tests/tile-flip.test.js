// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from '../src/app.js';
import { browserClock } from '../src/runtime/clock.js';
import { defaultSetup } from './fixtures.js';

/** @type {App} */
let app;
let sequence = 0;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1000);
  localStorage.clear();
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  app = new App(
    root,
    browserClock,
    () => 0,
    () => `flip-${++sequence}`,
  );
});
afterEach(() => {
  app.dispose();
  vi.restoreAllMocks();
  vi.useRealTimers();
  document.body.replaceChildren();
});

/** @param {string} selector */
function click(selector) {
  const node = document.querySelector(selector);
  if (!node) throw new Error(selector);
  node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

/** @param {string} selector */
function required(selector) {
  const node = document.querySelector(selector);
  if (!node) throw new Error(selector);
  return node;
}

test('accepted selection alone emits a flip; ticks, wrong judgments, theme and opponent never replay it', () => {
  app.start(defaultSetup('en'));
  click('#cell-4');
  const face = document.querySelector('#cell-4 .flipping');
  expect(face?.querySelector('.revealed-initial')?.textContent).toBe('CH');
  expect(app.state?.stage).toMatchObject({
    phase: 'question',
    round: { cell: 4, deadline: 31000 },
  });
  expect(app.feedback.flipCell).toBeUndefined();
  vi.advanceTimersByTime(500);
  expect(document.querySelector('#cell-4 .flipping')).toBe(face);
  click('#theme');
  expect(face?.isConnected).toBe(false);
  expect(document.querySelector('.flipping')).toBeNull();
  click('#judge-wrong');
  expect(document.querySelector('.flipping')).toBeNull();
  expect(document.querySelector('.revealed-initial')?.textContent).toBe('CH');
  click('#give-up');
  expect(app.state?.stage.phase).toBe('opponent');
  expect(document.querySelector('.revealed-initial')?.textContent).toBe('CH');
  expect(document.querySelector('.flipping')).toBeNull();
  click('#give-up');
  expect(document.querySelector('.revealed-initial')).toBeNull();
  expect(document.querySelector('#cell-4 .cell-label')?.textContent).toBe('CH');
  click('#cell-4');
  expect(app.state?.stage.phase).toBe('duel-preview');
  expect(document.querySelector('.flipping, .revealed-initial')).toBeNull();
});

test('recovered question retains full initial and original deadline without persisting an animation', () => {
  app.start(defaultSetup('cs'));
  click('#cell-10');
  expect(document.querySelector('.revealed-initial')?.textContent).toBe('Ch');
  const face = document.querySelector('.flipping');
  const saved = localStorage.getItem('hexy.game.v1');
  expect(saved).not.toContain('flipCell');
  app.dispose();
  expect(face?.isConnected).toBe(false);
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  app = new App(
    root,
    browserClock,
    () => 0,
    () => `flip-${++sequence}`,
  );
  expect(app.state?.stage).toMatchObject({
    phase: 'question',
    round: { cell: 10, deadline: 31000 },
  });
  expect(document.querySelector('.revealed-initial')?.textContent).toBe('Ch');
  expect(document.querySelector('.flipping')).toBeNull();
  vi.advanceTimersByTime(30000);
  expect(app.state?.stage.phase).toBe('opponent');
  expect(document.querySelector('.revealed-initial')?.textContent).toBe('Ch');
  click('#judge-correct');
  expect(document.querySelector('#cell-10 text')).toBeNull();
  expect(app.state?.cells[9]).toBe('B');
});

test('countdown follows actual configured player, existing clock and rerenders without stale updates', () => {
  /** @type {import('../src/ui/setup.js').Setup} */
  const settings = defaultSetup('en');
  settings.starter = 'B';
  settings.players.B.color = '#a13de0';
  app.start(settings);
  click('#cell-28');
  const ring = required('.tile-countdown');
  expect(
    required('.tile-countdown circle:last-child').getAttribute('stroke'),
  ).toBe('#a13de0');
  expect(ring.getAttribute('stroke-dasharray')).toBe('100 100');
  expect(required('.board > :last-child').id).toBe('cell-28');
  vi.advanceTimersByTime(7500);
  expect(ring.getAttribute('stroke-dasharray')).toBe('75 100');
  expect(ring.getAttribute('stroke-dashoffset')).toBe('-25');
  expect(required('#timer').textContent).toBe('23 s');
  click('#theme');
  expect(ring.isConnected).toBe(false);
  const replacement = required('.tile-countdown');
  expect(replacement.getAttribute('stroke-dasharray')).toBe('75 100');
  expect(document.querySelector('.flipping')).toBeNull();
  vi.advanceTimersByTime(7500);
  expect(replacement.getAttribute('stroke-dasharray')).toBe('50 100');
  expect(ring.getAttribute('stroke-dasharray')).toBe('75 100');
  vi.advanceTimersByTime(15000);
  expect(app.state?.stage.phase).toBe('opponent');
  expect(document.querySelector('.tile-countdown, .question-tile')).toBeNull();
  expect(replacement.isConnected).toBe(false);
  vi.advanceTimersByTime(90000);
  expect(app.state?.stage.phase).toBe('opponent');
  click('#give-up');
  click('#cell-28');
  expect(app.state?.stage.phase).toBe('duel-preview');
  expect(document.querySelector('.tile-countdown, .question-tile')).toBeNull();
});

test('recovery resumes elapsed progress and legacy custom colors; disposal removes all timer resources', () => {
  const settings = defaultSetup('cs');
  settings.players.A.color = '#22d3ee';
  app.start(settings);
  click('#cell-1');
  vi.advanceTimersByTime(12000);
  const detached = document.querySelector('.tile-countdown');
  app.dispose();
  expect(vi.getTimerCount()).toBe(0);
  expect(detached?.isConnected).toBe(false);
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  app = new App(
    root,
    browserClock,
    () => 0,
    () => `flip-${++sequence}`,
  );
  const ring = document.querySelector('.tile-countdown');
  expect(ring?.lastElementChild?.getAttribute('stroke')).toBe('#22d3ee');
  expect(ring?.getAttribute('stroke-dasharray')).toBe('60 100');
  expect(document.querySelector('.flipping')).toBeNull();
  expect(app.state?.stage).toMatchObject({ round: { deadline: 31000 } });
  vi.advanceTimersByTime(18000);
  expect(app.state?.stage.phase).toBe('opponent');
  expect(document.querySelector('.tile-countdown')).toBeNull();
});
