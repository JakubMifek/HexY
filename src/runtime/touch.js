/** @typedef {import('../domain/types.js').Player} Player */

export class DuelTouch {
  /** @type {Map<number, Player>} */
  held = new Map();
  /** @type {Set<Player>} */
  released = new Set();
  listeners = new AbortController();

  /** @param {Window} target @param {(player: Player, stamp: number) => void} press
   * @param {(player: Player, held: boolean) => void} changed
   * @param {() => void} cancel */
  constructor(target, press, changed, cancel) {
    this.press = press;
    this.changed = changed;
    this.cancel = cancel;
    this.document = target.document;
    const options = { signal: this.listeners.signal };
    target.addEventListener(
      'pointerup',
      (event) => this.release(event, false),
      options,
    );
    target.addEventListener(
      'pointercancel',
      (event) => this.release(event, true),
      options,
    );
  }

  /** @param {PointerEvent} event @param {Player} player */
  down(event, player) {
    event.preventDefault();
    if (event.button !== 0 || this.held.has(event.pointerId)) return;
    if ([...this.held.values()].includes(player)) return;
    this.held.set(event.pointerId, player);
    this.changed(player, true);
    this.press(player, event.timeStamp);
  }

  /** @param {PointerEvent} event @param {boolean} cancelled */
  release(event, cancelled) {
    const player = this.held.get(event.pointerId);
    if (!player) return;
    this.held.delete(event.pointerId);
    if (cancelled) this.cancel();
    if (!cancelled && !this.document.hidden && this.document.hasFocus())
      this.released.add(player);
    this.changed(player, false);
  }

  requireReleases() {
    // A cancelled/lost pointer is not a release; a new explicit touch can rearm it.
    this.held.clear();
    this.released.clear();
  }

  dispose() {
    this.listeners.abort();
    this.held.clear();
    this.released.clear();
  }
}
