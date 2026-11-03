import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/science-en-hard-04.json';
import ledger from '../docs/phase-12-science-en-hard-04-sources.json';
import { bundledPacks } from './bundled-packs.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {unknown} value */
function objectHash(value) {
  const serialized = JSON.stringify(value);
  if (serialized === undefined)
    throw new Error('Missing serialized source metadata.');
  return createHash('sha256').update(serialized).digest('hex');
}

test('Science Hard04 preserves the accepted native pack and planned148-deck append position', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(147);
  expect(ledger.nativeCandidate.sha256).toBe(
    '687f2956fdaec77f26c21b32c28b9acd4e1ea628ba10c0456f5b365a00a1b5a7',
  );
  expect(ledger.entireNativeSourceLedger.sha256).toBe(
    '38507d4df3dbaaba74a2a8bc92c709771537bb7727d465f3f659494c1f0c7c13',
  );
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/science-en-hard-04.json'))
      .digest('hex'),
  ).toBe(ledger.sourcePackSha256);
  expect(rawPack.questions).toHaveLength(28);
  expect(rawPack.questions).toEqual(
    ledger.entireAuthorOriginalOwnEntries.map((row) => row.wholeQuestion),
  );
});

test.each(ledger.entireAuthorOriginalOwnEntries)(
  '$id preserves the whole initial accepted question, source, aliases and receipt',
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
    expect(question.answer).toBe(raw.answer);
    expect(question.aliases).toEqual(original.completeAliases);
    for (const form of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, form)).toBe(true);
  },
);

test('Science Hard04 retains its actual Hard judgment and three informed bridges', () => {
  const rating = ledger.wholeDeckGeneralAdultRating;
  expect(ledger.wholeDeckRatingSha256).toBe(
    '64aa583f45324e41e93ebf7a2749d12d4ab9dcd6f833f4ddf8d562ba42ef12f3',
  );
  expect(objectHash(rating)).toBe(ledger.wholeDeckRatingSha256);
  expect(rating.id).toBe(rawPack.id);
  expect(rating.verdict).toBe('ACCEPT HARD');
  expect(rating.informedBridges).toEqual([
    'science-en-hard-04-03',
    'science-en-hard-04-20',
    'science-en-hard-04-24',
  ]);
  expect(ledger.entireAcceptedHardReceipt.wholeDeckRating).toEqual(rating);
  expect(ledger.entireAcceptedHardReceipt.wholeDeckRatingSha256).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(
    rawPack.questions.reduce((count, row) => count + row.aliases.length, 0),
  ).toBe(76);
  expect(
    ledger.entries.reduce((count, row) => count + row.evidence.length, 0),
  ).toBe(28);
});

test('Science Hard04 preserves its entire historical initial/current matrix without claiming current acceptance', () => {
  expect(ledger.originalAuthorLedgerBinding.sha256).toBe(
    '440e5b4158c68ac9440d854aa15e3b45fbd5b62357dabd0d4e0a4f87ab3990ab',
  );
  expect(
    createHash('sha256')
      .update(ledger.entireOriginalAuthorLedgerDocument)
      .digest('hex'),
  ).toBe(ledger.originalAuthorLedgerBinding.sha256);
  expect(ledger.entireAuthorOriginalOwnEntries).toHaveLength(28);
  expect(ledger.exactQuestionAndEntireEvidenceBindings).toHaveLength(28);
  for (const binding of ledger.exactQuestionAndEntireEvidenceBindings) {
    const raw = rawPack.questions.find((row) => row.id === binding.id);
    const entry = ledger.entries.find((row) => row.id === binding.id);
    expect(objectHash(raw)).toBe(binding.questionSha256);
    expect(objectHash(entry?.evidence)).toBe(binding.evidenceSha256);
  }
});
