import { element, input, svg } from './dom.js';
import { DIFFICULTIES } from '../domain/difficulty.js';
import { sortedDecks } from './catalog-names.js';

/** @typedef {import('./preparation-strings.js').PreparationTexts} Texts */
/** @typedef {import('../runtime/preparation.js').Preparation} Preparation */
/** @typedef {import('../domain/types.js').Pack} Pack */

/** @param {Texts} t @param {Preparation} model @param {Pack[]} visible
 * @param {Map<string, string>} names @param {(action: () => void) => void} run
 * @param {AbortSignal} signal */
export function catalogFolders(t, model, visible, names, run, signal) {
  /** @type {Map<string, Pack[]>} */
  const groups = new Map();
  for (const pack of visible) {
    const key = names.has(pack.id) ? pack.questions[0].category : 'custom';
    const group = groups.get(key) ?? [];
    group.push(pack);
    groups.set(key, group);
  }
  return [...groups].map(([key, packs]) =>
    folder(t, model, key, packs, names, run, signal),
  );
}

/** @param {Texts} t @param {Preparation} model @param {string} key
 * @param {Pack[]} packs @param {Map<string, string>} titles
 * @param {(action: () => void) => void} run
 * @param {AbortSignal} signal */
function folder(t, model, key, packs, titles, run, signal) {
  const names = /** @type {Record<string, string>} */ (t.categories);
  const name = key === 'custom' ? t.customFolder : names[key];
  const section = element('section', '', { class: 'catalog-folder' });
  const count = packs.filter((pack) => model.selected.includes(pack.id)).length;
  const box = selectionBox(
    `folder-${key}`,
    name,
    count === packs.length,
    () => {
      const visibleIds = new Set(packs.map((pack) => pack.id));
      const ids = model.selected.filter((id) => !visibleIds.has(id));
      if (box.checked) ids.push(...visibleIds);
      model.select(ids);
    },
    run,
    signal,
  );
  box.indeterminate = count > 0 && count < packs.length;
  const label = element('label', '', { class: 'folder-selection' });
  label.append(box);
  const details = document.createElement('details');
  details.id = `decks-${key}`;
  details.open = model.expandedFolders.has(key);
  details.addEventListener(
    'toggle',
    () => {
      if (!details.isConnected) return;
      if (details.open) model.expandedFolders.add(key);
      else model.expandedFolders.delete(key);
    },
    { signal },
  );
  const summary = element('summary');
  summary.append(
    folderIcon(),
    element('span', name, { class: 'folder-name' }),
    element('span', `${count} / ${packs.length}`, { class: 'folder-count' }),
  );
  details.append(summary);
  for (const pack of sortedDecks(packs, titles, model.language))
    details.append(sourceRow(t, model, pack, titles.get(pack.id), run, signal));
  section.append(label, details);
  return section;
}

/** @param {Texts} t @param {Preparation} model @param {Pack} pack
 * @param {string | undefined} title
 * @param {(action: () => void) => void} run @param {AbortSignal} signal */
function sourceRow(t, model, pack, title, run, signal) {
  const box = selectionBox(
    `source-${pack.id}`,
    title ?? pack.title,
    model.selected.includes(pack.id),
    () => {
      const ids = model.selected.filter((id) => id !== pack.id);
      if (box.checked) ids.push(pack.id);
      model.select(ids);
    },
    run,
    signal,
  );
  box.value = pack.id;
  const names = /** @type {Record<string, string>} */ (t.categories);
  const categories = [
    ...new Set(
      pack.questions.map((question) =>
        Object.hasOwn(names, question.category)
          ? names[question.category]
          : question.category,
      ),
    ),
  ].join(', ');
  const description = element('span', '', { class: 'deck-description' });
  description.append(
    element('strong', title ?? pack.title),
    element(
      'span',
      title
        ? String(pack.questions.length)
        : `${[pack.difficulty]
            .flat()
            .map((level) => t.difficulties[level])
            .join(' / ')} · ${categories} · ${pack.questions.length}`,
      { class: 'deck-meta' },
    ),
  );
  const badges = element('span', '', {
    class: 'difficulty-symbols',
    'aria-hidden': 'true',
  });
  const symbols = { easy: '●', medium: '◆', hard: '▲' };
  for (const level of DIFFICULTIES.filter((level) =>
    [pack.difficulty].flat().includes(level),
  ))
    badges.append(
      element('span', symbols[level], {
        class: `difficulty-${level}`,
        title: t.difficulties[level],
      }),
    );
  const label = element('label', '', { class: 'deck-row' });
  label.append(box, badges, description);
  return label;
}

function folderIcon() {
  const icon = svg('svg', {
    viewBox: '0 0 24 24',
    class: 'folder-icon',
    'aria-hidden': 'true',
    focusable: 'false',
  });
  icon.append(
    svg('path', {
      d: 'M3 7V5h6l2 2h10v13H3Z',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.8',
      'stroke-linejoin': 'round',
    }),
  );
  icon.append(
    svg('path', {
      d: 'M3 11h20l-4 9H3Z',
      class: 'folder-flap',
      'stroke-width': '1.8',
      'stroke-linejoin': 'round',
    }),
  );
  return icon;
}

/** @param {string} id @param {string} name @param {boolean} checked
 * @param {() => void} change @param {(action: () => void) => void} run
 * @param {AbortSignal} signal */
function selectionBox(id, name, checked, change, run, signal) {
  const box = input(id, 'checkbox', id);
  box.checked = checked;
  box.setAttribute('aria-label', name);
  box.addEventListener(
    'change',
    () => {
      run(change);
      document.getElementById(id)?.focus();
    },
    { signal },
  );
  return box;
}
