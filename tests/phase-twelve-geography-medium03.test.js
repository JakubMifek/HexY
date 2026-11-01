import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/geography-en-medium-03.json';
import ledger from '../docs/phase-12-geography-en-medium-03-sources.json';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {object} value */
function objectHash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

test('Geography Medium03 is the sole newest shipped deck with the exact accepted bytes', () => {
  expect(bundledPacks().at(-1)?.id).toBe(rawPack.id);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/geography-en-medium-03.json'))
      .digest('hex'),
  ).toBe(ledger.sourcePackSha256);
  expect(rawPack.questions).toEqual(
    ledger.exactQuestionAndEntireEvidenceBindings.map(
      (binding) => binding.rawQuestion,
    ),
  );
});

test.each(ledger.exactQuestionAndEntireEvidenceBindings)(
  '$id retains the entire accepted question, evidence and aliases',
  (binding) => {
    const current = ledger.entries.find((entry) => entry.id === binding.id);
    expect(current).toBeDefined();
    if (!current)
      throw new Error(`Missing accepted ledger entry ${binding.id}`);
    expect(objectHash(current)).toBe(binding.wholeLedgerEntrySha256);
    expect(objectHash(binding.rawQuestion)).toBe(binding.questionSha256);
    expect(objectHash(binding.entireRawEvidenceArray)).toBe(
      binding.evidenceSha256,
    );
    expect(current.evidence).toEqual(binding.entireRawEvidenceArray);
    expect(objectHash(binding.completeAliases)).toBe(binding.aliasArraySha256);
    expect(binding.rawQuestion.aliases).toEqual(binding.completeAliases);
    const question = bundledPacks()
      .at(-1)
      ?.questions.find((entry) => entry.id === binding.id);
    expect(question).toBeDefined();
    if (!question) throw new Error(`Missing bundled question ${binding.id}`);
    for (const answer of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, answer)).toBe(true);
  },
);

test('Durban landmarks resolve the rejected Richards Bay ambiguity without pruning aliases', () => {
  const question = bundledPacks().at(-1)?.questions[4];
  expect(question?.answer).toBe('Durban');
  expect(question?.text).toContain('Golden Mile');
  expect(question?.text).toContain('uShaka Marine World');
  expect(question?.aliases).toEqual(['eThekwini', 'Port Natal']);
  if (!question) throw new Error('Missing Durban question');
  for (const answer of ['Richards Bay', 'Richardsbaai', 'Port of Richards Bay'])
    expect(acceptsAnswer(question, answer)).toBe(false);
});

test('the accepted Durban support extends the original reading without changing the cached source', () => {
  const original = ledger.entireOriginalLedgerEntries[4].evidence[0];
  const corrected = ledger.entries[4].evidence[0];
  expect(original.consultedParagraphIndices).toEqual([0]);
  expect(corrected.consultedParagraphIndices).toEqual([0, 3]);
  expect(corrected.passage).toContain(original.passage);
  expect(corrected.passage).toContain('Golden Mile beachfront');
  expect(corrected.passage).toContain('uShaka Marine World');
  expect(corrected.sourceBodySha256).toBe(original.sourceBodySha256);
  expect(corrected.sourceTextSha256).toBe(original.sourceTextSha256);
  expect(corrected.fetchedAt).toBe(original.fetchedAt);
});

test('the original whole-deck general-adult Medium judgment remains exact', () => {
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(ledger.wholeDeckGeneralAdultRating.independentDominantRating).toBe(
    'medium',
  );
  expect(ledger.wholeDeckGeneralAdultRating.disposition).toBe('ACCEPTED');
  expect(ledger.wholeDeckGeneralAdultRating.entries).toBe(28);
  expect(rawPack.difficulty).toBe('medium');
});
