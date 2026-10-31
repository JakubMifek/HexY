/** @typedef {'select'|'award'|'black'|'end'|'tick'|'timeout'|'forfeit-black'} Cue
 * @typedef {''|'soundBlocked'|'soundUnavailable'|'soundFailed'} SoundStatus */

/** @type {Record<Cue, number[]>} */
const NOTES = {
  select: [440, 660],
  award: [523.25, 659.25, 783.99],
  black: [220, 164.81, 110],
  end: [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5],
  tick: [880],
  timeout: [330, 220],
  'forfeit-black': [330, 220, 164.81, 110],
};

/** @param {unknown} error @returns {SoundStatus} */
function audioFailure(error) {
  return error instanceof DOMException && error.name === 'NotAllowedError'
    ? 'soundBlocked'
    : 'soundFailed';
}

/** @param {{isTrusted: boolean}} event */
function eligibleKey(event) {
  return (
    !(event instanceof KeyboardEvent) ||
    !(
      event.repeat ||
      event.isComposing ||
      ['Escape', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key)
    )
  );
}

export class SoundPlayer {
  /** @type {AudioContext | null} */
  context = null;
  /** @type {Set<{oscillator: OscillatorNode, gain: GainNode}>} */
  voices = new Set();
  /** @type {SoundStatus} */
  status = '';
  disposed = false;
  resuming = false;
  resumeAttempt = 0;
  listeners = new AbortController();

  /** @param {boolean} enabled @param {(status: SoundStatus) => void} changed
   * @param {Document} [document] @param {() => AudioContext | null} [create] */
  constructor(
    enabled,
    changed,
    document = window.document,
    create = () =>
      typeof AudioContext === 'undefined' ? null : new AudioContext(),
  ) {
    this.enabled = enabled;
    this.changed = changed;
    this.document = document;
    this.create = create;
    const options = { capture: true, signal: this.listeners.signal };
    for (const type of ['click', 'keydown'])
      document.addEventListener(type, (event) => this.gesture(event), options);
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) {
          this.cancelResume();
          this.stop();
        }
      },
      options,
    );
  }

  /** @param {{isTrusted: boolean}} event */
  gesture(event) {
    if (!event.isTrusted || this.document.hidden) return;
    if (!this.document.defaultView?.navigator.userActivation?.isActive) return;
    if (!eligibleKey(event)) return;
    void this.unlock(true);
  }

  /** @param {boolean} [activated] */
  async unlock(activated = false) {
    if (this.disposed || !this.enabled || (this.resuming && !activated)) return;
    const attempt = ++this.resumeAttempt;
    this.resuming = true;
    try {
      const status = await this.resumeContext();
      if (attempt === this.resumeAttempt) this.report(status);
    } catch (error) {
      if (attempt === this.resumeAttempt) this.report(audioFailure(error));
    } finally {
      if (attempt === this.resumeAttempt) this.resuming = false;
    }
  }

  /** @returns {Promise<SoundStatus>} */
  async resumeContext() {
    this.context ??= this.create();
    const context = this.context;
    if (!context) return 'soundUnavailable';
    // A pending resume can outlive its activation; a new gesture must retry.
    if (context.state === 'suspended') await context.resume();
    return context.state === 'running' ? '' : 'soundBlocked';
  }

  cancelResume() {
    this.resumeAttempt += 1;
    this.resuming = false;
  }

  /** @param {boolean} enabled */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.cancelResume();
      this.stop();
      this.report('');
    }
  }

  /** @param {SoundStatus} status */
  report(status) {
    if (!this.enabled && status !== '') return;
    if (this.disposed || this.status === status) return;
    this.status = status;
    this.changed(status);
  }

  /** @param {Cue} cue */
  play(cue) {
    if (this.disposed || !this.enabled || this.document.hidden) return;
    const context = this.context;
    if (!context || context.state !== 'running') {
      this.report(this.status || 'soundBlocked');
      return;
    }
    try {
      if (cue !== 'tick') this.stop();
      const duration = cue === 'tick' ? 0.035 : 0.11;
      NOTES[cue].forEach((frequency, index) =>
        this.note(
          context,
          frequency,
          context.currentTime + index * duration,
          duration,
        ),
      );
      this.report('');
    } catch {
      // Web Audio is an optional browser/device boundary; gameplay must continue.
      this.stop();
      this.report('soundFailed');
    }
  }

  /** @param {AudioContext} context @param {number} frequency
   * @param {number} start @param {number} duration */
  note(context, frequency, start, duration) {
    const gain = context.createGain();
    const oscillator = context.createOscillator();
    const voice = { oscillator, gain };
    this.voices.add(voice);
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.055, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.onended = () => this.release(voice);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
  }

  /** @param {{oscillator: OscillatorNode, gain: GainNode}} voice */
  release(voice) {
    voice.oscillator.onended = null;
    voice.oscillator.disconnect();
    voice.gain.disconnect();
    this.voices.delete(voice);
  }

  stop() {
    for (const voice of this.voices) {
      try {
        voice.oscillator.stop();
      } catch (error) {
        if (!(
          error instanceof DOMException && error.name === 'InvalidStateError'
        ))
          this.report('soundFailed');
      }
      this.release(voice);
    }
  }

  dispose() {
    this.cancelResume();
    this.stop();
    this.disposed = true;
    this.listeners.abort();
    const context = this.context;
    this.context = null;
    if (context && context.state !== 'closed') void this.close(context);
  }

  /** @param {AudioContext} context */
  async close(context) {
    try {
      await context.close();
    } catch {
      // A closing device may already be gone; no live view remains to notify.
    }
  }
}
