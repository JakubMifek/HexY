export class DomainError extends Error {
  /** @param {string} code @param {string} [path] */
  constructor(code, path = '') {
    super(code);
    this.name = 'DomainError';
    this.code = code;
    this.path = path;
  }
}

/** @param {unknown} value @param {string} code @param {string} [path]
 * @returns {asserts value} */
export function requireValue(value, code, path = '') {
  if (!value) throw new DomainError(code, path);
}
