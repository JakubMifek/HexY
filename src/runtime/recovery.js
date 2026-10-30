import { DomainError, requireValue } from '../domain/errors.js';
import { validateSave } from '../domain/saves.js';
import {
  recoverPortable,
  portableGame,
  MAX_GAME_BYTES,
} from '../domain/portable.js';
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
  /** @type {import('../ui/setup.js').Setup | null} */
  settings = null;
  /** @type {{A: string, B: string} | null} */
  keys = null;

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
      const restored =
        this.original === null
          ? null
          : recoverPortable(this.original, now, sessionId, true);
      const state = restored ? browserGame(restored.game) : null;
      this.settings = restored?.settings ?? null;
      this.keys = restored?.keys ?? null;
      this.#writable = true;
      return state;
    });
  }

  /** @param {import('../domain/types.js').Game} state @param {number} now @param {string} sessionId */
  retrySave(state, now, sessionId) {
    if (this.disposed) return;
    if (!this.#writable) {
      const settings = this.settings;
      const keys = this.keys;
      const recovered = this.load(now, sessionId);
      this.#writable = recovered === null;
      this.settings = settings;
      this.keys = keys;
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
      const game = browserGame(validateSave(state));
      const json = JSON.stringify(
        this.settings
          ? portableGame(game, this.settings, this.keys ?? undefined)
          : game,
      );
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

  /** @param {Pick<File, 'text'> & {size?: number}} file @param {() => number} now @param {() => string} sessionId */
  async import(file, now, sessionId) {
    const generation = ++this.generation;
    let json;
    try {
      requireValue(
        file.size === undefined || file.size <= MAX_GAME_BYTES,
        'gameSize',
      );
      json = await file.text();
    } catch (error) {
      if (!this.disposed && generation === this.generation)
        this.error = error instanceof DomainError ? error.code : 'fileRead';
      return;
    }
    if (this.disposed || generation !== this.generation) return;
    return this.attempt(() => {
      requireValue(this.writable && this.original === null, 'recoveryBlocked');
      const restored = recoverPortable(json, now(), sessionId());
      const game = browserGame(restored.game);
      this.settings = restored.settings;
      this.keys = restored.keys;
      return game;
    });
  }

  /** @param {import('../domain/types.js').Game | null} state */
  export(state) {
    if (this.disposed) return;
    const previous = this.error;
    const exported = this.attempt(() => {
      const json = state
        ? JSON.stringify(
            this.settings
              ? portableGame(state, this.settings, this.keys ?? undefined)
              : validateSave(state),
          )
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
