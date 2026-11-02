import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/general-cs-medium-04.json';
import ledger from '../docs/phase-12-general-cs-medium-04-sources.json';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {unknown} value */
function objectHash(value) {
  const serialized = JSON.stringify(value);
  if (serialized === undefined)
    throw new Error('Missing serialized source metadata.');
  return createHash('sha256').update(serialized).digest('hex');
}

test('General Czech Medium04 preserves corrected pack bytes and all144 prior positions', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(144);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/general-cs-medium-04.json'))
      .digest('hex'),
  ).toBe('606c302cd2447e76f288ac56e2de592c0f2c748831612db4d58c4c9a54c95088');
  expect(ledger.acceptedAuthorCorrectedPackBinding.sha256).toBe(
    'c47b6407cbf6272f165ec59e672bcac12de9f4c30ccea4f9f8689049f22ec389',
  );
  expect(ledger.byteFormattingContinuity.entirePackObjectSha256).toBe(
    objectHash(rawPack),
  );
  expect(ledger.rawPack).toEqual(rawPack);
  expect(ledger.entireProposedSourceBinding.sha256).toBe(
    '87a69defae1da11869447379c967740f994ede96e093717959d5c9bba4848f12',
  );
});

test.each(ledger.entireOriginalOwnRows)(
  '$id preserves full original evidence, prior accepted receipts and all original forms',
  (original) => {
    const source = ledger.entries.find((entry) => entry.id === original.id);
    const raw = rawPack.questions.find((entry) => entry.id === original.id);
    const question = bundledPacks()
      .find((pack) => pack.id === rawPack.id)
      ?.questions.find((entry) => entry.id === original.id);
    if (!source || !raw || !question)
      throw new Error(`Missing own entry ${original.id}`);
    expect(source.evidence).toEqual(original.entireRawEvidenceArray);
    expect(objectHash(source.evidence)).toBe(original.evidenceSha256);
    expect(objectHash(original.entireEnrichedEvidenceArray)).toBe(
      original.enrichedEvidenceSha256,
    );
    expect(
      objectHash(original.originalPreCorrectionEnrichedEvidenceArray),
    ).toBe(original.originalPreCorrectionEnrichedEvidenceSha256);
    expect(objectHash(original.wholeLedgerEntry)).toBe(
      original.wholeLedgerEntrySha256,
    );
    expect(objectHash(original.rawQuestion)).toBe(original.questionSha256);
    expect(objectHash(original.completeAliases)).toBe(
      original.aliasArraySha256,
    );
    expect(original.wholeApplicableAcceptedReceipt).toBeTruthy();
    expect(source.aliases).toEqual(raw.aliases);
    const accepted =
      ledger.acceptedCorrectionReview.actualAcceptedCurrentEntries.find(
        (entry) => entry.id === original.id,
      );
    if (!accepted)
      throw new Error(`Missing actual independent binding ${original.id}`);
    expect(accepted.currentWholeQuestionSha256).toBe(objectHash(raw));
    expect(accepted.currentWholeSourceEntrySha256).toBe(objectHash(source));
    expect(accepted.currentEntireRawEvidenceArraySha256).toBe(
      objectHash(source.evidence),
    );
    expect(raw.aliases).toEqual(
      original.id.endsWith('-17')
        ? [...original.completeAliases, 'Wu long', 'Wu lung', 'Wulung']
        : original.completeAliases,
    );
    if (!original.id.endsWith('-17')) expect(raw).toEqual(original.rawQuestion);
    for (const form of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, form)).toBe(true);
  },
);

test('General Czech Medium04 retains actual original whole Medium schema and calibration', () => {
  expect(ledger.wholeDeckRatingSha256).toBe(
    '6500328345784b0229145385855ad0f7f39fbb9a3f41e4a6990a34e9dec7efd5',
  );
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(ledger.wholeDeckGeneralAdultRating.entries).toEqual(
    rawPack.questions.map((q) => q.id),
  );
  expect(ledger.wholeDeckGeneralAdultRating.distribution).toEqual({
    informed: 19,
    'specialist-but-fair': 3,
    common: 6,
  });
  expect(ledger.unchangedWholeQuestions).toBe(27);
  expect(ledger.currentCanonicalAndAliasForms).toBe(66);
  expect(
    ledger.acceptedCorrectionReview.entireFindingsAndClosure.blockingFindings,
  ).toBe(0);
  expect(ledger.acceptedCorrectionReview.seal.sha256).toBe(
    '46992b19fc852d4bcea1e5202c9f84f5408fcfed36a014e5d452dd9d167a505d',
  );
  expect(ledger.independentChangedEntryAndAliasAcceptanceStillRequired).toBe(
    false,
  );
});

test('Oolong accepts every missing legitimate form without rewriting the clue or other aliases', () => {
  const question = bundledPacks().find((pack) => pack.id === rawPack.id)
    ?.questions[16];
  const original = ledger.entireOriginalOwnRows[16];
  if (!question) throw new Error('Missing Oolong question.');
  const oldQuestion = { ...question, aliases: original.completeAliases };
  for (const form of ['Wu long', 'Wu lung', 'Wulung']) {
    expect(acceptsAnswer(oldQuestion, form)).toBe(false);
    expect(acceptsAnswer(question, form)).toBe(true);
  }
  expect(rawPack.questions[16]).toEqual({
    ...original.rawQuestion,
    aliases: [...original.completeAliases, 'Wu long', 'Wu lung', 'Wulung'],
  });
});

test('General Czech Medium04 retains every original own row and every historical root binding', () => {
  expect(ledger.losslessOriginalFieldInventory).toHaveLength(52);
  const ownRowsBinding = ledger.losslessOriginalFieldInventory.find(
    (field) => field.field === 'entries',
  );
  expect(objectHash(ledger.entireOriginalOwnRows)).toBe(
    ownRowsBinding?.entireValueSha256,
  );
  for (const field of ledger.losslessOriginalFieldInventory) {
    expect(field.retainedAt.sha256).toBe(
      'd62f6d7d8ceec243d685028e8b9b4f91c718daf753f8614ebac64e4c4df46fea',
    );
    expect(field.retainedAt.pointer).toBe(`/${field.field}`);
  }
  expect(ledger.exactQuestionAndEntireEvidenceBindings).toHaveLength(28);
  for (const binding of ledger.exactQuestionAndEntireEvidenceBindings) {
    const raw = rawPack.questions.find(
      (question) => question.id === binding.id,
    );
    const source = ledger.entries.find((entry) => entry.id === binding.id);
    expect(objectHash(raw)).toBe(binding.questionSha256);
    expect(objectHash(source?.evidence)).toBe(binding.evidenceSha256);
  }
});
