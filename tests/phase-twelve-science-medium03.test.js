import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/science-en-medium-03.json';
import ledger from '../docs/phase-12-science-en-medium-03-sources.json';
import { bundledPacks } from './bundled-packs.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {object} value */
function objectHash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

test('Science Medium03 preserves its exact accepted bytes and append position', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(140);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/science-en-medium-03.json'))
      .digest('hex'),
  ).toBe(ledger.sourcePackSha256);
  expect(rawPack.questions).toEqual(
    ledger.exactQuestionAndEntireEvidenceBindings.map(
      (binding) => binding.rawQuestion,
    ),
  );
});

test.each(ledger.exactQuestionAndEntireEvidenceBindings)(
  '$id retains full accepted source, question, aliases and both independent receipts',
  (binding) => {
    const current = ledger.entries.find((entry) => entry.id === binding.id);
    const original = ledger.entireOriginalLedgerEntries.find(
      (entry) => entry.id === binding.id,
    );
    if (!current || !original)
      throw new Error(`Missing accepted source ${binding.id}`);
    expect(current).toEqual(original);
    expect(objectHash(current)).toBe(binding.wholeLedgerEntrySha256);
    expect(objectHash(current.evidence)).toBe(binding.evidenceSha256);
    expect(current.evidence).toEqual(binding.entireRawEvidenceArray);
    expect(objectHash(binding.rawQuestion)).toBe(binding.questionSha256);
    expect(objectHash(binding.completeAliases)).toBe(binding.aliasArraySha256);
    expect(binding.rawQuestion.aliases).toEqual(binding.completeAliases);
    expect(objectHash(binding.wholeOriginalReceipt)).toBe(
      binding.wholeOriginalReceiptSha256,
    );
    expect(objectHash(binding.wholeApplicableAcceptedReceipt)).toBe(
      binding.wholeApplicableAcceptedReceiptSha256,
    );
    expect(binding.wholeApplicableAcceptedReceipt.questionSha256).toBe(
      binding.questionSha256,
    );
    expect(binding.wholeApplicableAcceptedReceipt.wholeEvidenceSha256).toBe(
      binding.evidenceSha256,
    );
    const question = bundledPacks()
      .find((pack) => pack.id === rawPack.id)
      ?.questions.find((entry) => entry.id === binding.id);
    if (!question) throw new Error(`Missing bundled question ${binding.id}`);
    expect(question.answer).toBe(binding.rawQuestion.answer);
    expect(question.aliases).toEqual(binding.completeAliases);
    for (const answer of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, answer)).toBe(true);
  },
);

test('Science Medium03 preserves the native entire 4/21/3 adult Medium calibration', () => {
  expect(ledger.wholeDeckRatingSha256).toBe(
    '26a9b3739d46ace86ad3bb831cf4786618753f2829ace830c9dd6db46f3fc9d1',
  );
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  const rating = ledger.wholeDeckGeneralAdultRating;
  expect(rating.id).toBe(rawPack.id);
  expect(rating.decision).toBe('Accept dominant Medium');
  expect([
    rating.commonEasyIndices.length,
    rating.informedMediumIndices.length,
    rating.specialistHardIndices.length,
  ]).toEqual([4, 21, 3]);
  expect(
    [
      ...rating.commonEasyIndices,
      ...rating.informedMediumIndices,
      ...rating.specialistHardIndices,
    ].sort((left, right) => left - right),
  ).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
});

test('Science Medium03 retains the actual 26 unchanged and two accepted corrected objects', () => {
  const bindings = ledger.exactQuestionAndEntireEvidenceBindings;
  expect(
    bindings.filter((binding) => binding.originalWholeQuestionUnchanged),
  ).toHaveLength(26);
  expect(
    bindings
      .filter((binding) => !binding.originalWholeQuestionUnchanged)
      .map((binding) => binding.id),
  ).toEqual(['science-en-medium-03-05', 'science-en-medium-03-14']);
  expect(
    ledger.entries.reduce((count, entry) => count + entry.evidence.length, 0),
  ).toBe(31);
  expect(
    rawPack.questions.reduce(
      (count, question) => count + question.aliases.length + 1,
      0,
    ),
  ).toBe(95);
});
