// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { countdownView, displayCountdown } from '../src/ui/countdown.js';
import { defaultSetup, randomPlayers } from '../src/ui/setup.js';
import { question, act } from './fixtures.js';

test('the full ring empties clockwise from twelve o’clock using the existing deadline and duration', () => {
  const state = question();
  const root = document.createElement('div');
  const ring = countdownView('#Ab12Cd');
  root.append(ring);
  expect(ring.getAttribute('aria-hidden')).toBe('true');
  expect(ring.getAttribute('transform')).toBe('rotate(-90)');
  expect([...ring.children].map((node) => node.getAttribute('stroke'))).toEqual(
    ['#17283c', '#Ab12Cd'],
  );
  for (const [now, remaining, offset] of [
    [0, 100, 0],
    [1000, 100, 0],
    [8500, 75, -25],
    [16000, 50, -50],
    [30999, 1 / 300, 1 / 300 - 100],
    [31000, 0, -100],
    [40000, 0, -100],
  ]) {
    displayCountdown(root, state, now);
    expect(
      Number(ring.getAttribute('stroke-dasharray')?.split(' ')[0]),
    ).toBeCloseTo(remaining);
    expect(Number(ring.getAttribute('stroke-dashoffset'))).toBeCloseTo(offset);
  }
  expect(state.stage).toMatchObject({ round: { deadline: 31000 } });
});

test('missing views and untimed states never animate a leftover ring', () => {
  const state = question();
  displayCountdown(document.createElement('div'), state, 16000);
  const root = document.createElement('div');
  const ring = countdownView('#ffffff');
  root.append(ring);
  for (const untimed of [null, act(state, { type: 'give-up' })]) {
    displayCountdown(root, untimed, 16000);
    expect(ring.getAttribute('stroke-dasharray')).toBe('100 100');
  }
});

test('all fresh setup paths use the owner RGB defaults without sharing mutable players', () => {
  for (const language of /** @type {const} */ (['cs', 'en'])) {
    const setup = defaultSetup(language);
    const players = randomPlayers(() => 0);
    expect(setup.players.A.color).toBe('#129FB5');
    expect(setup.players.B.color).toBe('#FBA123');
    expect(players.A.color).toBe(setup.players.A.color);
    expect(players.B.color).toBe(setup.players.B.color);
    setup.players.A.color = '#000000';
    expect(defaultSetup(language).players.A.color).toBe('#129FB5');
  }
});
