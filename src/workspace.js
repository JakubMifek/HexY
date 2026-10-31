import { DomainError } from './domain/errors.js';
import { validatePack } from './domain/packs.js';
import { message } from './messages.js';
import { Preparation } from './runtime/preparation.js';
import { LocalLibrary } from './runtime/library.js';
import { Downloads } from './runtime/downloads.js';
import { defaultSetup } from './ui/setup.js';
import { preparationStrings } from './ui/preparation-strings.js';
import { preparationView } from './ui/preparation.js';
import { editorView } from './ui/editor.js';
import { answerSheet } from './ui/answer-sheet.js';
import { button, element } from './ui/dom.js';
import { libraryView } from './ui/library.js';

export class Workspace {
  /** @type {import('./domain/preferences.js').Preferences} */
  preferences = { language: 'cs', theme: 'light', setup: defaultSetup('cs') };
  storageError = '';
  error = '';
  notice = '';
  saved = false;
  disposed = false;
  importSequence = 0;
  downloads = new Downloads();
  /** @type {Set<string>} */
  excluded = new Set();

  /** @param {() => number} random @param {() => string} id
   * @param {() => void} changed @param {LocalLibrary} [library] */
  constructor(random, id, changed, library = new LocalLibrary()) {
    this.model = new Preparation(random, id);
    this.changed = changed;
    this.library = library;
    this.load();
    this.model.configure(this.preferences.setup);
  }

  load() {
    try {
      const data = this.library.load();
      if (!data) return;
      this.model.add(data.packs);
      this.preferences = data.preferences;
      this.saved = true;
    } catch (error) {
      if (!(error instanceof DomainError)) throw error;
      this.library.writable = false;
      this.storageError = error.code;
    }
  }

  /** @param {import('./domain/preferences.js').Preferences} preferences */
  savePreferences(preferences) {
    this.preferences = preferences;
    this.persist();
  }

  persist() {
    try {
      this.library.save({
        schemaVersion: 1,
        packs: this.model.custom.filter((pack) => !this.excluded.has(pack.id)),
        preferences: this.preferences,
      });
      this.saved = true;
      this.storageError = '';
      return true;
    } catch (error) {
      if (!(error instanceof DomainError)) throw error;
      this.saved = false;
      // Keep the original read failure visible; blocked writes do not repair corrupt data.
      if (error.code !== 'storageBlocked' || !this.storageError)
        this.storageError = error.code;
      return false;
    }
  }

  /** @param {() => void} action */
  run(action) {
    if (this.disposed) return;
    const editing = this.model.editing;
    const proposal = this.model.proposal;
    const custom = this.model.custom;
    try {
      this.model.assertEditable();
      action();
      if (this.model.custom !== custom) this.persist();
      this.error = '';
      this.notice = '';
    } catch (error) {
      if (!(error instanceof DomainError)) throw error;
      this.error = error.code;
      this.errorPath = error.path;
    }
    this.changed();
    this.focusAfterEdit(editing, proposal);
  }

  /** @param {import('./domain/types.js').Pack | null} editing
   * @param {import('./domain/types.js').Pack | null} proposal */
  focusAfterEdit(editing, proposal) {
    if (this.model.editing && this.model.editing !== editing)
      document.getElementById('pack-title')?.focus();
    else if (editing !== this.model.editing || proposal !== this.model.proposal)
      document.getElementById('accept-board')?.focus();
  }

  /** @param {File[]} files */
  async importFiles(files) {
    if (this.disposed || this.model.locked || files.length === 0) return;
    const revision = this.model.revision;
    const sequence = ++this.importSequence;
    try {
      const jsons = await readFiles(files);
      if (!this.importIsCurrent(sequence, revision)) return;
      if (!this.model.import(jsons, revision)) return;
      this.persist();
      this.error = '';
      this.notice = 'imported';
    } catch (error) {
      if (!this.importIsCurrent(sequence, revision)) return;
      if (!(error instanceof DomainError)) throw error;
      this.error = error.code;
      this.errorPath = error.path;
    }
    this.changed();
  }

  /** @param {number} sequence @param {number} revision */
  importIsCurrent(sequence, revision) {
    return (
      !this.disposed &&
      !this.model.locked &&
      sequence === this.importSequence &&
      revision === this.model.revision
    );
  }

  saveEditor() {
    this.run(() => this.model.saveEditor());
  }

  /** @param {string} id @param {boolean} included */
  setIncluded(id, included) {
    if (this.disposed || !this.model.custom.some((pack) => pack.id === id))
      return;
    if (included) this.excluded.delete(id);
    else this.excluded.add(id);
    if (!this.persist()) {
      if (included) this.excluded.add(id);
      else this.excluded.delete(id);
    }
    this.changed();
    document.getElementById(`library-export-${id}`)?.focus();
  }

  /** @param {import('./domain/types.js').Pack} pack @param {boolean} [sheet] */
  download(pack, sheet = false) {
    if (this.disposed) return false;
    let success = false;
    try {
      const content = sheet
        ? answerSheet(pack, pack.language)
        : JSON.stringify(validatePack(pack), null, 2);
      const extension = sheet ? 'html' : 'json';
      this.downloads.save(
        content,
        `hexy-${pack.id.replace(/[^\p{L}\p{N}._-]/gu, '_')}.${extension}`,
        sheet ? 'text/html;charset=utf-8' : 'application/json',
      );
      this.error = '';
      success = true;
    } catch (error) {
      if (!(error instanceof DomainError)) throw error;
      this.error = error.code;
    }
    this.changed();
    return success;
  }

  /** @param {AbortSignal} signal */
  view(signal) {
    const t = preparationStrings[this.preferences.language];
    const section = element('div', '', { class: 'workspace' });
    const download = (
      /** @type {import('./domain/types.js').Pack} */ pack,
      sheet = false,
    ) => this.download(pack, sheet);
    const run = (/** @type {() => void} */ action) => this.run(action);
    section.append(
      preparationView(
        t,
        this.model,
        run,
        (files) => {
          void this.importFiles(files);
        },
        download,
        signal,
      ),
    );
    if (this.model.editing)
      section.append(
        editorView(t, this.model, run, () => this.saveEditor(), signal),
      );
    section.append(this.libraryView(signal), this.statusView());
    return section;
  }

  /** @param {AbortSignal} signal */
  libraryView(signal) {
    const section = libraryView(
      preparationStrings[this.preferences.language],
      this.model.custom,
      this.excluded,
      (pack) => this.download(pack),
      (id, included) => this.setIncluded(id, included),
      signal,
    );
    if (this.storageError && typeof this.library.original === 'string')
      section.append(
        button(
          preparationStrings[this.preferences.language].exportOriginalLibrary,
          'export-library-original',
          () => this.exportOriginalLibrary(),
          signal,
        ),
      );
    return section;
  }

  exportOriginalLibrary() {
    if (this.disposed || typeof this.library.original !== 'string') return;
    try {
      this.downloads.save(
        this.library.original,
        'hexy-original-library.json',
        'application/json',
      );
      this.error = '';
    } catch (error) {
      if (!(error instanceof DomainError)) throw error;
      this.error = error.code;
    }
    this.changed();
  }

  statusView() {
    const language = this.preferences.language;
    const t = preparationStrings[language];
    const status = element('div', '', { class: 'library-status' });
    status.append(
      element('p', this.saved ? t.stored : t.memory, { class: 'muted' }),
    );
    if (this.storageError)
      status.append(
        element('p', message(language, this.storageError), {
          id: 'storage-error',
          role: 'alert',
        }),
      );
    const error = this.error
      ? `${message(language, this.error)} ${this.errorPath ?? ''}`
      : '';
    status.append(
      element('p', error, { id: 'preparation-error', role: 'alert' }),
    );
    if (this.notice === 'imported')
      status.append(element('p', t.imported, { role: 'status' }));
    return status;
  }

  dispose() {
    this.disposed = true;
    this.model.lock();
    this.downloads.dispose();
  }
}

/** @param {File[]} files */
async function readFiles(files) {
  try {
    return await Promise.all(files.map((file) => file.text()));
  } catch {
    throw new DomainError('fileRead');
  }
}
