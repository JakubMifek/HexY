import { deadlineAfter, randomIndex } from './config.js';
import { opponent, resolveRound } from './outcomes.js';

/** @param {import('./types.js').Game} state
 * @param {import('./types.js').Round} round
 * @param {import('./types.js').Environment} env */
export function startDuel(state, round, env) {
  const config = state.config.duel;
  const target = config.symbols[randomIndex(env.random, config.symbols.length)];
  const others = config.symbols.filter((symbol) => symbol !== target);
  const beforeTarget = randomIndex(env.random, config.length);
  const sequence = Array.from(
    { length: beforeTarget },
    () => others[randomIndex(env.random, others.length)],
  );
  sequence.push(target);
  const startsAt = deadlineAfter(env.now, config.previewMs);
  deadlineAfter(startsAt, sequence.length * config.symbolMs);
  state.stage = {
    phase: 'duel-preview',
    round: {
      cell: round.cell,
      originalChooser: round.originalChooser,
      target,
      sequence,
      startsAt,
    },
  };
}

/** @param {import('./types.js').Game} state
 * @param {import('./types.js').Environment} env */
export function advanceDuel(state, env) {
  const stage = state.stage;
  if (stage.phase !== 'duel-preview' && stage.phase !== 'duel-active')
    return false;
  const { round } = stage;
  if (env.now < round.startsAt) return false;
  const index = Math.floor(
    (env.now - round.startsAt) / state.config.duel.symbolMs,
  );
  if (index >= round.sequence.length) {
    startDuel(state, round, env);
    return true;
  }
  if (stage.phase === 'duel-preview') {
    state.stage = { phase: 'duel-active', round };
    return true;
  }
  const previousIndex = Math.floor(
    (state.lastNow - round.startsAt) / state.config.duel.symbolMs,
  );
  return index !== previousIndex;
}

/** @param {import('./types.js').Game} state
 * @param {import('./types.js').Player[]} players
 * @param {import('./types.js').Environment} env */
export function pressDuel(state, players, env) {
  const stage = state.stage;
  if (stage.phase !== 'duel-active') return false;
  if (players.length === 2) {
    startDuel(state, stage.round, env);
    return true;
  }
  const index = Math.floor(
    (env.now - stage.round.startsAt) / state.config.duel.symbolMs,
  );
  const correct = stage.round.sequence[index] === stage.round.target;
  resolveRound(state, stage.round, correct ? players[0] : opponent(players[0]));
  return true;
}
