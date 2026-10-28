import { expect, test } from 'vitest';
import {
  ALPHABETS,
  acceptsAnswer,
  normalizeAnswer,
} from '../src/domain/answers.js';
import { importPack, validatePack } from '../src/domain/packs.js';
import { boardPack, sourcePack } from './fixtures.js';

test('normalization handles case, Unicode diacritics and repeated whitespace without fuzzy punctuation', () => {
  expect(normalizeAnswer('  ŽLUŤOUČKÝ \t KŮŇ\n')).toBe('zlutoucky kun');
  expect(normalizeAnswer('Z\u030clut\u030couc\u030cky\u0301')).toBe(
    'zlutoucky',
  );
  expect(normalizeAnswer('a-b')).not.toBe(normalizeAnswer('a b'));
  expect(normalizeAnswer('answer!')).not.toBe(normalizeAnswer('answer'));
});

test('canonical answer and explicit aliases match, but typos and empty guesses do not', () => {
  const question = sourcePack().questions[0];
  expect(acceptsAnswer(question, ' ALPHA ')).toBe(true);
  expect(acceptsAnswer(question, 'a')).toBe(true);
  expect(acceptsAnswer(question, 'alfa')).toBe(false);
  expect(acceptsAnswer(question, '')).toBe(false);
});

test('the authoritative alphabets preserve Czech diacritics and explicit digraphs', () => {
  expect(ALPHABETS.cs.join(' ')).toBe(
    'A B C Č D E F G H Ch I J K L M N O P R Ř S Š T U V W Z Ž',
  );
  expect(ALPHABETS.en.join(' ')).toBe(
    'A B C CH D E F G H I J K L M N O P Q R S SH T U V W X Y Z',
  );
  for (const language of /** @type {const} */ (['cs', 'en'])) {
    expect(validatePack(boardPack('letters', language)).questions).toHaveLength(
      28,
    );
  }
});

test('pack JSON round trip preserves ordered placement, identity, authors, aliases and rights', () => {
  const pack = boardPack('letters', 'cs');
  pack.license = 'Private author permission; not CC BY';
  expect(importPack(JSON.stringify(pack))).toEqual(pack);
  const parsed = validatePack(pack);
  parsed.questions[0].aliases.push('changed');
  expect(pack.questions[0].aliases).not.toContain('changed');
});

test.each([
  [null, 'invalidObject'],
  [{ schemaVersion: 2 }, 'packVersion'],
  [{ ...sourcePack(), questions: [] }, 'emptyPack'],
  [{ ...sourcePack(), authors: [] }, 'missingProvenance'],
  [{ ...sourcePack(), mode: 'numbers' }, 'boardCount'],
  [{ ...sourcePack(), language: 'de' }, 'invalidChoice'],
])('rejects invalid pack boundary %#', (value, code) => {
  expect(() => validatePack(value)).toThrow(code);
});

test('rejects duplicate IDs, mixed language and wrong fixed placement', () => {
  const duplicate = boardPack();
  duplicate.questions[1].id = duplicate.questions[0].id;
  expect(() => validatePack(duplicate)).toThrow('duplicateQuestion');
  const mixed = sourcePack();
  mixed.questions[0].language = 'cs';
  expect(() => validatePack(mixed)).toThrow('mixedLanguage');
  const misplaced = boardPack('letters');
  [misplaced.questions[0], misplaced.questions[1]] = [
    misplaced.questions[1],
    misplaced.questions[0],
  ];
  expect(() => validatePack(misplaced)).toThrow('letterPlacement');
});

test('canonical prefixes preserve diacritics; explicitly assigned digraphs are not inferred', () => {
  const pack = sourcePack('cs');
  pack.questions[0].initial = 'Č';
  pack.questions[0].answer = 'Čáp';
  expect(validatePack(pack).questions[0].initial).toBe('Č');
  pack.questions[0].answer = 'Cap';
  expect(() => validatePack(pack)).toThrow('answerInitial');
  pack.questions[0].initial = 'Ch';
  pack.questions[0].answer = 'Chata';
  expect(validatePack(pack).questions[0].initial).toBe('Ch');
});

test('malformed JSON and missing question fields fail without altering the source', () => {
  expect(() => importPack('{')).toThrow('invalidJson');
  const pack = sourcePack();
  const snapshot = JSON.stringify(pack);
  expect(() => validatePack({ ...pack, questions: [{ id: 'x' }] })).toThrow();
  expect(JSON.stringify(pack)).toBe(snapshot);
});
