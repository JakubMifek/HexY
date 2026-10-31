// @vitest-environment jsdom
import { Blob as NodeBlob } from 'node:buffer';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from '../src/app.js';
import { Workspace } from '../src/workspace.js';
import { LocalLibrary, LIBRARY_KEY } from '../src/runtime/library.js';
import { browserClock } from '../src/runtime/clock.js';
import { bundledPacks } from '../src/content/catalog.js';
import { importPack } from '../src/domain/packs.js';
import { answerSheet } from '../src/ui/answer-sheet.js';
import { DomainError } from '../src/domain/errors.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';
import { prepare, setting } from './ui-helpers.js';

/** @type {App} */
let app;
/** @type {HTMLElement} */
let root;
/** @type {Blob[]} */
let downloads;
let count = 0;
const id = () => `test-copy-${++count}`;

beforeEach(() => {
  localStorage.clear();
  downloads = [];
  root = document.createElement('div');
  document.body.append(root);
  Element.prototype.scrollIntoView = vi.fn();
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  vi.stubGlobal('Blob', NodeBlob);
  const OriginalURL = URL;
  vi.stubGlobal(
    'URL',
    class extends OriginalURL {
      static createObjectURL(/** @type {Blob} */ blob) {
        downloads.push(blob);
        return `blob:${downloads.length}`;
      }
      static revokeObjectURL = vi.fn();
    },
  );
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  app = new App(root, browserClock, () => 0, id);
  prepare(app);
});

afterEach(() => {
  app.dispose();
  root.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** @param {string} selector */
function click(selector) {
  const node = root.querySelector(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

/** @param {string} selector @param {string} value */
function set(selector, value) {
  if (setting(app, selector, value)) return;
  const node = root.querySelector(selector);
  if (!(
    node instanceof HTMLInputElement ||
    node instanceof HTMLSelectElement ||
    node instanceof HTMLTextAreaElement
  ))
    throw new Error(selector);
  node.value = value;
  node.dispatchEvent(new Event('input', { bubbles: true }));
  node.dispatchEvent(new Event('change', { bubbles: true }));
}

/** @param {string} json @returns {File} */
function file(json) {
  const file = new File([json], 'pack.json');
  file.text = () => Promise.resolve(json);
  return file;
}

/** @param {Document} sheet @param {import('../src/domain/types.js').Pack} pack */
function expectSheetMatches(sheet, pack) {
  expect(
    Array.from(sheet.querySelectorAll('tbody tr')).map((row) =>
      Array.from(row.children).map((cell) => cell.textContent),
    ),
  ).toEqual(
    pack.questions.map((q, index) => [
      String(index + 1),
      q.id,
      q.initial,
      q.text,
      q.answer,
      q.aliases.join('\n'),
    ]),
  );
}

test('real editor makes an immutable custom fixed copy with aliases, metadata and exact HTML rows', async () => {
  set('#ui-language', 'en');
  set('#language', 'en');
  const before = bundledPacks()[1];
  click('#edit-proposal');
  expect(root.querySelector('#answer-sheet')).toBeNull();
  set('#pack-title', 'Private <script>title</script>');
  set('#pack-authors', 'Editor\nOriginal contributors');
  set('#pack-license', 'Original CC BY 4.0; edits by Editor');
  set('#question-text', '<img src=x onerror=alert(1)> Which Greek capital?');
  set('#question-answer', 'Athens');
  set('#question-aliases', 'Athína\n  ATHENAI ');
  set('#question-category', 'geography');
  set('#question-sources', 'Host-authored revision\nhttps://example.com/fact');
  set('#theme', 'dark');
  expect(root.querySelector('#question-text')).toHaveProperty(
    'value',
    '<img src=x onerror=alert(1)> Which Greek capital?',
  );
  expect(root.querySelector('#question-initial')).toHaveProperty(
    'disabled',
    true,
  );
  set('#edit-position', '1');
  set('#edit-position', '0');
  click('#save-pack');
  click('#accept-board');
  click('#export-pack');
  const pack = importPack(await downloads[0].text());
  expect(pack.questions[0].id).toBe(before.questions[0].id);
  expect(pack.questions[0].aliases).toEqual(['Athína', 'ATHENAI']);
  expect(pack.questions.map((q) => q.initial)).toEqual(
    before.questions.map((q) => q.initial),
  );
  expect(bundledPacks()[1]).toEqual(before);
  app.workspace.download(pack, true);
  const sheet = new DOMParser().parseFromString(
    await downloads[1].text(),
    'text/html',
  );
  expect(sheet.querySelectorAll('script,img,button,input')).toHaveLength(0);
  expectSheetMatches(sheet, pack);
  expect(sheet.querySelector('ul')?.textContent).toContain('HexY contributors');
  expect(sheet.querySelector('ul')?.textContent).toContain('CC BY 4.0');
  click('#start');
  expect(app.state?.pack).toEqual(pack);
  expect(root.querySelector('#edit-proposal')).toBeNull();
  expect(root.querySelector('#import-packs')).toBeNull();
  expect(root.querySelector('#answer-sheet')).toBeNull();
  expect(await downloads[2].text()).toBe(await downloads[1].text());
});

test('number proposals need acceptance, allow initial and placement edits, and reimport unchanged', async () => {
  set('#language', 'en');
  set('#mode', 'numbers');
  click('#start');
  expect(app.state).toBeNull();
  click('#prepare-board');
  click('#edit-proposal');
  set('#question-initial', 'A');
  set('#question-answer', 'Athena');
  click('#move-down');
  click('#move-up');
  click('#save-pack');
  click('#accept-board');
  const original = structuredClone(app.workspace.model.accepted);
  click('#export-pack');
  const json = await downloads[0].text();
  await app.workspace.importFiles([file(json)]);
  expect(root.querySelector('#preparation-error')?.textContent).toBe('');
  app.workspace.run(() => app.workspace.model.select([JSON.parse(json).id]));
  click('#use-numbers');
  click('#accept-board');
  expect(app.workspace.model.accepted).toEqual(original);
  click('#edit-proposal');
  set('#pack-id', 'second-custom');
  click('#cancel-edit');
  expect(app.workspace.model.accepted).toBeNull();
  click('#accept-board');
  click('#start');
  expect(app.state?.pack).toEqual(original);
});

test('source selection, invalid drafts/imports, and export errors keep valid prior packs', async () => {
  const before = structuredClone(app.workspace.model.accepted);
  click('#edit-source');
  set('#question-answer', 'Wrong prefix');
  click('#save-pack');
  expect(root.querySelector('#preparation-error')?.textContent).toContain(
    'Hlavní odpověď',
  );
  expect(app.workspace.model.custom).toHaveLength(0);
  click('#cancel-edit');
  click('#accept-board');
  await app.workspace.importFiles([file('{')]);
  expect(root.querySelector('#preparation-error')?.textContent).toContain(
    'Neplatný JSON',
  );
  expect(app.workspace.model.accepted).toEqual(before);
  const source = bundledPacks()[0];
  source.id = 'imported';
  const input = root.querySelector('#import-packs');
  if (!(input instanceof HTMLInputElement)) throw new Error('No importer');
  Object.defineProperty(input, 'files', {
    value: [file(JSON.stringify(source))],
  });
  input.dispatchEvent(new Event('change'));
  await vi.waitFor(() => expect(app.workspace.model.custom).toHaveLength(1));
  click('#source-imported');
  expect(root.querySelector('#edit-source')).toHaveProperty('disabled', true);
  click('#prepare-board');
  expect(root.querySelector('#preparation-error')?.textContent).toContain(
    'právě jednu',
  );
  click('#export-sources');
  expect(downloads).toHaveLength(2);
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
    throw new Error('Unavailable');
  });
  click('#export-sources');
  expect(root.querySelector('#preparation-error')?.textContent).toContain(
    'Stažený soubor',
  );
  expect(app.workspace.model.custom).toHaveLength(1);
});

test('saved imports, custom copies and settings survive remount independently of game storage', async () => {
  set('#ui-language', 'en');
  set('#theme', 'dark');
  set('#nameA', 'Ada');
  click('#edit-proposal');
  set('#pack-title', 'Saved local copy');
  click('#save-pack');
  const copy = app.workspace.model.custom[0];
  app.dispose();
  app = new App(root, browserClock, () => 0, id);
  expect(app.language).toBe('en');
  expect(app.theme).toBe('dark');
  expect(app.settings.players.A.name).toBe('Ada');
  prepare(app);
  expect(app.workspace.model.custom).toEqual([copy]);
  expect(root.textContent).toContain('Saved local copy');
  expect(app.state).toBeNull();
  click('#export-sources');
  expect(importPack(await downloads[0].text())).toEqual(bundledPacks()[1]);
});

test('old library difficulty is never guessed, overwritten or lost; exact original bytes export in both languages', async () => {
  const legacy = {
    ...bundledPacks()[1],
    schemaVersion: 1,
    difficulty: undefined,
  };
  const json = ` \n${JSON.stringify({ schemaVersion: 1, packs: [legacy], preferences: app.workspace.preferences }, null, 3)}\n `;
  app.dispose();
  localStorage.setItem(LIBRARY_KEY, json);
  app = new App(root, browserClock, () => 0, id);
  prepare(app);
  expect(app.workspace.storageError).toBe('storageCorrupt');
  expect(app.workspace.model.custom).toEqual([]);
  expect(app.workspace.library.writable).toBe(false);
  click('#export-library-original');
  expect(await downloads[0].text()).toBe(json);
  set('#ui-language', 'en');
  click('#export-library-original');
  expect(await downloads[1].text()).toBe(json);
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(json);
  vi.spyOn(app.workspace.downloads, 'save').mockImplementation(() => {
    throw new DomainError('exportFailed');
  });
  click('#export-library-original');
  expect(app.workspace.error).toBe('exportFailed');
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(json);
  app.dispose();
  app.workspace.exportOriginalLibrary();
  expect(downloads).toHaveLength(2);
});

test('editor explicitly changes a deck difficulty and persists it through export and reload', async () => {
  click('#edit-proposal');
  set('#pack-difficulty', 'hard');
  click('#save-pack');
  click('#accept-board');
  const pack = app.workspace.model.accepted;
  expect(pack?.difficulty).toBe('hard');
  expect(
    pack?.questions.every((question) => question.difficulty === 'hard'),
  ).toBe(true);
  click('#export-pack');
  expect(importPack(await downloads[0].text())).toEqual(pack);
  app.dispose();
  app = new App(root, browserClock, () => 0, id);
  expect(app.workspace.model.custom[0]).toEqual(pack);
  app.workspace.exportOriginalLibrary();
  expect(downloads).toHaveLength(2);
});

test('editing mixed metadata retains question levels until an explicit whole-copy reclassification', () => {
  set('#ui-language', 'en');
  set('#mode', 'numbers');
  app.workspace.run(() => {
    app.workspace.model.select(['general-en-01', 'general-en-02']);
    app.workspace.model.random = () => 0.41;
    app.workspace.model.generate('Mixed');
  });
  const proposal = app.workspace.model.proposal;
  expect(proposal?.difficulty).toEqual(['easy', 'medium']);
  click('#edit-proposal');
  set('#pack-difficulty', 'mixed');
  set('#pack-title', 'Preserve source levels');
  click('#save-pack');
  expect(app.workspace.model.proposal?.difficulty).toEqual(
    proposal?.difficulty,
  );
  expect(
    app.workspace.model.proposal?.questions.map((q) => q.difficulty),
  ).toEqual(proposal?.questions.map((q) => q.difficulty));
  click('#edit-proposal');
  set('#pack-difficulty', 'hard');
  click('#save-pack');
  expect(app.workspace.model.proposal?.difficulty).toBe('hard');
  expect(
    app.workspace.model.proposal?.questions.every(
      (q) => q.difficulty === 'hard',
    ),
  ).toBe(true);
});

test.each(['{', '{"schemaVersion":2}'])(
  'invalid local library stays untouched and errors translate: %s',
  (json) => {
    app.dispose();
    localStorage.setItem(LIBRARY_KEY, json);
    app = new App(root, browserClock, () => 0, id);
    prepare(app);
    expect(root.querySelector('#storage-error')?.textContent).toContain(
      'přepsána',
    );
    set('#ui-language', 'en');
    expect(root.querySelector('#storage-error')?.textContent).toContain(
      'not overwritten',
    );
    click('#edit-proposal');
    click('#save-pack');
    expect(app.workspace.model.custom).toHaveLength(1);
    expect(localStorage.getItem(LIBRARY_KEY)).toBe(json);
    click('#accept-board');
    click('#start');
    expect(app.state).not.toBeNull();
  },
);

test('storage quota and unavailable storage are visible while custom packs remain exportable', async () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Full', 'QuotaExceededError');
  });
  click('#edit-proposal');
  click('#save-pack');
  expect(root.querySelector('#storage-error')?.textContent).toContain('plné');
  click('#export-pack');
  expect(importPack(await downloads[0].text())).toEqual(
    app.workspace.model.proposal,
  );
  spy.mockRestore();
  set('#theme', 'dark');
  expect(root.querySelector('#storage-error')).toBeNull();
  app.dispose();
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Denied');
  });
  app = new App(root, browserClock, () => 0, id);
  prepare(app);
  expect(root.querySelector('#storage-error')?.textContent).toContain(
    'nelze přečíst',
  );
  click('#start');
  expect(app.state).not.toBeNull();
});

test('late asynchronous import success/failure cannot replace accepted running or disposed content', async () => {
  /** @type {(value: string) => void} */
  let resolve = () => {};
  const delayed = file('{}');
  delayed.text = () =>
    new Promise((done) => {
      resolve = done;
    });
  const pending = app.workspace.importFiles([delayed]);
  const before = structuredClone(app.workspace.model.accepted);
  click('#start');
  resolve(JSON.stringify({ ...bundledPacks()[1], id: 'too-late' }));
  await pending;
  expect(app.state?.pack).toEqual(before);
  expect(app.workspace.model.custom).toHaveLength(0);
  const failing = file('');
  failing.text = () => Promise.reject(new Error('Read failed'));
  await app.workspace.importFiles([failing]);
  expect(app.workspace.error).toBe('');
  app.dispose();
  await app.workspace.importFiles([file('{}')]);
  app.workspace.run(() => {
    throw new Error('Should not run');
  });
  app.workspace.download(bundledPacks()[1]);
  expect(root.childElementCount).toBe(0);
});

test('read failures and superseded imports are explicit or safely ignored without unhandled rejections', async () => {
  const failing = file('');
  failing.text = () => Promise.reject(new Error('Read failed'));
  await app.workspace.importFiles([failing]);
  expect(root.querySelector('#preparation-error')?.textContent).toContain(
    'Soubor nelze',
  );
  /** @type {(value: string) => void} */
  let resolve = () => {};
  const delayed = file('');
  delayed.text = () =>
    new Promise((done) => {
      resolve = done;
    });
  const pending = app.workspace.importFiles([delayed]);
  await app.workspace.importFiles([
    file(JSON.stringify({ ...bundledPacks()[1], id: 'newer' })),
  ]);
  resolve(JSON.stringify({ ...bundledPacks()[1], id: 'older' }));
  await pending;
  expect(app.workspace.model.custom.map((pack) => pack.id)).toEqual(['newer']);
});

test('answer sheets share localization contracts and validate before export', () => {
  expect(Object.keys(preparationStrings.cs)).toEqual(
    Object.keys(preparationStrings.en),
  );
  const invalid = bundledPacks()[1];
  invalid.questions.pop();
  expect(() => answerSheet(invalid, 'en')).toThrow();
});

test('unknown programmer errors are not swallowed by synchronous boundaries', () => {
  expect(() =>
    app.workspace.run(() => {
      throw new Error('Bug');
    }),
  ).toThrow('Bug');
  const library = new LocalLibrary();
  vi.spyOn(library, 'load').mockImplementation(() => {
    throw new Error('Bug');
  });

  expect(
    () =>
      new Workspace(
        () => 0,
        id,
        () => {},
        library,
      ),
  ).toThrow('Bug');
});

test('accepted generated boards are temporary, and active-game downloads preserve the locked pack, typed draft and deadline', async () => {
  set('#mode', 'numbers');
  click('#prepare-board');
  click('#accept-board');
  const pack = app.workspace.model.accepted;
  expect(app.workspace.model.custom).toEqual([]);
  expect(JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? '{}').packs).toEqual(
    [],
  );
  set('#answerMode', 'automatic');
  click('#start');
  click('#cell-1');
  set('#answer', 'Still composing');
  const stage = app.state?.stage;
  expect(root.querySelector('#answer-sheet, #export-pack')).toBeNull();
  click('#save-game');
  expect(root.querySelector('#answer')).toHaveProperty(
    'value',
    'Still composing',
  );
  expect(app.state?.stage).toEqual(stage);
  expect(JSON.parse(await downloads[0].text()).game.pack).toEqual(pack);
});

test('cancelled import is silent and disposal releases every downloaded Blob URL', async () => {
  await app.workspace.importFiles([]);
  expect(app.workspace.notice).toBe('');
  click('#export-pack');
  app.workspace.download(bundledPacks()[0], true);
  expect(app.workspace.downloads.urls.size).toBe(2);
  app.dispose();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:1');
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:2');
  expect(app.workspace.downloads.urls.size).toBe(0);
});

test('confirmed saving exclusion retains exports, selected acceptance and the locked game', async () => {
  click('#edit-proposal');
  click('#save-pack');
  click('#accept-board');
  const accepted = app.workspace.model.accepted;
  if (!accepted) throw new Error('Missing accepted copy');
  const retained = { ...bundledPacks()[1], id: 'retained' };
  await app.workspace.importFiles([file(JSON.stringify(retained))]);
  const original = localStorage.getItem(LIBRARY_KEY);
  click(`#library-delete-${accepted.id}`);
  click(`#library-cancel-delete-${accepted.id}`);
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(original);
  click(`#library-delete-${accepted.id}`);
  click(`#library-confirm-delete-${accepted.id}`);
  expect(JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? '{}').packs).toEqual([
    retained,
  ]);
  expect(app.workspace.model.accepted).toBe(accepted);
  expect(app.workspace.model.custom).toEqual([accepted, retained]);
  click(`#library-export-${accepted.id}`);
  expect(importPack(await downloads[0].text())).toEqual(accepted);
  click('#start');
  const game = app.state;
  expect(root.querySelector(`#library-include-${accepted.id}`)).toBeNull();
  app.workspace.setIncluded(accepted.id, true);
  expect(JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? '{}').packs).toEqual([
    accepted,
    retained,
  ]);
  app.workspace.setIncluded(accepted.id, false);
  expect(app.state).toBe(game);
  expect(app.workspace.model.locked).toBe(true);
  expect(root.querySelector('#edit-proposal')).toBeNull();
  const saved = localStorage.getItem(LIBRARY_KEY);
  app.workspace.setIncluded(bundledPacks()[0].id, false);
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(saved);
  app.dispose();
  app.workspace.setIncluded(retained.id, false);
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(saved);
});

test.each(/** @type {const} */ (['en', 'cs']))(
  '%s: restored read access requires reload and reimport, not an unsafe write retry',
  async (language) => {
    set('#ui-language', language);
    const before = localStorage.getItem(LIBRARY_KEY);
    app.dispose();
    const denied = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new DOMException('Denied', 'SecurityError');
      });
    app = new App(root, browserClock, () => 0, id);
    prepare(app);
    set('#ui-language', language);
    click('#edit-proposal');
    click('#save-pack');
    const copy = app.workspace.model.custom[0];
    click('#export-pack');
    denied.mockRestore();
    set('#nameA', 'Retry');
    const guidance =
      language === 'en'
        ? 'reload, then reimport'
        : 'obnovte stránku a znovu importujte';
    expect(root.querySelector('#storage-error')?.textContent).toContain(
      guidance,
    );
    expect(localStorage.getItem(LIBRARY_KEY)).toBe(before);
    app.dispose();
    app = new App(root, browserClock, () => 0, id);
    expect(app.workspace.model.custom).toEqual([]);
    await app.workspace.importFiles([file(await downloads[0].text())]);
    expect(app.workspace.model.custom).toEqual([copy]);
    expect(app.workspace.storageError).toBe('');
    expect(JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? '{}').packs).toEqual(
      [copy],
    );
  },
);
