import { filterPacks } from '../content/catalog.js';
import { button, element, field, input, select } from './dom.js';

/** @typedef {import('./preparation-strings.js').PreparationTexts} Texts */
/** @typedef {import('../runtime/preparation.js').Preparation} Preparation */

/** @param {Texts} t @param {Preparation} model
 * @param {(action: () => void) => void} run @param {AbortSignal} signal */
export function catalogView(t, model, run, signal) {
  const section = element('div', '', { class: 'catalog' });
  const sources = element('fieldset', '', { class: 'pack-sources' });
  sources.append(element('legend', t.sources), element('p', t.selectionHelp));
  const results = element('div', '', { id: 'catalog-results' });
  const status = element('p', '', { id: 'catalog-status', role: 'status' });
  const bundledIds = new Set(model.bundled.map((pack) => pack.id));
  const refresh = () => {
    const visible = filterPacks(model.packs, bundledIds, model.filters);
    results.replaceChildren(
      ...visible.map((pack) => sourceRow(t, model, pack, bundledIds)),
    );
    status.textContent = `${t.matching}: ${visible.length} / ${model.packs.length}`;
    if (!visible.length) results.append(element('p', t.noMatches));
  };
  const controls = filterControls(t, model, refresh, signal);
  sources.append(status, results);
  sources.addEventListener(
    'change',
    (event) => {
      const box = event.target;
      if (!(box instanceof HTMLInputElement)) return;
      run(() => {
        const ids = model.selected.filter((id) => id !== box.value);
        if (box.checked) ids.push(box.value);
        model.select(ids);
      });
    },
    { signal },
  );
  const selected = element('div', '', { id: 'catalog-selection' });
  selected.append(element('p', `${t.selected}: ${model.selected.length}`));
  const list = element('ul');
  for (const pack of model.selectedPacks())
    list.append(element('li', `${pack.title} · ${pack.language} · ${pack.id}`));
  const clear = button(
    t.clearSelection,
    'clear-sources',
    () => run(() => model.select([])),
    signal,
  );
  clear.disabled = model.selected.length === 0;
  selected.append(list, element('p', t.filtersHelp), clear);
  section.append(controls, selected, sources);
  refresh();
  return section;
}

/** @param {Texts} t @param {Preparation} model
 * @param {() => void} refresh @param {AbortSignal} signal */
function filterControls(t, model, refresh, signal) {
  const controls = element('div', '', { class: 'catalog-filters' });
  const fields = filterFields(t, model);
  for (const { key, label, control } of fields) {
    control.addEventListener(
      'input',
      () => {
        Object.assign(model.filters, { [key]: control.value });
        refresh();
      },
      { signal },
    );
    controls.append(field(label, control));
  }
  controls.append(
    button(
      t.resetFilters,
      'reset-catalog',
      () => {
        for (const { key, control } of fields) {
          Object.assign(model.filters, { [key]: '' });
          control.value = '';
        }
        refresh();
      },
      signal,
    ),
  );
  return controls;
}

/** @param {Texts} t @param {Preparation} model */
function filterFields(t, model) {
  const categories = [
    ...new Set(
      model.packs.flatMap((pack) => pack.questions.map((q) => q.category)),
    ),
  ].sort();
  /** @type {Record<string, string>} */
  const names = t.categories;
  return [
    {
      key: 'search',
      label: t.search,
      control: input('catalog-search', 'search', model.filters.search),
    },
    {
      key: 'language',
      label: t.language,
      control: select(
        'catalog-language',
        [
          ['', t.allLanguages],
          ['cs', t.czech],
          ['en', t.english],
        ],
        model.filters.language,
      ),
    },
    {
      key: 'category',
      label: t.category,
      control: select(
        'catalog-category',
        [
          ['', t.allCategories],
          ...categories.map((key) => [
            key,
            Object.hasOwn(names, key) ? names[key] : key,
          ]),
        ],
        model.filters.category,
      ),
    },
    {
      key: 'origin',
      label: t.origin,
      control: select(
        'catalog-origin',
        [
          ['', t.allOrigins],
          ['bundled', t.bundled],
          ['custom', t.custom],
        ],
        model.filters.origin,
      ),
    },
  ];
}

/** @param {Texts} t @param {Preparation} model
 * @param {import('../domain/types.js').Pack} pack @param {Set<string>} bundledIds */
function sourceRow(t, model, pack, bundledIds) {
  const box = input(`source-${pack.id}`, 'checkbox', pack.id);
  box.checked = model.selected.includes(pack.id);
  const origin = bundledIds.has(pack.id) ? t.bundled : t.custom;
  /** @type {Record<string, string>} */
  const names = t.categories;
  const categories = [
    ...new Set(
      pack.questions.map((q) =>
        Object.hasOwn(names, q.category) ? names[q.category] : q.category,
      ),
    ),
  ].join(', ');
  const label = element('label');
  const description = element('span', '', { class: 'deck-description' });
  description.append(
    element('strong', pack.title),
    element(
      'span',
      ` · ${pack.language} · ${categories} · ${pack.questions.length} · ${origin}`,
      { class: 'deck-meta' },
    ),
  );
  label.append(box, description);
  return label;
}
