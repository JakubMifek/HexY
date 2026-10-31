// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { SoundPlayer } from '../src/runtime/sound-player.js';

class AudioDevice {
  state = 'running';
  currentTime = 3;
  destination = {};
  resume = vi.fn(async () => {
    this.state = 'running';
  });
  close = vi.fn(async () => {
    this.state = 'closed';
  });
  createGain = vi.fn(() => ({
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  createOscillator = vi.fn(() => ({
    type: 'sine',
    frequency: { value: 0 },
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: /** @type {null | (() => void)} */ (null),
  }));
}

/** @type {SoundPlayer} */
let sound;
/** @type {AudioDevice} */
let device;
const changed = vi.fn();
beforeEach(() => {
  device = new AudioDevice();
  vi.stubGlobal(
    'AudioContext',
    vi.fn(() => device),
  );
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  vi.stubGlobal('navigator', {
    userActivation: { isActive: true, hasBeenActive: true },
  });
  sound = new SoundPlayer(true, changed);
});
afterEach(() => {
  sound.dispose();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  changed.mockClear();
});

test('only an eligible gesture unlocks audio, and locked cues are never queued', async () => {
  sound.play('select');
  expect(sound.status).toBe('soundBlocked');
  document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  expect(AudioContext).not.toHaveBeenCalled();
  await sound.unlock();
  expect(device.createOscillator).not.toHaveBeenCalled();
  sound.play('select');
  expect(device.createOscillator).toHaveBeenCalledTimes(2);
  expect(sound.status).toBe('');
  const first = device.createOscillator.mock.results[0].value;
  expect(first.frequency.value).toBe(440);
  expect(first.start).toHaveBeenCalledWith(3);
  first.onended?.();
  expect(first.disconnect).toHaveBeenCalledOnce();
  expect(sound.voices.size).toBe(1);
});

test('distinct original cues are bounded and later outcomes replace ongoing audio', async () => {
  await sound.unlock();
  const cues = /** @type {const} */ ([
    'select',
    'award',
    'black',
    'end',
    'tick',
    'timeout',
    'forfeit-black',
  ]);
  const patterns = cues.map((cue) => {
    sound.stop();
    device.createOscillator.mockClear();
    sound.play(cue);
    return device.createOscillator.mock.results
      .map(({ value }) => value.frequency.value)
      .join(',');
  });
  expect(new Set(patterns).size).toBe(cues.length);
  const voices = [...sound.voices];
  sound.play('end');
  expect(
    voices.every(
      ({ oscillator }) => vi.mocked(oscillator.stop).mock.calls.length === 2,
    ),
  ).toBe(true);
  expect(sound.voices.size).toBe(6);
});

test('muting, hiding, disposal and late resume release resources without replay', async () => {
  await sound.unlock();
  sound.play('award');
  sound.setEnabled(false);
  expect(sound.voices.size).toBe(0);
  sound.play('select');
  expect(sound.voices.size).toBe(0);
  sound.setEnabled(true);
  sound.play('black');
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  document.dispatchEvent(new Event('visibilitychange'));
  expect(sound.voices.size).toBe(0);
  sound.play('tick');
  expect(sound.voices.size).toBe(0);
  sound.dispose();
  expect(device.close).toHaveBeenCalledOnce();
  expect(sound.context).toBeNull();
  await sound.unlock();
  expect(AudioContext).toHaveBeenCalledOnce();
});

test('unsupported audio and creation, resume, playback and close failures stay at the audio boundary', async () => {
  vi.stubGlobal('AudioContext', undefined);
  await sound.unlock();
  expect(sound.status).toBe('soundUnavailable');
  vi.stubGlobal(
    'AudioContext',
    vi.fn(() => {
      throw new Error('device');
    }),
  );
  await sound.unlock();
  expect(sound.status).toBe('soundFailed');
  vi.stubGlobal(
    'AudioContext',
    vi.fn(() => device),
  );
  device.state = 'suspended';
  device.resume.mockRejectedValueOnce(
    new DOMException('blocked', 'NotAllowedError'),
  );
  await sound.unlock();
  expect(sound.status).toBe('soundBlocked');
  await sound.unlock();
  device.createOscillator.mockImplementationOnce(() => {
    throw new Error('device');
  });
  sound.play('end');
  expect(sound.status).toBe('soundFailed');
  expect(sound.voices.size).toBe(0);
  device.close.mockRejectedValueOnce(new Error('gone'));
  sound.dispose();
  await Promise.resolve();
});

test('concurrent unlocks are coalesced and a muted or disposed pending resume cannot report or play', async () => {
  device.state = 'suspended';
  /** @type {() => void} */
  let resolve = () => {};
  device.resume.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const pending = sound.unlock();
  await sound.unlock();
  expect(device.resume).toHaveBeenCalledOnce();
  sound.setEnabled(false);
  resolve();
  await pending;
  expect(sound.status).toBe('');
  sound.dispose();
  sound.report('soundFailed');
  sound.play('end');
  expect(device.createOscillator).not.toHaveBeenCalled();
});

test('trusted eligible gestures initialize audio, while hidden gestures and disabled audio do not', async () => {
  const unlock = vi.spyOn(sound, 'unlock');
  sound.gesture({ isTrusted: true });
  expect(unlock).toHaveBeenCalledOnce();
  await Promise.resolve();
  expect(sound.context).not.toBeNull();
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  sound.gesture({ isTrusted: true });
  expect(unlock).toHaveBeenCalledOnce();
  sound.setEnabled(false);
  await sound.unlock();
  sound.report('soundFailed');
  expect(sound.status).toBe('');
});

test.each([
  { key: 'Shift' },
  { key: 'Control' },
  { key: 'Alt' },
  { key: 'Meta' },
  { key: 'Escape' },
  { key: 'Enter', repeat: true },
  { key: 'a', isComposing: true },
])(
  'ignores ineligible keyboard input even during activation: %j',
  (options) => {
    const event = new KeyboardEvent('keydown', options);
    const trusted = new Proxy(event, {
      get(target, property) {
        return property === 'isTrusted'
          ? true
          : Reflect.get(target, property, target);
      },
    });
    sound.gesture(trusted);
    expect(AudioContext).not.toHaveBeenCalled();
  },
);

test('a trusted but nonactivating gesture never creates a context or queues cues', async () => {
  vi.stubGlobal('navigator', {
    userActivation: { isActive: false, hasBeenActive: false },
  });
  sound.gesture({ isTrusted: true });
  sound.play('select');
  expect(AudioContext).not.toHaveBeenCalled();
  vi.stubGlobal('navigator', {
    userActivation: { isActive: true, hasBeenActive: true },
  });
  sound.gesture({ isTrusted: true });
  await Promise.resolve();
  expect(AudioContext).toHaveBeenCalledOnce();
  expect(device.createOscillator).not.toHaveBeenCalled();
  sound.play('award');
  expect(device.createOscillator).toHaveBeenCalledTimes(3);
});

test.each(['resolve', 'reject'])(
  'fresh activation retries a pending resume and an older %s cannot overwrite the result',
  async (settlement) => {
    device.state = 'suspended';
    /** @type {() => void} */
    let settle = () => {};
    device.resume.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          settle =
            settlement === 'resolve' ? resolve : () => reject(new Error('old'));
        }),
    );
    const old = sound.unlock();
    sound.play('select');
    await sound.unlock();
    expect(device.resume).toHaveBeenCalledOnce();
    const retry = vi.spyOn(sound, 'unlock');
    sound.gesture({ isTrusted: true });
    await retry.mock.results[0].value;
    expect(device.resume).toHaveBeenCalledTimes(2);
    expect(sound.status).toBe('');
    expect(device.createOscillator).not.toHaveBeenCalled();
    sound.play('award');
    settle();
    await old;
    expect(sound.status).toBe('');
    expect(device.createOscillator).toHaveBeenCalledTimes(3);
  },
);

test.each(['mute', 'hide', 'dispose'])(
  '%s invalidates a pending resume even if audio later fails',
  async (action) => {
    device.state = 'suspended';
    /** @type {(reason: Error) => void} */
    let reject = () => {};
    device.resume.mockImplementationOnce(
      () =>
        new Promise((_, fail) => {
          reject = fail;
        }),
    );
    const pending = sound.unlock();
    if (action === 'mute') sound.setEnabled(false);
    if (action === 'hide') {
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      document.dispatchEvent(new Event('visibilitychange'));
    }
    if (action === 'dispose') sound.dispose();
    changed.mockClear();
    reject(new Error('late'));
    await pending;
    expect(changed).not.toHaveBeenCalled();
    expect(device.createOscillator).not.toHaveBeenCalled();
    expect(sound.resuming).toBe(false);
  },
);

test('a suspended context skips cues, a nonrunning resume explains the block, and cleanup tolerates stopped nodes', async () => {
  device.state = 'suspended';
  device.resume.mockImplementationOnce(async () => {});
  await sound.unlock();
  sound.play('award');
  expect(sound.status).toBe('soundBlocked');
  expect(device.createOscillator).not.toHaveBeenCalled();
  await sound.unlock();
  sound.play('tick');
  const voice = [...sound.voices][0];
  vi.mocked(voice.oscillator.stop).mockImplementationOnce(() => {
    throw new DOMException('already stopped', 'InvalidStateError');
  });
  sound.stop();
  expect(sound.voices.size).toBe(0);
  expect(sound.status).toBe('');
  sound.play('tick');
  vi.mocked([...sound.voices][0].oscillator.stop).mockImplementationOnce(() => {
    throw new Error('device lost');
  });
  sound.stop();
  expect(sound.status).toBe('soundFailed');
});
