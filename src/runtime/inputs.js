import { DuelKeyboard } from './keyboard.js';
import { DuelGamepads } from './gamepad.js';
import { DuelTouch } from './touch.js';
import { DomainError } from '../domain/errors.js';
import { deviceStrings } from '../ui/device-strings.js';
import { gamepadView, inputView, touchView } from '../ui/inputs.js';
import { button, element } from '../ui/dom.js';

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

  /** @param {Window} target @param {import('./clock.js').Clock} clock
   * @param {(action: import('../domain/types.js').Action) => void} send
   * @param {() => void} interrupt */
  constructor(target, clock, send, interrupt) {
    this.interrupt = interrupt;
    this.keyboard = new DuelKeyboard(target, clock, send, interrupt);
    this.keyboard.changed = (player, held) => this.feedback(player, held);
    this.touch = new DuelTouch(
      target,
      (player, stamp) => this.keyboard.batch.press(player, stamp),
      (player, held) => this.feedback(player, held),
      () => this.keyboard.batch.clear(),
    );
    this.gamepads = new DuelGamepads(
      target,
      clock,
      (player, stamp) => this.keyboard.batch.press(player, stamp),
      interrupt,
      () => this.padChanged(),
    );
    this.gamepads.feedback = (player, held) => this.feedback(player, held);
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

  /** @param {Player} player @param {boolean} held */
  feedback(player, held) {
    const t = deviceStrings[this.language];
    const node = this.dialog?.querySelector('#input-test-status');
    if (node) node.textContent = `${player} · ${held ? t.pressed : t.released}`;
    this.releaseFeedback();
  }

  releaseFeedback() {
    const node = document.getElementById('release-status');
    if (node) {
      const t = deviceStrings[this.language];
      const text = this.ready() ? t.released : t.rearm;
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
    this.keyboard.requireReleases();
    this.gamepads.requireReleases();
    this.touch.requireReleases();
  }

  ready() {
    const keysReleased = this.keyboard.releasesRequired.size === 0;
    const touchReleased = this.touch.released.size === 2;
    return (
      (keysReleased || touchReleased) &&
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

  /** @param {import('../domain/types.js').Language} language @param {AbortSignal} signal */
  controls(language, signal) {
    this.language = language;
    const t = deviceStrings[language];
    const panel = element('div', '', { class: 'device-controls' });
    panel.append(
      button(t.controls, 'input-controls', () => this.open(), signal),
      button(
        t.fullscreen,
        'fullscreen',
        () => {
          void this.fullscreen();
        },
        signal,
      ),
      element('p', this.storageError ? this.mappingNotice() : '', {
        id: 'device-error',
        role: 'alert',
      }),
    );
    return panel;
  }

  /** @param {AbortSignal} signal */
  buzzers(signal) {
    const panel = element('div');
    const t = deviceStrings[this.language];
    panel.append(
      element(
        'p',
        `A · ${this.keyboard.mapping.A} / B · ${this.keyboard.mapping.B}`,
      ),
      touchView(t, this, signal),
      element('p', '', { id: 'release-status', role: 'status' }),
      element('p', this.controllerStatus(), {
        id: 'controller-status',
        role: 'status',
      }),
    );
    if (this.state?.stage.phase === 'duel-interrupted')
      panel.append(element('p', t.readyHelp));
    return panel;
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

  async fullscreen() {
    const scope = this.state;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      if (!this.disposed && this.state === scope) {
        const node = document.getElementById('device-error');
        if (node)
          node.textContent = deviceStrings[this.language].fullscreenError;
      }
    }
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
