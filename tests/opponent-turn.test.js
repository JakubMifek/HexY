import { expect, test } from 'vitest';
import { createGame, remainingMs, transition } from '../src/domain/game.js';
import { recoverGame, validateSave } from '../src/domain/saves.js';
import { nextBoundary } from '../src/runtime/clock.js';
import { act, boardPack, config, question } from './fixtures.js';

/** @param {'hosted'|'automatic'} [mode] @param {'A'|'B'} [starter] @param {number} [timeLimitMs] */
function offer(mode = 'hosted', starter = 'A', timeLimitMs = 30_000) {
  const game = createGame(
    boardPack(),
    { ...config(mode), starter, timeLimitMs },
    1_000,
    'opponent-test',
  );
  return act(act(game, { type: 'select', cell: 1 }), { type: 'give-up' });
}

for (const mode of /** @type {const} */ (['hosted', 'automatic'])) {
  for (const starter of /** @type {const} */ (['A', 'B'])) {
    test(`${mode} ${starter}: declining preserves the opponent's next selection`, () => {
      const state = offer(mode, starter);
      expect(state.stage.phase).toBe('opponent-offer');
      expect(remainingMs(state, 999_000)).toBeNull();
      expect(nextBoundary(state)).toBeNull();
      const declined = act(state, { type: 'decline-opponent' }, 999_000);
      expect(declined.stage.phase).toBe('selecting');
      expect(declined.cells[0]).toBe('black');
      expect(declined.chooser).toBe(starter === 'A' ? 'B' : 'A');
    });

    test.each(['correct', 'give-up', 'timeout'])(
      `${mode} ${starter}: accepting spends the turn on %s`,
      (outcome) => {
        const state = act(
          offer(mode, starter),
          { type: 'accept-opponent' },
          50_000,
        );
        const recipient = starter === 'A' ? 'B' : 'A';
        expect(state.stage).toMatchObject({
          phase: 'opponent',
          round: {
            originalChooser: starter,
            startedAt: 50_000,
            deadline: 65_000,
          },
        });
        const correct =
          mode === 'hosted'
            ? /** @type {const} */ ({ type: 'judge', correct: true })
            : /** @type {const} */ ({
                type: 'answer',
                player: recipient,
                text: 'Alpha',
              });
        const action =
          outcome === 'correct'
            ? correct
            : outcome === 'give-up'
              ? /** @type {const} */ ({ type: 'give-up' })
              : /** @type {const} */ ({ type: 'tick' });
        const result = act(
          state,
          action,
          outcome === 'timeout' ? 65_000 : 64_999,
        );
        expect(result.cells[0]).toBe(
          outcome === 'correct' ? recipient : 'black',
        );
        expect(result.chooser).toBe(starter);
        expect(result.stage.phase).toBe('selecting');
      },
    );

    test(`${mode} ${starter}: unlimited wrong attempts never extend the half deadline`, () => {
      let state = act(
        offer(mode, starter),
        { type: 'accept-opponent' },
        50_000,
      );
      const stage = structuredClone(state.stage);
      const recipient = starter === 'A' ? 'B' : 'A';
      for (let attempt = 0; attempt < 20; attempt++) {
        const action =
          mode === 'hosted'
            ? /** @type {const} */ ({ type: 'judge', correct: false })
            : /** @type {const} */ ({
                type: 'answer',
                player: recipient,
                text: 'wrong',
              });
        state = act(state, action, 50_001 + attempt);
        expect(state.stage).toEqual(stage);
        expect(state.cells[0]).toBe('unclaimed');
      }
      expect(remainingMs(state, 64_999)).toBe(1);
      expect(nextBoundary(state)).toBe(65_000);
      expect(act(state, { type: 'tick' }, 65_000).chooser).toBe(starter);
    });
  }
}

test.each([1_000, 3_000, 30_000, 3_600_000, 1, 3])(
  'opponent deadline halves %dms, rounded up only to the next whole millisecond',
  (timeLimitMs) => {
    const state = act(
      offer('hosted', 'A', timeLimitMs),
      { type: 'accept-opponent' },
      2_000,
    );
    expect(remainingMs(state, 2_000)).toBe(Math.ceil(timeLimitMs / 2));
    expect(validateSave(state)).toEqual(state);
  },
);

test('offer has no answer controls in the engine and accepts only its explicit decision', () => {
  const state = offer('automatic');
  for (const action of /** @type {const} */ ([
    { type: 'answer', player: 'B', text: 'Alpha' },
    { type: 'judge', correct: true },
    { type: 'give-up' },
    { type: 'tick' },
  ]))
    expect(act(state, action, 90_000)).toBe(state);
  for (const state of [question(), act(offer(), { type: 'accept-opponent' })]) {
    expect(act(state, { type: 'accept-opponent' })).toBe(state);
    expect(act(state, { type: 'decline-opponent' })).toBe(state);
  }
});

test('late answers and stale offer callbacks cannot win or start a second opponent timer', () => {
  const offered = offer();
  const accepted = act(offered, { type: 'accept-opponent' }, 40_000);
  const expired = transition(
    accepted,
    {
      type: 'judge',
      correct: true,
      sessionId: accepted.sessionId,
      revision: accepted.revision,
    },
    { now: 55_000, random: () => 0 },
  );
  expect(expired.reason).toBe('expired');
  expect(expired.state.cells[0]).toBe('black');
  expect(expired.state.chooser).toBe('A');
  for (const type of /** @type {const} */ ([
    'accept-opponent',
    'decline-opponent',
    'tick',
  ])) {
    const stale = transition(
      accepted,
      {
        type,
        sessionId: offered.sessionId,
        revision: offered.revision,
      },
      { now: 70_000, random: () => 0 },
    );
    expect(stale.reason).toBe('stale');
    expect(stale.state).toBe(accepted);
  }
});

test.each([54_999, 55_000, 55_001])(
  'opponent reload at %d preserves its deadline or spends the turn',
  (now) => {
    const accepted = act(offer(), { type: 'accept-opponent' }, 40_000);
    const restored = recoverGame(JSON.stringify(accepted), now, 'restored');
    expect(restored.schemaVersion).toBe(3);
    if (now < 55_000) {
      expect(restored.stage).toEqual(accepted.stage);
      expect(remainingMs(restored, now)).toBe(1);
    } else {
      expect(restored.stage.phase).toBe('selecting');
      expect(restored.cells[0]).toBe('black');
      expect(restored.chooser).toBe('A');
    }
    expect(validateSave(restored)).toEqual(restored);
  },
);

test.each([1, 2])(
  'legacy v%d untimed opponent becomes an explicit offer, not an expired attempt',
  (version) => {
    const offered = offer();
    if (offered.stage.phase !== 'opponent-offer') throw new Error('test setup');
    const legacy = {
      ...offered,
      schemaVersion: version,
      stage: { phase: 'opponent', round: offered.stage.round },
    };
    const json = JSON.stringify(legacy);
    const restored = recoverGame(json, 90_000, 'restored');
    expect(restored.stage.phase).toBe('opponent-offer');
    expect(restored.cells[0]).toBe('unclaimed');
    expect(restored.chooser).toBe('A');
    expect(remainingMs(restored, 90_000)).toBeNull();
    expect(
      remainingMs(act(restored, { type: 'accept-opponent' }, 90_000), 90_000),
    ).toBe(15_000);
    expect(JSON.stringify(legacy)).toBe(json);
  },
);

test('v3 saves reject full-length or expired opponent deadlines and pre-v3 offers', () => {
  const state = act(offer(), { type: 'accept-opponent' }, 40_000);
  if (state.stage.phase !== 'opponent') throw new Error('test setup');
  const changed = structuredClone(state);
  if (changed.stage.phase !== 'opponent') throw new Error('test setup');
  changed.stage.round.deadline = 70_000;
  expect(() => validateSave(changed)).toThrow('invalidDeadline');
  expect(() => validateSave({ ...state, lastNow: 55_000 })).toThrow(
    'invalidDeadline',
  );
  expect(() => validateSave({ ...offer(), schemaVersion: 2 })).toThrow(
    'saveVersion',
  );
  expect(() => validateSave({ ...state, chooser: 'B' })).toThrow(
    'invalidRound',
  );
});

test('opponent can still win immediately, while host edits stay unavailable during offer and answer', () => {
  let state = createGame(boardPack(), config(), 1_000, 'winning-opponent');
  for (const cell of [2, 4, 7, 11, 16, 22])
    state = act(state, { type: 'set-cell', cell, owner: 'B' });
  state = act(act(state, { type: 'select', cell: 1 }), { type: 'give-up' });
  expect(() => act(state, { type: 'set-chooser', player: 'B' })).toThrow(
    'correctionUnavailable',
  );
  state = act(state, { type: 'accept-opponent' });
  expect(() => act(state, { type: 'set-cell', cell: 1, owner: 'A' })).toThrow(
    'correctionUnavailable',
  );
  const won = act(state, { type: 'judge', correct: true });
  expect(won.stage).toMatchObject({ phase: 'won', winner: 'B' });
  expect(won.chooser).toBe('A');
});
