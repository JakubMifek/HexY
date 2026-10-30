import { expect, test, vi } from 'vitest';
import { act, duel, game, question } from './fixtures.js';
import { recoverGame, validateSave } from '../src/domain/saves.js';
import { browserGame, DUEL_SYMBOLS } from '../src/runtime/symbols.js';
import { transition } from '../src/domain/game.js';

test('many complete cycles retain one target, all seven shapes and bounded serializable state', () => {
  let state = act(duel(), { type: 'tick' }, 1100);
  if (state.stage.phase !== 'duel-active') throw new Error('fixture');
  const target = state.stage.round.target;
  for (let cycle = 0; cycle < 12; cycle += 1) {
    const seen = new Set();
    for (let index = 0; index < 7; index += 1) {
      state = act(
        state,
        { type: 'tick' },
        1100 + cycle * 700 + index * 100,
        () => (cycle % 3) / 3,
      );
      if (state.stage.phase !== 'duel-active')
        throw new Error('rotation stopped');
      expect(state.stage.round.target).toBe(target);
      expect(state.stage.round.sequence).toHaveLength(7);
      seen.add(state.stage.round.sequence[index]);
      expect(JSON.stringify(state.stage).length).toBeLessThan(250);
      expect(validateSave(state)).toEqual(state);
    }
    expect(seen).toEqual(new Set(Object.keys(DUEL_SYMBOLS)));
    expect(state.cells[0]).toBe('black');
    expect(state.chooser).toBe('A');
  }
});

test('delayed cycle rollover performs bounded work and never reinterprets a late press', () => {
  const active = act(duel(), { type: 'tick' }, 1100);
  const random = vi.fn(() => 0.5);
  const next = act(
    active,
    { type: 'press', players: ['A'] },
    7_001_150,
    random,
  );
  expect(next.stage).toMatchObject({
    phase: 'duel-active',
    round: { startsAt: 7_001_100, target: 'circle' },
  });
  expect(next.cells[0]).toBe('black');
  expect(random).toHaveBeenCalledTimes(6);
  expect(validateSave(next)).toEqual(next);
  const stale = transition(
    next,
    {
      type: 'press',
      players: ['B'],
      sessionId: active.sessionId,
      revision: active.revision,
    },
    { now: 7_001_151, random },
  );
  expect(stale.reason).toBe('stale');
});

test('cycle saves recover interrupted with fresh scope and never preserve queued capture context', () => {
  const active = act(duel(), { type: 'tick' }, 12_350);
  const restored = recoverGame(JSON.stringify(active), 12_400, 'recovered');
  expect(restored.stage).toEqual({
    phase: 'duel-interrupted',
    round: { cell: 1, originalChooser: 'A' },
  });
  expect(restored.cells).toEqual(active.cells);
  expect(restored.chooser).toBe(active.chooser);
  expect(restored.revision).toBeGreaterThan(active.revision);
  expect(act(restored, { type: 'restart' }, 12_500).stage).toMatchObject({
    phase: 'duel-preview',
    round: { startsAt: 12_600 },
  });
});

test('new cycles reject omitted, repeated and foreign symbols and inconsistent length', () => {
  const state = duel();
  if (state.stage.phase !== 'duel-preview') throw new Error('fixture');
  const omitted = structuredClone(state);
  if (omitted.stage.phase !== 'duel-preview') throw new Error('fixture');
  omitted.stage.round.sequence.pop();
  expect(() => validateSave(omitted)).toThrow('invalidDuel');
  state.stage.round.sequence[1] = state.stage.round.sequence[0];
  expect(() => validateSave(state)).toThrow('invalidDuel');
  const invalid = game();
  invalid.config.duel.length = 5;
  expect(() => validateSave(invalid)).toThrow('invalidDuel');
  invalid.config.duel.length = 7;
  invalid.config.duel.symbols[0] = 'ring';
  expect(() => browserGame(validateSave(invalid))).toThrow('duelCompatibility');
});

test('legacy four-symbol active saves validate before safe seven-symbol migration', () => {
  const state = duel();
  if (state.stage.phase !== 'duel-preview') throw new Error('fixture');
  state.schemaVersion = 1;
  state.config.duel.symbols = ['circle', 'triangle', 'square', 'star'];
  state.config.duel.length = 5;
  state.stage.round.sequence = ['square', 'circle'];
  expect(validateSave(state).schemaVersion).toBe(1);
  expect(browserGame(validateSave(state)).stage.phase).toBe('duel-interrupted');
  const restored = browserGame(
    recoverGame(JSON.stringify(state), 3000, 'legacy'),
  );
  expect(restored.schemaVersion).toBe(2);
  expect(restored.config.duel.symbols).toEqual(Object.keys(DUEL_SYMBOLS));
  expect(restored.stage.phase).toBe('duel-interrupted');
  expect(restored.cells).toEqual(state.cells);
  state.stage.round.sequence = ['circle', 'square'];
  expect(() => validateSave(state)).toThrow('invalidDuel');
});

test('legacy question upgrades preserve its exact deadline; unknown legacy shapes are not guessed', () => {
  const state = question();
  state.schemaVersion = 1;
  state.config.duel.symbols = ['circle', 'star'];
  const restored = browserGame(validateSave(state));
  expect(restored.stage).toEqual(state.stage);
  expect(restored.pack).toEqual(state.pack);
  state.config.duel.symbols = ['circle', 'sun'];
  expect(() => browserGame(validateSave(state))).toThrow('duelCompatibility');
});
