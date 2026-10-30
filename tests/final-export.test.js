// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from '../src/app.js';
import { browserClock } from '../src/runtime/clock.js';
import { GAME_KEY } from '../src/runtime/recovery.js';
import { LIBRARY_KEY, LocalLibrary } from '../src/runtime/library.js';
import { Preparation } from '../src/runtime/preparation.js';
import { defaultSetup } from './fixtures.js';
import { DomainError } from '../src/domain/errors.js';
import { recoverPortable } from '../src/domain/portable.js';

/** @type {App} */
let app;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1000);
  localStorage.clear();
  vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
});
afterEach(() => {
  app?.dispose();
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
function mount() {
  const root = document.createElement('main');
  document.body.append(root);
  app = new App(
    root,
    browserClock,
    () => 0,
    () => 'final-export',
  );
  app.language = 'en';
}
/** @param {string} id */
function click(id) {
  document.getElementById(id)?.click();
}
/** @param {import('../src/domain/types.js').ActionBody} action */
function send(action) {
  if (!app.state) throw new Error('No game');
  app.send({
    ...action,
    sessionId: app.state.sessionId,
    revision: app.state.revision,
  });
}

test('final export uses click-time expired state before clearing; cancel preserves running absolute deadline', () => {
  mount();
  app.start(defaultSetup('en'));
  send({ type: 'select', cell: 1 });
  const state = app.state;
  app.requestNew();
  click('cancel-new');
  expect(app.state).toBe(state);
  const download = vi
    .spyOn(app.recovery.downloads, 'save')
    .mockImplementation(() => {});
  app.requestNew();
  vi.setSystemTime(31_001);
  click('save-return');
  expect(download).toHaveBeenCalledOnce();
  const output = JSON.parse(download.mock.calls[0][0]);
  expect(output.game.stage.phase).toBe('opponent');
  expect(output.game.stage.round.deadline).toBe(31_000);
  expect(
    recoverPortable(JSON.stringify(output), 32_000, 'reimport').game.stage,
  ).toEqual(output.game.stage);
  expect(localStorage.getItem(GAME_KEY)).toBeNull();
  expect(app.state).toBeNull();
  expect(document.getElementById('new-game')).not.toBeNull();
  expect(document.querySelector('dialog')).toBeNull();
  expect(app.inputs.state).toBeNull();
});

test('failed final download or deletion keeps the game, recoverable record and actionable dialog', () => {
  mount();
  app.start(defaultSetup('en'));
  const before = localStorage.getItem(GAME_KEY);
  const download = vi
    .spyOn(app.recovery.downloads, 'save')
    .mockImplementation(() => {
      throw new DomainError('exportFailed');
    });
  app.requestNew();
  click('save-return');
  expect(app.state).not.toBeNull();
  expect(localStorage.getItem(GAME_KEY)).toBe(before);
  expect(document.getElementById('exit-error')?.textContent).not.toBe('');
  download.mockImplementation(() => {});
  const remove = vi
    .spyOn(Storage.prototype, 'removeItem')
    .mockImplementation(() => {
      throw new DOMException('Denied');
    });
  click('save-return');
  expect(download).toHaveBeenCalledTimes(2);
  expect(app.state).not.toBeNull();
  expect(localStorage.getItem(GAME_KEY)).toBe(before);
  expect(app.recovery.error).toBe('recoveryWrite');
  remove.mockRestore();
  click('discard-new');
  expect(app.state).toBeNull();
  expect(localStorage.getItem(GAME_KEY)).toBeNull();
});

test('concurrent record replacement cannot be overwritten by export tick or deleted by repeated departure', () => {
  mount();
  app.start(defaultSetup('en'));
  send({ type: 'select', cell: 1 });
  const original = app.state;
  const download = vi
    .spyOn(app.recovery.downloads, 'save')
    .mockImplementation(() => {});
  app.requestNew();
  localStorage.setItem(GAME_KEY, '{ protected replacement');
  vi.setSystemTime(31_001);
  click('save-return');
  expect(download).toHaveBeenCalledOnce();
  expect(app.state).not.toBe(original);
  expect(app.state?.stage.phase).toBe('opponent');
  expect(localStorage.getItem(GAME_KEY)).toBe('{ protected replacement');
  expect(app.recovery.writable).toBe(false);
  click('discard-new');
  expect(app.state).not.toBeNull();
  expect(localStorage.getItem(GAME_KEY)).toBe('{ protected replacement');
});

test('victory alone retains recovery and host correction; confirmed departure preserves library and preferences', () => {
  mount();
  app.start(defaultSetup('en'));
  for (const cell of [1, 2, 4, 7, 11, 16, 22])
    send({ type: 'set-cell', cell, owner: 'A' });
  expect(app.state?.stage.phase).toBe('won');
  expect(localStorage.getItem(GAME_KEY)).not.toBeNull();
  app.requestNew();
  click('cancel-new');
  expect(app.state?.stage.phase).toBe('won');
  send({ type: 'set-cell', cell: 1, owner: 'unclaimed' });
  expect(app.state?.stage.phase).toBe('selecting');
  send({ type: 'set-cell', cell: 1, owner: 'A' });
  const library = localStorage.getItem(LIBRARY_KEY);
  const download = vi
    .spyOn(app.recovery.downloads, 'save')
    .mockImplementation(() => {});
  app.requestNew();
  click('save-return');
  expect(JSON.parse(download.mock.calls[0][0]).game.stage.phase).toBe('won');
  expect(localStorage.getItem(GAME_KEY)).toBeNull();
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(library);
});

function legacyLibrary() {
  const prep = new Preparation(
    () => 0,
    () => 'legacy-mix',
  );
  prep.configure({ ...defaultSetup('en'), mode: 'numbers' });
  prep.generate('My deck');
  if (!prep.proposal) throw new Error('No proposal');
  // Historical accept called this same add path as import; no origin was stored.
  prep.add([prep.proposal]);
  const imported = new Preparation(
    () => 0,
    () => 'unused',
  );
  imported.import([JSON.stringify(prep.proposal)], imported.revision);
  expect(imported.custom).toEqual(prep.custom);
  const saved = { ...prep.proposal, id: 'explicit-custom', title: 'My deck' };
  return {
    schemaVersion: 1,
    packs: [prep.proposal, saved],
    preferences: { language: 'en', theme: 'dark', setup: defaultSetup('en') },
  };
}

test('ambiguous legacy mixes and explicit imports survive startup; only confirmed selected copy is removed', () => {
  const legacy = legacyLibrary();
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(legacy));
  localStorage.setItem(GAME_KEY, '{ protected active game');
  mount();
  expect(app.workspace.model.custom).toEqual(legacy.packs);
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(JSON.stringify(legacy));
  app.navigation.go('options');
  expect(document.getElementById('library-heading')?.textContent).toBe(
    'Saved decks',
  );
  click('library-delete-legacy-mix');
  click('library-cancel-delete-legacy-mix');
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(JSON.stringify(legacy));
  click('library-delete-legacy-mix');
  click('library-confirm-delete-legacy-mix');
  const stored = JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? '{}');
  expect(stored.packs).toEqual([legacy.packs[1]]);
  expect(stored.preferences).toEqual(legacy.preferences);
  expect(localStorage.getItem(GAME_KEY)).toBe('{ protected active game');
  const bundled = app.workspace.model.bundled;
  app.dispose();
  mount();
  expect(app.workspace.model.custom).toEqual([legacy.packs[1]]);
  expect(app.workspace.model.bundled).toEqual(bundled);
});

test('saved-copy Delete requires an open confirmation and revoked UI cannot delete after navigation', () => {
  const legacy = legacyLibrary();
  const bytes = JSON.stringify(legacy);
  localStorage.setItem(LIBRARY_KEY, bytes);
  mount();
  app.navigation.go('options');
  click('library-delete-legacy-mix');
  const confirm = document.getElementById('library-confirm-delete-legacy-mix');
  const dialog = document.querySelector('dialog');
  expect(dialog?.open).toBe(true);
  dialog?.dispatchEvent(new Event('cancel', { cancelable: true }));
  expect(document.querySelector('dialog')).toBeNull();
  expect(document.activeElement?.id).toBe('library-delete-legacy-mix');
  confirm?.click();
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(bytes);
  click('library-delete-legacy-mix');
  app.navigation.go('menu');
  confirm?.click();
  expect(document.querySelector('dialog')).toBeNull();
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(bytes);
});

test('new mixes remain temporary through accept, start and confirmed exit; explicit import stays saved', async () => {
  mount();
  const setup = {
    ...defaultSetup('en'),
    mode: /** @type {const} */ ('numbers'),
  };
  app.workspace.model.configure(setup);
  app.workspace.model.generate('Temporary');
  app.workspace.model.accept();
  const pack = app.workspace.model.accepted;
  expect(app.workspace.model.custom).toEqual([]);
  app.start(setup);
  expect(app.state?.pack).toEqual(pack);
  expect(JSON.parse(localStorage.getItem(GAME_KEY) ?? '{}').game.pack).toEqual(
    pack,
  );
  app.requestNew();
  click('discard-new');
  expect(app.workspace.model.accepted).toBeNull();
  expect(JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? '{}').packs).toEqual(
    [],
  );
  await app.workspace.importFiles([
    /** @type {File} */ ({ text: async () => JSON.stringify(pack) }),
  ]);
  expect(JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? '{}').packs).toEqual([
    pack,
  ]);
});

test.each(['quota', 'changed', 'read'])(
  'selective removal under %s failure preserves stored copies and selection',
  (failure) => {
    const legacy = legacyLibrary();
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(legacy));
    mount();
    const get = Storage.prototype.getItem;
    if (failure === 'quota')
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Full', 'QuotaExceededError');
      });
    if (failure === 'read')
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('Denied');
      });
    if (failure === 'changed')
      localStorage.setItem(LIBRARY_KEY, '{ concurrent');
    app.workspace.setIncluded('legacy-mix', false);
    expect(app.workspace.excluded.has('legacy-mix')).toBe(false);
    expect(app.workspace.model.custom).toEqual(legacy.packs);
    expect(get.call(localStorage, LIBRARY_KEY)).toBe(
      failure === 'changed' ? '{ concurrent' : JSON.stringify(legacy),
    );
    expect(app.workspace.storageError).not.toBe('');
  },
);

test('unread/incompatible libraries are not rewritten or migrated', () => {
  for (const bytes of ['{', '{"schemaVersion":99}']) {
    localStorage.setItem(LIBRARY_KEY, bytes);
    const library = new LocalLibrary();
    expect(() => library.load()).toThrow();
    expect(() =>
      library.save(
        /** @type {import('../src/runtime/library.js').LibraryData} */ (
          legacyLibrary()
        ),
      ),
    ).toThrow('storageBlocked');
    expect(localStorage.getItem(LIBRARY_KEY)).toBe(bytes);
  }
});

test('startup recovery has a distinct explicit discard path; ordinary departure never clears protected bytes', () => {
  localStorage.setItem(GAME_KEY, '{"schemaVersion":99}');
  mount();
  app.requestNew();
  click('discard-new');
  expect(localStorage.getItem(GAME_KEY)).toBe('{"schemaVersion":99}');
  click('cancel-new');
  click('discard-save');
  click('discard-new');
  expect(localStorage.getItem(GAME_KEY)).toBeNull();
  expect(document.querySelector('dialog')).toBeNull();
  app.start(defaultSetup('en'));
  expect(app.recovery.saved).toBe(true);
});

test('backwards final-export clock and disposed dialog callbacks never discard or initiate a download', () => {
  mount();
  app.start(defaultSetup('en'));
  const download = vi
    .spyOn(app.recovery.downloads, 'save')
    .mockImplementation(() => {});
  app.requestNew();
  vi.setSystemTime(999);
  click('save-return');
  expect(app.recovery.error).toBe('clockBackwards');
  expect(download).not.toHaveBeenCalled();
  expect(app.state).not.toBeNull();
  const button = document.getElementById('save-return');
  const stored = localStorage.getItem(GAME_KEY);
  app.dispose();
  button?.click();
  expect(download).not.toHaveBeenCalled();
  expect(localStorage.getItem(GAME_KEY)).toBe(stored);
});
