import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/science-en-medium-04.json';
import ledger from '../docs/phase-12-science-en-medium-04-sources.json';
import { bundledPacks } from './bundled-packs.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {unknown} value */
function objectHash(value) {
  const serialized = JSON.stringify(value);
  if (serialized === undefined)
    throw new Error('Missing serialized source metadata.');
  return createHash('sha256').update(serialized).digest('hex');
}

test('Science Medium04 preserves its accepted native pack and prior146 append position', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(146);
  expect(ledger.nativeCandidate.sha256).toBe(
    'ec670826de67cadf15821b4994112bccc663df06a73420fca4f3b19da772e2f2',
  );
  expect(ledger.entireNativeSourceLedger.sha256).toBe(
    '38507d4df3dbaaba74a2a8bc92c709771537bb7727d465f3f659494c1f0c7c13',
  );
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/science-en-medium-04.json'))
      .digest('hex'),
  ).toBe(ledger.sourcePackSha256);
  expect(rawPack.questions).toHaveLength(28);
  expect(rawPack.questions).toEqual(
    ledger.entireAuthorOriginalOwnEntries.map((row) => row.wholeQuestion),
  );
});

test.each(ledger.entireAuthorOriginalOwnEntries)(
  '$id retains the entire accepted question, support array, aliases and original receipt',
  (original) => {
    const source = ledger.entries.find((entry) => entry.id === original.id);
    const raw = rawPack.questions.find((entry) => entry.id === original.id);
    const question = bundledPacks()
      .find((pack) => pack.id === rawPack.id)
      ?.questions.find((entry) => entry.id === original.id);
    if (!source || !raw || !question)
      throw new Error(`Missing accepted source ${original.id}`);
    expect(source).toEqual(original.wholeRawSupportingEntry);
    expect(objectHash(source.evidence)).toBe(original.rawEvidenceSha256);
    expect(raw).toEqual(original.wholeQuestion);
    expect(objectHash(raw)).toBe(original.questionSha256);
    expect(raw.aliases).toEqual(original.completeAliases);
    expect(objectHash(raw.aliases)).toBe(original.aliasArraySha256);
    const receipt = original.entireOriginalAcceptedReceipt;
    expect(objectHash(receipt)).toBe(original.originalReceiptSha256);
    expect(receipt.wholeQuestion).toEqual(raw);
    expect(receipt.wholeQuestionSha256).toBe(original.questionSha256);
    expect(receipt.wholeLedgerEntry).toEqual(source);
    expect(receipt.wholeEvidenceSha256).toBe(original.rawEvidenceSha256);
    expect(original.initialFactWordingSourceInitialAliasStatus).toBe(
      'INHERIT EXACT OWN INITIAL ACCEPTANCE',
    );
    expect(original.actualGeneralAdultRating).toEqual(
      ledger.wholeDeckGeneralAdultRating,
    );
    expect(original.wholeRatingSha256).toBe(ledger.wholeDeckRatingSha256);
    expect(question.answer).toBe(raw.answer);
    expect(question.aliases).toEqual(original.completeAliases);
    for (const form of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, form)).toBe(true);
  },
);

test('Science Medium04 retains its actual Medium judgment without inventing a bucket distribution', () => {
  const rating = ledger.wholeDeckGeneralAdultRating;
  expect(ledger.wholeDeckRatingSha256).toBe(
    '6ecfc915d133f15fb5f8a4e228f8314d2b2d6f1b6f7da512d4f02c1cc95be0c6',
  );
  expect(objectHash(rating)).toBe(ledger.wholeDeckRatingSha256);
  expect(rating.id).toBe(rawPack.id);
  expect(rating.verdict).toBe('ACCEPT MEDIUM');
  expect(rating.easierAnchors).toEqual([
    'science-en-medium-04-09',
    'science-en-medium-04-15',
  ]);
  expect(rating.specialistOutliers).toEqual([
    'science-en-medium-04-02',
    'science-en-medium-04-18',
    'science-en-medium-04-25',
    'science-en-medium-04-26',
    'science-en-medium-04-27',
  ]);
  expect(
    rawPack.questions.reduce((count, row) => count + row.aliases.length, 0),
  ).toBe(53);
  expect(
    ledger.entries.reduce((count, row) => count + row.evidence.length, 0),
  ).toBe(29);
});

test('Science Medium04 preserves the full original author document and prior independent decisions', () => {
  const originalDocument = ledger.entireOriginalAuthorLedgerDocument;
  expect(createHash('sha256').update(originalDocument).digest('hex')).toBe(
    ledger.originalAuthorLedgerBinding.sha256,
  );
  expect(JSON.parse(originalDocument)).toEqual(
    ledger.entireAuthorOriginalOwnEntries,
  );
  const review = ledger.currentIndependentContentReview;
  expect(review.actualExternallyBoundReviewer).toBe(
    '774420ab-8a42-481f-8707-dd880925b7fa',
  );
  expect(review.seal.sha256).toBe(
    'c02d53aa05c691679321c815fcb6a66e8ec8e1d7d01ebd26e2b1ef6ea54e867b',
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
