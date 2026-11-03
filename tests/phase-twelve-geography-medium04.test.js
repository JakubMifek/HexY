import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/geography-en-medium-04.json';
import ledger from '../docs/phase-12-geography-en-medium-04-sources.json';
import { bundledPacks } from './bundled-packs.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {unknown} value */
function objectHash(value) {
  const serialized = JSON.stringify(value);
  if (serialized === undefined)
    throw new Error('Missing serializable accepted metadata.');
  return createHash('sha256').update(serialized).digest('hex');
}

test('Geography Medium04 retains accepted bytes and explicit position after all143 old packs', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(143);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/geography-en-medium-04.json'))
      .digest('hex'),
  ).toBe('a62223a423a753b3c11d623944f6b738ceac3b31feeb27cfd3554683b69a0d82');
  expect(rawPack.questions).toEqual(
    ledger.entireAuthorOriginalOwnEntries.map((row) => row.rawQuestion),
  );
  expect(ledger.entireNativeSourceLedger.sha256).toBe(
    'f836fc4473b2b0669cdc41eb5fc6d3e5843001cd24c42aaed46f57f085bc06de',
  );
});

test.each(ledger.entireAuthorOriginalOwnEntries)(
  '$id retains full source/receipt objects, evidence arrays and legitimate aliases',
  (binding) => {
    const source = ledger.entries.find((entry) => entry.id === binding.id);
    if (!source) throw new Error(`Missing accepted source ${binding.id}`);
    expect(source).toEqual(binding.entireSupportingEntry);
    expect(objectHash(source)).toBe(binding.wholeSourceEntrySha256);
    expect(source.evidence).toEqual(binding.entireEvidenceArray);
    expect(objectHash(source.evidence)).toBe(binding.wholeEvidenceArraySha256);
    expect(objectHash(binding.rawQuestion)).toBe(binding.wholeQuestionSha256);
    expect(binding.rawQuestion.aliases).toEqual(binding.allAliases);
    expect(objectHash(binding.allAliases)).toBe(binding.allAliasesSha256);
    expect(
      binding.initialIndependentAccepted ||
        binding.correctionIndependentAccepted,
    ).toBe(true);
    expect(binding.entireApplicableAcceptedJudgment.wholeQuestionSha256).toBe(
      binding.wholeQuestionSha256,
    );
    expect(
      binding.entireApplicableAcceptedJudgment.wholeSupportingEntrySha256,
    ).toBe(binding.wholeSourceEntrySha256);
    expect(
      binding.entireApplicableAcceptedJudgment.wholeEvidenceMetadataSha256,
    ).toBe(binding.wholeEvidenceArraySha256);
    const question = bundledPacks()
      .find((pack) => pack.id === rawPack.id)
      ?.questions.find((entry) => entry.id === binding.id);
    if (!question) throw new Error(`Missing bundled question ${binding.id}`);
    for (const answer of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, answer)).toBe(true);
  },
);

test('Geography Medium04 retains actual Medium2Easy25Medium1Hard and accepted correction scope', () => {
  expect(ledger.wholeDeckRatingSha256).toBe(
    '890c2ee7eb80b9c0169f12acf0bb01a37e293218115341a90d388d4afbd4aff1',
  );
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(ledger.wholeDeckGeneralAdultRating.assignedLevel).toBe(
    rawPack.difficulty,
  );
  expect(ledger.wholeDeckGeneralAdultRating.individualDistribution).toEqual({
    medium: 25,
    easy: 2,
    hard: 1,
  });
  expect(ledger.wholeDeckGeneralAdultRating.questionIds).toEqual(
    rawPack.questions.map((question) => question.id),
  );
  expect(
    ledger.entireAuthorOriginalOwnEntries.filter(
      (row) => row.initialIndependentAccepted,
    ),
  ).toHaveLength(27);
  expect(
    ledger.entireAuthorOriginalOwnEntries
      .filter((row) => row.correctionIndependentAccepted)
      .map((row) => row.id),
  ).toEqual(['geography-en-medium-04-26']);
});

test('Geography Medium04 generic compatibility retains every preceding full projection field', () => {
  const projected = new Map(Object.entries(ledger));
  for (const binding of ledger.genericBindingProjection.originalFields)
    expect(objectHash(projected.get(binding.field))).toBe(binding.sha256);
  expect(
    ledger.losslessOriginalAuthorProjectionBinding.originalFields,
  ).toHaveLength(25);
  expect(ledger.exactQuestionAndEntireEvidenceBindings).toHaveLength(28);
  for (const binding of ledger.exactQuestionAndEntireEvidenceBindings) {
    const original = ledger.entireAuthorOriginalOwnEntries.find(
      (row) => row.id === binding.id,
    );
    expect(binding.questionSha256).toBe(original?.wholeQuestionSha256);
    expect(binding.evidenceSha256).toBe(original?.wholeEvidenceArraySha256);
  }
});
