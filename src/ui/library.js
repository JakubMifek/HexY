import { button, element } from './dom.js';

/** @typedef {import('./preparation-strings.js').PreparationTexts} Texts
 * @typedef {import('../domain/types.js').Pack} Pack */

/** @param {Texts} t @param {Pack[]} packs @param {Set<string>} excluded
 * @param {(pack: Pack) => void} download
 * @param {(id: string, included: boolean) => void} include
 * @param {AbortSignal} signal */
export function libraryView(t, packs, excluded, download, include, signal) {
  const section = element('section', '', {
    class: 'library-management panel',
    'aria-labelledby': 'library-heading',
  });
  if (!packs.length) return section;
  section.append(
    element('h2', t.storageManagement, { id: 'library-heading' }),
    element('p', t.storageHelp),
  );
  for (const pack of packs) {
    const row = element('article', '', { 'data-pack-id': pack.id });
    const memoryOnly = excluded.has(pack.id);
    row.append(
      element('h3', pack.title),
      element('p', `${t.packId}: ${pack.id}`),
      element('p', memoryOnly ? t.excluded : t.included, { role: 'status' }),
      button(
        t.export,
        `library-export-${pack.id}`,
        () => download(pack),
        signal,
      ),
    );
    if (memoryOnly)
      row.append(
        button(
          t.include,
          `library-include-${pack.id}`,
          () => include(pack.id, true),
          signal,
        ),
      );
    else row.append(exclusionConfirmation(t, pack.id, include, signal));
    section.append(row);
  }
  return section;
}

/** @param {Texts} t @param {string} id
 * @param {(id: string, included: boolean) => void} include
 * @param {AbortSignal} signal */
function exclusionConfirmation(t, id, include, signal) {
  const details = document.createElement('details');
  details.append(element('summary', t.exclude), element('p', t.excludeWarning));
  const actions = element('div', '', { class: 'actions' });
  actions.append(
    button(
      t.confirmExclude,
      `library-exclude-${id}`,
      () => include(id, false),
      signal,
    ),
    button(
      t.keepIncluded,
      `library-keep-${id}`,
      () => {
        details.open = false;
      },
      signal,
    ),
  );
  details.append(actions);
  return details;
}
