import { winningGroup } from './board.js';

/** @param {import('./types.js').Player} player */
export function opponent(player) {
  return player === 'A' ? 'B' : 'A';
}

/** @param {import('./types.js').Game} state */
export function updateVictory(state) {
  for (const player of /** @type {const} */ (['A', 'B'])) {
    const group = winningGroup(state.cells, player);
    if (group.length > 0) {
      state.stage = { phase: 'won', winner: player, winningCells: group };
      return;
    }
  }
  if (state.stage.phase === 'won') state.stage = { phase: 'selecting' };
}

/** @param {import('./types.js').Game} state
 * @param {import('./types.js').Round} round
 * @param {import('./types.js').Player|'black'} recipient */
export function resolveRound(state, round, recipient) {
  state.cells[round.cell - 1] = recipient;
  state.chooser = opponent(
    recipient === 'black' ? round.originalChooser : recipient,
  );
  state.stage = { phase: 'selecting' };
  updateVictory(state);
}
