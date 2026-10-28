import { winningGroup } from './board.js';
import { validateConfig } from './config.js';
import { DomainError, requireValue } from './errors.js';
import { validatePack } from './packs.js';
import {
  cellId,
  choice,
  integer,
  list,
  owner,
  player,
  record,
  strings,
  text,
} from './validation.js';

/** @param {unknown} value @returns {import('./types.js').Game} */
export function validateSave(value) {
  const data = record(value, 'save');
  requireValue(data.schemaVersion === 1, 'saveVersion', 'schemaVersion');
  const pack = validatePack(data.pack);
  requireValue(pack.mode !== 'source', 'boardCount', 'pack.mode');
  const cells = list(data.cells, 'cells').map((item) => owner(item, 'cells'));
  requireValue(cells.length === 28, 'boardCount', 'cells');
  const state = {
    schemaVersion: /** @type {const} */ (1),
    sessionId: text(data.sessionId, 'sessionId'),
    pack,
    cells,
    config: validateConfig(data.config),
    chooser: player(data.chooser, 'chooser'),
    revision: integer(data.revision, 'revision'),
    lastNow: integer(data.lastNow, 'lastNow'),
    stage: parseStage(data.stage),
  };
  validateStage(state);
  return state;
}

/** @param {unknown} value @returns {import('./types.js').Stage} */
function parseStage(value) {
  const data = record(value, 'stage');
  const phase = choice(
    data.phase,
    /** @type {const} */ ([
      'selecting',
      'question',
      'opponent',
      'duel-preview',
      'duel-active',
      'duel-interrupted',
      'won',
    ]),
    'stage.phase',
  );
  if (phase === 'selecting') return { phase };
  if (phase === 'won')
    return {
      phase,
      winner: player(data.winner, 'stage.winner'),
      winningCells: list(data.winningCells, 'stage.winningCells').map((id) =>
        cellId(id, 'stage.winningCells'),
      ),
    };
  const round = record(data.round, 'stage.round');
  const common = {
    cell: cellId(round.cell, 'stage.round.cell'),
    originalChooser: player(
      round.originalChooser,
      'stage.round.originalChooser',
    ),
  };
  if (phase === 'duel-interrupted') return { phase, round: common };
  if (phase === 'question' || phase === 'opponent')
    return {
      phase,
      round: {
        ...common,
        startedAt: integer(round.startedAt, 'stage.round.startedAt'),
        deadline: integer(round.deadline, 'stage.round.deadline'),
      },
    };
  return {
    phase,
    round: {
      ...common,
      target: choice(
        round.target,
        strings(round.sequence, 'stage.round.sequence'),
        'stage.round.target',
      ),
      sequence: strings(round.sequence, 'stage.round.sequence'),
      startsAt: integer(round.startsAt, 'stage.round.startsAt'),
    },
  };
}

/** @param {import('./types.js').Game} state */
function validateStage(state) {
  const { stage } = state;
  const winners = [
    winningGroup(state.cells, 'A'),
    winningGroup(state.cells, 'B'),
  ];
  if (stage.phase === 'won') {
    const expected = winners[stage.winner === 'A' ? 0 : 1];
    requireValue(
      expected.length > 0 &&
        JSON.stringify(expected) === JSON.stringify(stage.winningCells),
      'invalidVictory',
      'stage.winningCells',
    );
    return;
  }
  requireValue(
    winners.every((group) => group.length === 0),
    'invalidVictory',
    'stage.phase',
  );
  if (stage.phase === 'selecting') return;
  requireValue(
    stage.round.originalChooser === state.chooser,
    'invalidRound',
    'chooser',
  );
  if (stage.phase === 'question' || stage.phase === 'opponent') {
    validateQuestionRound(state, stage);
    return;
  }
  requireValue(
    state.cells[stage.round.cell - 1] === 'black',
    'invalidRound',
    'cells',
  );
  if (stage.phase === 'duel-preview' || stage.phase === 'duel-active') {
    validateDuelRound(state, stage);
  }
}

/** @param {import('./types.js').Game} state
 * @param {{phase: 'question'|'opponent', round: import('./types.js').QuestionRound}} stage */
function validateQuestionRound(state, stage) {
  const { round } = stage;
  requireValue(
    state.cells[round.cell - 1] === 'unclaimed',
    'invalidRound',
    'cells',
  );
  requireValue(
    round.startedAt <= state.lastNow &&
      round.deadline - round.startedAt === state.config.timeLimitMs,
    'invalidDeadline',
    'stage.round.deadline',
  );
  if (stage.phase === 'question') {
    requireValue(state.lastNow < round.deadline, 'invalidDeadline', 'lastNow');
  }
}

/** @param {import('./types.js').Game} state
 * @param {{phase: 'duel-preview'|'duel-active', round: import('./types.js').DuelRound}} stage */
function validateDuelRound(state, stage) {
  const { round } = stage;
  const config = state.config.duel;
  requireValue(
    round.sequence.length > 0 &&
      round.sequence.length <= config.length &&
      round.sequence.every((symbol) => config.symbols.includes(symbol)),
    'invalidDuel',
    'stage.round.sequence',
  );
  requireValue(
    round.sequence.at(-1) === round.target &&
      round.sequence.filter((symbol) => symbol === round.target).length === 1,
    'invalidDuel',
    'stage.round.target',
  );
  const endsAt = round.startsAt + round.sequence.length * config.symbolMs;
  requireValue(
    Number.isSafeInteger(endsAt) && state.lastNow < endsAt,
    'invalidDuel',
    'stage.round.startsAt',
  );
  requireValue(
    (stage.phase === 'duel-preview') === state.lastNow < round.startsAt,
    'invalidDuel',
    'stage.phase',
  );
  if (stage.phase === 'duel-preview') {
    requireValue(
      round.startsAt - state.lastNow === config.previewMs,
      'invalidDuel',
      'stage.round.startsAt',
    );
  }
}

/** @param {string} json @param {number} now @param {string} sessionId */
export function recoverGame(json, now, sessionId) {
  let value;
  try {
    value = JSON.parse(json);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    throw new DomainError('invalidJson');
  }
  const state = validateSave(value);
  const nextSession = text(sessionId, 'sessionId');
  requireValue(nextSession !== state.sessionId, 'sessionReused', 'sessionId');
  integer(now, 'now');
  requireValue(now >= state.lastNow, 'clockBackwards', 'now');
  const stage = state.stage;
  if (stage.phase === 'question' && now >= stage.round.deadline) {
    state.stage = { phase: 'opponent', round: stage.round };
  }
  if (stage.phase === 'duel-preview' || stage.phase === 'duel-active') {
    state.stage = {
      phase: 'duel-interrupted',
      round: {
        cell: stage.round.cell,
        originalChooser: stage.round.originalChooser,
      },
    };
  }
  state.revision = integer(state.revision + 1, 'revision');
  state.lastNow = now;
  state.sessionId = nextSession;
  return state;
}
