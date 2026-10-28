import { expect, test } from 'vitest';
import { createGame, remainingMs, transition } from '../src/domain/game.js';
import { act, boardPack, config, duel, game, question } from './fixtures.js';

test('A captures directly, therefore B chooses next', () => {
  const state = act(question(), { type: 'judge', correct: true });
  expect(state.cells[0]).toBe('A');
  expect(state.chooser).toBe('B');
  expect(state.stage.phase).toBe('selecting');
});

test('A fails and B fails, therefore black retains its ID and B chooses', () => {
  const handed = act(question(), { type: 'give-up' });
  const state = act(handed, { type: 'judge', correct: false });
  expect(state.cells[0]).toBe('black');
  expect(state.pack.questions[0].id).toBe(handed.pack.questions[0].id);
  expect(state.chooser).toBe('B');
});

test('A fails and B captures, therefore A chooses next', () => {
  const handed = act(question(), { type: 'give-up' });
  const state = act(handed, { type: 'judge', correct: true });
  expect(state.cells[0]).toBe('B');
  expect(state.chooser).toBe('A');
});

test('unlimited initial wrong answers preserve the original deadline and chooser', () => {
  let state = question('automatic');
  const stage = state.stage;
  for (let i = 0; i < 100; i += 1) {
    state = act(
      state,
      { type: 'answer', player: 'A', text: 'wrong' },
      1_000 + i,
    );
    expect(state.stage).toEqual(stage);
    expect(state.cells[0]).toBe('unclaimed');
  }
  expect(state.chooser).toBe('A');
  state = act(state, { type: 'answer', player: 'A', text: ' ALPHA ' }, 30_999);
  expect(state.cells[0]).toBe('A');
});

test('host wrong guesses preserve time, while timeout transfers exactly at deadline', () => {
  const start = question();
  const wrong = act(start, { type: 'judge', correct: false }, 10_000);
  expect(wrong.stage).toEqual(start.stage);
  expect(remainingMs(wrong, 30_999)).toBe(1);
  expect(remainingMs(wrong, 31_000)).toBe(0);
  const expired = act(wrong, { type: 'tick' }, 31_000);
  expect(expired.stage.phase).toBe('opponent');
  expect(remainingMs(expired, 40_000)).toBeNull();
});

test.each([31_000, 99_000])(
  'late initial correctness cannot be reinterpreted as opponent answer at %d',
  (now) => {
    const state = question();
    const result = transition(
      state,
      {
        type: 'judge',
        correct: true,
        sessionId: state.sessionId,
        revision: state.revision,
      },
      { now, random: () => 0 },
    );
    expect(result.reason).toBe('expired');
    expect(result.state.stage.phase).toBe('opponent');
    expect(result.state.cells[0]).toBe('unclaimed');
  },
);

test('the opponent has one untimed opportunity and original chooser cannot answer for them', () => {
  let state = act(question('automatic'), { type: 'give-up' });
  const before = state;
  state = act(state, { type: 'answer', player: 'A', text: 'Alpha' }, 100_000);
  expect(state).toBe(before);
  state = act(state, { type: 'answer', player: 'B', text: 'wrong' }, 100_000);
  expect(state.cells[0]).toBe('black');
  expect(
    act(state, { type: 'answer', player: 'B', text: 'Alpha' }, 100_001),
  ).toBe(state);
});

test('answer-mode commands do not cross hosted/automatic boundaries', () => {
  const hosted = question();
  expect(act(hosted, { type: 'answer', player: 'A', text: 'Alpha' })).toBe(
    hosted,
  );
  const automatic = question('automatic');
  expect(act(automatic, { type: 'judge', correct: true })).toBe(automatic);
  expect(
    act(game('automatic'), { type: 'set-cell', cell: 1, owner: 'A' }).cells[0],
  ).toBe('unclaimed');
});

test('stale and duplicate actions cannot award or time out a later round', () => {
  const first = question();
  const resolved = act(first, { type: 'judge', correct: true });
  const second = act(resolved, { type: 'select', cell: 2 });
  for (const type of /** @type {const} */ (['tick', 'judge'])) {
    const result = transition(
      second,
      {
        type,
        correct: true,
        sessionId: first.sessionId,
        revision: first.revision,
      },
      { now: 99_000, random: () => 0 },
    );
    expect(result.state).toBe(second);
    expect(result.reason).toBe('stale');
  }
  expect(second.cells[1]).toBe('unclaimed');
});

test('pure transitions do not mutate inputs and unavailable cells cannot be selected', () => {
  const original = game();
  const snapshot = JSON.stringify(original);
  const owned = act(original, { type: 'set-cell', cell: 1, owner: 'B' });
  expect(JSON.stringify(original)).toBe(snapshot);
  expect(act(owned, { type: 'select', cell: 1 })).toBe(owned);
  const active = question();
  expect(act(active, { type: 'select', cell: 2 })).toBe(active);
});

test('host can reset, blacken and award every cell between rounds without changing its question', () => {
  for (let cell = 1; cell <= 28; cell += 1) {
    let state = game();
    const questionId = state.pack.questions[cell - 1].id;
    for (const owner of /** @type {const} */ ([
      'A',
      'B',
      'black',
      'unclaimed',
    ])) {
      state = act(state, { type: 'set-cell', cell, owner });
      expect(state.cells[cell - 1]).toBe(owner);
      expect(state.pack.questions[cell - 1].id).toBe(questionId);
    }
    state = act(state, { type: 'select', cell });
    expect(state.stage.phase).toBe('question');
  }
});

test('host can independently change the next chooser between rounds', () => {
  const state = act(game(), { type: 'set-chooser', player: 'B' });
  const chosen = act(state, { type: 'select', cell: 1 });
  expect(chosen.stage).toMatchObject({ round: { originalChooser: 'B' } });
  expect(act(chosen, { type: 'judge', correct: true }).chooser).toBe('A');
});

test('capture detects victory immediately and rejects gameplay after win', () => {
  let state = game();
  for (const cell of [2, 4, 7, 11, 16, 22])
    state = act(state, { type: 'set-cell', cell, owner: 'A' });
  state = act(act(state, { type: 'select', cell: 1 }), {
    type: 'judge',
    correct: true,
  });
  expect(state.stage).toEqual({
    phase: 'won',
    winner: 'A',
    winningCells: [1, 2, 4, 7, 11, 16, 22],
  });
  expect(act(state, { type: 'select', cell: 3 })).toBe(state);
  const corrected = act(state, {
    type: 'set-cell',
    cell: 1,
    owner: 'unclaimed',
  });
  expect(corrected.stage.phase).toBe('selecting');
  expect(corrected.chooser).toBe('B');
});

test('host edits are unavailable throughout questions, opponent attempts and duels', () => {
  const states = [
    question(),
    act(question(), { type: 'give-up' }),
    duel(),
    act(duel(), { type: 'tick' }, 1_100),
    act(duel(), { type: 'interrupt' }),
  ];
  for (const state of states) {
    const snapshot = JSON.stringify(state);
    for (const cell of [1, 2]) {
      for (const owner of /** @type {const} */ ([
        'unclaimed',
        'black',
        'A',
        'B',
      ])) {
        expect(() => act(state, { type: 'set-cell', cell, owner })).toThrow(
          'correctionUnavailable',
        );
      }
    }
    expect(() => act(state, { type: 'set-chooser', player: 'B' })).toThrow(
      'correctionUnavailable',
    );
    expect(JSON.stringify(state)).toBe(snapshot);
  }
  expect(remainingMs(states[0], 20_000)).toBe(11_000);
});

test('post-win host edits preserve the chosen player and immediately recheck victory', () => {
  let state = game();
  for (const cell of [1, 2, 4, 7, 11, 16, 22]) {
    state = act(state, { type: 'set-cell', cell, owner: 'A' });
  }
  expect(state.stage.phase).toBe('won');
  state = act(state, { type: 'set-chooser', player: 'B' });
  expect(state.stage.phase).toBe('won');
  state = act(state, { type: 'set-cell', cell: 28, owner: 'B' });
  expect(state.stage.phase).toBe('won');
  state = act(state, { type: 'set-cell', cell: 1, owner: 'unclaimed' });
  expect(state.stage.phase).toBe('selecting');
  expect(state.chooser).toBe('B');
});

test('starting a game isolates its prepared content from later source-pack edits', () => {
  const pack = boardPack();
  const state = createGame(pack, config(), 1_000, 'locked-session');
  const locked = JSON.stringify(state.pack);
  pack.questions[0].text = 'Changed outside the game';
  pack.questions[0].answer = 'Changed';
  pack.questions[0].aliases.push('Changed alias');
  pack.questions.reverse();
  expect(JSON.stringify(state.pack)).toBe(locked);
  const captured = act(act(state, { type: 'select', cell: 1 }), {
    type: 'judge',
    correct: true,
  });
  const reset = act(captured, {
    type: 'set-cell',
    cell: 1,
    owner: 'unclaimed',
  });
  expect(JSON.stringify(reset.pack)).toBe(locked);
  expect(() =>
    transition(
      reset,
      {
        type: 'edit-question',
        sessionId: reset.sessionId,
        revision: reset.revision,
      },
      { now: reset.lastNow, random: () => 0 },
    ),
  ).toThrow('invalidChoice');
});

test('clock and action boundaries reject invalid input rather than corrupting state', () => {
  const state = question();
  expect(() => remainingMs(state, 999)).toThrow('clockBackwards');
  for (const now of [-1, NaN, Infinity, 1_000.1, 999]) {
    expect(() => act(state, { type: 'tick' }, now)).toThrow();
  }
  for (const action of [
    { type: 'unknown' },
    { type: 'select', cell: 29 },
    { type: 'judge', correct: 'yes' },
  ]) {
    expect(() =>
      transition(
        state,
        { ...action, sessionId: state.sessionId, revision: state.revision },
        { now: 1_000, random: () => 0 },
      ),
    ).toThrow();
  }
  expect(() =>
    createGame(
      boardPack(),
      { ...config(), timeLimitMs: 0 },
      1_000,
      'test-session',
    ),
  ).toThrow('invalidNumber');
});

test('a stale correction cannot overwrite a more recent host correction', () => {
  const state = game();
  const corrected = act(state, { type: 'set-cell', cell: 1, owner: 'B' });
  const result = transition(
    corrected,
    {
      type: 'set-cell',
      cell: 1,
      owner: 'A',
      sessionId: state.sessionId,
      revision: state.revision,
    },
    { now: 1_001, random: () => 0 },
  );
  expect(result.reason).toBe('stale');
  expect(result.state.cells[0]).toBe('B');
});

test('a new game rejects an old game action even when revision numbers coincide', () => {
  const first = question();
  const next = act(createGame(boardPack(), config(), 1_000, 'new-session'), {
    type: 'select',
    cell: 1,
  });
  expect(next.revision).toBe(first.revision);
  const result = transition(
    next,
    {
      type: 'judge',
      correct: true,
      sessionId: first.sessionId,
      revision: first.revision,
    },
    { now: 1_001, random: () => 0 },
  );
  expect(result.reason).toBe('stale');
  expect(result.state).toBe(next);
});
