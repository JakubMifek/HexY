import { expect, test } from 'vitest';
import { randomStarter } from '../src/domain/config.js';
import { transition } from '../src/domain/game.js';
import { act, duel, game } from './fixtures.js';

test('the target is guaranteed within a bounded sequence from injected randomness', () => {
  for (const sample of [0, 0.1, 0.5, 0.999999]) {
    const state = duel(() => sample);
    expect(state.stage.phase).toBe('duel-preview');
    if (state.stage.phase !== 'duel-preview') throw new Error('test setup');
    const round = state.stage.round;
    expect(round.sequence.length).toBeLessThanOrEqual(3);
    expect(round.sequence.at(-1)).toBe(round.target);
    expect(round.sequence.filter((s) => s === round.target)).toHaveLength(1);
  }
});

test('a valid target press captures for the presser and switches from recipient', () => {
  const active = act(duel(), { type: 'tick' }, 1_100);
  const state = act(active, { type: 'press', players: ['B'] }, 1_101);
  expect(state.cells[0]).toBe('B');
  expect(state.chooser).toBe('A');
});

test('a wrong-symbol press awards the opponent, not the original chooser by default', () => {
  const active = act(
    duel(() => 0.999),
    { type: 'tick' },
    1_100,
  );
  const state = act(active, { type: 'press', players: ['A'] }, 1_101);
  expect(state.cells[0]).toBe('B');
  expect(state.chooser).toBe('A');
});

test('indistinguishable ties replay without an award or chooser change', () => {
  const active = act(duel(), { type: 'tick' }, 1_100);
  const state = act(active, { type: 'press', players: ['B', 'A'] }, 1_101);
  expect(state.stage.phase).toBe('duel-preview');
  expect(state.cells[0]).toBe('black');
  expect(state.chooser).toBe('A');
  expect(state.revision).toBeGreaterThan(active.revision);
});

test('a missed target repeats and late presses cannot capture the expired target', () => {
  const active = act(duel(), { type: 'tick' }, 1_100);
  const state = act(active, { type: 'press', players: ['A'] }, 1_200);
  expect(state.stage.phase).toBe('duel-preview');
  expect(state.cells[0]).toBe('black');
  expect(state.chooser).toBe('A');
});

test('preview presses do nothing and symbol changes invalidate queued events', () => {
  const preview = duel(() => 0.999);
  expect(act(preview, { type: 'press', players: ['A'] }, 1_099)).toBe(preview);
  const active = act(preview, { type: 'tick' }, 1_100);
  const next = act(active, { type: 'tick' }, 1_200);
  expect(next.revision).toBeGreaterThan(active.revision);
  const stale = transition(
    next,
    {
      type: 'press',
      players: ['A'],
      sessionId: active.sessionId,
      revision: active.revision,
    },
    { now: 1_201, random: () => 0 },
  );
  expect(stale.reason).toBe('stale');
  expect(stale.state.cells[0]).toBe('black');
});

test('interruption requires explicit readiness restart with no award or chooser change', () => {
  const active = act(duel(), { type: 'tick' }, 1_100);
  const interrupted = act(active, { type: 'interrupt' }, 1_101);
  expect(interrupted.stage).toEqual({
    phase: 'duel-interrupted',
    round: { cell: 1, originalChooser: 'A' },
  });
  expect(act(interrupted, { type: 'press', players: ['A'] }, 5_000)).toBe(
    interrupted,
  );
  const restarted = act(interrupted, { type: 'restart' }, 5_001);
  expect(restarted.stage).toMatchObject({
    phase: 'duel-preview',
    round: { startsAt: 5_101 },
  });
  expect(restarted.cells[0]).toBe('black');
  expect(restarted.chooser).toBe('A');
});

test('lightning captures use the same connected victory rule', () => {
  let state = game();
  for (const cell of [2, 4, 7, 11, 16, 22])
    state = act(state, { type: 'set-cell', cell, owner: 'A' });
  state = act(state, { type: 'set-cell', cell: 1, owner: 'black' });
  state = act(state, { type: 'select', cell: 1 });
  state = act(state, { type: 'tick' }, 1_100);
  state = act(state, { type: 'press', players: ['A'] }, 1_101);
  expect(state.stage).toMatchObject({ phase: 'won', winner: 'A' });
  expect(state.chooser).toBe('B');
});

test('randomness contract rejects invalid samples and deterministic starter honors endpoints', () => {
  expect(randomStarter(() => 0)).toBe('A');
  expect(randomStarter(() => 0.999999)).toBe('B');
  for (const sample of [-0.1, 1, Infinity, NaN]) {
    expect(() => randomStarter(() => sample)).toThrow('randomRange');
    expect(() => duel(() => sample)).toThrow('randomRange');
  }
});

test('invalid press batches are rejected, without representing repeats as new presses', () => {
  const active = act(duel(), { type: 'tick' }, 1_100);
  for (const players of [[], ['A', 'A'], ['C']]) {
    expect(() =>
      transition(
        active,
        {
          type: 'press',
          players,
          sessionId: active.sessionId,
          revision: active.revision,
        },
        { now: 1_101, random: () => 0 },
      ),
    ).toThrow();
  }
});

test.each([1_100, 1_200, 999_999])(
  'interruption takes priority over a due symbol or replay at %d',
  (now) => {
    const state = act(duel(), { type: 'interrupt' }, now, () => {
      throw new Error('interruption must not generate a new sequence');
    });
    expect(state.stage.phase).toBe('duel-interrupted');
    expect(state.cells[0]).toBe('black');
    expect(state.chooser).toBe('A');
  },
);
