import { choice, integer, record, text } from './validation.js';
import { requireValue } from './errors.js';

/** @typedef {{language: import('./types.js').Language, theme: string,
 * setup: import('../ui/setup.js').Setup}} Preferences */

/** @param {unknown} value @returns {Preferences} */
export function validatePreferences(value) {
  const data = record(value, 'preferences');
  const setup = record(data.setup, 'setup');
  const players = record(setup.players, 'players');
  const seconds = integer(setup.seconds, 'seconds', 1);
  requireValue(seconds <= 3600, 'invalidNumber', 'seconds');
  return {
    language: choice(data.language, ['cs', 'en'], 'preferences.language'),
    theme: choice(data.theme, ['light', 'dark'], 'theme'),
    setup: {
      players: { A: player(players.A), B: player(players.B) },
      language: choice(setup.language, ['cs', 'en'], 'setup.language'),
      mode: choice(setup.mode, ['letters', 'numbers'], 'mode'),
      answerMode: choice(
        setup.answerMode,
        ['hosted', 'automatic'],
        'answerMode',
      ),
      starter: choice(setup.starter, ['A', 'B', 'random'], 'starter'),
      seconds,
    },
  };
}

/** @param {unknown} value */
function player(value) {
  const data = record(value, 'player');
  const name = text(data.name, 'name');
  const color = text(data.color, 'color');
  requireValue(
    name.length <= 30 && /^#[a-f0-9]{6}$/i.test(color),
    'invalidChoice',
  );
  return { name, color };
}
