import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/general-cs-hard-04.json';
import ledger from '../docs/phase-12-general-cs-hard-04-sources.json';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {unknown} value */
function objectHash(value) {
  const serialized = JSON.stringify(value);
  if (serialized === undefined)
    throw new Error('Missing serialized source metadata.');
  return createHash('sha256').update(serialized).digest('hex');
}

test('General Czech Hard04 preserves accepted native bytes and planned149-deck append position', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(148);
  expect(ledger.nativeCandidate.sha256).toBe(
    '7a9129d3cc3eef22f99705bc70098359e9fc2e672fb3ba87e630d3b4e949927a',
  );
  expect(ledger.entireNativeSourceLedger.sha256).toBe(
    '3c135c822e4e81dbb0446387124ffb3c3876f7f87600c359b664c4f8667c09fa',
  );
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/general-cs-hard-04.json'))
      .digest('hex'),
  ).toBe(ledger.sourcePackSha256);
  expect(rawPack.questions).toEqual(
    ledger.entireAuthorOriginalOwnEntries.map((row) => row.rawQuestion),
  );
  expect(rawPack.questions).toHaveLength(28);
});

test.each(ledger.entireAuthorOriginalOwnEntries)(
  '$id preserves the full original and accepted row, complete evidence and all aliases',
  (original) => {
    const source = ledger.entries.find((row) => row.id === original.id);
    const raw = rawPack.questions.find((row) => row.id === original.id);
    const question = bundledPacks()
      .find((pack) => pack.id === rawPack.id)
      ?.questions.find((row) => row.id === original.id);
    if (!source || !raw || !question)
      throw new Error(`Missing accepted source ${original.id}`);
    expect(raw).toEqual(original.rawQuestion);
    expect(objectHash(raw)).toBe(original.questionSha256);
    expect(raw.aliases).toEqual(original.completeAliases);
    expect(objectHash(raw.aliases)).toBe(original.aliasArraySha256);
    expect(source).toEqual(original.entireNativeSourceEntry);
    expect(objectHash(source)).toBe(original.nativeSourceEntrySha256);
    expect(source.evidence).toEqual(original.entireRawEvidenceArray);
    expect(objectHash(source.evidence)).toBe(original.evidenceSha256);
    expect(objectHash(original.entireEnrichedProjection)).toBe(
      original.enrichedProjectionSha256,
    );
    expect(question.answer).toBe(raw.answer);
    expect(question.aliases).toEqual(original.completeAliases);
    for (const form of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, form)).toBe(true);
  },
);

test('General Czech Hard04 retains actual22 specialist/3 informed/3 common and all six accessible bridges', () => {
  const rating = ledger.wholeDeckGeneralAdultRating;
  expect(ledger.wholeDeckRatingSha256).toBe(
    'e01a1add7aa1f88ca8248d326a528bf47772a0165f6b31c95ffbe8ac19d3d325',
  );
  expect(objectHash(rating)).toBe(ledger.wholeDeckRatingSha256);
  expect(rating).toEqual(ledger.wholeOriginalAdultRating);
  expect(rating.id).toBe(rawPack.id);
  expect(rating.entries).toEqual(rawPack.questions.map((row) => row.id));
  expect(rating.verdict).toBe(
    'ACCEPTED whole-deck adult difficulty; localized aliases remain separate findings',
  );
  expect(rating.distribution).toEqual({
    'specialist-but-fair': 22,
    informed: 3,
    common: 3,
  });
  expect(rating.bridges.map((row) => row.id)).toEqual([
    'general-cs-hard-04-07',
    'general-cs-hard-04-08',
    'general-cs-hard-04-17',
    'general-cs-hard-04-21',
    'general-cs-hard-04-25',
    'general-cs-hard-04-26',
  ]);
  expect(
    rawPack.questions.reduce((count, row) => count + row.aliases.length, 0),
  ).toBe(49);
  expect(
    ledger.entries.reduce((count, row) => count + row.evidence.length, 0),
  ).toBe(33);
});

test('General Czech Hard04 retains every original root field and full rich own row', () => {
  const originalDocument = ledger.entireOriginalAuthorLedgerDocument;
  const binding = ledger.losslessOriginalAuthorProjectionBinding;
  expect(binding.sha256).toBe(
    'd7c93b48db77f78bc3b54c339ae63fed1ddc9d8e56c9b81fd0ae391f2cd61bae',
  );
  expect(createHash('sha256').update(originalDocument).digest('hex')).toBe(
    binding.sha256,
  );
  const original = JSON.parse(originalDocument);
  expect(Object.keys(original)).toHaveLength(24);
  expect(original.entries).toEqual(ledger.entireAuthorOriginalOwnEntries);
  expect(binding.originalFields).toHaveLength(24);
  /** @type {Map<string, unknown>} */
  const currentFields = new Map(Object.entries(ledger));
  for (const field of binding.originalFields)
    expect(objectHash(currentFields.get(field.projectedField))).toBe(
      field.sha256,
    );
});

test('General Czech Hard04 preserves prior accepted current decisions and exact whole-array bindings', () => {
  const review = ledger.currentIndependentContentReview;
  expect(review.actualExternallyBoundReviewer).toBe(
    '774420ab-8a42-481f-8707-dd880925b7fa',
  );
  expect(review.seal.sha256).toBe(
    '5cdb8f460bed716e1b5b9c5d6ae5c176c4f9f6e5b2f373716ce945571e4329cb',
  );
  expect(review.verdict).toBe('CONTENTDELTAACCEPTED');
  expect(review.blockers).toBe(0);
  expect(
    createHash('sha256')
      .update(review.entireOriginalOwn28DecisionsDocument)
      .digest('hex'),
  ).toBe(review.originalOwn28DecisionsBinding.sha256);
  expect(JSON.parse(review.entireOriginalOwn28DecisionsDocument)).toEqual(
    review.fullOwn28Decisions,
  );
  expect(ledger.exactQuestionAndEntireEvidenceBindings).toHaveLength(28);
  for (const binding of ledger.exactQuestionAndEntireEvidenceBindings) {
    const raw = rawPack.questions.find((row) => row.id === binding.id);
    const entry = ledger.entries.find((row) => row.id === binding.id);
    expect(objectHash(raw)).toBe(binding.questionSha256);
    expect(objectHash(entry?.evidence)).toBe(binding.evidenceSha256);
  }
});
