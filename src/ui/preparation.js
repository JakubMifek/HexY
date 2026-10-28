import { button, element, field, input } from './dom.js';
import { catalogView } from './catalog.js';

/** @typedef {import('./preparation-strings.js').PreparationTexts} Texts */

/** @param {Texts} t @param {import('../runtime/preparation.js').Preparation} model
 * @param {(action: () => void) => void} run
 * @param {(files: File[]) => void} importFiles
 * @param {(pack: import('../domain/types.js').Pack, sheet?: boolean) => void} download
 * @param {AbortSignal} signal */
export function preparationView(t, model, run, importFiles, download, signal) {
  const panel = element('section', '', {
    class: 'preparation panel',
    'aria-labelledby': 'preparation-heading',
  });
  panel.append(
    element('h2', t.preparation, { id: 'preparation-heading' }),
    element('p', t.privacy),
  );
  panel.append(
    catalogView(t, model, run, signal),
    sourceActions(t, model, run, download, signal),
  );
  const files = input('import-packs', 'file', '');
  files.multiple = true;
  files.accept = '.json,application/json';
  files.addEventListener(
    'change',
    () => {
      importFiles(Array.from(files.files ?? []));
    },
    { signal },
  );
  const importLabel = field(t.import, files);
  importLabel.className = 'file-import';
  panel.append(importLabel, element('p', t.importHelp));
  if (model.proposal)
    panel.append(proposalView(t, model, run, download, signal));
  return panel;
}

/** @param {Texts} t @param {import('../runtime/preparation.js').Preparation} model
 * @param {(action: () => void) => void} run
 * @param {(pack: import('../domain/types.js').Pack) => void} download
 * @param {AbortSignal} signal */
function sourceActions(t, model, run, download, signal) {
  const actions = element('div', '', { class: 'actions' });
  actions.append(
    button(
      model.mode === 'letters' ? t.useFixed : t.generate,
      'prepare-board',
      () =>
        run(() =>
          model.mode === 'letters'
            ? model.useFixed()
            : model.generate(t.generated),
        ),
      signal,
    ),
  );
  if (model.mode === 'numbers')
    actions.append(
      button(
        t.useNumbers,
        'use-numbers',
        () => run(() => model.useNumbers()),
        signal,
      ),
    );
  const edit = button(
    t.inspect,
    'edit-source',
    () =>
      run(() => {
        model.edit(model.selectedPacks()[0], t.copy);
      }),
    signal,
  );
  edit.disabled = model.selectedPacks().length !== 1;
  const exportPacks = button(
    t.exportSource,
    'export-sources',
    () => {
      for (const pack of model.selectedPacks()) download(pack);
    },
    signal,
  );
  exportPacks.disabled = model.selected.length === 0;
  actions.append(edit, exportPacks);
  return actions;
}

/** @param {Texts} t @param {import('../runtime/preparation.js').Preparation} model
 * @param {(action: () => void) => void} run
 * @param {(pack: import('../domain/types.js').Pack, sheet?: boolean) => void} download
 * @param {AbortSignal} signal */
function proposalView(t, model, run, download, signal) {
  const pack = model.proposal;
  if (!pack) throw new Error('Proposal required');
  const section = element('section', '', { class: 'proposal' });
  section.append(
    element('h3', `${t.proposal}: ${pack.title}`),
    element('p', model.accepted ? t.accepted : t.unaccepted, {
      id: 'acceptance',
      role: 'status',
    }),
    element('p', `${t.boardId}: ${pack.id}`),
  );
  const actions = element('div', '', { class: 'actions' });
  const accept = button(
    t.accept,
    'accept-board',
    () => run(() => model.accept()),
    signal,
  );
  accept.disabled = !!model.editing;
  actions.append(
    accept,
    button(
      t.edit,
      'edit-proposal',
      () => run(() => model.edit(pack, t.copy)),
      signal,
    ),
  );
  if (model.accepted)
    actions.append(downloadControls(t, model.accepted, download, signal));
  else
    actions.append(
      button(t.export, 'export-pack', () => download(pack), signal),
    );
  const details = document.createElement('details');
  details.append(
    element('summary', `${t.proposal} · ${pack.questions.length}`),
  );
  const list = element('ol');
  for (const question of pack.questions)
    list.append(
      element('li', `${question.initial} · ${question.id} · ${question.text}`),
    );
  details.append(list);
  section.append(actions, details);
  return section;
}

/** @param {Texts} t @param {import('../domain/types.js').Pack} pack
 * @param {(pack: import('../domain/types.js').Pack, sheet?: boolean) => void} download
 * @param {AbortSignal} signal */
export function downloadControls(t, pack, download, signal) {
  const controls = element('div', '', { class: 'actions downloads' });
  controls.append(
    button(t.export, 'export-pack', () => download(pack), signal),
    button(t.sheet, 'answer-sheet', () => download(pack, true), signal),
  );
  return controls;
}
