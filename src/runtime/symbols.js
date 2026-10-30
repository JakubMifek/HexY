import { requireValue } from '../domain/errors.js';

export const DUEL_SYMBOLS = Object.freeze({
  circle: '●',
  star: '★',
  square: '■',
  triangle: '▲',
  hexagon: '⬢',
  heart: '♥',
  sun: '☀',
});

/** @param {string} symbol */
export function symbolKey(symbol) {
  requireValue(Object.hasOwn(DUEL_SYMBOLS, symbol), 'duelCompatibility');
  return /** @type {keyof typeof DUEL_SYMBOLS} */ (symbol);
}

/** @param {import('../domain/types.js').Game} state */
export function browserGame(state) {
  if (state.schemaVersion === 1) return upgradeLegacy(state);
  for (const symbol of state.config.duel.symbols) symbolKey(symbol);
  requireValue(state.config.duel.symbols.length === 7, 'duelCompatibility');
  return state;
}

/** @param {import('../domain/types.js').Game} state */
function upgradeLegacy(state) {
  const old = ['circle', 'triangle', 'square', 'star'];
  requireValue(
    state.config.duel.symbols.every((symbol) => old.includes(symbol)),
    'duelCompatibility',
  );
  const { stage } = state;
  return {
    ...state,
    schemaVersion: /** @type {const} */ (2),
    config: {
      ...state.config,
      duel: {
        ...state.config.duel,
        length: 7,
        symbols: Object.keys(DUEL_SYMBOLS),
      },
    },
    stage:
      stage.phase === 'duel-preview' || stage.phase === 'duel-active'
        ? {
            phase: /** @type {const} */ ('duel-interrupted'),
            round: {
              cell: stage.round.cell,
              originalChooser: stage.round.originalChooser,
            },
          }
        : stage,
  };
}
