import { DuelKeyboard } from './keyboard.js';
import { DuelGamepads } from './gamepad.js';
import { DuelTouch } from './touch.js';
import { DomainError } from '../domain/errors.js';
import { deviceStrings } from '../ui/device-strings.js';
import { gamepadView, inputView } from '../ui/inputs.js';

export const INPUT_KEY = 'hexy.inputs.v1';
/** @typedef {import('../domain/types.js').Player} Player */

export class Inputs {
  /** @type {HTMLDialogElement | null} */
  dialog = null;
  /** @type {import('../domain/types.js').Language} */
  language = 'cs';
  listeners = new AbortController();
  padListeners = new AbortController();
  storageError = false;
  writable = false;
  disposed = false;
  /** @type {import('../domain/types.js').Game | null} */
  state = null;
  /** @type {Map<Player, string>} */
  rearming = new Map();
  /** @type {Set<Player>} */
  rearmed = new Set();
  generation = 0;

  /** @param {Window} target @param {import('./clock.js').Clock} clock
   * @param {(action: import('../domain/types.js').Action) => void} send
   * @param {() => void} interrupt @param {() => boolean} [available] */
  constructor(target, clock, send, interrupt, available = () => true) {
    this.available = available;
    this.interrupt = interrupt;
    this.send = send;
    this.target = target;
    this.keyboard = new DuelKeyboard(target, clock, send, interrupt);
    this.keyboard.changed = (player, held) =>
      this.feedback(player, held, 'key');
    this.touch = new DuelTouch(
      target,
      (player, stamp) => this.keyboard.batch.press(player, stamp),
      (player, held) => this.feedback(player, held, 'touch'),
      () => this.interrupt(),
    );
    this.gamepads = new DuelGamepads(
      target,
      clock,
      (player, stamp) => this.keyboard.batch.press(player, stamp),
      interrupt,
      () => this.padChanged(),
    );
    this.gamepads.feedback = (player, held) =>
      this.feedback(
        player,
        held,
        'pad',
        this.gamepads.assignments[player]?.armed ?? false,
      );
    this.load();
  }

  load() {
    try {
      const json = window.localStorage.getItem(INPUT_KEY);
      if (json !== null) {
        const data = JSON.parse(json);
        if (data?.schemaVersion !== 1) throw new DomainError('inputConflict');
        this.keyboard.remap(data.keys);
      }
      this.writable = true;
    } catch {
      this.storageError = true;
    }
  }

  /** @param {Player} player @param {string} code */
  remap(player, code) {
    try {
      this.keyboard.remap({ ...this.keyboard.mapping, [player]: code });
      this.interrupt();
      if (this.writable) {
        window.localStorage.setItem(
          INPUT_KEY,
          JSON.stringify({ schemaVersion: 1, keys: this.keyboard.mapping }),
        );
        this.storageError = false;
      }
      this.error(this.storageError ? this.mappingNotice() : '');
    } catch (error) {
      if (!(error instanceof DomainError)) this.storageError = true;
      const control = document.getElementById(`key-${player}`);
      if (control instanceof HTMLSelectElement)
        control.value = this.keyboard.mapping[player];
      this.error(
        error instanceof DomainError
          ? deviceStrings[this.language].conflict
          : this.mappingNotice(),
      );
    }
  }

  mappingNotice() {
    const t = deviceStrings[this.language];
    return this.writable ? t.mappingError : t.mappingReadError;
  }

  /** @param {Player} player @param {string} token @param {number} index */
  assign(player, token, index) {
    try {
      this.gamepads.assign(player, token, index);
      this.padChanged();
      this.error('');
    } catch (error) {
      if (!(error instanceof DomainError)) throw error;
      const t = deviceStrings[this.language];
      this.error(
        error.code === 'inputConflict' ? t.conflict : t.assignmentError,
      );
    }
  }

  /** @param {string} text */
  error(text) {
    const node = this.dialog?.querySelector('#input-error');
    if (node) node.textContent = text;
  }

  /** @param {Player} player @param {boolean} held @param {string} source @param {boolean} [fresh] */
  feedback(player, held, source, fresh = true) {
    const t = deviceStrings[this.language];
    const node = this.dialog?.querySelector('#input-test-status');
    if (node) node.textContent = `${player} · ${held ? t.pressed : t.released}`;
    this.rearm(player, held, source, fresh);
    this.releaseFeedback();
    this.restartWhenReady();
  }

  /** @param {Player} player @param {boolean} held @param {string} source @param {boolean} fresh */
  rearm(player, held, source, fresh) {
    if (
      this.state?.stage.phase === 'duel-interrupted' &&
      this.available() &&
      !this.dialog &&
      !this.target.document.hidden &&
      this.target.document.hasFocus()
    ) {
      if (held) {
        if (fresh) this.rearming.set(player, source);
        else this.rearming.delete(player);
        this.rearmed.delete(player);
      } else if (this.rearming.get(player) === source) {
        this.rearming.delete(player);
        this.rearmed.add(player);
      }
    }
  }

  restartWhenReady() {
    const state = this.state;
    if (state?.stage.phase !== 'duel-interrupted' || !this.ready()) return;
    const generation = this.generation;
    // Resume outside the releasing adapter callback; queued presses keep their old context.
    queueMicrotask(() => {
      if (
        this.disposed ||
        generation !== this.generation ||
        this.state !== state ||
        !this.ready()
      )
        return;
      this.send({
        type: 'restart',
        sessionId: state.sessionId,
        revision: state.revision,
      });
    });
  }

  releaseFeedback() {
    const node = document.getElementById('release-status');
    if (node) {
      const t = deviceStrings[this.language];
      const ready =
        this.state?.stage.phase === 'duel-interrupted'
          ? this.ready()
          : this.released();
      const text = ready ? t.released : t.rearm;
      if (node.textContent !== text) node.textContent = text;
    }
    const controller = document.getElementById('controller-status');
    if (controller && controller.textContent !== this.controllerStatus())
      controller.textContent = this.controllerStatus();
  }

  controllerStatus() {
    const t = deviceStrings[this.language];
    if (this.gamepads.status)
      return t[
        /** @type {'unsupported'|'denied'|'disconnected'} */ (
          this.gamepads.status
        )
      ];
    if (Object.keys(this.gamepads.assignments).length === 0) return '';
    return /** @type {const} */ (['A', 'B'])
      .map((player) => {
        const assignment = this.gamepads.assignments[player];
        return `${player} · ${assignment ? `${t.device} ${assignment.token} · ${t.button} ${assignment.button}` : t.none}`;
      })
      .join(' / ');
  }

  padChanged() {
    if (!this.gamepads) return;
    const node = this.dialog?.querySelector('#gamepad-settings');
    const identity = JSON.stringify([
      [...this.gamepads.devices.keys()],
      this.gamepads.status,
      Object.entries(this.gamepads.assignments).map(([player, assignment]) => [
        player,
        assignment.token,
        assignment.button,
      ]),
    ]);
    if (node && node.getAttribute('data-identity') !== identity) {
      this.padListeners.abort();
      this.padListeners = new AbortController();
      node.setAttribute('data-identity', identity);
      node.replaceChildren(
        gamepadView(
          deviceStrings[this.language],
          this,
          this.padListeners.signal,
        ),
      );
    }
    this.releaseFeedback();
  }

  requireReleases() {
    this.generation += 1;
    this.rearming.clear();
    this.rearmed.clear();
    this.keyboard.requireReleases();
    this.gamepads.requireReleases();
    this.touch.requireReleases();
  }

  ready() {
    return (
      this.rearmed.size === 2 &&
      this.available() &&
      !this.dialog &&
      !this.target.document.hidden &&
      this.target.document.hasFocus() &&
      this.released()
    );
  }

  released() {
    return (
      this.keyboard.held.size === 0 &&
      this.touch.held.size === 0 &&
      this.gamepads.ready()
    );
  }

  /** @param {import('../domain/types.js').Game | null} state */
  bind(state) {
    this.state = state;
    this.keyboard.bind(state);
    if (this.dialog?.open) this.keyboard.batch.bind(null);
  }

  open() {
    if (this.disposed || this.dialog?.open) return;
    this.interrupt();
    this.keyboard.batch.bind(null);
    this.dialog = document.createElement('dialog');
    this.dialog.setAttribute('aria-labelledby', 'input-title');
    this.listeners = new AbortController();
    this.dialog.append(
      inputView(deviceStrings[this.language], this, this.listeners.signal),
    );
    this.dialog.addEventListener(
      'close',
      () => {
        this.listeners.abort();
        this.padListeners.abort();
        this.dialog?.remove();
        this.dialog = null;
        if (!this.disposed) {
          this.interrupt();
          this.keyboard.batch.bind(this.state);
          document.getElementById('input-controls')?.focus();
        }
      },
      { signal: this.listeners.signal },
    );
    document.body.append(this.dialog);
    this.dialog.showModal();
    this.padChanged();
    this.error(this.storageError ? this.mappingNotice() : '');
  }

  close() {
    this.dialog?.close();
  }

  dispose() {
    this.disposed = true;
    this.close();
    this.listeners.abort();
    this.padListeners.abort();
    this.keyboard.dispose();
    this.gamepads.dispose();
    this.touch.dispose();
  }
}
