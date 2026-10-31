import { filterPacks } from '../content/catalog.js';
import { button, element, field, select } from './dom.js';
import { catalogFolders } from './catalog-folders.js';
import { DIFFICULTIES } from '../domain/difficulty.js';

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
    const visible = filterPacks(
      model.packs,
      bundledIds,
      model.filters,
      model.language,
    );
    results.replaceChildren(
      ...catalogFolders(t, model, visible, bundledIds, run, signal),
    );
    const total = model.packs.filter(
      (pack) => pack.language === model.language,
    ).length;
    status.textContent = `${t.matching}: ${visible.length} / ${total}`;
    if (!visible.length) results.append(element('p', t.noMatches));
  };
  sources.append(status, results);
  section.append(
    filterControls(t, model, refresh, signal),
    selection(t, model, run, signal),
    sources,
  );
  refresh();
  return section;
}

/** @param {Texts} t @param {Preparation} model
 * @param {(action: () => void) => void} run @param {AbortSignal} signal */
function selection(t, model, run, signal) {
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
  return selected;
}

/** @param {Texts} t @param {Preparation} model
 * @param {() => void} refresh @param {AbortSignal} signal */
function filterControls(t, model, refresh, signal) {
  const controls = element('div', '', { class: 'catalog-filters' });
  const fields = [
    {
      key: 'origin',
      label: t.origin,
      options: [
        ['', t.allOrigins],
        ['bundled', t.bundled],
        ['custom', t.custom],
      ],
    },
    {
      key: 'difficulty',
      label: t.difficulty,
      options: [
        ['', t.allDifficulties],
        ...DIFFICULTIES.map((level) => [level, t.difficulties[level]]),
      ],
    },
  ].map(({ key, label, options }) => {
    const control = select(
      `catalog-${key}`,
      options,
      model.filters[/** @type {'origin'|'difficulty'} */ (key)],
    );
    control.addEventListener(
      'input',
      () => {
        Object.assign(model.filters, { [key]: control.value });
        refresh();
      },
      { signal },
    );
    controls.append(field(label, control));
    return { key, control };
  });
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
