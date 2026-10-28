/** @typedef {{
 * now: () => number,
 * later: (callback: () => void, delay: number) => number,
 * cancel: (id: number) => void
 * }} Clock */

/** @type {Clock} */
export const browserClock = {
  now: () => Date.now(),
  later: (callback, delay) => window.setTimeout(callback, delay),
  cancel: (id) => window.clearTimeout(id),
};

/** @param {import('../domain/types.js').Game} state */
export function nextBoundary(state) {
  const stage = state.stage;
  if (stage.phase === 'question') return stage.round.deadline;
  if (stage.phase === 'duel-preview') return stage.round.startsAt;
  if (stage.phase !== 'duel-active') return null;
  const { symbolMs } = state.config.duel;
  const index = Math.floor((state.lastNow - stage.round.startsAt) / symbolMs);
  return stage.round.startsAt + (index + 1) * symbolMs;
}

export class RoundClock {
  /** @type {number | undefined} */
  timer;

  /** @param {Clock} clock
   * @param {(state: import('../domain/types.js').Game) => void} tick
   * @param {(now: number) => void} display */
  constructor(clock, tick, display) {
    this.clock = clock;
    this.tick = tick;
    this.display = display;
  }

  /** @param {import('../domain/types.js').Game} state */
  bind(state) {
    this.dispose();
    const boundary = nextBoundary(state);
    if (boundary === null) return;
    const refresh = state.stage.phase === 'question' ? 100 : Infinity;
    this.timer = this.clock.later(
      () => {
        const now = this.clock.now();
        if (now >= boundary || now < state.lastNow) this.tick(state);
        else {
          this.display(now);
          this.bind(state);
        }
      },
      Math.max(0, Math.min(refresh, boundary - this.clock.now())),
    );
  }

  dispose() {
    if (this.timer !== undefined) this.clock.cancel(this.timer);
    this.timer = undefined;
  }
}
