// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { DuelGamepads } from '../src/runtime/gamepad.js';
import { DuelTouch } from '../src/runtime/touch.js';
import { DuelKeyboard } from '../src/runtime/keyboard.js';
import { browserClock } from '../src/runtime/clock.js';
import { act, duel } from './fixtures.js';

/** @type {DuelGamepads} */
let pads;
/** @type {DuelTouch} */
let touch;
/** @type {DuelKeyboard} */
let keyboard;
/** @type {(import('../src/runtime/gamepad.js').Pad | null)[]} */
let devices;
const interrupt = vi.fn();
const send = vi.fn();
const changed = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  devices = [];
  interrupt.mockClear();
  send.mockClear();
  changed.mockClear();
  Object.defineProperty(navigator, 'getGamepads', {
    configurable: true,
    value: () => devices,
  });
  keyboard = new DuelKeyboard(window, browserClock, send, interrupt);
  pads = new DuelGamepads(
    window,
    browserClock,
    (player, stamp) => keyboard.batch.press(player, stamp),
    interrupt,
    changed,
  );
  touch = new DuelTouch(
    window,
    (player, stamp) => keyboard.batch.press(player, stamp),
    changed,
    () => keyboard.batch.clear(),
  );
});
afterEach(() => {
  pads.dispose();
  touch.dispose();
  keyboard.dispose();
  Reflect.deleteProperty(navigator, 'getGamepads');
  vi.restoreAllMocks();
  vi.useRealTimers();
});

/** @param {number} index @param {boolean[]} [buttons] @param {string} [id] */
function pad(index, buttons = [false, false], id = 'Xbox mock') {
  return {
    index,
    id,
    connected: true,
    mapping: 'standard',
    timestamp: 0,
    axes: [],
    buttons: buttons.map((pressed) => ({
      pressed,
      touched: pressed,
      value: Number(pressed),
    })),
  };
}

test('gamepads require explicit conflict-free assignments and neutral samples before rising edges', () => {
  devices = [pad(0, [true, false]), pad(1)];
  pads.sample(devices);
  keyboard.bind(act(duel(), { type: 'tick' }, 1100));
  pads.sample(devices);
  expect(send).not.toHaveBeenCalled();
  pads.assign('A', '1', 0);
  expect(() => pads.assign('B', '1', 0)).toThrow();
  expect(() => pads.assign('B', 'missing', 0)).toThrow();
  expect(() => pads.assign('B', '2', 2)).toThrow();
  expect(() => pads.assign('B', '2', 0.5)).toThrow();
  pads.assign('B', '2', 0);
  pads.sample(devices);
  expect(pads.ready()).toBe(false);
  devices = [pad(0), pad(1)];
  pads.sample(devices);
  expect(pads.ready()).toBe(true);
  devices = [pad(0, [true, false]), pad(1, [true, false])];
  pads.sample(devices);
  pads.sample(devices);
  vi.advanceTimersByTime(8);
  expect(send).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ players: ['A', 'B'] }),
  );
});

test('disconnect invalidates assigned devices without automatic reassignment, including same-index reconnection', () => {
  devices = [pad(0), pad(1)];
  pads.sample(devices);
  pads.assign('A', '1', 0);
  interrupt.mockClear();
  pads.remove(99);
  pads.remove(1);
  expect(interrupt).not.toHaveBeenCalled();
  const event = new Event('gamepaddisconnected');
  Object.defineProperty(event, 'gamepad', { value: devices[0] });
  window.dispatchEvent(event);
  expect(interrupt).toHaveBeenCalledOnce();
  expect(pads.status).toBe('disconnected');
  pads.sample([pad(0)]);
  expect(pads.assignments).toEqual({});
  expect(pads.devices.get(0)?.token).not.toBe('1');
  pads.assign('A', pads.devices.get(0)?.token ?? '', 0);
  pads.assign('A', '', 0);
  expect(pads.assignments).toEqual({});
});

test('identity replacement and focus/visibility loss require neutral rearming', () => {
  devices = [pad(0)];
  pads.sample(devices);
  pads.assign('A', '1', 0);
  pads.sample(devices);
  pads.requireReleases();
  expect(pads.ready()).toBe(false);
  vi.spyOn(document, 'hasFocus').mockReturnValue(false);
  pads.sample(devices);
  expect(pads.ready()).toBe(false);
  vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  pads.sample(devices);
  expect(pads.ready()).toBe(false);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  pads.sample(devices);
  expect(pads.ready()).toBe(true);
  pads.sample([pad(0, [], 'replacement')]);
  expect(pads.assignments).toEqual({});
  expect(pads.status).toBe('disconnected');
});

test('unsupported/denied Gamepad APIs are explicit and cleanup cancels all polling', () => {
  pads.dispose();
  Reflect.deleteProperty(navigator, 'getGamepads');
  const unsupported = new DuelGamepads(
    window,
    browserClock,
    vi.fn(),
    interrupt,
    changed,
  );
  expect(unsupported.status).toBe('unsupported');
  unsupported.dispose();
  Object.defineProperty(navigator, 'getGamepads', {
    configurable: true,
    value: () => {
      throw new DOMException('permission');
    },
  });
  pads = new DuelGamepads(window, browserClock, vi.fn(), interrupt, changed);
  expect(pads.status).toBe('denied');
  pads.read = () => [pad(0)];
  vi.advanceTimersByTime(16);
  expect(pads.devices.size).toBe(1);
  pads.assign('A', '1', 0);
  pads.read = () => {
    throw new DOMException('permission');
  };
  vi.advanceTimersByTime(16);
  expect(pads.assignments).toEqual({});
  pads.dispose();
  pads.poll();
  expect(vi.getTimerCount()).toBe(0);
});

/** @param {string} type @param {number} id @param {number} stamp @param {number} [button] */
function pointer(type, id, stamp, button = 0) {
  const event = new Event(type, { cancelable: true });
  Object.defineProperties(event, {
    pointerId: { value: id },
    timeStamp: { value: stamp },
    button: { value: button },
  });
  return /** @type {PointerEvent} */ (event);
}

test('simultaneous touches batch ties; held/duplicate/nonprimary pointers do not repeat', () => {
  keyboard.bind(act(duel(), { type: 'tick' }, 1100));
  touch.down(pointer('pointerdown', 1, 10), 'A');
  touch.down(pointer('pointerdown', 1, 10), 'A');
  touch.down(pointer('pointerdown', 3, 10), 'A');
  touch.down(pointer('pointerdown', 4, 10, 1), 'B');
  touch.down(pointer('pointerdown', 2, 10), 'B');
  vi.advanceTimersByTime(8);
  expect(send).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ players: ['A', 'B'] }),
  );
  window.dispatchEvent(pointer('pointerup', 1, 20));
  window.dispatchEvent(pointer('pointerup', 2, 20));
  expect(touch.released.size).toBe(2);
  expect(touch.held.size).toBe(0);
  touch.down(pointer('pointerdown', 5, 30), 'A');
  vi.advanceTimersByTime(8);
  expect(send).toHaveBeenCalledTimes(2);
});

test('preview holds, cancellation, focus loss and disposal cannot turn touches into awards', () => {
  touch.down(pointer('pointerdown', 1, 1), 'A');
  keyboard.bind(act(duel(), { type: 'tick' }, 1100));
  touch.down(pointer('pointerdown', 1, 2), 'A');
  window.dispatchEvent(pointer('pointercancel', 1, 3));
  expect(touch.released.size).toBe(0);
  touch.down(pointer('pointerdown', 2, 4), 'B');
  window.dispatchEvent(pointer('pointercancel', 2, 5));
  window.dispatchEvent(pointer('pointerup', 99, 6));
  vi.advanceTimersByTime(8);
  expect(send).not.toHaveBeenCalled();
  touch.down(pointer('pointerdown', 3, 10), 'A');
  vi.spyOn(document, 'hasFocus').mockReturnValue(false);
  window.dispatchEvent(pointer('pointerup', 3, 11));
  expect(touch.released.size).toBe(0);
  touch.requireReleases();
  touch.dispose();
  window.dispatchEvent(pointer('pointerup', 4, 12));
  expect(touch.held.size).toBe(0);
});

test('physical remaps reject conflicts, preserve held/repeat filtering and require explicit releases', () => {
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft' }));
  keyboard.remap({ A: 'KeyQ', B: 'KeyP' });
  expect(keyboard.held.size).toBe(0);
  expect(() => keyboard.remap({ A: 'KeyQ', B: 'KeyQ' })).toThrow();
  expect(() => keyboard.remap({ A: 'Tab', B: 'Enter' })).toThrow();
  keyboard.bind(act(duel(), { type: 'tick' }, 1100));
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyQ' }));
  vi.advanceTimersByTime(8);
  expect(send).not.toHaveBeenCalled();
  window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyQ' }));
  window.dispatchEvent(
    new KeyboardEvent('keydown', { code: 'KeyQ', repeat: true }),
  );
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyQ' }));
  vi.advanceTimersByTime(8);
  expect(send).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ players: ['A'] }),
  );
});

test('mapped keys do not steal input from ordinary controls, but work with buzzer focus', () => {
  keyboard.bind(act(duel(), { type: 'tick' }, 1100));
  for (const tag of ['select', 'input', 'button']) {
    const control = document.createElement(tag);
    document.body.append(control);
    const event = new KeyboardEvent('keydown', {
      code: 'ShiftLeft',
      bubbles: true,
      cancelable: true,
    });
    control.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    keyboard.up('ShiftLeft');
    control.remove();
  }
  vi.advanceTimersByTime(8);
  expect(send).not.toHaveBeenCalled();
  const buzzer = document.createElement('button');
  buzzer.className = 'buzzer';
  document.body.append(buzzer);
  buzzer.dispatchEvent(
    new KeyboardEvent('keydown', { code: 'ShiftLeft', bubbles: true }),
  );
  vi.advanceTimersByTime(8);
  expect(send).toHaveBeenCalledOnce();
  buzzer.remove();
});
