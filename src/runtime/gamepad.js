import { requireValue } from '../domain/errors.js';

/** @typedef {import('../domain/types.js').Player} Player */
/** @typedef {Pick<Gamepad, 'index'|'id'|'connected'|'buttons'>} Pad */
/** @typedef {{token: string, button: number, held: boolean, armed: boolean}} Assignment */

export class DuelGamepads {
  /** @type {Map<number, {token: string, pad: Pad}>} */
  devices = new Map();
  /** @type {Set<Player>} */
  missing = new Set();
  /** @type {Partial<Record<Player, Assignment>>} */
  assignments = {};
  sequence = 0;
  status = '';
  /** @type {number | undefined} */
  timer;
  disposed = false;
  listeners = new AbortController();
  /** @type {(player: Player, held: boolean) => void} */
  feedback = () => {};

  /** @param {Window} target @param {import('./clock.js').Clock} clock
   * @param {(player: Player, stamp: number) => void} press
   * @param {() => void} interrupt @param {() => void} changed
   * @param {() => (Pad | null)[]} [read] @param {() => number} [stamp] */
  constructor(
    target,
    clock,
    press,
    interrupt,
    changed,
    read = () => Array.from(target.navigator.getGamepads()),
    stamp = () => performance.now(),
  ) {
    this.clock = clock;
    this.press = press;
    this.interrupt = interrupt;
    this.changed = changed;
    this.read = read;
    this.stamp = stamp;
    this.document = target.document;
    if (!target.navigator.getGamepads) {
      this.status = 'unsupported';
      return;
    }
    target.addEventListener(
      'gamepaddisconnected',
      (event) => this.remove(event.gamepad.index),
      { signal: this.listeners.signal },
    );
    this.poll();
  }

  poll() {
    if (this.disposed) return;
    let pads;
    try {
      pads = this.read();
    } catch {
      const previous = this.status;
      for (const index of this.devices.keys()) this.remove(index);
      this.status = 'denied';
      if (previous !== this.status) this.changed();
    }
    if (pads) this.sample(pads);
    this.timer = this.clock.later(() => this.poll(), 16);
  }

  /** @param {(Pad | null)[]} pads */
  sample(pads) {
    const connected = pads.filter((pad) => pad?.connected);
    for (const [index, device] of this.devices) {
      if (
        !connected.some(
          (pad) => pad?.index === index && pad.id === device.pad.id,
        )
      )
        this.remove(index);
    }
    for (const pad of connected) {
      if (pad) this.observe(pad);
    }
    const stamp = this.stamp();
    for (const player of /** @type {const} */ (['A', 'B']))
      this.button(player, stamp);
  }

  /** @param {Pad} pad */
  observe(pad) {
    const device = this.devices.get(pad.index);
    if (device) device.pad = pad;
    else {
      this.devices.set(pad.index, { pad, token: `${++this.sequence}` });
      if (this.status !== 'disconnected') this.status = '';
      this.changed();
    }
  }

  /** @param {number} index */
  remove(index) {
    const device = this.devices.get(index);
    if (!device) return;
    this.devices.delete(index);
    for (const player of /** @type {const} */ (['A', 'B'])) {
      if (this.assignments[player]?.token === device.token) {
        delete this.assignments[player];
        this.missing.add(player);
        this.status = 'disconnected';
        this.interrupt();
      }
    }
    this.changed();
  }

  /** @param {Player} player @param {string} token @param {number} button */
  assign(player, token, button) {
    if (!token) {
      delete this.assignments[player];
      this.missing.delete(player);
      this.interrupt();
      return;
    }
    const device = [...this.devices.values()].find(
      (entry) => entry.token === token,
    );
    requireValue(
      device &&
        Number.isInteger(button) &&
        button >= 0 &&
        button < device.pad.buttons.length,
      'inputAssignment',
    );
    const other = this.assignments[player === 'A' ? 'B' : 'A'];
    requireValue(
      !other || other.token !== token || other.button !== button,
      'inputConflict',
    );
    this.assignments[player] = {
      token,
      button,
      held: device.pad.buttons[button].pressed,
      armed: false,
    };
    this.missing.delete(player);
    this.status = '';
    this.interrupt();
    this.changed();
  }

  /** @param {Player} player @param {number} stamp */
  button(player, stamp) {
    const assignment = this.assignments[player];
    if (!assignment) return;
    const device = [...this.devices.values()].find(
      (entry) => entry.token === assignment.token,
    );
    const button = device?.pad.buttons[assignment.button];
    if (!button) {
      if (device) this.remove(device.pad.index);
      return;
    }
    this.edge(player, assignment, button.pressed, stamp);
  }

  /** @param {Player} player @param {Assignment} assignment @param {boolean} held @param {number} stamp */
  edge(player, assignment, held, stamp) {
    if (this.document.hidden || !this.document.hasFocus()) {
      assignment.armed = false;
      return;
    }
    const rising = held && !assignment.held && assignment.armed;
    const changed = held !== assignment.held;
    const wasArmed = assignment.armed;
    assignment.held = held;
    if (!held) assignment.armed = true;
    if (rising) this.press(player, stamp);
    if (changed) this.feedback(player, held);
    if (changed || wasArmed !== assignment.armed) this.changed();
  }

  requireReleases() {
    for (const assignment of Object.values(this.assignments))
      assignment.armed = false;
  }

  ready() {
    return (
      this.missing.size === 0 &&
      Object.values(this.assignments).every(
        (assignment) => assignment.armed && !assignment.held,
      )
    );
  }

  dispose() {
    this.disposed = true;
    this.listeners.abort();
    if (this.timer !== undefined) this.clock.cancel(this.timer);
    this.devices.clear();
    this.assignments = {};
  }
}
