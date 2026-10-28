import { BuzzerBatch } from './buzzer.js';
import { requireValue } from '../domain/errors.js';

export const KEY_CODES = [
  'ShiftLeft',
  'ShiftRight',
  'Space',
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => `Key${letter}`),
];

export class DuelKeyboard {
  mapping = { A: 'ShiftLeft', B: 'ShiftRight' };
  held = new Set();
  releasesRequired = new Set();
  listeners = new AbortController();
  /** @type {(player: import('../domain/types.js').Player, held: boolean) => void} */
  changed = () => {};

  /** @param {Window} target @param {import('./clock.js').Clock} clock
   * @param {(action: import('../domain/types.js').Action) => void} send
   * @param {() => void} interrupt */
  constructor(target, clock, send, interrupt) {
    this.clock = clock;
    this.send = send;
    this.batch = new BuzzerBatch(clock, send);
    this.document = target.document;
    const options = { signal: this.listeners.signal };
    target.addEventListener('keydown', (event) => this.down(event), options);
    target.addEventListener('keyup', (event) => this.up(event.code), options);
    target.addEventListener(
      'blur',
      () => {
        this.batch.clear();
        interrupt();
      },
      options,
    );
    target.document.addEventListener(
      'visibilitychange',
      () => {
        if (target.document.hidden) {
          this.batch.clear();
          interrupt();
        }
      },
      options,
    );
  }

  requireReleases() {
    this.batch.clear();
    this.releasesRequired = new Set(Object.values(this.mapping));
  }

  /** @param {{A: string, B: string}} mapping */
  remap(mapping) {
    requireValue(
      KEY_CODES.includes(mapping.A) &&
        KEY_CODES.includes(mapping.B) &&
        mapping.A !== mapping.B,
      'inputConflict',
    );
    this.mapping = { ...mapping };
    this.held = new Set(
      [...this.held].filter((code) => Object.values(mapping).includes(code)),
    );
    this.requireReleases();
  }

  /** @param {string} code */
  up(code) {
    this.held.delete(code);
    if (!this.document.hidden && this.document.hasFocus()) {
      this.releasesRequired.delete(code);
    }
    const player = this.player(code);
    if (player) this.changed(player, false);
  }

  /** @param {string} code @returns {import('../domain/types.js').Player | null} */
  player(code) {
    if (code === this.mapping.A) return 'A';
    return code === this.mapping.B ? 'B' : null;
  }

  /** @param {KeyboardEvent} event */
  down(event) {
    const player = this.player(event.code);
    if (!player) return;
    if (event.repeat || this.held.has(event.code)) return;
    this.held.add(event.code);
    this.changed(player, true);
    if (!this.batch.context || this.releasesRequired.has(event.code)) return;
    if (isControl(event.target)) return;
    event.preventDefault();
    this.batch.press(player, event.timeStamp);
  }

  /** @param {import('../domain/types.js').Game | null} state */
  bind(state) {
    this.batch.bind(state);
    if (!state) this.releasesRequired.clear();
  }

  dispose() {
    this.listeners.abort();
    this.batch.bind(null);
    this.held.clear();
    this.releasesRequired.clear();
  }
}

/** @param {EventTarget | null} target */
function isControl(target) {
  return (
    target instanceof Element &&
    !target.closest('.buzzer') &&
    target.closest(
      'input, select, textarea, button, [contenteditable="true"]',
    ) !== null
  );
}
