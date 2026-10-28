import { requireValue } from './errors.js';

/** @param {unknown} value @param {string} path */
export function record(value, path) {
  requireValue(
    typeof value === 'object' && value !== null && !Array.isArray(value),
    'invalidObject',
    path,
  );
  return /** @type {Record<string, unknown>} */ (value);
}

/** @param {unknown} value @param {string} path */
export function text(value, path) {
  requireValue(
    typeof value === 'string' && value.trim().length > 0,
    'invalidText',
    path,
  );
  return value;
}

/** @param {unknown} value @param {string} path */
export function list(value, path) {
  requireValue(Array.isArray(value), 'invalidList', path);
  return /** @type {unknown[]} */ (value);
}

/** @param {unknown} value @param {string} path */
export function strings(value, path) {
  return list(value, path).map((item, index) => text(item, `${path}.${index}`));
}

/** @param {unknown} value @param {string} path @param {number} [minimum] */
export function integer(value, path, minimum = 0) {
  requireValue(
    typeof value === 'number' &&
      Number.isSafeInteger(value) &&
      value >= minimum,
    'invalidNumber',
    path,
  );
  return value;
}

/** @template {string} T @param {unknown} value @param {readonly T[]} allowed
 * @param {string} path @returns {T} */
export function choice(value, allowed, path) {
  requireValue(typeof value === 'string', 'invalidChoice', path);
  const found = allowed.find((item) => item === value);
  requireValue(found !== undefined, 'invalidChoice', path);
  return found;
}

/** @param {unknown} value @param {string} path */
export function player(value, path) {
  return choice(value, /** @type {const} */ (['A', 'B']), path);
}

/** @param {unknown} value @param {string} path */
export function owner(value, path) {
  return choice(
    value,
    /** @type {const} */ (['A', 'B', 'black', 'unclaimed']),
    path,
  );
}

/** @param {unknown} value @param {string} path */
export function cellId(value, path) {
  const id = integer(value, path, 1);
  requireValue(id <= 28, 'invalidCell', path);
  return id;
}
