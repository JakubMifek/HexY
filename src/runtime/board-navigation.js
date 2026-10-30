import { moveBoardSelection } from '../ui/board.js';

/** @typedef {{armed: boolean, direction: number, confirm: boolean, next: number}} Edge */
export class BoardNavigation {
  /** @type {Map<string, Edge>} */
  edges = new Map();
  /** @param {import('./inputs.js').Inputs} inputs @param {import('./clock.js').Clock} clock */
  constructor(inputs, clock) {
    this.inputs = inputs;
    this.clock = clock;
  }

  reset() {
    this.edges.clear();
  }

  available() {
    const document = this.inputs.target.document;
    return (
      this.inputs.state?.stage.phase === 'selecting' &&
      this.inputs.available() &&
      !document.querySelector('dialog[open]') &&
      !document.hidden &&
      document.hasFocus() &&
      boardFocused(document)
    );
  }

  /** @param {Map<number, {token: string, pad: import('./gamepad.js').Pad}>} devices */
  sample(devices) {
    if (!this.available()) {
      this.reset();
      return;
    }
    const present = new Set([...devices.values()].map(({ token }) => token));
    for (const token of this.edges.keys())
      if (!present.has(token)) this.edges.delete(token);
    let action = 0;
    for (const { token, pad } of devices.values()) {
      if (pad.mapping !== 'standard') {
        this.edges.delete(token);
        continue;
      }
      const next = this.edge(token, pad);
      if (!action) action = next;
    }
    if (action) this.act(action);
  }

  /** @param {string} token @param {import('./gamepad.js').Pad} pad */
  edge(token, pad) {
    const edge = this.edges.get(token) ?? {
      armed: false,
      direction: 0,
      confirm: false,
      next: 0,
    };
    this.edges.set(token, edge);
    const direction = padDirection(pad, edge.direction);
    const confirm = pad.buttons[0]?.pressed ?? false;
    const now = this.clock.now();
    if (!direction && !confirm) edge.armed = true;
    const action = nextAction(edge, direction, confirm, now);
    edge.direction = direction;
    edge.confirm = confirm;
    return action;
  }

  /** @param {number} action */
  act(action) {
    const document = this.inputs.target.document;
    const board = document.querySelector('.board');
    if (!(board instanceof SVGElement)) return;
    const cell = document.activeElement;
    if (action !== 2) moveBoardSelection(board, action);
    else if (
      cell instanceof SVGElement &&
      cell.matches('.cell[aria-disabled="false"]')
    )
      cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    else moveBoardSelection(board, 1);
  }
}

/** @param {import('./gamepad.js').Pad} pad @param {number} previous */
function padDirection(pad, previous) {
  const pressed = (/** @type {number} */ index) => pad.buttons[index]?.pressed;
  const [x, y] = pad.axes ?? [0, 0];
  if (pressed(12) || pressed(14)) return -1;
  if (pressed(13) || pressed(15)) return 1;
  const axis = Math.abs(x) >= Math.abs(y) ? x : y;
  const threshold = previous ? 0.3 : 0.6;
  return Math.abs(axis) >= threshold ? Math.sign(axis) : 0;
}

/** @param {Document} document */
function boardFocused(document) {
  const focused = document.activeElement;
  return (
    focused === document.body ||
    focused?.id === 'phase-heading' ||
    !!focused?.closest('.board')
  );
}

/** @param {Edge} edge @param {number} direction @param {boolean} confirm @param {number} now */
function nextAction(edge, direction, confirm, now) {
  if (!edge.armed) return 0;
  if (confirm && !edge.confirm) return 2;
  if (!direction || (direction === edge.direction && now < edge.next)) return 0;
  edge.next = now + (direction !== edge.direction ? 350 : 110);
  return direction;
}
