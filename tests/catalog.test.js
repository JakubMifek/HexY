// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { bundledPacks } from './bundled-packs.js';
import { filterPacks } from '../src/content/catalog.js';
import { Preparation } from '../src/runtime/preparation.js';
import { defaultSetup } from './fixtures.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';
import { catalogView } from '../src/ui/catalog.js';
import { answerSheet } from '../src/ui/answer-sheet.js';
import { editorView } from '../src/ui/editor.js';
import { DIFFICULTIES } from '../src/domain/difficulty.js';

/** @type {AbortController[]} */
const controllers = [];
afterEach(() => {
  controllers.forEach((controller) => controller.abort());
  controllers.length = 0;
  document.body.replaceChildren();
});

/** @param {'en'|'cs'} [language] */
function setup(language = 'en') {
  const model = new Preparation(
    () => 0,
    () => 'custom',
    bundledPacks(),
  );
  model.configure(defaultSetup(language));
  const lifecycle = new AbortController();
  controllers.push(lifecycle);
  const render = () =>
    document.body.replaceChildren(
      catalogView(
        preparationStrings[language],
        model,
        (action) => {
          action();
          render();
        },
        lifecycle.signal,
      ),
    );
  render();
  return { model, render, lifecycle };
}

/** @param {string} id @param {string} value */
function filter(id, value) {
  const control = document.getElementById(`catalog-${id}`);
  if (!(control instanceof HTMLSelectElement))
    throw new Error('Missing filter');
  control.value = value;
  control.dispatchEvent(new Event('input', { bubbles: true }));
}

/** @param {string} id @returns {HTMLInputElement} */
function box(id) {
  const control = document.getElementById(id);
  if (!(control instanceof HTMLInputElement)) throw new Error(`Missing ${id}`);
  return control;
}

/** @param {string} id @param {boolean} checked */
function check(id, checked) {
  const control = box(id);
  control.checked = checked;
  control.dispatchEvent(new Event('change', { bubbles: true }));
}

test.each(
  /** @type {const} */ ([
    ['en', 'Computing and Programming'],
    ['cs', 'Informatika a programování'],
  ]),
)(
  '%s Computing scope has a stable ID and localized folder, title and print name',
  (language, name) => {
    const { model, lifecycle } = setup(language);
    expect(preparationStrings[language].categories.programming).toBe(name);
    expect(
      document.querySelector('#decks-programming summary')?.textContent,
    ).toContain(name);
    const pack = model.packs.find(
      (pack) => pack.id === `programming-${language}-01`,
    );
    if (!pack) throw new Error('Missing inherited Computing pack');
    expect(pack.title).toBe(`${name} · 01`);
    expect(pack.questions.every((q) => q.category === 'programming')).toBe(
      true,
    );
    const printed = new DOMParser().parseFromString(
      answerSheet(pack, language),
      'text/html',
    );
    expect(printed.body.textContent).toContain(
      `${preparationStrings[language].category}: ${name}`,
    );
    expect(printed.querySelectorAll('tbody tr')).toHaveLength(28);
    model.edit(pack, preparationStrings[language].custom);
    document.body.replaceChildren(
      editorView(
        preparationStrings[language],
        model,
        (action) => action(),
        () => model.saveEditor(),
        lifecycle.signal,
      ),
    );
    expect(
      document.querySelector('#question-category')?.closest('label')
        ?.textContent,
    ).toContain(name);
    expect(document.querySelector('#question-category')).toHaveProperty(
      'value',
      'programming',
    );
  },
);

test.each(/** @type {const} */ (['cs', 'en']))(
  '%s uses only Origin/Difficulty, native category folders and the Options language',
  (language) => {
    const { model } = setup(language);
    expect(model.selected).toEqual([`general-${language}-01`]);
    expect(model.accepted?.id).toBe(`general-${language}-01`);
    expect(
      [...document.querySelectorAll('select')].map((node) => node.id),
    ).toEqual(['catalog-origin', 'catalog-difficulty']);
    const localized = model.packs.filter((pack) => pack.language === language);
    expect(document.querySelectorAll('input[id^="source-"]')).toHaveLength(
      localized.length,
    );
    expect(document.querySelectorAll('details')).toHaveLength(
      new Set(localized.map((pack) => pack.questions[0].category)).size,
    );
    expect(document.getElementById('catalog-status')?.textContent).toContain(
      `${localized.length} / ${localized.length}`,
    );
    for (const [category, label] of Object.entries(
      preparationStrings[language].categories,
    )) {
      if (category === 'entertainment') continue;
      expect(
        document.querySelector(`#decks-${category} summary`)?.textContent,
      ).toContain(label);
    }
    model.configure({
      ...defaultSetup(language === 'cs' ? 'en' : 'cs'),
      mode: 'numbers',
    });
    expect(model.accepted).toBeNull();
    model.generate('Numbers');
    expect(
      model.proposal?.questions.every((q) => q.language === model.language),
    ).toBe(true);
  },
);

test.each(bundledPacks())(
  '$id answer sheet keeps all 28 localized rows and excludes live controls',
  (pack) => {
    const sheet = answerSheet(pack, pack.language);
    const document = new DOMParser().parseFromString(sheet, 'text/html');
    expect(document.querySelectorAll('tbody tr')).toHaveLength(28);
    expect(document.documentElement.lang).toBe(pack.language);
    expect(document.querySelector('style')?.textContent).toContain(
      '@media print',
    );
    expect(document.querySelectorAll('link,script,button')).toHaveLength(0);
  },
);

test.each(/** @type {const} */ (['cs', 'en']))(
  '%s filters project without invalidating acceptance; folder selection changes matching decks only',
  (language) => {
    const { model } = setup(language);
    const accepted = model.accepted;
    const revision = model.revision;
    expect(box('folder-general').indeterminate).toBe(true);
    const second = model.packs.find(
      (pack) => pack.id === `general-${language}-02`,
    );
    if (!second || Array.isArray(second.difficulty))
      throw new Error('Missing fixed deck');
    filter('difficulty', second.difficulty);
    expect(model.accepted).toBe(accepted);
    expect(model.revision).toBe(revision);
    expect(box('folder-general').indeterminate).toBe(false);
    check('folder-general', true);
    expect(model.selected.sort()).toEqual(
      [
        `general-${language}-01`,
        ...model.packs
          .filter(
            (pack) =>
              pack.language === language &&
              pack.questions[0].category === 'general' &&
              pack.difficulty === second.difficulty,
          )
          .map((pack) => pack.id),
      ].sort(),
    );
    expect(model.accepted).toBeNull();
    expect(document.activeElement?.id).toBe('folder-general');
    check('folder-general', false);
    expect(model.selected).toEqual([`general-${language}-01`]);
    document.getElementById('reset-catalog')?.click();
    expect(box('folder-general').indeterminate).toBe(true);
    expect(document.querySelectorAll('input[id^="source-"]')).toHaveLength(
      model.packs.filter((pack) => pack.language === language).length,
    );
    check(`source-general-${language}-02`, true);
    expect(box('folder-general').checked).toBe(false);
    expect(box('folder-general').indeterminate).toBe(true);
    expect(() => model.useFixed()).toThrow('selectFixed');
    check(`source-general-${language}-02`, false);
    model.useFixed();
    model.accept();
    expect(model.accepted?.id).toBe(`general-${language}-01`);
  },
);

test('custom sources have one separate folder, even with multiple hostile category strings', () => {
  const { model, render } = setup();
  const pack = bundledPacks()[1];
  pack.id = 'private';
  pack.title = '<img src=x onerror=alert(1)> Žluťoučký';
  pack.questions[0].category = 'Private <b>category</b>';
  model.add([pack]);
  render();
  filter('origin', 'custom');
  expect(document.querySelectorAll('details')).toHaveLength(1);
  expect(document.getElementById('decks-custom')?.textContent).toContain(
    'Private <b>category</b>',
  );
  expect(document.querySelectorAll('img,b')).toHaveLength(0);
  check('folder-custom', true);
  expect(model.selected).toContain('private');
  expect(document.getElementById('catalog-selection')?.textContent).toContain(
    'general-en-01',
  );
  filter('difficulty', 'easy');
  expect(document.getElementById('catalog-results')?.textContent).toBe(
    preparationStrings.en.noMatches,
  );
  expect(model.selected).toContain('private');
  document.getElementById('clear-sources')?.click();
  expect(model.selected).toEqual([]);
});

test('folder expansion survives filter refresh and selection rerenders', () => {
  const { model } = setup();
  const details = document.getElementById('decks-general');
  if (!(details instanceof HTMLDetailsElement)) throw new Error('No folder');
  expect(details.open).toBe(false);
  details.open = true;
  details.dispatchEvent(new Event('toggle'));
  expect(model.expandedFolders.has('general')).toBe(true);
  filter('origin', 'bundled');
  expect(document.getElementById('decks-general')).toHaveProperty('open', true);
  check('folder-general', true);
  expect(document.getElementById('decks-general')).toHaveProperty('open', true);
  const current = document.getElementById('decks-general');
  if (!(current instanceof HTMLDetailsElement)) throw new Error('No folder');
  current.open = false;
  current.dispatchEvent(new Event('toggle'));
  expect(model.expandedFolders.has('general')).toBe(false);
  details.dispatchEvent(new Event('toggle'));
  expect(model.expandedFolders.has('general')).toBe(false);
});

test.each(/** @type {const} */ (['cs', 'en']))(
  '%s folders start collapsed with one compact heading and safe difficulty symbols',
  (language) => {
    const { model } = setup(language);
    const general = model.packs.filter(
      (pack) =>
        pack.language === language && pack.questions[0].category === 'general',
    );
    expect(document.querySelectorAll('details[open]')).toHaveLength(0);
    const folder = document.getElementById('decks-general');
    const t = preparationStrings[language];
    expect(folder?.querySelector('summary')?.textContent).toBe(
      `${t.categories.general}1 / ${general.length}`,
    );
    expect(
      folder?.parentElement?.querySelector('.folder-selection')?.textContent,
    ).toBe('');
    expect(box('folder-general').getAttribute('aria-label')).toBe(
      t.categories.general,
    );
    expect(folder?.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1);
    expect(
      [...document.querySelectorAll('#decks-general .difficulty-symbols')].map(
        (node) => node.textContent,
      ),
    ).toEqual(
      DIFFICULTIES.flatMap((level) =>
        general
          .filter((pack) => pack.difficulty === level)
          .map(() => ({ easy: '●', medium: '◆', hard: '▲' })[level]),
      ),
    );
    const first = folder?.querySelector(
      '.deck-description strong',
    )?.textContent;
    filter('difficulty', 'easy');
    expect(
      document.querySelector('#decks-general .deck-description strong')
        ?.textContent,
    ).toBe(first);
  },
);

test('new imported folder stays collapsed and keeps custom title and mixed-level badges', () => {
  const { model, render } = setup();
  const custom = bundledPacks()[1];
  custom.id = 'custom-mixed';
  custom.title = '<b>Original title</b>';
  custom.mode = 'numbers';
  custom.difficulty = ['easy', 'hard'];
  custom.questions.forEach((question, index) => {
    question.difficulty = index % 2 ? 'easy' : 'hard';
  });
  model.add([custom]);
  render();
  const folder = document.getElementById('decks-custom');
  expect(folder).toHaveProperty('open', false);
  expect(folder?.querySelector('strong')?.textContent).toBe(custom.title);
  expect(folder?.querySelector('.difficulty-symbols')?.textContent).toBe('●▲');
  expect(folder?.querySelector('.deck-meta')?.textContent).toContain(
    'Easy / Hard',
  );
  expect(folder?.querySelector('b')).toBeNull();
});

test('aborted folder, deck, filter and expansion listeners cannot mutate preparation', () => {
  const { model, lifecycle } = setup();
  lifecycle.abort();
  filter('difficulty', 'hard');
  check('source-nature-en-01', true);
  check('folder-general', true);
  expect(model.filters.difficulty).toBe('');
  expect(model.selected).toEqual(['general-en-01']);
});

test('selection rejects foreign, duplicate and unknown IDs without invalidating a valid board', () => {
  const { model } = setup();
  const accepted = model.accepted;
  for (const ids of [
    ['general-cs-01'],
    ['missing'],
    ['general-en-01', 'general-en-01'],
  ])
    expect(() => model.select(ids)).toThrow('mixedSources');
  expect(model.accepted).toBe(accepted);
});

test('filtering is a pure language-scoped projection, including multi-level number boards', () => {
  const packs = bundledPacks();
  const ids = new Set(packs.map((pack) => pack.id));
  const before = structuredClone(packs);
  expect(filterPacks(packs, ids, { origin: '', difficulty: '' }, '')).toEqual(
    [],
  );
  expect(
    filterPacks(packs, ids, { origin: 'custom', difficulty: '' }, 'en'),
  ).toEqual([]);
  expect(
    filterPacks(
      packs,
      ids,
      { origin: 'bundled', difficulty: 'easy' },
      'cs',
    ).map((pack) => pack.id),
  ).toEqual(
    packs
      .filter((pack) => pack.language === 'cs' && pack.difficulty === 'easy')
      .map((pack) => pack.id),
  );
  const mixed = structuredClone(packs[1]);
  mixed.id = 'mixed';
  mixed.difficulty = ['easy', 'hard'];
  expect(
    filterPacks([mixed], ids, { origin: '', difficulty: 'hard' }, 'en'),
  ).toEqual([mixed]);
  expect(packs).toEqual(before);
});

test.each(['constructor', 'toString', '__proto__'])(
  'custom category %s remains authored inert text',
  (category) => {
    const { model, render } = setup();
    const pack = bundledPacks()[1];
    pack.id = 'private';
    pack.questions[0].category = category;
    model.add([pack]);
    render();
    filter('origin', 'custom');
    expect(
      document.getElementById('source-private')?.closest('label')?.textContent,
    ).toContain(` · ${category}, General knowledge · `);
  },
);
