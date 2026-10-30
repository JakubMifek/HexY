import { deadlineAfter, randomIndex } from './config.js';
import { opponent, resolveRound } from './outcomes.js';

/** @param {import('./types.js').Game} state
 * @param {import('./types.js').Round} round
 * @param {import('./types.js').Environment} env */
export function startDuel(state, round, env) {
  const config = state.config.duel;
  const target = config.symbols[randomIndex(env.random, config.symbols.length)];
  const sequence = cycle(config, target, env.random);
  state.schemaVersion = 2;
  config.length = config.symbols.length;
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
    const cycleMs = round.sequence.length * state.config.duel.symbolMs;
    round.startsAt +=
      Math.floor((env.now - round.startsAt) / cycleMs) * cycleMs;
    round.sequence = cycle(state.config.duel, round.target, env.random);
    deadlineAfter(round.startsAt, cycleMs);
    state.stage = { phase: 'duel-active', round };
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
    stage.round.sequence = cycle(
      state.config.duel,
      stage.round.target,
      env.random,
    );
    stage.round.startsAt = env.now;
    deadlineAfter(
      env.now,
      stage.round.sequence.length * state.config.duel.symbolMs,
    );
    return true;
  }

  const index = Math.floor(
    (env.now - stage.round.startsAt) / state.config.duel.symbolMs,
  );
  const correct = stage.round.sequence[index] === stage.round.target;
  resolveRound(state, stage.round, correct ? players[0] : opponent(players[0]));
  return true;
}

/** @param {import('./types.js').DuelConfig} config @param {string} target
 * @param {() => number} random */
function cycle(config, target, random) {
  const position = randomIndex(random, config.symbols.length);
  const symbols = config.symbols.filter((symbol) => symbol !== target);
  for (let index = symbols.length - 1; index > 0; index -= 1) {
    const other = randomIndex(random, index + 1);
    [symbols[index], symbols[other]] = [symbols[other], symbols[index]];
  }
  symbols.splice(position, 0, target);
  return symbols;
}
