import { element, input } from './dom.js';

/** @typedef {import('./preparation-strings.js').PreparationTexts} Texts */
/** @typedef {import('../runtime/preparation.js').Preparation} Preparation */
/** @typedef {import('../domain/types.js').Pack} Pack */

/** @param {Texts} t @param {Preparation} model @param {Pack[]} visible
 * @param {Set<string>} bundledIds @param {(action: () => void) => void} run
 * @param {AbortSignal} signal */
export function catalogFolders(t, model, visible, bundledIds, run, signal) {
  /** @type {Map<string, Pack[]>} */
  const groups = new Map();
  for (const pack of visible) {
    const key = bundledIds.has(pack.id) ? pack.questions[0].category : 'custom';
    const group = groups.get(key) ?? [];
    group.push(pack);
    groups.set(key, group);
  }
  return [...groups].map(([key, packs]) =>
    folder(t, model, key, packs, run, signal),
  );
}

/** @param {Texts} t @param {Preparation} model @param {string} key
 * @param {Pack[]} packs @param {(action: () => void) => void} run
 * @param {AbortSignal} signal */
function folder(t, model, key, packs, run, signal) {
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
  label.append(
    box,
    element('span', `${t.selectFolder}: ${name} · ${count} / ${packs.length}`),
  );
  const details = document.createElement('details');
  details.id = `decks-${key}`;
  details.open = !model.collapsedFolders.has(key);
  details.addEventListener(
    'toggle',
    () => {
      if (!details.isConnected) return;
      if (details.open) model.collapsedFolders.delete(key);
      else model.collapsedFolders.add(key);
    },
    { signal },
  );
  details.append(
    element('summary', `${name} · ${t.matching}: ${packs.length}`),
  );
  for (const pack of packs)
    details.append(sourceRow(t, model, pack, run, signal));
  section.append(label, details);
  return section;
}

/** @param {Texts} t @param {Preparation} model @param {Pack} pack
 * @param {(action: () => void) => void} run @param {AbortSignal} signal */
function sourceRow(t, model, pack, run, signal) {
  const box = selectionBox(
    `source-${pack.id}`,
    pack.title,
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
    element('strong', pack.title),
    element(
      'span',
      ` · ${[pack.difficulty]
        .flat()
        .map((level) => t.difficulties[level])
        .join(' / ')} · ${categories} · ${pack.questions.length}`,
      { class: 'deck-meta' },
    ),
  );
  const label = element('label');
  label.append(box, description);
  return label;
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
