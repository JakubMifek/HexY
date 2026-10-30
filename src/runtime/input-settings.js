import {
  defaultBindings,
  validateBindings,
  validateInputPreferences,
} from '../domain/controls.js';
import { DomainError } from '../domain/errors.js';
import { BindingRecorder } from './binding-recorder.js';
import { inputView } from '../ui/inputs.js';
import { deviceStrings } from '../ui/device-strings.js';

export const INPUT_KEY = 'hexy.inputs.v1';

export class InputSettings {
  bindings = defaultBindings();
  /** @type {HTMLDialogElement | null} */
  dialog = null;
  listeners = new AbortController();
  writable = false;
  storageError = false;
  recordError = '';
  /** @type {string | null | undefined} */
  original;
  /** @type {(bindings: import('../domain/controls.js').Bindings) => void} */
  changed = () => {};

  /** @param {import('./inputs.js').Inputs} inputs */
  constructor(inputs) {
    this.inputs = inputs;
    this.recorder = new BindingRecorder(
      inputs.target,
      (player, binding, token) => this.set(player, binding, token),
      (error) => this.refresh(error ?? ''),
      () => inputs.gamepads.refresh(),
    );
    try {
      this.original = inputs.target.localStorage.getItem(INPUT_KEY);
      if (this.original !== null)
        this.restore(validateInputPreferences(JSON.parse(this.original)));
      this.writable = true;
    } catch {
      this.storageError = true;
    }
  }

  /** @param {import('../domain/controls.js').Bindings} bindings */
  restore(bindings) {
    this.bindings = validateBindings(bindings);
    this.inputs.gamepads.assignments = {};
    this.inputs.gamepads.missing.clear();
    this.applyKeys();
  }

  applyKeys() {
    const { A, B } = this.bindings;
    this.inputs.keyboard.remap({
      A: A.kind === 'keyboard' ? A.code : null,
      B: B.kind === 'keyboard' ? B.code : null,
    });
  }

  /** @param {import('../domain/types.js').Player} player
   * @param {import('../domain/controls.js').Binding} binding @param {string} [token] */
  set(player, binding, token) {
    try {
      const bindings = validateBindings({
        ...this.bindings,
        [player]: binding,
      });
      if (binding.kind === 'gamepad')
        this.inputs.gamepads.assign(player, token ?? '', binding.button);
      else this.inputs.gamepads.assign(player, '', 0);
      this.bindings = bindings;
      this.applyKeys();
      this.inputs.requireReleases();
      this.persist();
      this.changed(this.bindings);
      return true;
    } catch (error) {
      if (!(error instanceof DomainError)) throw error;
      this.refresh(
        error.code === 'inputConflict' ? 'conflict' : 'assignmentError',
      );
      return false;
    }
  }

  persist() {
    if (!this.writable) return;
    try {
      const storage = this.inputs.target.localStorage;
      if (storage.getItem(INPUT_KEY) !== this.original) {
        this.writable = false;
        throw new DomainError('inputConflict');
      }
      const json = JSON.stringify({
        schemaVersion: 2,
        bindings: this.bindings,
      });
      storage.setItem(INPUT_KEY, json);
      this.original = json;
      this.storageError = false;
    } catch {
      this.storageError = true;
    }
  }

  notice() {
    const t = deviceStrings[this.inputs.language];
    return this.writable ? t.mappingError : t.mappingReadError;
  }

  needsConnection() {
    return /** @type {const} */ (['A', 'B']).some(
      (player) =>
        this.bindings[player].kind === 'gamepad' &&
        !this.inputs.gamepads.assignments[player],
    );
  }

  /** @param {import('../domain/types.js').Player} player */
  label(player) {
    const t = deviceStrings[this.inputs.language];
    const binding = this.bindings[player];
    if (binding.kind === 'keyboard') {
      /** @type {Record<string, string>} */
      const special = {
        ShiftLeft: t.leftShift,
        ShiftRight: t.rightShift,
        Space: t.space,
      };
      return `${t.key} · ${special[binding.code] ?? binding.code}`;
    }
    const assignment = this.inputs.gamepads.assignments[player];
    return assignment
      ? `${t.device} ${assignment.token} · ${t.button} ${binding.button}`
      : `${t.device} · ${t.rebind}`;
  }

  /** @param {string} [error] */
  refresh(error) {
    if (error !== undefined) this.recordError = error;
    const t = deviceStrings[this.inputs.language];
    for (const player of /** @type {const} */ (['A', 'B'])) {
      const label = this.dialog?.querySelector(`#binding-${player}`);
      if (label) label.textContent = this.label(player);
    }
    const status = this.dialog?.querySelector('#record-status');
    if (status)
      status.textContent = this.recorder.player
        ? `${this.recorder.player} · ${t.recording}`
        : '';
    const cancel = this.dialog?.querySelector('#cancel-record');
    if (cancel instanceof HTMLButtonElement)
      cancel.hidden = !this.recorder.player;
    this.error();
  }

  error() {
    const error = this.recordError;
    const t = deviceStrings[this.inputs.language];
    const feedback = this.dialog?.querySelector('#input-error');
    if (feedback)
      feedback.textContent = error
        ? t[/** @type {'reserved'|'conflict'|'assignmentError'} */ (error)]
        : this.storageError
          ? this.notice()
          : '';
  }

  open() {
    if (this.inputs.disposed || this.dialog) return;
    this.inputs.interrupt();
    this.inputs.keyboard.batch.bind(null);
    const dialog = document.createElement('dialog');
    this.dialog = dialog;
    this.listeners = new AbortController();
    const signal = this.listeners.signal;
    dialog.setAttribute('aria-labelledby', 'input-title');
    dialog.append(
      inputView(deviceStrings[this.inputs.language], this.inputs, signal),
    );
    dialog.addEventListener(
      'cancel',
      (event) => {
        event.preventDefault();
        if (this.recorder.player) this.recorder.cancel();
        else this.close();
      },
      { signal },
    );
    dialog.addEventListener('close', () => this.close(), { signal });
    document.body.append(dialog);
    dialog.showModal();
    this.refresh('');
  }

  close() {
    const dialog = this.dialog;
    if (!dialog) return;
    this.listeners.abort();
    this.recorder.cancel();
    this.inputs.requireReleases();
    this.dialog = null;
    dialog.close();
    dialog.remove();
    if (!this.inputs.disposed) {
      this.inputs.keyboard.batch.bind(this.inputs.state);
      document.getElementById('input-controls')?.focus();
    }
  }

  dispose() {
    this.close();
    this.recorder.dispose();
  }
}
