import { expect, test } from 'vitest';
import { validatePack, importPack } from '../src/domain/packs.js';
import { generateNumbers } from '../src/domain/generation.js';
import { questionDifficulty } from '../src/domain/difficulty.js';
import { boardPack, config, defaultSetup } from './fixtures.js';
import { bundledPacks, filterPacks } from '../src/content/catalog.js';
import { createGame } from '../src/domain/game.js';
import { portableGame, recoverPortable } from '../src/domain/portable.js';
import { answerSheet } from '../src/ui/answer-sheet.js';
import { message } from '../src/messages.js';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test.each([
  undefined,
  null,
  '',
  'Easy',
  'unrated',
  'expert',
  [],
  ['easy'],
  ['easy', 'easy'],
  ['hard', 'easy'],
  ['easy', 'medium', 'hard', 'easy'],
])(
  'missing or malformed difficulty %j fails with actionable localized guidance',
  (difficulty) => {
    const pack = boardPack();
    expect(() => importPack(JSON.stringify({ ...pack, difficulty }))).toThrow(
      'packDifficulty',
    );
    for (const language of /** @type {const} */ (['cs', 'en']))
      expect(message(language, 'packDifficulty')).toContain('easy');
  },
);

test('only number boards may have multiple levels and each question must match their exact union', () => {
  const pack = boardPack();
  pack.difficulty = ['easy', 'hard'];
  expect(() => validatePack(pack)).toThrow('packDifficulty');
  pack.questions.forEach((question, index) => {
    question.difficulty = index % 2 ? 'easy' : 'hard';
  });
  expect(validatePack(pack)).toEqual(pack);
  expect(() => validatePack({ ...pack, mode: 'letters' })).toThrow(
    'packDifficulty',
  );
  expect(() => validatePack({ ...pack, mode: 'source' })).toThrow(
    'packDifficulty',
  );
  pack.questions[0].difficulty = 'medium';
  expect(() => validatePack(pack)).toThrow('packDifficulty');
  pack.questions.forEach((question) => {
    question.difficulty = 'easy';
  });
  expect(() => validatePack(pack)).toThrow('packDifficulty');
  expect(() =>
    questionDifficulty(pack, { ...pack.questions[0], difficulty: undefined }),
  ).toThrow('packDifficulty');
});

test('homogeneous packs inherit their declared level; conflicting explicit question levels fail', () => {
  const pack = boardPack();
  expect(questionDifficulty(pack, pack.questions[0])).toBe('medium');
  pack.questions[0].difficulty = 'medium';
  expect(questionDifficulty(pack, pack.questions[0])).toBe('medium');
  expect(validatePack(pack)).toEqual(pack);
  pack.questions[0].difficulty = 'hard';
  expect(() => validatePack(pack)).toThrow('packDifficulty');
  expect(() =>
    validatePack({
      ...pack,
      questions: [{ ...pack.questions[0], difficulty: 'unrated' }],
    }),
  ).toThrow('packDifficulty');
});

test('mixed generation retains actual selected question levels through JSON, game recovery and printing', () => {
  const sources = bundledPacks().filter((pack) =>
    ['general-en-01', 'general-en-02'].includes(pack.id),
  );
  const generated = generateNumbers(
    sources,
    'en',
    () => 0.41,
    'mixed',
    'Mixed board',
  );
  expect(generated.difficulty).toEqual(['easy', 'medium']);
  for (const question of generated.questions) {
    const source = sources.find((pack) =>
      pack.questions.some((prior) => prior.id === question.id),
    );
    expect(question.difficulty).toBe(source?.difficulty);
  }
  expect(importPack(JSON.stringify(generated))).toEqual(generated);
  const game = createGame(generated, config(), 1000, 'old');
  const file = portableGame(game, { ...defaultSetup('en'), mode: 'numbers' });
  expect(
    recoverPortable(JSON.stringify(file), 2000, 'fresh').game.pack,
  ).toEqual(generated);
  expect(answerSheet(generated, 'en')).toContain('Difficulty: Easy / Medium');
  expect(answerSheet(generated, 'cs')).toContain('Obtížnost: Lehká / Střední');
  expect(
    generateNumbers([generated], 'en', () => 0.3, 'again', 'Again').difficulty,
  ).toEqual(['easy', 'medium']);
  expect(
    generateNumbers([sources[0]], 'en', () => 0.3, 'single', 'Single')
      .difficulty,
  ).toBe('medium');
  expect(() =>
    generateNumbers([sources[0], generated], 'en', () => 0.3, 'dedup', 'Dedup'),
  ).not.toThrow();
});

test('v1 metadata is not inferred, even for a known bundled ID or a claimed difficulty', () => {
  const pack = bundledPacks()[1];
  for (const difficulty of [undefined, 'medium'])
    expect(() =>
      importPack(JSON.stringify({ ...pack, schemaVersion: 1, difficulty })),
    ).toThrow('packVersion');
});

test('Czech Nature 1 retains its reviewed Medium classification in filters, generated metadata and exports', () => {
  const pack = bundledPacks().find((pack) => pack.id === 'nature-cs-01');
  if (!pack) throw new Error('Missing Czech Nature 1');
  expect(pack.difficulty).toBe('medium');
  const ids = new Set([pack.id]);
  expect(
    filterPacks([pack], ids, { origin: '', difficulty: 'hard' }, 'cs'),
  ).toEqual([]);
  expect(
    filterPacks([pack], ids, { origin: '', difficulty: 'medium' }, 'cs'),
  ).toEqual([pack]);
  const numbers = generateNumbers([pack], 'cs', () => 0.3, 'nature', 'Nature');
  expect(numbers.difficulty).toBe('medium');
  expect(numbers.questions.every((q) => q.difficulty === 'medium')).toBe(true);
  expect(importPack(JSON.stringify(numbers))).toEqual(numbers);
  expect(answerSheet(numbers, 'cs')).toContain('Obtížnost: Střední');
});

test('classification ledger preserves all 32 retained and four archived historical packs', () => {
  const ledger = JSON.parse(
    readFileSync('docs/phase-11-classification.json', 'utf8'),
  );
  const hash = (/** @type {string|Buffer} */ value) =>
    createHash('sha256').update(value).digest('hex');
  expect(ledger.packs).toHaveLength(36);
  const inherited = bundledPacks().filter((pack) =>
    ledger.packs.some(
      (/** @type {{id: string}} */ entry) => entry.id === pack.id,
    ),
  );
  expect(inherited).toHaveLength(32);
  const retired = [
    'entertainment-cs-01',
    'entertainment-cs-02',
    'entertainment-en-01',
    'entertainment-en-02',
  ].map((id) =>
    validatePack(JSON.parse(readFileSync(`docs/retired/${id}.json`, 'utf8'))),
  );
  expect(
    [...inherited, ...retired].flatMap((pack) => pack.questions),
  ).toHaveLength(1008);
  for (const pack of [...inherited, ...retired]) {
    const path = `${retired.includes(pack) ? 'docs/retired' : 'src/content'}/${pack.id}.json`;
    const entry = ledger.packs.find(
      (/** @type {{id: string}} */ entry) => entry.id === pack.id,
    );
    expect(entry.difficulty).toBe(pack.difficulty);
    expect(entry.entryIds).toEqual(
      pack.questions.map((question) => question.id),
    );
    expect(entry.unchangedQuestionsSha256).toBe(
      hash(JSON.stringify(JSON.parse(readFileSync(path, 'utf8')).questions)),
    );
    expect(entry.currentSha256).toBe(hash(readFileSync(path)));
  }
  expect(
    new Set(
      ledger.packs.map(
        (/** @type {{difficulty: string}} */ entry) => entry.difficulty,
      ),
    ).size,
  ).toBe(3);
});
