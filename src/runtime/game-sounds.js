import { SoundPlayer } from './sound-player.js';

const TIMER_CUE_WINDOW_MS = 5_000;

/** @param {import('../domain/types.js').Game} before
 * @param {import('../domain/types.js').Game} after
 * @param {import('../domain/types.js').Action} action
 * @returns {import('./sound-player.js').Cue | null} */
export function transitionCue(before, after, action) {
  if (before.stage.phase === 'selecting' && 'round' in after.stage)
    return 'select';
  if (!('round' in before.stage)) return null;
  if (after.stage.phase === 'won') return 'end';
  const cell = before.stage.round.cell - 1;
  if (before.cells[cell] !== after.cells[cell])
    return awardCue(before, after, action.type);
  if (
    before.stage.phase === 'question' &&
    after.stage.phase === 'opponent-offer'
  )
    return 'timeout';
  return null;
}

/** @param {import('../domain/types.js').Game} before
 * @param {import('../domain/types.js').Game} after
 * @param {import('../domain/types.js').Action['type']} action
 * @returns {import('./sound-player.js').Cue} */
function awardCue(before, after, action) {
  const stage = before.stage;
  if (!('round' in stage)) return 'award';
  const owner = after.cells[stage.round.cell - 1];
  if (owner !== 'black') return 'award';
  const expired =
    'deadline' in stage.round && after.lastNow >= stage.round.deadline;
  return action === 'give-up' || (stage.phase === 'opponent' && expired)
    ? 'forfeit-black'
    : 'black';
}

export class GameSounds {
  /** @type {{key: string, seconds: number, now: number} | null} */
  observed = null;

  /** @param {boolean} enabled
   * @param {(status: import('./sound-player.js').SoundStatus) => void} changed
   * @param {SoundPlayer} [player] */
  constructor(enabled, changed, player = new SoundPlayer(enabled, changed)) {
    this.player = player;
  }

  get enabled() {
    return this.player.enabled;
  }

  /** @param {boolean} enabled */
  setEnabled(enabled) {
    this.player.setEnabled(enabled);
  }

  /** @param {import('../domain/types.js').Game} before
   * @param {import('../domain/types.js').Game} after
   * @param {import('../domain/types.js').Action} action */
  accepted(before, after, action) {
    const cue = transitionCue(before, after, action);
    if (cue) this.player.play(cue);
  }

  /** @param {import('../domain/types.js').Game | null} state @param {number} now */
  display(state, now) {
    if (!state) {
      this.player.stop();
      this.observed = null;
      return;
    }
    if (state.stage.phase !== 'question' && state.stage.phase !== 'opponent') {
      this.observed = null;
      return;
    }
    const round = state.stage.round;
    const key = `${state.sessionId}/${round.cell}/${round.startedAt}/${round.deadline}`;
    const seconds = Math.ceil(Math.max(0, round.deadline - now) / 1000);
    const previous = this.observed;
    this.observed = { key, seconds, now };
    if (!previous || previous.key !== key || seconds <= 0) return;
    if (
      previous.seconds - seconds === 1 &&
      now - previous.now <= 1500 &&
      round.deadline - now <= TIMER_CUE_WINDOW_MS
    )
      this.player.play('tick');
  }

  dispose() {
    this.observed = null;
    this.player.dispose();
  }
}
