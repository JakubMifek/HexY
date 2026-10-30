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
    );
    const actions = element('div', '', { class: 'actions' });
    actions.append(
      button(
        t.export,
        `library-export-${pack.id}`,
        () => download(pack),
        signal,
      ),
    );
    if (memoryOnly)
      actions.append(
        button(
          t.include,
          `library-include-${pack.id}`,
          () => include(pack.id, true),
          signal,
        ),
      );
    else actions.append(removalControl(t, pack, include, signal));
    row.append(actions);
    section.append(row);
  }
  return section;
}

/** @param {Texts} t @param {Pack} pack
 * @param {(id: string, included: boolean) => void} include
 * @param {AbortSignal} signal */
function removalControl(t, pack, include, signal) {
  const { id } = pack;
  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-labelledby', `library-delete-title-${id}`);
  const control = button(
    t.delete,
    `library-delete-${id}`,
    () => {
      control.after(dialog);
      dialog.showModal();
    },
    signal,
  );
  const close = () => {
    if (!dialog.isConnected) return;
    dialog.close();
    dialog.remove();
    control.focus();
  };
  dialog.addEventListener(
    'cancel',
    (event) => {
      event.preventDefault();
      close();
    },
    { signal },
  );
  signal.addEventListener('abort', close, { once: true });
  const actions = element('div', '', { class: 'actions' });
  actions.append(
    button(t.cancelDelete, `library-cancel-delete-${id}`, close, signal),
    button(
      t.delete,
      `library-confirm-delete-${id}`,
      () => {
        if (!dialog.open) return;
        close();
        include(id, false);
      },
      signal,
    ),
  );
  dialog.append(
    element('h2', t.deleteTitle, { id: `library-delete-title-${id}` }),
    element('p', pack.title),
    element('p', t.deleteWarning),
    actions,
  );
  return control;
}
