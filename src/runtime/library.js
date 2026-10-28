import { DomainError, requireValue } from '../domain/errors.js';
import { validatePack } from '../domain/packs.js';
import { validatePreferences } from '../domain/preferences.js';
import { list, record } from '../domain/validation.js';

export const LIBRARY_KEY = 'hexy.library.v1';

/** @typedef {{schemaVersion: 1, packs: import('../domain/types.js').Pack[],
 * preferences: import('../domain/preferences.js').Preferences}} LibraryData */

/** @param {unknown} value @returns {LibraryData} */
export function validateLibrary(value) {
  const data = record(value, 'library');
  requireValue(data.schemaVersion === 1, 'libraryVersion');
  const packs = list(data.packs, 'packs').map(validatePack);
  requireValue(
    new Set(packs.map((pack) => pack.id)).size === packs.length,
    'packIdConflict',
  );
  return {
    schemaVersion: 1,
    packs,
    preferences: validatePreferences(data.preferences),
  };
}

export class LocalLibrary {
  writable = false;

  /** @param {() => Storage} [storage] */
  constructor(storage = () => window.localStorage) {
    this.storage = storage;
  }

  load() {
    this.writable = false;
    let json;
    try {
      json = this.storage().getItem(LIBRARY_KEY);
    } catch {
      throw new DomainError('storageReadUnavailable');
    }
    if (json === null) {
      this.writable = true;
      return null;
    }
    try {
      const data = validateLibrary(JSON.parse(json));
      this.writable = true;
      return data;
    } catch (error) {
      if (error instanceof DomainError && error.code === 'libraryVersion')
        throw error;
      if (error instanceof SyntaxError || error instanceof DomainError)
        throw new DomainError('storageCorrupt');
      throw error;
    }
  }

  /** @param {LibraryData} data */
  save(data) {
    requireValue(this.writable, 'storageBlocked');
    const json = JSON.stringify(validateLibrary(data));
    try {
      this.storage().setItem(LIBRARY_KEY, json);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError')
        throw new DomainError('storageQuota');
      throw new DomainError('storageUnavailable');
    }
  }
}
