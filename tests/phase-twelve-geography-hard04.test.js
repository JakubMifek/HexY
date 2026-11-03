import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/geography-en-hard-04.json';
import ledger from '../docs/phase-12-geography-en-hard-04-sources.json';
import contentSeal from '../docs/phase-12-geography-en-hard-04-content-seal.json';
import { bundledPacks } from './bundled-packs.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {unknown} value */
function objectHash(value) {
  const serialized = JSON.stringify(value);
  if (serialized === undefined)
    throw new Error('Missing serializable accepted metadata.');
  return createHash('sha256').update(serialized).digest('hex');
}

test('Geography Hard04 retains accepted bytes and explicit position after all145 preceding packs', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(145);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/geography-en-hard-04.json'))
      .digest('hex'),
  ).toBe('9ef36453bd804d38ab0842698239670c38d5a60c44b8a8c73a4f4841977f23fb');
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

test('Geography Hard04 retains actual adult Hard3Easy7Medium18Hard and25plus3 accepted continuity', () => {
  expect(ledger.wholeDeckRatingSha256).toBe(
    'c52476f8ad6bf56973e3b1a765cc2ccb9fdb95473df925cc4c546cd03eeb1132',
  );
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(ledger.wholeDeckGeneralAdultRating.assignedLevel).toBe('hard');
  expect(ledger.wholeDeckGeneralAdultRating.individualDistribution).toEqual({
    medium: 7,
    hard: 18,
    easy: 3,
  });
  expect(ledger.wholeDeckGeneralAdultRating.questionIds).toEqual(
    rawPack.questions.map((question) => question.id),
  );
  expect(
    ledger.entireAuthorOriginalOwnEntries.filter(
      (row) => row.initialIndependentAccepted,
    ),
  ).toHaveLength(25);
  expect(
    ledger.entireAuthorOriginalOwnEntries
      .filter((row) => row.correctionIndependentAccepted)
      .map((row) => row.id),
  ).toEqual([
    'geography-en-hard-04-04',
    'geography-en-hard-04-21',
    'geography-en-hard-04-22',
  ]);
});

test('Geography Hard04 projection retains every original full field and evidence hash binding', () => {
  const projected = new Map(Object.entries(ledger));
  expect(
    ledger.losslessOriginalAuthorProjectionBinding.originalFields,
  ).toHaveLength(25);
  for (const binding of ledger.losslessOriginalAuthorProjectionBinding
    .originalFields)
    expect(objectHash(projected.get(binding.projectedField))).toBe(
      binding.sha256,
    );
  expect(ledger.exactQuestionAndEntireEvidenceBindings).toHaveLength(28);
  for (const binding of ledger.exactQuestionAndEntireEvidenceBindings) {
    const original = ledger.entireAuthorOriginalOwnEntries.find(
      (row) => row.id === binding.id,
    );
    expect(binding.questionSha256).toBe(original?.wholeQuestionSha256);
    expect(binding.evidenceSha256).toBe(original?.wholeEvidenceArraySha256);
  }
});

test('Geography Hard04 retains the sealed entire independent current own28 decision document', () => {
  const review = ledger.currentIndependentContentReview;
  expect(review.verdict).toBe('CONTENTDELTAACCEPTED');
  expect(review.blockers).toBe(0);
  expect(review.seal.sha256).toBe(
    '0e203318c05e53ac4840c76d347d80d41afeb45bcf43625e15f1bd4ee6f20db2',
  );
  const member = contentSeal.members.find((entry) =>
    entry.path.endsWith('/CURRENT-OWN28-DECISIONS.json'),
  );
  if (!member) throw new Error('Missing independent current decision seal.');
  expect(
    createHash('sha256')
      .update(review.entireOriginalOwn28DecisionsDocument)
      .digest('hex'),
  ).toBe(member.sha256);
  expect(JSON.parse(review.entireOriginalOwn28DecisionsDocument)).toEqual(
    review.fullOwn28Decisions,
  );
  expect(
    createHash('sha256')
      .update(
        readFileSync(
          'docs/phase-12-geography-en-hard-04-content-seal-original.txt',
        ),
      )
      .digest('hex'),
  ).toBe(review.seal.sha256);
});
