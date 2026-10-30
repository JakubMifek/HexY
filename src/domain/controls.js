import { record, choice, integer } from './validation.js';
import { requireValue } from './errors.js';

export const KEY_CODES = [
  'ShiftLeft',
  'ShiftRight',
  'Space',
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => `Key${letter}`),
  ...'0123456789'
    .split('')
    .flatMap((digit) => [`Digit${digit}`, `Numpad${digit}`]),
  'Backquote',
  'Minus',
  'Equal',
  'BracketLeft',
  'BracketRight',
  'Backslash',
  'Semicolon',
  'Quote',
  'Comma',
  'Period',
  'Slash',
  'IntlBackslash',
  'NumpadAdd',
  'NumpadSubtract',
  'NumpadMultiply',
  'NumpadDivide',
  'NumpadDecimal',
];

/** @typedef {{kind: 'keyboard', code: string} | {kind: 'gamepad', button: number}} Binding */
/** @typedef {Record<import('./types.js').Player, Binding>} Bindings */

export function defaultBindings() {
  return keysToBindings({ A: 'ShiftLeft', B: 'ShiftRight' });
}

/** @param {unknown} value @returns {Bindings} */
export function keysToBindings(value) {
  const keys = validateKeys(value);
  return {
    A: { kind: 'keyboard', code: keys.A },
    B: { kind: 'keyboard', code: keys.B },
  };
}

/** @param {unknown} value @returns {Bindings} */
export function validateBindings(value) {
  const data = record(value, 'bindings');
  const A = binding(data.A);
  const B = binding(data.B);
  requireValue(
    A.kind !== 'keyboard' || B.kind !== 'keyboard' || A.code !== B.code,
    'inputConflict',
  );
  return { A, B };
}

/** @param {unknown} value @returns {Binding} */
function binding(value) {
  const data = record(value, 'binding');
  const kind = choice(data.kind, ['keyboard', 'gamepad'], 'kind');
  if (kind === 'keyboard')
    return { kind, code: choice(data.code, KEY_CODES, 'code') };
  const button = integer(data.button, 'button', 0);
  requireValue(button <= 63, 'inputAssignment');
  return { kind, button };
}

/** @param {unknown} value */
export function validateInputPreferences(value) {
  const data = record(value, 'inputs');
  requireValue(
    data.schemaVersion === 1 || data.schemaVersion === 2,
    'inputConflict',
  );
  return data.schemaVersion === 1
    ? keysToBindings(data.keys)
    : validateBindings(data.bindings);
}

/** @param {unknown} value */
export function validateKeys(value) {
  const data = record(value, 'controls.keys');
  const keys = {
    A: choice(data.A, KEY_CODES, 'controls.keys.A'),
    B: choice(data.B, KEY_CODES, 'controls.keys.B'),
  };
  requireValue(keys.A !== keys.B, 'inputConflict');
  return keys;
}
