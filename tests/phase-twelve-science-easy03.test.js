import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/science-en-easy-03.json';
import ledger from '../docs/phase-12-science-en-easy-03-sources.json';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {object} value */
function objectHash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

test('Science Easy03 retains its exact accepted bytes and appended delivery position', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(137);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/science-en-easy-03.json'))
      .digest('hex'),
  ).toBe(ledger.sourcePackSha256);
  expect(rawPack.questions).toEqual(
    ledger.exactQuestionAndEntireEvidenceBindings.map(
      (binding) => binding.rawQuestion,
    ),
  );
});

test.each(ledger.exactQuestionAndEntireEvidenceBindings)(
  '$id retains the complete accepted question, full evidence array and aliases',
  (binding) => {
    const current = ledger.entries.find((entry) => entry.id === binding.id);
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
      .find((pack) => pack.id === rawPack.id)
      ?.questions.find((entry) => entry.id === binding.id);
    if (!question) throw new Error(`Missing bundled question ${binding.id}`);
    for (const answer of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, answer)).toBe(true);
  },
);

test('Science Easy03 preserves the actual independent general-adult Easy judgment', () => {
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(ledger.wholeDeckGeneralAdultRating.id).toBe(rawPack.id);
  expect(ledger.wholeDeckGeneralAdultRating.decision).toBe(
    'Accept dominant Easy',
  );
  expect(
    [
      ...ledger.wholeDeckGeneralAdultRating.commonEasyIndices,
      ...ledger.wholeDeckGeneralAdultRating.informedMediumIndices,
      ...ledger.wholeDeckGeneralAdultRating.specialistHardIndices,
    ].sort((a, b) => a - b),
  ).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
});
