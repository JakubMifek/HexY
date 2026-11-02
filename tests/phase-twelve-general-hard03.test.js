import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import rawPack from '../src/content/general-en-hard-03.json';
import ledger from '../docs/phase-12-general-en-hard-03-sources.json';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/** @param {object} value */
function objectHash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

test('General Hard03 retains its exact accepted bytes and append position', () => {
  expect(bundledPacks().findIndex((pack) => pack.id === rawPack.id)).toBe(138);
  expect(
    createHash('sha256')
      .update(readFileSync('src/content/general-en-hard-03.json'))
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
    if (!current)
      throw new Error(`Missing accepted ledger entry ${binding.id}`);
    const original = ledger.entireOriginalLedgerEntries.find(
      (entry) => entry.id === binding.id,
    );
    if (!original)
      throw new Error(`Missing original ledger entry ${binding.id}`);
    expect(objectHash(original)).toBe(binding.wholeLedgerEntrySha256);
    expect(current).toEqual({
      ...original,
      difficulty: rawPack.difficulty,
      difficultyJudgment:
        binding.wholeApplicableAcceptedReceipt.difficultyJudgment,
      editorialJudgment: binding.wholeApplicableAcceptedReceipt,
      reviewStatus:
        'Historical fact/source/alias/wording/initial/difficulty ACCEPTED; independent CURRENT adoption/delta review and release PENDING.',
    });
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

test('General Hard03 keeps its entire accepted Hard calibration and correction continuity', () => {
  expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
    ledger.wholeDeckRatingSha256,
  );
  expect(ledger.wholeDeckGeneralAdultRating.id).toBe(rawPack.id);
  expect(ledger.wholeDeckGeneralAdultRating.entriesRead).toBe(28);
  expect(ledger.wholeDeckGeneralAdultRating.proposedDifficulty).toBe('hard');
  expect(ledger.wholeDeckGeneralAdultRating.individualEditorialBuckets).toEqual(
    {
      hard: 26,
      medium: 2,
    },
  );
  expect(ledger.wholeDeckGeneralAdultRating.correctionRecheck).toBeTruthy();
});
