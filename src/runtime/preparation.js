import { bundledPacks } from '../content/catalog.js';
import {
  attributedCopy,
  generateNumbers,
  validatePlayable,
} from '../domain/generation.js';
import { requireValue } from '../domain/errors.js';
import { importPack, validatePack } from '../domain/packs.js';

export class Preparation {
  bundled = bundledPacks();
  /** @type {import('../domain/types.js').Pack[]} */
  custom = [];
  /** @type {import('../domain/types.js').Pack | null} */
  proposal = null;
  /** @type {import('../domain/types.js').Pack | null} */
  accepted = null;
  /** @type {import('../domain/types.js').Pack | null} */
  editing = null;
  position = 0;
  locked = false;
  revision = 0;
  /** @type {string[]} */
  selected = [];
  /** @type {string} */
  language = '';
  mode = '';
  filters = { search: '', category: '', language: '', origin: '' };

  /** @param {() => number} random @param {() => string} id */
  constructor(random, id) {
    this.random = random;
    this.id = id;
  }

  get packs() {
    return [...this.bundled, ...this.custom];
  }

  /** @param {import('../ui/setup.js').Setup} setup */
  configure(setup) {
    if (this.language === setup.language && this.mode === setup.mode)
      return false;
    this.assertEditable();
    this.language = setup.language;
    this.filters.language = setup.language;
    this.mode = setup.mode;
    this.selected = this.bundled
      .filter((pack) => pack.language === setup.language)
      .slice(0, 1)
      .map((pack) => pack.id);
    this.invalidate();
    this.proposal = null;
    this.editing = null;
    if (setup.mode === 'letters') {
      this.useFixed();
      this.accept();
    }
    return true;
  }

  assertEditable() {
    requireValue(!this.locked, 'contentLocked');
  }

  invalidate() {
    this.assertEditable();
    this.accepted = null;
    this.revision += 1;
  }

  /** @param {string[]} ids */
  select(ids) {
    this.invalidate();
    this.selected = ids;
    this.proposal = null;
    this.editing = null;
  }

  selectedPacks() {
    return this.packs.filter((pack) => this.selected.includes(pack.id));
  }

  useFixed() {
    this.assertEditable();
    const packs = this.selectedPacks();
    requireValue(
      packs.length === 1 && packs[0].mode === 'letters',
      'selectFixed',
    );
    requireValue(packs[0].language === this.language, 'mixedSources');
    this.proposal = validatePlayable(packs[0]);
    this.editing = null;
    this.invalidate();
  }

  useNumbers() {
    this.assertEditable();
    const packs = this.selectedPacks();
    requireValue(
      packs.length === 1 && packs[0].mode === 'numbers',
      'selectNumbers',
    );
    requireValue(
      packs[0].language === this.language && this.mode === 'numbers',
      'preparationMismatch',
    );
    this.proposal = validatePlayable(packs[0]);
    this.editing = null;
    this.invalidate();
  }

  /** @param {string} title */
  generate(title) {
    this.assertEditable();
    requireValue(this.mode === 'numbers', 'invalidChoice');
    const proposal = generateNumbers(
      this.selectedPacks(),
      this.language === 'cs' ? 'cs' : 'en',
      this.random,
      this.id(),
      title,
    );
    this.proposal = proposal;
    this.editing = null;
    this.invalidate();
  }

  /** @param {import('../domain/types.js').Pack} pack @param {string} title */
  edit(pack, title) {
    this.assertEditable();
    this.editing = attributedCopy(pack);
    this.editing.id = this.id();
    this.editing.title = `${pack.title} · ${title}`;
    this.position = 0;
    this.invalidate();
  }

  /** @param {number} direction */
  move(direction) {
    this.assertEditable();
    const pack = this.editing;
    requireValue(pack && pack.mode !== 'letters', 'letterPlacement');
    const next = this.position + direction;
    requireValue(next >= 0 && next < pack.questions.length, 'invalidCell');
    [pack.questions[this.position], pack.questions[next]] = [
      pack.questions[next],
      pack.questions[this.position],
    ];
    this.position = next;
    this.invalidate();
  }

  saveEditor() {
    this.assertEditable();
    const pack = validatePack(this.editing);
    this.add([pack]);
    this.proposal = pack;
    this.editing = null;
    this.invalidate();
  }

  cancelEditor() {
    this.assertEditable();
    this.editing = null;
    this.invalidate();
  }

  /** @param {import('../domain/types.js').Pack[]} incoming */
  add(incoming) {
    this.assertEditable();
    const packs = [...this.packs];
    const additions = [];
    for (const value of incoming) {
      const pack = validatePack(value);
      const existing = packs.find((item) => item.id === pack.id);
      requireValue(
        !existing || JSON.stringify(existing) === JSON.stringify(pack),
        'packIdConflict',
      );
      if (existing) continue;
      additions.push(pack);
      packs.push(pack);
    }
    if (additions.length) this.custom = [...this.custom, ...additions];
  }

  /** @param {string[]} jsons @param {number} revision */
  import(jsons, revision) {
    if (this.locked || revision !== this.revision) return false;
    this.add(jsons.map(importPack));
    return true;
  }

  accept() {
    this.assertEditable();
    requireValue(!this.editing && this.proposal, 'acceptPreparation');
    const pack = validatePlayable(this.proposal);
    requireValue(
      pack.mode === this.mode && pack.language === this.language,
      'preparationMismatch',
    );
    this.add([pack]);
    this.accepted = pack;
  }

  packForStart() {
    this.assertEditable();
    requireValue(this.accepted, 'acceptPreparation');
    return validatePlayable(this.accepted);
  }

  lock() {
    this.locked = true;
    this.editing = null;
    this.revision += 1;
  }

  unlock() {
    this.locked = false;
    this.revision += 1;
  }
}
