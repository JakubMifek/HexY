const TIE_WINDOW_MS = 8;

/** @typedef {Pick<import('../domain/types.js').Game, 'sessionId'|'revision'>} Context */

export class DuelKeyboard {
  /** @type {Context | null} */
  context = null;
  /** @type {{context: Context, players: import('../domain/types.js').Player[], stamp: number} | null} */
  pending = null;
  /** @type {number | undefined} */
  timer;
  held = new Set();
  releasesRequired = new Set();
  listeners = new AbortController();

  /** @param {Window} target @param {import('./clock.js').Clock} clock
   * @param {(action: import('../domain/types.js').Action) => void} send
   * @param {() => void} interrupt */
  constructor(target, clock, send, interrupt) {
    this.clock = clock;
    this.send = send;
    this.document = target.document;
    const options = { signal: this.listeners.signal };
    target.addEventListener('keydown', (event) => this.down(event), options);
    target.addEventListener('keyup', (event) => this.up(event.code), options);
    target.addEventListener(
      'blur',
      () => {
        this.clearPending();
        interrupt();
      },
      options,
    );
    target.document.addEventListener(
      'visibilitychange',
      () => {
        if (target.document.hidden) {
          this.clearPending();
          interrupt();
        }
      },
      options,
    );
  }

  requireReleases() {
    this.clearPending();
    this.releasesRequired = new Set(['ShiftLeft', 'ShiftRight']);
  }

  /** @param {string} code */
  up(code) {
    this.held.delete(code);
    if (!this.document.hidden && this.document.hasFocus()) {
      this.releasesRequired.delete(code);
    }
  }

  /** @param {KeyboardEvent} event */
  down(event) {
    if (event.code !== 'ShiftLeft' && event.code !== 'ShiftRight') return;
    if (event.repeat || this.held.has(event.code)) return;
    this.held.add(event.code);
    const context = this.context;
    if (!context) return;
    event.preventDefault();
    const player = event.code === 'ShiftLeft' ? 'A' : 'B';
    const pending = this.pending;
    if (this.isTie(event.timeStamp)) {
      this.addPlayer(player);
      return;
    }

    if (pending) this.flush();
    this.pending = {
      context,
      players: [player],
      stamp: event.timeStamp,
    };
    this.timer = this.clock.later(() => this.flush(), TIE_WINDOW_MS);
  }

  /** @param {number} stamp */
  isTie(stamp) {
    return (
      this.pending !== null &&
      Math.abs(stamp - this.pending.stamp) <= TIE_WINDOW_MS
    );
  }

  /** @param {import('../domain/types.js').Player} player */
  addPlayer(player) {
    if (this.pending && !this.pending.players.includes(player))
      this.pending.players.push(player);
  }

  flush() {
    const pending = this.pending;
    this.clearPending();
    if (pending)
      this.send({
        type: 'press',
        players: pending.players,
        ...pending.context,
      });
  }

  clearPending() {
    if (this.timer !== undefined) this.clock.cancel(this.timer);
    this.timer = undefined;
    this.pending = null;
  }

  /** @param {import('../domain/types.js').Game | null} state */
  bind(state) {
    this.clearPending();
    if (!state) this.releasesRequired.clear();
    this.context =
      state?.stage.phase === 'duel-active'
        ? { sessionId: state.sessionId, revision: state.revision }
        : null;
  }

  dispose() {
    this.listeners.abort();
    this.clearPending();
    this.context = null;
    this.held.clear();
    this.releasesRequired.clear();
  }
}
