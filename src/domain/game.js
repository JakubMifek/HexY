import { acceptsAnswer } from './answers.js';
import { validateAction } from './actions.js';
import { validateConfig, deadlineAfter } from './config.js';
import { advanceDuel, pressDuel, startDuel } from './duels.js';
import { requireValue } from './errors.js';
import { opponent, resolveRound, updateVictory } from './outcomes.js';
import { validatePack } from './packs.js';
import { integer, text } from './validation.js';

/** @param {unknown} packValue @param {unknown} configValue @param {number} now
 * @param {string} sessionId
 * @returns {import('./types.js').Game} */
export function createGame(packValue, configValue, now, sessionId) {
  const pack = validatePack(packValue);
  requireValue(pack.mode !== 'source', 'boardCount', 'pack.mode');
  const config = validateConfig(configValue);
  return {
    schemaVersion: 1,
    sessionId: text(sessionId, 'sessionId'),
    pack,
    config,
    cells: Array.from({ length: 28 }, () => 'unclaimed'),
    chooser: config.starter,
    revision: 0,
    lastNow: integer(now, 'now'),
    stage: { phase: 'selecting' },
  };
}

/** @param {import('./types.js').Game} current @param {unknown} actionValue
 * @param {import('./types.js').Environment} env
 * @returns {import('./types.js').Transition} */
export function transition(current, actionValue, env) {
  const action = validateAction(actionValue);
  if (
    action.sessionId !== current.sessionId ||
    action.revision !== current.revision
  ) {
    return { state: current, outcome: 'ignored', reason: 'stale' };
  }
  integer(env.now, 'now');
  requireValue(env.now >= current.lastNow, 'clockBackwards', 'now');
  const state = structuredClone(current);
  const expired = expireQuestion(state, env.now);
  const advanced = action.type !== 'interrupt' && advanceDuel(state, env);
  const applied = !expired && !advanced && applyAction(state, action, env);
  if (!expired && !advanced && !applied) {
    return { state: current, outcome: 'ignored', reason: 'inactive' };
  }
  state.lastNow = env.now;
  state.revision = integer(current.revision + 1, 'revision');
  return {
    state,
    outcome: 'applied',
    ...(expired ? { reason: 'expired' } : {}),
  };
}

/** @param {import('./types.js').Game} state @param {number} now */
function expireQuestion(state, now) {
  if (state.stage.phase !== 'question' || now < state.stage.round.deadline)
    return false;
  state.stage = { phase: 'opponent', round: state.stage.round };
  return true;
}

/** @param {import('./types.js').Game} state
 * @param {import('./types.js').Action} action
 * @param {import('./types.js').Environment} env */
function applyAction(state, action, env) {
  switch (action.type) {
    case 'select':
      return selectCell(state, action.cell, env);
    case 'answer':
      return answer(state, action);
    case 'judge':
      return judge(state, action.correct);
    case 'give-up':
      return giveUp(state);
    case 'press':
      return pressDuel(state, action.players, env);
    case 'set-cell':
    case 'set-chooser':
      return correctState(state, action);
    default:
      return lifecycle(state, action.type, env);
  }
}

/** @param {import('./types.js').Game} state @param {number} cell
 * @param {import('./types.js').Environment} env */
function selectCell(state, cell, env) {
  if (state.stage.phase !== 'selecting') return false;
  const owner = state.cells[cell - 1];
  if (owner === 'A' || owner === 'B') return false;
  const round = { cell, originalChooser: state.chooser };
  if (owner === 'black') {
    startDuel(state, round, env);
  } else {
    state.stage = {
      phase: 'question',
      round: {
        ...round,
        startedAt: env.now,
        deadline: deadlineAfter(env.now, state.config.timeLimitMs),
      },
    };
  }
  return true;
}

/** @param {import('./types.js').Game} state
 * @param {Extract<import('./types.js').ActionBody, {type: 'answer'}>} action */
function answer(state, action) {
  if (state.config.answerMode !== 'automatic') return false;
  const stage = state.stage;
  if (stage.phase !== 'question' && stage.phase !== 'opponent') return false;
  const recipient =
    stage.phase === 'question'
      ? stage.round.originalChooser
      : opponent(stage.round.originalChooser);
  if (action.player !== recipient) return false;
  const correct = acceptsAnswer(
    state.pack.questions[stage.round.cell - 1],
    action.text,
  );
  return resolveAnswer(state, correct);
}

/** @param {import('./types.js').Game} state @param {boolean} correct */
function judge(state, correct) {
  if (state.config.answerMode !== 'hosted') return false;
  return resolveAnswer(state, correct);
}

/** @param {import('./types.js').Game} state @param {boolean} correct */
function resolveAnswer(state, correct) {
  const stage = state.stage;
  if (stage.phase !== 'question' && stage.phase !== 'opponent') return false;
  if (!correct && stage.phase === 'question') return true;
  const recipient =
    stage.phase === 'question'
      ? stage.round.originalChooser
      : opponent(stage.round.originalChooser);
  resolveRound(state, stage.round, correct ? recipient : 'black');
  return true;
}

/** @param {import('./types.js').Game} state */
function giveUp(state) {
  const stage = state.stage;
  if (stage.phase !== 'question' && stage.phase !== 'opponent') return false;
  if (stage.phase === 'opponent') resolveRound(state, stage.round, 'black');
  else state.stage = { phase: 'opponent', round: stage.round };
  return true;
}

/** @param {import('./types.js').Game} state
 * @param {Extract<import('./types.js').ActionBody, {type: 'set-cell'|'set-chooser'}>} action */
function correctState(state, action) {
  if (state.config.answerMode !== 'hosted') return false;
  requireValue(
    state.stage.phase === 'selecting' || state.stage.phase === 'won',
    'correctionUnavailable',
  );
  if (action.type === 'set-chooser') state.chooser = action.player;
  else state.cells[action.cell - 1] = action.owner;
  updateVictory(state);
  return true;
}

/** @param {import('./types.js').Game} state
 * @param {'tick'|'interrupt'|'restart'} type
 * @param {import('./types.js').Environment} env */
function lifecycle(state, type, env) {
  const stage = state.stage;
  if (
    type === 'interrupt' &&
    (stage.phase === 'duel-preview' || stage.phase === 'duel-active')
  ) {
    state.stage = {
      phase: 'duel-interrupted',
      round: {
        cell: stage.round.cell,
        originalChooser: stage.round.originalChooser,
      },
    };
    return true;
  }
  if (type === 'restart' && stage.phase === 'duel-interrupted') {
    startDuel(state, stage.round, env);
    return true;
  }
  return false;
}

/** @param {import('./types.js').Game} state @param {number} now */
export function remainingMs(state, now) {
  integer(now, 'now');
  requireValue(now >= state.lastNow, 'clockBackwards', 'now');
  return state.stage.phase === 'question'
    ? Math.max(0, state.stage.round.deadline - now)
    : null;
}
