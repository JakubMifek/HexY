import { expect, test } from 'vitest';
import { recoverGame, validateSave } from '../src/domain/saves.js';
import { transition } from '../src/domain/game.js';
import { act, duel, game, question } from './fixtures.js';

test('JSON save validation round trips selection, timed question and opponent opportunity', () => {
  const states = [game(), question(), act(question(), { type: 'give-up' })];
  for (const state of states) {
    expect(validateSave(JSON.parse(JSON.stringify(state)))).toEqual(state);
    const recovered = recoverGame(
      JSON.stringify(state),
      2_000,
      'recovered-session',
    );
    expect(recovered.cells).toEqual(state.cells);
    expect(recovered.chooser).toBe(state.chooser);
    expect(recovered.stage).toEqual(state.stage);
    expect(recovered.revision).toBe(state.revision + 1);
  }
});

test('reload preserves the exact original deadline rather than granting extra time', () => {
  const state = question();
  const resumed = recoverGame(
    JSON.stringify(state),
    30_999,
    'recovered-session',
  );
  expect(resumed.stage).toEqual(state.stage);
  const expired = recoverGame(
    JSON.stringify(state),
    31_000,
    'recovered-session',
  );
  expect(expired.stage).toMatchObject({
    phase: 'opponent',
    round: { startedAt: 1_000, deadline: 31_000 },
  });
  expect(expired.cells[0]).toBe('unclaimed');
});

test('preview, active and already interrupted duel recover into explicit restart state', () => {
  const preview = duel();
  const active = act(preview, { type: 'tick' }, 1_100);
  const interrupted = act(active, { type: 'interrupt' }, 1_101);
  for (const state of [preview, active, interrupted]) {
    expect(validateSave(JSON.parse(JSON.stringify(state)))).toEqual(state);
    const recovered = recoverGame(
      JSON.stringify(state),
      100_000,
      'recovered-session',
    );
    expect(recovered.stage).toEqual({
      phase: 'duel-interrupted',
      round: { cell: 1, originalChooser: 'A' },
    });
    expect(recovered.cells[0]).toBe('black');
    expect(recovered.chooser).toBe('A');
  }
});

test('recovery invalidates callbacks from the saved round', () => {
  const state = question();
  const recovered = recoverGame(
    JSON.stringify(state),
    2_000,
    'recovered-session',
  );
  const result = transition(
    recovered,
    {
      type: 'judge',
      correct: true,
      sessionId: state.sessionId,
      revision: state.revision,
    },
    { now: 2_001, random: () => 0 },
  );
  expect(result.reason).toBe('stale');
  expect(result.state).toBe(recovered);
});

test('winning saves must contain the actual connected winning group', () => {
  let state = game();
  for (const cell of [1, 2, 4, 7, 11, 16, 22])
    state = act(state, { type: 'set-cell', cell, owner: 'A' });
  expect(validateSave(JSON.parse(JSON.stringify(state)))).toEqual(state);
  expect(() =>
    validateSave({ ...state, stage: { phase: 'selecting' } }),
  ).toThrow('invalidVictory');
  expect(() =>
    validateSave({
      ...state,
      stage: { phase: 'won', winner: 'B', winningCells: [28] },
    }),
  ).toThrow('invalidVictory');
});

test.each([
  [null, 'invalidObject'],
  [{ schemaVersion: 999 }, 'saveVersion'],
  [{ ...game(), cells: [] }, 'boardCount'],
  [{ ...game(), cells: Array(28).fill('unknown') }, 'invalidChoice'],
  [{ ...game(), revision: -1 }, 'invalidNumber'],
  [{ ...game(), lastNow: Infinity }, 'invalidNumber'],
  [{ ...game(), stage: { phase: 'paused' } }, 'invalidChoice'],
])('rejects invalid save boundary %#', (value, code) => {
  expect(() => validateSave(value)).toThrow(code);
});

test('save validation detects forged deadlines, chooser mismatch and conflicting ownership', () => {
  const state = question();
  if (state.stage.phase !== 'question') throw new Error('test setup');
  const changed = structuredClone(state);
  if (changed.stage.phase !== 'question') throw new Error('test setup');
  changed.stage.round.deadline += 10;
  expect(() => validateSave(changed)).toThrow('invalidDeadline');
  expect(() => validateSave({ ...state, chooser: 'B' })).toThrow(
    'invalidRound',
  );
  state.cells[0] = 'black';
  expect(() => validateSave(state)).toThrow('invalidRound');
});

test('invalid saved duel sequences and phase timing cannot be resumed', () => {
  const state = duel();
  if (state.stage.phase !== 'duel-preview') throw new Error('test setup');
  const round = state.stage.round;
  expect(() =>
    validateSave({
      ...state,
      stage: {
        ...state.stage,
        round: { ...round, sequence: [round.target, round.target] },
      },
    }),
  ).toThrow('invalidDuel');
  expect(() =>
    validateSave({ ...state, stage: { ...state.stage, phase: 'duel-active' } }),
  ).toThrow('invalidDuel');
  state.cells[0] = 'unclaimed';
  expect(() => validateSave(state)).toThrow('invalidRound');
});

test('invalid JSON or a backwards recovery clock fails without destroying the valid save', () => {
  expect(() => recoverGame('{', 1_000, 'recovered-session')).toThrow(
    'invalidJson',
  );
  const saved = JSON.stringify(question());
  expect(() => recoverGame(saved, 999, 'recovered-session')).toThrow(
    'clockBackwards',
  );
  expect(recoverGame(saved, 1_000, 'recovered-session').stage.phase).toBe(
    'question',
  );
});

test('recovery requires a fresh session scope and rejects old callbacks with coincident revisions', () => {
  const state = question();
  const json = JSON.stringify(state);
  expect(() => recoverGame(json, 2_000, state.sessionId)).toThrow(
    'sessionReused',
  );
  const recovered = recoverGame(json, 2_000, 'recovered-session');
  const result = transition(
    recovered,
    {
      type: 'judge',
      correct: true,
      sessionId: state.sessionId,
      revision: recovered.revision,
    },
    { now: 2_001, random: () => 0 },
  );
  expect(result.reason).toBe('stale');
  expect(result.state).toBe(recovered);
});
