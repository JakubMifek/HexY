// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { bundledPacks, filterPacks } from '../src/content/catalog.js';
import { Preparation } from '../src/runtime/preparation.js';
import { defaultSetup } from '../src/ui/setup.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';
import { catalogView } from '../src/ui/catalog.js';

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
  );
  model.configure(defaultSetup(language === 'cs' ? 'cs' : 'en'));
  const signal = new AbortController();
  controllers.push(signal);
  const render = () => {
    document.body.replaceChildren(
      catalogView(
        preparationStrings[language === 'cs' ? 'cs' : 'en'],
        model,
        (action) => {
          action();
          render();
        },
        signal.signal,
      ),
    );
  };
  render();
  return { model, render, signal };
}

/** @param {string} id @param {string} value */
function filter(id, value) {
  const control = document.getElementById(id);
  if (!(
    control instanceof HTMLInputElement || control instanceof HTMLSelectElement
  ))
    throw new Error('Missing filter');
  control.value = value;
  control.dispatchEvent(new Event('input', { bubbles: true }));
}

/** @param {string} id @param {boolean} checked */
function check(id, checked) {
  const box = document.getElementById(`source-${id}`);
  if (!(box instanceof HTMLInputElement)) throw new Error('Missing source');
  box.checked = checked;
  box.dispatchEvent(new Event('change', { bubbles: true }));
}

test('new multi-pack inventory retains one accepted starter on setup changes', () => {
  const { model } = setup();
  expect(model.selected).toEqual(['general-en-01']);
  expect(model.accepted?.id).toBe('general-en-01');
  model.configure({ ...defaultSetup('cs'), mode: 'numbers' });
  expect(model.selected).toEqual(['general-cs-01']);
  expect(model.accepted).toBeNull();
  model.generate('Numbers');
  expect(
    model.proposal?.questions.every((q) => q.id.startsWith('general-cs-01-')),
  ).toBe(true);
});

test.each(/** @type {const} */ (['cs', 'en']))(
  'full phase-six %s catalog localizes all six categories and keeps selection explicit',
  (language) => {
    const { model } = setup(language);
    expect(document.querySelectorAll('#catalog-results input')).toHaveLength(
      24,
    );
    expect(document.getElementById('catalog-status')?.textContent).toContain(
      '24 / 24',
    );
    filter('catalog-language', language);
    expect(document.querySelectorAll('#catalog-results input')).toHaveLength(
      12,
    );
    const categories = [
      'general',
      'nature',
      'geography',
      'history',
      'politics',
      'science',
    ];
    expect(document.querySelectorAll('#catalog-category option')).toHaveLength(
      7,
    );
    for (const category of categories) {
      filter('catalog-category', category);
      expect(document.querySelectorAll('#catalog-results input')).toHaveLength(
        2,
      );
      const label = /** @type {Record<string, string>} */ (
        preparationStrings[language].categories
      )[category];
      expect(
        document.querySelector(`#catalog-category option[value="${category}"]`)
          ?.textContent,
      ).toBe(label);
      expect(document.getElementById('catalog-results')?.textContent).toContain(
        label,
      );
    }
    expect(model.selected).toEqual([`general-${language}-01`]);
    expect(model.accepted?.id).toBe(`general-${language}-01`);
  },
);

test.each(/** @type {const} */ (['cs', 'en']))(
  'catalog %s combines filters without changing accepted content or hidden selection',
  (language) => {
    const { model } = setup(language);
    const accepted = model.accepted;
    const revision = model.revision;
    filter('catalog-language', language);
    filter('catalog-category', 'nature');
    filter('catalog-origin', 'bundled');
    expect(document.querySelectorAll('#catalog-results input')).toHaveLength(2);
    filter('catalog-search', `  NATURE-${language}-02  `);
    expect(document.querySelectorAll('#catalog-results input')).toHaveLength(1);
    expect(model.accepted).toBe(accepted);
    expect(model.revision).toBe(revision);
    expect(document.getElementById('catalog-selection')?.textContent).toContain(
      `general-${language}-01`,
    );
    document.getElementById('clear-sources')?.click();
    expect(model.selected).toEqual([]);
    expect(model.accepted).toBeNull();
    check(`nature-${language}-02`, true);
    expect(model.selected).toEqual([`nature-${language}-02`]);
    model.useFixed();
    model.accept();
    const nature = model.accepted;
    filter('catalog-search', 'does not exist');
    expect(document.getElementById('catalog-status')?.textContent).toContain(
      '0 / 24',
    );
    expect(document.getElementById('catalog-results')?.textContent).toBe(
      preparationStrings[language].noMatches,
    );
    expect(model.accepted).toBe(nature);
    document.getElementById('reset-catalog')?.click();
    expect(document.querySelectorAll('#catalog-results input')).toHaveLength(
      24,
    );
    check(`nature-${language}-02`, false);
    expect(model.selected).toEqual([]);
  },
);

test('custom and mixed-category packs remain discoverable and imported text is inert', () => {
  const { model, render } = setup();
  const pack = bundledPacks()[1];
  pack.id = 'private';
  pack.title = '<img src=x onerror=alert(1)> Žluťoučký';
  pack.questions[0].category = 'Private <b>category</b>';
  model.add([pack]);
  render();
  filter('catalog-origin', 'custom');
  filter('catalog-search', 'ZLUTOUCKY');
  filter('catalog-category', 'Private <b>category</b>');
  expect(document.querySelectorAll('#catalog-results input')).toHaveLength(1);
  expect(document.querySelectorAll('img,b')).toHaveLength(0);
  expect(document.getElementById('catalog-results')?.textContent).toContain(
    'Private <b>category</b>',
  );
  filter('catalog-category', 'general');
  expect(document.querySelectorAll('#catalog-results input')).toHaveLength(1);
  filter('catalog-language', 'cs');
  expect(document.querySelectorAll('#catalog-results input')).toHaveLength(0);
});

test('filter and selection listeners stop on disposal; unrelated change events do not select', () => {
  const { model, signal } = setup();
  document
    .querySelector('.pack-sources')
    ?.dispatchEvent(new Event('change', { bubbles: true }));
  expect(model.selected).toEqual(['general-en-01']);
  signal.abort();
  filter('catalog-search', 'nature');
  check('nature-en-01', true);
  expect(model.filters.search).toBe('');
  expect(model.selected).toEqual(['general-en-01']);
});

test('filtering is a pure projection and never searches hidden answers', () => {
  const packs = bundledPacks();
  const before = structuredClone(packs);
  const ids = new Set(packs.map((pack) => pack.id));
  expect(
    filterPacks(packs, ids, {
      search: 'Aardvark',
      category: '',
      language: '',
      origin: '',
    }),
  ).toEqual([]);
  expect(
    filterPacks(packs, ids, {
      search: 'PRIRODA',
      category: '',
      language: '',
      origin: '',
    }),
  ).toHaveLength(2);
  expect(packs).toEqual(before);
});

test.each(['constructor', 'toString', '__proto__'])(
  'custom category %s is displayed as authored text, not an inherited property',
  (category) => {
    const { model, render } = setup();
    const pack = bundledPacks()[1];
    pack.id = 'private';
    pack.title = 'Private pack';
    pack.questions[0].category = category;
    model.add([pack]);
    render();
    filter('catalog-origin', 'custom');
    filter('catalog-category', category);
    expect(
      document.querySelector(`#catalog-category option[value="${category}"]`)
        ?.textContent,
    ).toBe(category);
    expect(
      document.getElementById('source-private')?.closest('label')?.textContent,
    ).toContain(` · ${category}, General knowledge · `);
  },
);
