import { DomainError, requireValue } from '../domain/errors.js';
import { recoverGame, validateSave } from '../domain/saves.js';
import { Downloads } from './downloads.js';
import { browserGame } from './symbols.js';

export const GAME_KEY = 'hexy.game.v1';

export class Recovery {
  #writable = false;
  saved = false;
  error = '';
  disposed = false;
  generation = 0;
  /** @type {string | null | undefined} */
  original;
  downloads = new Downloads();

  /** @param {() => Storage} [storage] */
  constructor(storage = () => window.localStorage) {
    this.storage = storage;
  }

  get writable() {
    return this.#writable;
  }

  /** @param {number} now @param {string} sessionId */
  load(now, sessionId) {
    this.generation += 1;
    this.#writable = false;
    this.saved = false;
    return this.attempt(() => {
      try {
        this.original = this.storage().getItem(GAME_KEY);
      } catch {
        throw new DomainError('recoveryRead');
      }
      const state =
        this.original === null
          ? null
          : browserGame(recoverGame(this.original, now, sessionId));
      this.#writable = true;
      return state;
    });
  }

  /** @param {import('../domain/types.js').Game} state @param {number} now @param {string} sessionId */
  retrySave(state, now, sessionId) {
    if (this.disposed) return;
    if (!this.#writable) {
      const recovered = this.load(now, sessionId);
      this.#writable = recovered === null;
    }
    this.save(state);
  }

  /** @param {import('../domain/types.js').Game} state */
  save(state) {
    if (this.disposed) return;
    this.generation += 1;
    this.saved = false;
    this.attempt(() => {
      requireValue(this.writable, 'recoveryBlocked');
      const json = JSON.stringify(browserGame(validateSave(state)));
      this.write(json);
      this.original = json;
      this.saved = true;
    });
  }

  /** @param {string | null} json */
  write(json) {
    try {
      if (json === null) this.storage().removeItem(GAME_KEY);
      else this.storage().setItem(GAME_KEY, json);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError')
        throw new DomainError('recoveryQuota');
      throw new DomainError('recoveryWrite');
    }
  }

  discard() {
    if (this.disposed) return false;
    this.generation += 1;
    return (
      this.attempt(() => {
        // Compare even a corrupt record: confirmation must not delete a newer tab's save.
        let current;
        try {
          current = this.storage().getItem(GAME_KEY);
        } catch {
          this.#writable = false;
          this.saved = false;
          throw new DomainError('recoveryRead');
        }
        if (current !== this.original) {
          this.original = current;
          this.#writable = false;
          this.saved = false;
          throw new DomainError('recoveryChanged');
        }
        this.write(null);
        this.original = null;
        this.#writable = true;
        this.saved = false;
        return true;
      }) === true
    );
  }

  /** @param {Pick<File, 'text'>} file @param {() => number} now @param {() => string} sessionId */
  async import(file, now, sessionId) {
    const generation = ++this.generation;
    let json;
    try {
      json = await file.text();
    } catch {
      if (!this.disposed && generation === this.generation)
        this.error = 'fileRead';
      return;
    }
    if (this.disposed || generation !== this.generation) return;
    return this.attempt(() => {
      requireValue(this.writable && this.original === null, 'recoveryBlocked');
      return browserGame(recoverGame(json, now(), sessionId()));
    });
  }

  /** @param {import('../domain/types.js').Game | null} state */
  export(state) {
    if (this.disposed) return;
    const previous = this.error;
    const exported = this.attempt(() => {
      const json = state
        ? JSON.stringify(validateSave(state), null, 2)
        : this.original;
      requireValue(typeof json === 'string', 'recoveryRead');
      this.downloads.save(
        /** @type {string} */ (json),
        state ? 'hexy-game.json' : 'hexy-original-save.json',
        'application/json',
      );
      return true;
    });
    if (exported) this.error = previous;
  }

  /** @template T @param {() => T} action @returns {T | undefined} */
  attempt(action) {
    try {
      const result = action();
      this.error = '';
      return result;
    } catch (error) {
      if (!(error instanceof DomainError)) throw error;
      if (error.code !== 'recoveryBlocked' || !this.error)
        this.error = error.code;
      return undefined;
    }
  }

  dispose() {
    this.disposed = true;
    this.generation += 1;
    this.downloads.dispose();
  }
}
