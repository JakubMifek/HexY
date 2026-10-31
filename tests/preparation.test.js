import { expect, test } from 'vitest';
import {
  attributedCopy,
  generateNumbers,
  validatePlayable,
} from '../src/domain/generation.js';
import { importPack, validatePack } from '../src/domain/packs.js';
import { Preparation } from '../src/runtime/preparation.js';
import { bundledPacks } from '../src/content/catalog.js';
import { defaultSetup } from './fixtures.js';
import { createGame } from '../src/domain/game.js';
import { recoverGame } from '../src/domain/saves.js';
import { act, config } from './fixtures.js';

/** @param {string} id @param {number} count */
export function bank(id, count) {
  const pack = bundledPacks()[1];
  pack.id = id;
  pack.mode = 'source';
  pack.authors = [`Author ${id}`];
  pack.license = `Private rights ${id}`;
  pack.questions = Array.from({ length: count }, (_, index) => ({
    ...pack.questions[index % 28],
    id: `${id}-${index}`,
    text: `Distinct ${id} question ${index}?`,
  }));
  return pack;
}

function model() {
  let id = 0;
  const model = new Preparation(
    () => 0,
    () => `custom-${++id}`,
  );
  model.configure(defaultSetup('en'));
  return model;
}

test('generation uses exactly selected sources, 28 distinct questions, stable IDs and per-question rights', () => {
  const sources = [bank('one', 20), bank('two', 20)];
  const before = structuredClone(sources);
  const result = generateNumbers(sources, 'en', () => 0, 'game', 'Combined');
  expect(result.questions).toHaveLength(28);
  expect(new Set(result.questions.map((q) => q.id)).size).toBe(28);
  expect(new Set(result.questions.map((q) => q.text)).size).toBe(28);
  expect(
    new Set(result.questions.flatMap((q) => q.origins?.map((o) => o.packId))),
  ).toEqual(new Set(['one', 'two']));
  expect(result.authors).toEqual(['Author one', 'Author two']);
  expect(result.license).not.toContain('CC BY');
  for (const question of result.questions) {
    const source = sources.find((pack) =>
      pack.questions.some((q) => q.id === question.id),
    );
    expect(question.origins).toEqual([
      {
        packId: source?.id,
        questionId: question.id,
        authors: source?.authors,
        license: source?.license,
      },
    ]);
  }
  expect(importPack(JSON.stringify(result))).toEqual(result);
  expect(sources).toEqual(before);
});

test('duplicates are deterministic and never fill from unselected content', () => {
  const first = bank('first', 28);
  const second = structuredClone(first);
  second.id = 'duplicate-bank';
  const result = generateNumbers(
    [first, second],
    'en',
    () => 0,
    'out',
    'Title',
  );
  expect(result.questions).toHaveLength(28);
  expect(result.questions.every((q) => q.origins?.[0].packId === 'first')).toBe(
    true,
  );
  second.questions[0].text = 'Different content sharing an ID';
  expect(() =>
    generateNumbers([first, second], 'en', () => 0, 'out', 'Title'),
  ).toThrow(expect.objectContaining({ code: 'conflictingQuestionId' }));
  const duplicates = bank('distinct-ids', 28);
  duplicates.questions.forEach((q, i) => {
    q.text = ` ${first.questions[i].text.toUpperCase()} `;
  });
  expect(
    generateNumbers([first, duplicates], 'en', () => 0, 'out', 'Title')
      .questions,
  ).toHaveLength(28);
  first.questions[1].text = first.questions[0].text;
  expect(() => generateNumbers([first], 'en', () => 0, 'out', 'Title')).toThrow(
    expect.objectContaining({ code: 'insufficientQuestions' }),
  );
});

test('language, selection, random and repeated-board boundaries fail explicitly', () => {
  const en = bundledPacks()[1];
  for (const [packs, code] of [
    [[], 'selectSources'],
    [bundledPacks(), 'mixedSources'],
    [[bank('short', 27)], 'insufficientQuestions'],
  ]) {
    expect(() =>
      generateNumbers(
        /** @type {import('../src/domain/types.js').Pack[]} */ (packs),
        'en',
        () => 0,
        'id',
        'title',
      ),
    ).toThrow(expect.objectContaining({ code }));
  }
  expect(() => generateNumbers([en], 'en', () => 1, 'id', 'title')).toThrow(
    expect.objectContaining({ code: 'randomRange' }),
  );
  en.questions[1].text = en.questions[0].text;
  expect(() => validatePlayable(en)).toThrow(
    expect.objectContaining({ code: 'repeatedQuestion' }),
  );
  expect(() => validatePlayable(bank('bank', 28))).toThrow(
    expect.objectContaining({ code: 'boardCount' }),
  );
});

test('optional v1 origins preserve attribution through copies, edits, and validation', () => {
  const pack = bundledPacks()[0];
  expect(validatePack(pack)).toEqual(pack);
  const copy = attributedCopy(pack);
  expect(attributedCopy(copy)).toEqual(copy);
  copy.questions[0].text = 'Changed original wording';
  expect(importPack(JSON.stringify(copy))).toEqual(copy);
  for (const origins of [
    [],
    [{ packId: 'id', questionId: 'q', authors: [], license: 'Private' }],
  ]) {
    expect(() =>
      validatePack({ ...copy, questions: [{ ...copy.questions[0], origins }] }),
    ).toThrow(expect.objectContaining({ code: 'missingProvenance' }));
  }
});

test('mixing an edited copy retains both original and editor pack-level attribution', () => {
  const original = bundledPacks()[1];
  const edited = attributedCopy(original);
  edited.id = 'editor-version';
  edited.authors = ['Editor'];
  edited.license = 'Custom edits retain their stated rights';
  edited.questions[0].text = 'An edited question';
  const generated = generateNumbers([edited], 'en', () => 0, 'out', 'Game');
  const question = generated.questions.find(
    (q) => q.id === original.questions[0].id,
  );
  expect(question?.origins?.map((origin) => origin.packId)).toEqual([
    original.id,
    edited.id,
  ]);
  expect(question?.origins?.[1]).toMatchObject({
    authors: ['Editor'],
    license: edited.license,
  });
});

test('preparation acceptance, copies, number placement and explicit unchanged reimports', () => {
  const prep = model();
  const fixed = structuredClone(prep.accepted);
  expect(prep.configure(defaultSetup('en'))).toBe(false);
  if (!prep.proposal) throw new Error('No proposal');
  prep.edit(prep.proposal, 'Edited');
  expect(prep.accepted).toBeNull();
  expect(() => prep.accept()).toThrow();
  expect(() => prep.move(1)).toThrow();
  if (!prep.editing) throw new Error('No editor');
  prep.editing.questions[0].aliases.push('Custom alias');
  prep.saveEditor();
  prep.accept();
  expect(prep.accepted?.questions[0].aliases).toContain('Custom alias');
  expect(bundledPacks()[1]).toEqual(fixed);
  prep.configure({ ...defaultSetup('en'), mode: 'numbers' });
  expect(() => prep.packForStart()).toThrow();
  prep.generate('Generated');
  if (!prep.proposal) throw new Error('No proposal');
  prep.edit(prep.proposal, 'Moved');
  const first = prep.editing?.questions[0].id;
  prep.move(1);
  expect(prep.editing?.questions[1].id).toBe(first);
  prep.move(-1);
  expect(() => prep.move(-1)).toThrow();
  prep.saveEditor();
  const saved = prep.proposal;
  prep.select([saved.id]);
  prep.useNumbers();
  prep.accept();
  expect(prep.packForStart()).toEqual(saved);
});

test('transactional imports preserve valid data and reject conflicting pack identities', () => {
  const prep = model();
  const existing = structuredClone(prep.accepted);
  const pack = bank('new', 28);
  expect(() =>
    prep.import([JSON.stringify(pack), '{'], prep.revision),
  ).toThrow();
  expect(prep.custom).toEqual([]);
  expect(prep.accepted).toEqual(existing);
  expect(prep.import([JSON.stringify(pack)], prep.revision)).toBe(true);
  prep.add([pack]);
  expect(prep.custom).toHaveLength(1);
  pack.title = 'Conflicting copy';
  expect(() => prep.add([bank('other', 28), pack])).toThrow(
    expect.objectContaining({ code: 'packIdConflict' }),
  );
  expect(prep.custom).toHaveLength(1);
  expect(prep.import(['{}'], prep.revision - 1)).toBe(false);
});

test('every started-game mutation is locked; host reset and recovery preserve original content', () => {
  const prep = model();
  const pack = prep.packForStart();
  let game = createGame(pack, config(), 1000, 'first');
  prep.lock();
  for (const action of [
    () => prep.generate('Other'),
    () => prep.edit(pack, 'Copy'),
    () => prep.useFixed(),
    () => prep.useNumbers(),
    () => prep.select([]),
    () => prep.move(1),
    () => prep.accept(),
    () => prep.saveEditor(),
    () => prep.cancelEditor(),
    () => prep.add([]),
    () => prep.packForStart(),
    () => prep.configure(defaultSetup('cs')),
  ])
    expect(action).toThrow(expect.objectContaining({ code: 'contentLocked' }));
  expect(prep.import(['{}'], prep.revision)).toBe(false);
  game = act(game, { type: 'set-cell', cell: 1, owner: 'A' });
  game = act(game, { type: 'set-cell', cell: 1, owner: 'unclaimed' });
  expect(game.pack).toEqual(pack);
  expect(recoverGame(JSON.stringify(game), 1000, 'fresh').pack).toEqual(pack);
  prep.unlock();
  prep.select([]);
  expect(prep.selectedPacks()).toEqual([]);
});

test('fixed and number selection guards never shuffle or replace rejected proposals', () => {
  const prep = model();
  const before = prep.proposal;
  expect(() => prep.generate('Wrong mode')).toThrow();
  prep.select([]);
  expect(() => prep.useFixed()).toThrow();
  prep.select(
    prep.bundled
      .filter((pack) => pack.language === 'en')
      .map((pack) => pack.id),
  );
  expect(() => prep.useFixed()).toThrow();
  expect(() => prep.select([prep.bundled[0].id])).toThrow(
    expect.objectContaining({ code: 'mixedSources' }),
  );
  prep.select([prep.bundled[1].id]);
  prep.useFixed();
  expect(prep.proposal).toEqual(before);
  prep.edit(
    /** @type {import('../src/domain/types.js').Pack} */ (before),
    'Copy',
  );
  prep.cancelEditor();
  prep.mode = 'numbers';
  expect(() => prep.accept()).toThrow(
    expect.objectContaining({ code: 'preparationMismatch' }),
  );
  expect(() => prep.useNumbers()).toThrow(
    expect.objectContaining({ code: 'selectNumbers' }),
  );
  const numbers = generateNumbers(
    [prep.bundled[0]],
    'cs',
    () => 0,
    'cs-numbers',
    'Numbers',
  );
  prep.add([numbers]);
  expect(() => prep.select([numbers.id])).toThrow(
    expect.objectContaining({ code: 'mixedSources' }),
  );
  prep.select([prep.bundled[1].id]);
  prep.generate('English numbers');
  if (!prep.proposal) throw new Error('No number board');
  prep.add([prep.proposal]);
  prep.select([prep.proposal.id]);
  prep.mode = 'letters';
  expect(() => prep.useNumbers()).toThrow(
    expect.objectContaining({ code: 'preparationMismatch' }),
  );
});
