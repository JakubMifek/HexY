import { requireValue } from './errors.js';
import { choice, integer, player, record, strings } from './validation.js';

export const DEFAULT_QUESTION_TIME_MS = 30_000;
export const MAX_DUEL_SEQUENCE_LENGTH = 1_000;

/** @param {unknown} value @returns {import('./types.js').GameConfig} */
export function validateConfig(value) {
  const data = record(value, 'config');
  const duel = record(data.duel, 'config.duel');
  const symbols = strings(duel.symbols, 'config.duel.symbols');
  const length = integer(duel.length, 'config.duel.length', 1);
  requireValue(
    length <= MAX_DUEL_SEQUENCE_LENGTH,
    'duelLength',
    'config.duel.length',
  );
  requireValue(
    symbols.length >= 2 && new Set(symbols).size === symbols.length,
    'duelSymbols',
    'config.duel.symbols',
  );
  return {
    answerMode: choice(
      data.answerMode,
      /** @type {const} */ (['hosted', 'automatic']),
      'config.answerMode',
    ),
    timeLimitMs: integer(data.timeLimitMs, 'config.timeLimitMs', 1),
    starter: player(data.starter, 'config.starter'),
    duel: {
      previewMs: integer(duel.previewMs, 'config.duel.previewMs', 1),
      symbolMs: integer(duel.symbolMs, 'config.duel.symbolMs', 1),
      length,
      symbols,
    },
  };
}

/** @param {() => number} random @param {number} length */
export function randomIndex(random, length) {
  const sample = random();
  requireValue(
    Number.isFinite(sample) && sample >= 0 && sample < 1,
    'randomRange',
  );
  return Math.floor(sample * length);
}

/** @param {() => number} random @returns {import('./types.js').Player} */
export function randomStarter(random) {
  return randomIndex(random, 2) === 0 ? 'A' : 'B';
}

/** @param {number} now @param {number} duration */
export function deadlineAfter(now, duration) {
  const deadline = now + duration;
  requireValue(Number.isSafeInteger(deadline), 'invalidNumber', 'deadline');
  return deadline;
}
