// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { Recovery, GAME_KEY } from '../src/runtime/recovery.js';
import { DomainError } from '../src/domain/errors.js';
import { validateSave } from '../src/domain/saves.js';
import { DUEL_SYMBOLS, browserGame } from '../src/runtime/symbols.js';
import { MAX_GAME_BYTES, recoverPortable } from '../src/domain/portable.js';
import { act, duel, game, question, savedGame } from './fixtures.js';
import { keysToBindings } from '../src/domain/controls.js';

/** @type {Recovery} */
let recovery;
beforeEach(() => {
  localStorage.clear();
  recovery = new Recovery();
});
afterEach(() => {
  recovery.dispose();
  vi.restoreAllMocks();
});

test('near-limit full-game downloads remain importable after round growth without pretty-print expansion', () => {
  const data = JSON.parse(savedGame(game()));
  data.game.pack.questions[0].sources = [''];
  const base = new TextEncoder().encode(JSON.stringify(data)).length;
  data.game.pack.questions[0].sources = [
    'W'.repeat(MAX_GAME_BYTES - base - 700),
  ];
  recovery.settings = data.settings;
  recovery.bindings = keysToBindings(data.keys);
  const state = act(data.game, { type: 'select', cell: 1 });
  const download = vi
    .spyOn(recovery.downloads, 'save')
    .mockImplementation(() => {});
  recovery.export(state);
  expect(download).toHaveBeenCalledOnce();
  const json = download.mock.calls[0][0];
  expect(new TextEncoder().encode(json).length).toBeLessThan(MAX_GAME_BYTES);
  expect(
    recoverPortable(json, 1000, '00000000-0000-0000-0000-000000000001').game
      .stage,
  ).toEqual(state.stage);
});

test('browser symbol compatibility shares the default alphabet and guards persistence without changing domain validity', () => {
  const state = game();
  state.config.duel.symbols = Object.keys(DUEL_SYMBOLS);
  expect(browserGame(state)).toBe(state);
  recovery.load(1000, 'fresh');
  recovery.save(state);
  const original = localStorage.getItem(GAME_KEY);
  for (const symbols of [
    ['hexagon', 'diamond'],
    ['toString', '__proto__'],
  ]) {
    state.config.duel.symbols = symbols;
    state.config.duel.length = symbols.length;
    expect(validateSave(state).config.duel.symbols).toEqual(symbols);
    recovery.save(state);
    expect(recovery.error).toBe('duelCompatibility');
    expect(recovery.saved).toBe(false);
    expect(localStorage.getItem(GAME_KEY)).toBe(original);
  }
});

test.each([30_999, 31_000, 31_001])(
  'recovery at %i preserves the original deadline and uses a new runtime scope',
  (now) => {
    const initial = question();
    localStorage.setItem(GAME_KEY, JSON.stringify(initial));
    const restored = recovery.load(now, 'new-scope');
    expect(restored?.stage).toMatchObject({
      phase: now < 31_000 ? 'question' : 'opponent',
      round: { deadline: 31_000, originalChooser: 'A' },
    });
    expect(restored?.sessionId).toBe('new-scope');
    expect(restored?.cells).toEqual(initial.cells);
    expect(localStorage.getItem(GAME_KEY)).toBe(JSON.stringify(initial));
    if (!restored) throw new Error('Missing recovery');
    recovery.save(restored);
    expect(recovery.saved).toBe(true);
    expect(recovery.load(now, 'third-scope')?.stage).toEqual(restored.stage);
  },
);

test('between-turns, opponent, victory and every duel phase recover through the real validator', () => {
  const selecting = game();
  let win = selecting;
  for (const cell of [1, 2, 4, 7, 11, 16, 22])
    win = act(win, { type: 'set-cell', cell, owner: 'A' });
  const preview = duel();
  const active = act(preview, { type: 'tick' }, 1100);
  const interrupted = act(active, { type: 'interrupt' }, 1100);
  const opponent = act(question(), { type: 'give-up' });
  for (const state of [
    selecting,
    win,
    preview,
    active,
    interrupted,
    opponent,
  ]) {
    localStorage.setItem(GAME_KEY, JSON.stringify(state));
    const restored = recovery.load(2000, 'fresh');
    expect(restored?.pack).toEqual(state.pack);
    expect(restored?.cells).toEqual(state.cells);
    expect(restored?.chooser).toBe(state.chooser);
    expect(restored?.stage.phase).toBe(
      state.stage.phase.startsWith('duel')
        ? 'duel-interrupted'
        : state.stage.phase,
    );
  }
});

test.each([
  '{',
  '{"schemaVersion":3}',
  JSON.stringify({ ...game(), cells: [] }),
])(
  'invalid original %s stays exportable and protected until explicit discard',
  (json) => {
    localStorage.setItem(GAME_KEY, json);
    expect(recovery.load(1000, 'fresh')).toBeUndefined();
    const error = recovery.error;
    recovery.save(game());
    expect(recovery.error).toBe(error);
    expect(recovery.saved).toBe(false);
    const save = vi
      .spyOn(recovery.downloads, 'save')
      .mockImplementation(() => {});
    recovery.export(null);
    expect(save).toHaveBeenCalledWith(
      json,
      'hexy-original-save.json',
      'application/json',
    );
    expect(recovery.error).toBe(error);
    expect(localStorage.getItem(GAME_KEY)).toBe(json);
    expect(recovery.discard()).toBe(true);
    recovery.save(game());
    expect(recovery.saved).toBe(true);
  },
);

test.each([
  JSON.stringify({ ...game(), sessionId: 'other-tab' }, null, 2) + '\n',
  '{ corrupt replacement\n',
  '{ "format": "hexy-game", "schemaVersion": 99 }\n',
  null,
])(
  'write-detected replacement %# is retained verbatim without granting cleanup permission',
  (bytes) => {
    recovery.load(1000, 'fresh');
    recovery.save(game());
    if (bytes === null) localStorage.removeItem(GAME_KEY);
    else localStorage.setItem(GAME_KEY, bytes);
    recovery.save(question());
    expect(recovery.original).toBe(bytes);
    expect(recovery.error).toBe('recoveryChanged');
    expect(recovery.writable).toBe(false);
    expect(recovery.saved).toBe(false);
    const download = vi
      .spyOn(recovery.downloads, 'save')
      .mockImplementation(() => {});
    expect(recovery.export(null)).toBe(bytes !== null);
    if (bytes === null) expect(download).not.toHaveBeenCalled();
    else
      expect(download).toHaveBeenLastCalledWith(
        bytes,
        'hexy-original-save.json',
        'application/json',
      );
    recovery.save(question());
    expect(recovery.discardCurrent()).toBe(false);
    expect(recovery.discardCurrent()).toBe(false);
    expect(localStorage.getItem(GAME_KEY)).toBe(bytes);
    const next = '{ subsequent protected replacement\n';
    localStorage.setItem(GAME_KEY, next);
    expect(recovery.discard()).toBe(false);
    expect(recovery.original).toBe(next);
    expect(recovery.writable).toBe(false);
    expect(recovery.export(null)).toBe(true);
    expect(download).toHaveBeenLastCalledWith(
      next,
      'hexy-original-save.json',
      'application/json',
    );
    expect(recovery.discardCurrent()).toBe(false);
    expect(localStorage.getItem(GAME_KEY)).toBe(next);
  },
);

test('clock regression and unread storage never grant write permission', () => {
  localStorage.setItem(GAME_KEY, JSON.stringify(question()));
  expect(recovery.load(999, 'fresh')).toBeUndefined();
  expect(recovery.error).toBe('clockBackwards');
  const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('denied');
  });
  recovery.load(1000, 'fresh');
  expect(recovery.error).toBe('recoveryRead');
  expect(recovery.discard()).toBe(false);
  get.mockRestore();
  expect(recovery.load(1000, 'fresh')?.stage.phase).toBe('question');
});

test('quota/write/delete failures and a changed record preserve the original', () => {
  recovery.load(1000, 'fresh');
  recovery.save(game());
  const original = localStorage.getItem(GAME_KEY);
  const write = vi
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
  recovery.save(question());
  expect(recovery.error).toBe('recoveryQuota');
  expect(recovery.saved).toBe(false);
  expect(localStorage.getItem(GAME_KEY)).toBe(original);
  write.mockImplementation(() => {
    throw new DOMException('denied');
  });
  recovery.save(question());
  expect(recovery.error).toBe('recoveryWrite');
  write.mockRestore();
  const remove = vi
    .spyOn(Storage.prototype, 'removeItem')
    .mockImplementation(() => {
      throw new DOMException('denied');
    });
  expect(recovery.discard()).toBe(false);
  remove.mockRestore();
  localStorage.setItem(GAME_KEY, 'newer tab');
  expect(recovery.discard()).toBe(false);
  expect(recovery.error).toBe('recoveryChanged');
  expect(localStorage.getItem(GAME_KEY)).toBe('newer tab');
});

test.each([
  JSON.stringify(question(), null, 2),
  '{ unread corrupt bytes\n',
  '{ "schemaVersion": 99 }\n',
])(
  'failed retries cannot reuse stale empty-storage permission: case %#',
  (bytes) => {
    recovery.load(1000, 'fresh');
    recovery.save(game());
    localStorage.removeItem(GAME_KEY);
    expect(recovery.discard()).toBe(false);
    expect(recovery.original).toBeNull();
    localStorage.setItem(GAME_KEY, bytes);
    const nativeRead = Storage.prototype.getItem;
    const read = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new DOMException('denied');
      });
    const write = vi.spyOn(Storage.prototype, 'setItem');
    recovery.retrySave(game(), 1000, 'retry');
    recovery.save(question());
    expect(recovery.writable).toBe(false);
    expect(recovery.saved).toBe(false);
    expect(recovery.error).toBe('recoveryRead');
    expect(write).not.toHaveBeenCalled();
    expect(nativeRead.call(localStorage, GAME_KEY)).toBe(bytes);
    read.mockRestore();
    recovery.retrySave(game(), 1000, 'readable');
    expect(recovery.original).toBe(bytes);
    expect(recovery.writable).toBe(false);
    expect(write).not.toHaveBeenCalled();
    const download = vi
      .spyOn(recovery.downloads, 'save')
      .mockImplementation(() => {});
    recovery.export(null);
    expect(download).toHaveBeenCalledWith(
      bytes,
      'hexy-original-save.json',
      'application/json',
    );
    localStorage.removeItem(GAME_KEY);
    recovery.retrySave(game(), 1000, 'empty');
    expect(recovery.writable).toBe(true);
    expect(recovery.saved).toBe(true);
    expect(recovery.error).toBe('');
  },
);

test('a failed discard reread revokes previously granted saving permission', () => {
  recovery.load(1000, 'fresh');
  recovery.save(game());
  const nativeRead = Storage.prototype.getItem;
  const original = localStorage.getItem(GAME_KEY);
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('denied');
  });
  expect(recovery.discard()).toBe(false);
  recovery.save(question());
  expect(recovery.writable).toBe(false);
  expect(recovery.saved).toBe(false);
  expect(recovery.error).toBe('recoveryRead');
  expect(nativeRead.call(localStorage, GAME_KEY)).toBe(original);
});

test('game export validates real state; failed export is actionable; disposal releases downloads', () => {
  const save = vi
    .spyOn(recovery.downloads, 'save')
    .mockImplementation(() => {});
  recovery.export(question());
  expect(JSON.parse(save.mock.calls[0][0])).toEqual(question());
  save.mockImplementation(() => {
    throw new DomainError('exportFailed');
  });
  recovery.export(game());
  expect(recovery.error).toBe('exportFailed');
  recovery.export(null);
  expect(recovery.error).toBe('recoveryRead');
  expect(() =>
    recovery.attempt(() => {
      throw new Error('programmer');
    }),
  ).toThrow('programmer');
  recovery.dispose();
  recovery.retrySave(game(), 1000, 'disposed');
  recovery.save(game());
  recovery.export(game());
  expect(recovery.discard()).toBe(false);
});

test('saved-game imports are validated, reject occupied storage, and cancel late reads', async () => {
  recovery.load(1000, 'empty');
  const file = { text: async () => savedGame(question()) };
  const imported = await recovery.import(
    /** @type {File} */ (file),
    () => 31_000,
    () => 'import',
  );
  expect(imported?.stage.phase).toBe('opponent');
  recovery.save(game());
  expect(
    await recovery.import(
      /** @type {File} */ (file),
      () => 31_000,
      () => 'import',
    ),
  ).toBeUndefined();
  expect(recovery.error).toBe('recoveryBlocked');
  const bad = {
    text: async () => {
      throw new Error('read');
    },
  };
  await recovery.import(
    bad,
    () => 1000,
    () => 'import',
  );
  expect(recovery.error).toBe('fileRead');
  /** @type {(text: string) => void} */
  let resolve = () => {};
  const late = {
    text: () =>
      new Promise((done) => {
        resolve = done;
      }),
  };
  const pending = recovery.import(
    /** @type {File} */ (late),
    () => 1000,
    () => 'late',
  );
  recovery.discard();
  resolve(JSON.stringify(game()));
  expect(await pending).toBeUndefined();
  const disposed = recovery.import(
    /** @type {File} */ (file),
    () => 1000,
    () => 'disposed',
  );
  recovery.dispose();
  expect(await disposed).toBeUndefined();
});
