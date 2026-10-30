import { DuelKeyboard } from './keyboard.js';
import { DuelGamepads } from './gamepad.js';
import { DuelTouch } from './touch.js';
import { InputSettings } from './input-settings.js';
import { BoardNavigation } from './board-navigation.js';
import { deviceStrings } from '../ui/device-strings.js';
export { INPUT_KEY } from './input-settings.js';

/** @typedef {import('../domain/types.js').Player} Player */
export class Inputs {
  /** @type {import('../domain/types.js').Language} */
  language = 'cs';
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
      interrupt,
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
    this.controls = new InputSettings(this);
    this.board = new BoardNavigation(this, clock);
    this.gamepads.sampled = () => {
      this.controls.recorder.sample(this.gamepads.devices);
      this.board.sample(this.gamepads.devices);
    };
    this.controls.recorder.sample(this.gamepads.devices);
  }

  get dialog() {
    return this.controls.dialog;
  }
  get storageError() {
    return this.controls.storageError;
  }
  mappingNotice() {
    return this.controls.notice();
  }
  open() {
    this.controls.open();
  }
  close() {
    this.controls.close();
  }

  /** @param {Player} player @param {boolean} held @param {string} source @param {boolean} [fresh] */
  feedback(player, held, source, fresh = true) {
    const node = this.dialog?.querySelector('#input-test-status');
    const t = deviceStrings[this.language];
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
    // Releasing callbacks must finish before the next duel context is armed.
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
    return '';
  }

  padChanged() {
    if (!this.controls) return;
    this.controls.refresh();
    this.releaseFeedback();
  }

  requireReleases() {
    this.generation += 1;
    this.rearming.clear();
    this.rearmed.clear();
    this.keyboard.requireReleases();
    this.gamepads.requireReleases();
    this.touch.requireReleases();
    this.board?.reset();
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
    if (this.state !== state) this.board.reset();
    this.state = state;
    this.keyboard.bind(state);
    if (this.dialog) this.keyboard.batch.bind(null);
  }

  dispose() {
    this.disposed = true;
    this.controls.dispose();
    this.keyboard.dispose();
    this.gamepads.dispose();
    this.touch.dispose();
    this.board.reset();
  }
}
