import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/general-en-medium-05.json';
import ledger from '../docs/phase-12-general-en-medium-05-sources.json';
import { bundledPacks } from './bundled-packs.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {object} value */
function objectHash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

test('General Medium05 retains its exact accepted bytes and append position', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(142);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/general-en-medium-05.json'))
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
    const source = ledger.entries.find((entry) => entry.id === binding.id);
    if (!source) throw new Error(`Missing accepted source ${binding.id}`);
    expect(source).toEqual(binding.entireNativeSourceEntry);
    expect(objectHash(source)).toBe(binding.nativeSourceEntrySha256);
    expect(objectHash(binding.rawQuestion)).toBe(binding.questionSha256);
    expect(objectHash(source.evidence)).toBe(binding.evidenceSha256);
    expect(source.evidence).toEqual(binding.entireRawEvidenceArray);
    expect(objectHash(binding.entireLegitimateAcceptedEvidenceProjection)).toBe(
      binding.acceptedEvidenceProjectionSha256,
    );
    expect(binding.wholeOriginalReceipt.questionSha256).toBe(
      binding.questionSha256,
    );
    expect(binding.wholeAcceptedReceipt.questionSha256).toBe(
      binding.questionSha256,
    );
    expect(binding.wholeAcceptedReceipt.evidenceSha256).toBe(
      binding.evidenceSha256,
    );
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

test('General Medium05 retains its actual accepted general-adult Medium calibration', () => {
  expect(ledger.wholeDeckRatingSha256).toBe(
    '2772a1543ee0f75ddc52fad402778c3b4b0c279b2544239125328c65bf6e7fbc',
  );
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(rawPack.difficulty).toBe('medium');
  expect(ledger.wholeDeckGeneralAdultRating.counts.medium).toEqual({
    common: 5,
    informed: 21,
    specialist: 2,
  });
  expect(ledger.wholeMediumRatingBinding.counts).toEqual(
    ledger.wholeDeckGeneralAdultRating.counts.medium,
  );
  expect(
    ledger.wholeMediumRatingBinding.all28WholeQuestionsUnchangedFromOriginal,
  ).toBe(true);
});
