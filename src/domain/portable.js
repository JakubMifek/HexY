import { requireValue, DomainError } from './errors.js';
import { record } from './validation.js';
import { validatePreferences } from './preferences.js';
import { recoverGame, validateSave } from './saves.js';
import {
  defaultBindings,
  keysToBindings,
  validateBindings,
} from './controls.js';

export const MAX_GAME_BYTES = 2_000_000;
const MIN_ROUND_RESERVE_BYTES = 512;
const ROUND_METADATA_BYTES = 256;

/** @param {import('./types.js').Game} game @param {import('../ui/setup.js').Setup} settings
 * @param {import('./controls.js').Bindings | {A: string, B: string}} [bindings] */
export function portableGame(game, settings, bindings = defaultBindings()) {
  return validatePortable({
    format: 'hexy-game',
    schemaVersion: 2,
    game,
    settings,
    bindings:
      typeof bindings.A === 'string' ? keysToBindings(bindings) : bindings,
  });
}

/** @param {unknown} value */
export function validatePortable(value) {
  const data = record(value, 'game-file');
  requireValue(data.format === 'hexy-game', 'gameFormat');
  requireValue(
    data.schemaVersion === 1 || data.schemaVersion === 2,
    'saveVersion',
  );
  const game = validateSave(data.game);
  const bindings =
    data.schemaVersion === 1
      ? keysToBindings(data.keys)
      : validateBindings(data.bindings);
  const settings = validatePreferences({
    language: game.pack.language,
    theme: 'light',
    setup: data.settings,
  }).setup;
  requireValue(
    settings.language === game.pack.language &&
      settings.mode === game.pack.mode &&
      settings.answerMode === game.config.answerMode &&
      settings.seconds * 1000 === game.config.timeLimitMs &&
      (settings.starter === 'random' ||
        settings.starter === game.config.starter),
    'gameMetadata',
  );
  const portable = {
    format: 'hexy-game',
    schemaVersion: 2,
    game,
    settings,
    bindings,
  };
  validateSize(portable);
  return portable;
}

/** @param {{game: import('./types.js').Game}} portable */
function validateSize(portable) {
  const bytes = (/** @type {unknown} */ value) =>
    new TextEncoder().encode(JSON.stringify(value)).length;
  const { game } = portable;
  const reserve = Math.max(
    MIN_ROUND_RESERVE_BYTES,
    2 * bytes(game.config.duel.symbols) + ROUND_METADATA_BYTES,
  );
  const projected = {
    ...portable,
    game: {
      ...game,
      stage: null,
      sessionId: '0'.repeat(36),
      revision: Number.MAX_SAFE_INTEGER,
      lastNow: Number.MAX_SAFE_INTEGER,
    },
  };
  requireValue(
    bytes(portable) <= MAX_GAME_BYTES &&
      bytes(projected) + reserve <= MAX_GAME_BYTES,
    'gameSize',
  );
}

/** @param {string} json @param {number} now @param {string} sessionId
 * @param {boolean} [legacy] */
export function recoverPortable(json, now, sessionId, legacy = false) {
  requireValue(
    new TextEncoder().encode(json).length <= MAX_GAME_BYTES,
    'gameSize',
  );
  let value;
  try {
    value = JSON.parse(json);
  } catch {
    throw new DomainError('invalidJson');
  }
  const data = record(value, 'game-file');
  if (legacy && data.format === undefined) {
    return {
      game: recoverGame(json, now, sessionId),
      settings: null,
      bindings: null,
    };
  }
  const result = validatePortable(data);
  return {
    game: recoverGame(JSON.stringify(result.game), now, sessionId),
    settings: result.settings,
    bindings: result.bindings,
  };
}
