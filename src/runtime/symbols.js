import { requireValue } from '../domain/errors.js';

export const DUEL_SYMBOLS = Object.freeze({
  circle: '●',
  triangle: '▲',
  square: '■',
  star: '★',
});

/** @param {string} symbol */
export function symbolKey(symbol) {
  requireValue(Object.hasOwn(DUEL_SYMBOLS, symbol), 'duelCompatibility');
  return /** @type {keyof typeof DUEL_SYMBOLS} */ (symbol);
}

/** @param {import('../domain/types.js').Game} state */
export function browserGame(state) {
  for (const symbol of state.config.duel.symbols) symbolKey(symbol);
  return state;
}
