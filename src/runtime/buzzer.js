const TIE_WINDOW_MS = 8;
/** @typedef {Pick<import('../domain/types.js').Game, 'sessionId'|'revision'>} Context */

export class BuzzerBatch {
  /** @type {Context | null} */
  context = null;
  /** @type {{context: Context, players: import('../domain/types.js').Player[], stamp: number} | null} */
  pending = null;
  /** @type {number | undefined} */
  timer;

  /** @param {import('./clock.js').Clock} clock
   * @param {(action: import('../domain/types.js').Action) => void} send */
  constructor(clock, send) {
    this.clock = clock;
    this.send = send;
  }

  /** @param {import('../domain/types.js').Player} player @param {number} stamp */
  press(player, stamp) {
    const context = this.context;
    if (!context) return;
    if (this.pending && Math.abs(stamp - this.pending.stamp) <= TIE_WINDOW_MS) {
      if (!this.pending.players.includes(player))
        this.pending.players.push(player);
      return;
    }
    if (this.pending) this.flush();
    this.pending = { context, players: [player], stamp };
    this.timer = this.clock.later(() => this.flush(), TIE_WINDOW_MS);
  }

  flush() {
    const pending = this.pending;
    this.clear();
    if (pending)
      this.send({
        type: 'press',
        players: pending.players,
        ...pending.context,
      });
  }

  clear() {
    if (this.timer !== undefined) this.clock.cancel(this.timer);
    this.timer = undefined;
    this.pending = null;
  }

  /** @param {import('../domain/types.js').Game | null} state */
  bind(state) {
    this.clear();
    this.context =
      state?.stage.phase === 'duel-active'
        ? { sessionId: state.sessionId, revision: state.revision }
        : null;
  }
}
