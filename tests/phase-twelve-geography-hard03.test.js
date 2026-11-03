import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/geography-en-hard-03.json';
import ledger from '../docs/phase-12-geography-en-hard-03-sources.json';
import { bundledPacks } from './bundled-packs.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {object} value */
function objectHash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

test('Geography Hard03 retains its exact accepted bytes and append position', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(139);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/geography-en-hard-03.json'))
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

test('Geography Hard03 keeps its entire accepted Hard calibration without invented zero buckets', () => {
  expect(ledger.wholeDeckRatingSha256).toBe(
    '40fcd01d0e85615b221d0e1ba8bdfeba7b35f6288389ab2d45b0ccbf7326c60c',
  );
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(ledger.wholeDeckGeneralAdultRating.id).toBe(rawPack.id);
  expect(ledger.wholeDeckGeneralAdultRating.entries).toBe(28);
  expect(ledger.wholeDeckGeneralAdultRating.independentDominantRating).toBe(
    'hard',
  );
  expect(ledger.wholeDeckGeneralAdultRating.disposition).toBe('ACCEPTED');
  expect(ledger.wholeDeckGeneralAdultRating.individualDistribution).toEqual({
    hard: 23,
    medium: 5,
  });
});
