import { record, choice } from './validation.js';
import { requireValue } from './errors.js';

export const KEY_CODES = [
  'ShiftLeft',
  'ShiftRight',
  'Space',
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => `Key${letter}`),
];

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
