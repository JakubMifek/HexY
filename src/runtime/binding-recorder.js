import { KEY_CODES } from '../domain/controls.js';

/** @typedef {import('../domain/types.js').Player} Player */
export class BindingRecorder {
  /** @type {Player | null} */
  player = null;
  held = new Set();
  /** @type {Map<string, boolean[]>} */
  pads = new Map();
  started = 0;
  listeners = new AbortController();

  /** @param {Window} target
   * @param {(player: Player, binding: import('../domain/controls.js').Binding, token?: string) => boolean} accept
   * @param {(error?: string) => void} changed @param {() => void} baseline */
  constructor(target, accept, changed, baseline) {
    this.target = target;
    this.accept = accept;
    this.changed = changed;
    this.baseline = baseline;
    const options = { signal: this.listeners.signal };
    target.addEventListener('keydown', (event) => this.down(event), options);
    target.addEventListener(
      'keyup',
      (event) => this.held.delete(event.code),
      options,
    );
    target.addEventListener('blur', () => this.cancel(), options);
    target.document.addEventListener(
      'visibilitychange',
      () => {
        if (target.document.hidden) this.cancel();
      },
      options,
    );
  }

  /** @param {Player} player */
  start(player) {
    // Sample current hardware before arming: the last poll may predate a held press.
    this.player = null;
    this.baseline();
    this.player = player;
    this.started = performance.now();
    this.changed();
  }

  cancel() {
    this.player = null;
    this.changed();
  }

  /** @param {KeyboardEvent} event */
  down(event) {
    const held = this.held.has(event.code);
    this.held.add(event.code);
    if (!this.player || held || event.repeat || event.timeStamp < this.started)
      return;
    if (this.target.document.hidden || !this.target.document.hasFocus()) return;
    event.preventDefault();
    if (event.code === 'Escape') {
      this.cancel();
      return;
    }
    if (reserved(event)) {
      this.changed('reserved');
      return;
    }

    /** @param {KeyboardEvent} event */
    function reserved(event) {
      return (
        !KEY_CODES.includes(event.code) ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      );
    }
    if (this.accept(this.player, { kind: 'keyboard', code: event.code }))
      this.cancel();
  }

  /** @param {Map<number, {token: string, pad: import('./gamepad.js').Pad}>} devices */
  sample(devices) {
    const previous = this.pads;
    this.pads = new Map(
      [...devices.values()].map(({ token, pad }) => [
        token,
        pad.buttons.map((button) => button.pressed),
      ]),
    );
    if ([...previous.keys()].some((token) => !this.pads.has(token))) {
      this.cancel();
      return;
    }
    if (
      !this.player ||
      this.target.document.hidden ||
      !this.target.document.hasFocus()
    )
      return;
    for (const [token, held] of this.pads) {
      const before = previous.get(token);
      if (!before) continue;
      const button = held.findIndex(
        (down, index) => down && before[index] === false,
      );
      if (
        button >= 0 &&
        this.accept(this.player, { kind: 'gamepad', button }, token)
      ) {
        this.cancel();
        return;
      }
    }
  }

  dispose() {
    this.player = null;
    this.listeners.abort();
    this.held.clear();
    this.pads.clear();
  }
}
