// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from '../src/app.js';
import { browserClock } from '../src/runtime/clock.js';
import { GameSounds, transitionCue } from '../src/runtime/game-sounds.js';
import { SoundPlayer } from '../src/runtime/sound-player.js';
import { validatePreferences } from '../src/domain/preferences.js';
import { strings } from '../src/ui/strings.js';
import { act, defaultSetup, game, question } from './fixtures.js';

/** @type {App} */
let app;
let sequence = 0;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1000);
  localStorage.clear();
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  app = new App(
    root,
    browserClock,
    () => 0,
    () => `effects-${++sequence}`,
  );
});
afterEach(() => {
  app.dispose();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

/** @param {import('../src/domain/types.js').ActionBody} action */
function send(action) {
  if (!app.state) throw new Error('Missing game');
  app.send({
    ...action,
    sessionId: app.state.sessionId,
    revision: app.state.revision,
  });
}

test('ownership and next turn are immediate while the old initial flips to the recipient face', () => {
  app.start(defaultSetup('en'));
  const play = vi.spyOn(app.sounds.player, 'play');
  send({ type: 'select', cell: 4 });
  expect(
    document.querySelector('#cell-4')?.classList.contains('selected-tile'),
  ).toBe(true);
  send({ type: 'judge', correct: true });
  expect(app.state?.cells[3]).toBe('A');
  expect(app.state?.chooser).toBe('B');
  const tile = document.querySelector('#cell-4');
  if (!tile) throw new Error('Missing selected tile');
  expect(tile.getAttribute('aria-label')).toContain('A');
  expect(tile.querySelector('.return-front text')?.textContent).toBe('CH');
  expect(
    tile.querySelector('.return-back .hex-base')?.getAttribute('fill'),
  ).toBe(app.settings.players.A.color);
  expect(tile.querySelector('.return-back text')).toBeNull();
  expect(document.querySelector('.board > :last-child')?.id).toBe('cell-4');
  expect(play.mock.calls.map(([cue]) => cue)).toEqual(['select', 'award']);
  expect(app.feedback.returnCell).toBeUndefined();
  expect(localStorage.getItem('hexy.game.v1')).not.toContain('returnCell');
  app.renderPresentation();
  expect(document.querySelector('.returning, .return-front')).toBeNull();
  expect(play).toHaveBeenCalledTimes(2);
});

test('rejected stale events, wrong answers, presentation and corrections do not emit outcome cues', () => {
  app.start(defaultSetup('en'));
  const play = vi.spyOn(app.sounds.player, 'play');
  send({ type: 'select', cell: 1 });
  app.send({ type: 'judge', correct: true, sessionId: 'stale', revision: 0 });
  send({ type: 'judge', correct: false });
  app.changePresentation('en', 'dark');
  app.renderPresentation();
  expect(play.mock.calls.map(([cue]) => cue)).toEqual(['select']);
  send({ type: 'judge', correct: true });
  send({ type: 'set-cell', cell: 2, owner: 'black' });
  expect(document.querySelector('.returning')).toBeNull();
  expect(play.mock.calls.map(([cue]) => cue)).toEqual(['select', 'award']);
});

test('deadline ticks start at five seconds and avoid duplicate, backlog, zero, or duel ticks', () => {
  const player = new SoundPlayer(true, () => {});
  const play = vi.spyOn(player, 'play');
  const sounds = new GameSounds(true, () => {}, player);
  const state = question();
  sounds.display(state, 1000);
  sounds.display(state, 1999);
  sounds.display(state, 2000);
  sounds.display(state, 2000);
  sounds.display(state, 12000);
  sounds.display(state, 13000);
  sounds.display(state, 25000);
  expect(play).not.toHaveBeenCalled();
  for (const now of [26000, 27000, 28000, 29000, 30000]) {
    sounds.display(state, now);
    sounds.display(state, now);
  }
  sounds.display(state, 31000);
  expect(play.mock.calls.map(([cue]) => cue)).toEqual([
    'tick',
    'tick',
    'tick',
    'tick',
    'tick',
  ]);
  sounds.display(game(), 32000);
  sounds.display(state, 32001);
  expect(play).toHaveBeenCalledTimes(5);
  sounds.dispose();
});

test('a winning award has one end cue, not overlapping award and victory sounds', () => {
  let state = game();
  for (const cell of [2, 4, 7, 11, 16, 22])
    state = act(state, { type: 'set-cell', cell, owner: 'A' });
  const before = act(state, { type: 'select', cell: 1 });
  const action = {
    type: /** @type {const} */ ('judge'),
    correct: true,
    sessionId: before.sessionId,
    revision: before.revision,
  };
  const after = act(before, action);
  expect(after.stage.phase).toBe('won');
  expect(transitionCue(before, after, action)).toBe('end');
});

test('deadline expiry uses the actual transition even when a late unrelated action triggers it', () => {
  app.start(defaultSetup('en'));
  const play = vi.spyOn(app.sounds.player, 'play');
  send({ type: 'select', cell: 1 });
  vi.setSystemTime(31000);
  send({ type: 'set-cell', cell: 2, owner: 'A' });
  expect(app.state?.stage.phase).toBe('opponent-offer');
  expect(app.state?.cells[1]).toBe('unclaimed');
  expect(play.mock.calls.map(([cue]) => cue)).toEqual(['select', 'timeout']);
});

test('sound defaults and strict optional preference migration preserve portable setup', () => {
  const preferences = {
    language: 'en',
    theme: 'light',
    setup: defaultSetup('en'),
  };
  expect(validatePreferences(preferences).sound).toBe(true);
  expect(validatePreferences({ ...preferences, sound: false }).sound).toBe(
    false,
  );
  expect(() =>
    validatePreferences({ ...preferences, sound: 'false' }),
  ).toThrow();
  expect(() => validatePreferences({ ...preferences, sound: null })).toThrow();
  app.navigation.go('options');
  const toggle = document.querySelector('#sound-enabled');
  expect(toggle?.getAttribute('aria-pressed')).toBe('true');
  toggle?.dispatchEvent(new MouseEvent('click'));
  expect(toggle?.getAttribute('aria-pressed')).toBe('false');
  expect(app.sounds.enabled).toBe(false);
  const saved = JSON.parse(localStorage.getItem('hexy.library.v1') ?? '{}');
  expect(saved.preferences.sound).toBe(false);
  expect(saved.preferences.setup).not.toHaveProperty('sound');
});

test('offer retains the enlarged initial; accepted opponent gets their color, ticks and return face', () => {
  app.start(defaultSetup('en'));
  const play = vi.spyOn(app.sounds.player, 'play');
  send({ type: 'select', cell: 4 });
  send({ type: 'give-up' });
  expect(app.state?.stage.phase).toBe('opponent-offer');
  expect(document.querySelector('#cell-4.selected-tile')).not.toBeNull();
  expect(document.querySelector('.tile-countdown')).toBeNull();
  vi.advanceTimersByTime(5000);
  expect(play.mock.calls.map(([cue]) => cue)).toEqual(['select', 'timeout']);
  send({ type: 'accept-opponent' });
  expect(
    document
      .querySelector('.tile-countdown circle:last-child')
      ?.getAttribute('stroke'),
  ).toBe(app.settings.players.B.color);
  send({ type: 'judge', correct: false });
  expect(app.state?.stage.phase).toBe('opponent');
  vi.advanceTimersByTime(1000);
  expect(play.mock.calls.map(([cue]) => cue)).toEqual(['select', 'timeout']);
  vi.advanceTimersByTime(9000);
  vi.advanceTimersByTime(4000);
  send({ type: 'judge', correct: true });
  expect(app.state?.cells[3]).toBe('B');
  expect(app.state?.chooser).toBe('A');
  expect(
    document.querySelector('.return-back .hex-base')?.getAttribute('fill'),
  ).toBe(app.settings.players.B.color);
  expect(play.mock.calls.map(([cue]) => cue)).toEqual([
    'select',
    'timeout',
    'tick',
    'tick',
    'tick',
    'tick',
    'tick',
    'award',
  ]);
});

test.each(['decline', 'give-up', 'timeout'])(
  '%s returns a black face and one coherent loss cue without delaying the chooser',
  (outcome) => {
    app.start(defaultSetup('en'));
    const play = vi.spyOn(app.sounds.player, 'play');
    send({ type: 'select', cell: 1 });
    send({ type: 'give-up' });
    if (outcome === 'decline') send({ type: 'decline-opponent' });
    else {
      send({ type: 'accept-opponent' });
      if (outcome === 'give-up') send({ type: 'give-up' });
      else vi.advanceTimersByTime(15000);
    }
    expect(app.state?.cells[0]).toBe('black');
    expect(app.state?.chooser).toBe(outcome === 'decline' ? 'B' : 'A');
    expect(document.querySelector('.return-front text')?.textContent).toBe('A');
    expect(
      document.querySelector('.return-back .hex-base')?.getAttribute('fill'),
    ).toBe('var(--cell-black)');
    expect(play.mock.calls.at(-1)).toEqual([
      outcome === 'decline' ? 'black' : 'forfeit-black',
    ]);
    expect(document.querySelector('.tile-countdown')).toBeNull();
  },
);

test('only the return animation completion removes its old face, without changing authoritative state', () => {
  app.start(defaultSetup('en'));
  send({ type: 'select', cell: 1 });
  send({ type: 'judge', correct: true });
  const face = document.querySelector('.returning');
  if (!face) throw new Error('Missing returning face');
  const revision = app.state?.revision;
  for (const [target, name] of [
    [face.firstElementChild, 'tile-reveal'],
    [face, 'tile-return'],
  ]) {
    const event = new Event('animationend', { bubbles: true });
    Object.defineProperty(event, 'animationName', { value: name });
    if (target instanceof Element) target.dispatchEvent(event);
    if (name === 'tile-reveal')
      expect(face.querySelector('.return-front')).not.toBeNull();
  }
  expect(face.querySelector('.return-front')).toBeNull();
  expect(face.classList.contains('returning')).toBe(false);
  expect(app.state?.revision).toBe(revision);
  expect(app.state?.cells[0]).toBe('A');
});

test.each([true, false])(
  'reduced motion (%s initially) cancels presentation once without replaying on preference changes',
  (initial) => {
    let reduced = initial;
    const motion = new EventTarget();
    Object.defineProperty(motion, 'matches', { get: () => reduced });
    vi.stubGlobal('matchMedia', () => motion);
    app.start(defaultSetup('en'));
    send({ type: 'select', cell: 1 });
    send({ type: 'judge', correct: true });
    reduced = true;
    motion.dispatchEvent(new Event('change'));
    expect(document.querySelector('.returning, .return-front')).toBeNull();
    reduced = false;
    motion.dispatchEvent(new Event('change'));
    expect(document.querySelector('.returning, .return-front')).toBeNull();
    expect(app.state?.cells[0]).toBe('A');
  },
);

test.each(
  /** @type {const} */ (['soundBlocked', 'soundUnavailable', 'soundFailed']),
)(
  '%s remains a localized header status rather than adding a gameplay footer or overlay',
  (code) => {
    app.start(defaultSetup('en'));
    app.sounds.player.report(code);
    const status = document.querySelector('#sound-status');
    expect(status?.closest('.header-controls')).not.toBeNull();
    expect(status?.getAttribute('aria-label')).toBe(strings.en[code]);
    expect(status?.getAttribute('title')).toBe(strings.en[code]);
    expect(status?.textContent).toContain('Audio');
    expect(app.root.lastElementChild?.id).toBe('error');
    app.language = 'cs';
    app.renderPresentation();
    const localized = document.querySelector('#sound-status');
    expect(localized?.getAttribute('aria-label')).toBe(strings.cs[code]);
    expect(localized?.textContent).toContain('Zvuk');
    app.sounds.setEnabled(false);
    expect(localized?.textContent).toBe('');
  },
);
