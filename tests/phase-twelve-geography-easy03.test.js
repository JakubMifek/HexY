import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/geography-en-easy-03.json';
import ledger from '../docs/phase-12-geography-en-easy-03-sources.json';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {object} value */
function objectHash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

test('Geography Easy03 retains its exact accepted bytes and append position', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(141);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/geography-en-easy-03.json'))
      .digest('hex'),
  ).toBe(ledger.sourcePackSha256);
  expect(rawPack.questions).toEqual(
    ledger.exactQuestionAndEntireEvidenceBindings.map(
      (binding) => binding.rawQuestion,
    ),
  );
});

test.each(ledger.exactQuestionAndEntireEvidenceBindings)(
  '$id retains the complete accepted question, full evidence and aliases',
  (binding) => {
    const current = ledger.entries.find((entry) => entry.id === binding.id);
    const original = ledger.entireOriginalLedgerEntries.find(
      (entry) => entry.id === binding.id,
    );
    if (!current || !original)
      throw new Error(`Missing accepted ledger entry ${binding.id}`);
    expect(current).toEqual(original);
    expect(objectHash(current)).toBe(binding.wholeLedgerEntrySha256);
    expect(objectHash(binding.rawQuestion)).toBe(binding.questionSha256);
    expect(objectHash(binding.entireRawEvidenceArray)).toBe(
      binding.evidenceSha256,
    );
    expect(current.evidence).toEqual(binding.entireRawEvidenceArray);
    expect(objectHash(binding.completeAliases)).toBe(binding.aliasArraySha256);
    expect(binding.rawQuestion.aliases).toEqual(binding.completeAliases);
    const question = bundledPacks()
      .find((pack) => pack.id === rawPack.id)
      ?.questions.find((entry) => entry.id === binding.id);
    if (!question) throw new Error(`Missing bundled question ${binding.id}`);
    for (const answer of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, answer)).toBe(true);
  },
);

test('Geography Easy03 retains its native accepted general-adult Easy calibration', () => {
  expect(ledger.wholeDeckRatingSha256).toBe(
    'e5527412420645350b6e5e27f713eb0acab02b45c8aded700fa3da77f8ab630a',
  );
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(ledger.wholeDeckGeneralAdultRating.id).toBe(rawPack.id);
  expect(ledger.wholeDeckGeneralAdultRating.entries).toBe(28);
  expect(ledger.wholeDeckGeneralAdultRating.independentDominantRating).toBe(
    'easy',
  );
  expect(ledger.wholeDeckGeneralAdultRating.disposition).toBe('ACCEPTED');
  expect(ledger.wholeDeckGeneralAdultRating.individualDistribution).toEqual({
    easy: 22,
    medium: 6,
  });
});
