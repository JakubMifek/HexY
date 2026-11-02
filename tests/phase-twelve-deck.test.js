import { expect, test } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { bundledPacks } from '../src/content/catalog.js';

/** @type {{additionalDeckIds: string[]}} */
const shipment = JSON.parse(
  readFileSync('docs/phase-12-deck-inventory.json', 'utf8'),
);
const digest = (/** @type {string | Buffer} */ bytes) =>
  createHash('sha256').update(bytes).digest('hex');

/**
 * @typedef {{rubric: string, counts: Record<string, Record<string, number>>,
 * judgment: string}} GeneralBatchRating
 */

/**
 * @typedef {{deckId: string, entries: number, verdict: string,
 * assignedLevel: string, individualDistribution: Record<string, number>,
 * questionIds: string[]}} GeographyDeckRating
 */

/**
 * @typedef {{
 * entriesReviewed: number, independentDominantGeneralAdultRating: string
 * } | {id: string, entriesRead: number, proposedDifficulty: string,
 * difficultyVerdict: string, individualEditorialBuckets: Record<string, number>
 * } | {id: string, assigned: string, independentDominantRating: string,
 * disposition: string, entries: number,
 * individualDistribution: Record<string, number>
 * } | {id: string, decision: string, commonEasyIndices: number[],
 * informedMediumIndices: number[], specialistHardIndices: number[]} |
 * GeneralBatchRating | GeographyDeckRating} AcceptedRating
 */

/** @param {Record<string, number>} levels */
function expectRatingDistribution(levels) {
  const distribution = Object.entries(levels);
  expect(distribution.length).toBeGreaterThan(0);
  expect(
    distribution.every(
      ([level, count]) =>
        ['easy', 'medium', 'hard'].includes(level) &&
        Number.isSafeInteger(count) &&
        count >= 0,
    ),
  ).toBe(true);
  expect(distribution.reduce((total, [, count]) => total + count, 0)).toBe(28);
}

/**
 * @param {{id: string, entriesRead: number, proposedDifficulty: string,
 * difficultyVerdict: string, individualEditorialBuckets: Record<string, number>}} rating
 * @param {string} deckId
 * @param {string} difficulty
 */
function expectGeneralRating(rating, deckId, difficulty) {
  expect(rating.id).toBe(deckId);
  expect(rating.entriesRead).toBe(28);
  expect(rating.proposedDifficulty).toBe(difficulty);
  expect(rating.difficultyVerdict).toBe(
    'CLEARED (early full-deck calibration only)',
  );
  expectRatingDistribution(rating.individualEditorialBuckets);
}

/**
 * @param {GeneralBatchRating} rating
 * @param {string} deckId
 * @param {string} difficulty
 */
function expectGeneralBatchRating(rating, deckId, difficulty) {
  expect(deckId).toBe('general-en-medium-05');
  expect(difficulty).toBe('medium');
  expect(digest(JSON.stringify(rating))).toBe(
    '2772a1543ee0f75ddc52fad402778c3b4b0c279b2544239125328c65bf6e7fbc',
  );
  expect(rating.counts.medium).toEqual({
    common: 5,
    informed: 21,
    specialist: 2,
  });
}

/**
 * @param {GeographyDeckRating} rating
 * @param {string} deckId
 * @param {string} difficulty
 */
function expectGeographyRating(rating, deckId, difficulty) {
  expect(rating.deckId).toBe(deckId);
  expect(rating.entries).toBe(28);
  expect(rating.verdict).toBe('ACCEPTED WHOLE-DECK ADULT RATING');
  expect(rating.assignedLevel).toBe(difficulty);
  expectRatingDistribution(rating.individualDistribution);
  expect(rating.questionIds).toEqual(
    Array.from(
      { length: 28 },
      (_, index) => `${deckId}-${String(index + 1).padStart(2, '0')}`,
    ),
  );
}

/**
 * @param {AcceptedRating} rating
 * @param {string} deckId
 * @param {string} difficulty
 */
function expectAcceptedRating(rating, deckId, difficulty) {
  if ('entriesReviewed' in rating) {
    expect(rating.entriesReviewed).toBe(28);
    expect(rating.independentDominantGeneralAdultRating).toBe(difficulty);
  } else if ('independentDominantRating' in rating) {
    expect(rating.id).toBe(deckId);
    expect(rating.assigned).toBe(difficulty);
    expect(rating.independentDominantRating).toBe(difficulty);
    expect(rating.disposition).toBe('ACCEPTED');
    expect(rating.entries).toBe(28);
    expectRatingDistribution(rating.individualDistribution);
  } else if ('entriesRead' in rating) {
    expectGeneralRating(rating, deckId, difficulty);
  } else if ('counts' in rating) {
    expectGeneralBatchRating(rating, deckId, difficulty);
  } else if ('assignedLevel' in rating) {
    expectGeographyRating(rating, deckId, difficulty);
  } else {
    expect(rating.id).toBe(deckId);
    expect(rating.decision).toBe(
      `Accept dominant ${difficulty[0].toUpperCase()}${difficulty.slice(1)}`,
    );
    const reviewed = [
      ...rating.commonEasyIndices,
      ...rating.informedMediumIndices,
      ...rating.specialistHardIndices,
    ];
    expect(reviewed.sort((left, right) => left - right)).toEqual(
      Array.from({ length: 28 }, (_, index) => index + 1),
    );
  }
}

for (const deckId of shipment.additionalDeckIds) {
  /** @type {{deckId: string, sourcePackSha256: string,
   * exactQuestionAndEntireEvidenceBindings: {id: string, questionSha256: string, evidenceSha256: string}[],
   * entries: {id: string, evidence: unknown[]}[],
   * wholeDeckRatingSha256: string,
   * wholeDeckGeneralAdultRating: AcceptedRating}} */
  const ledger = JSON.parse(
    readFileSync(`docs/phase-12-${deckId}-sources.json`, 'utf8'),
  );

  test(`${deckId} preserves all28 raw questions, entire evidence arrays and original adult rating`, () => {
    expect(ledger.deckId).toBe(deckId);
    const bytes = readFileSync(`src/content/${ledger.deckId}.json`);
    expect(digest(bytes)).toBe(ledger.sourcePackSha256);
    const raw = JSON.parse(bytes.toString());
    expect(raw.questions).toHaveLength(28);
    expect(ledger.entries).toHaveLength(28);
    expect(ledger.exactQuestionAndEntireEvidenceBindings).toHaveLength(28);
    for (const question of raw.questions) {
      const accepted = ledger.exactQuestionAndEntireEvidenceBindings.find(
        (entry) => entry.id === question.id,
      );
      const entry = ledger.entries.find((item) => item.id === question.id);
      expect(digest(JSON.stringify(question))).toBe(accepted?.questionSha256);
      expect(entry?.evidence.length).toBeGreaterThan(0);
      expect(digest(JSON.stringify(entry?.evidence))).toBe(
        accepted?.evidenceSha256,
      );
    }
    expect(digest(JSON.stringify(ledger.wholeDeckGeneralAdultRating))).toBe(
      ledger.wholeDeckRatingSha256,
    );
    expectAcceptedRating(
      ledger.wholeDeckGeneralAdultRating,
      deckId,
      raw.difficulty,
    );
  });
}

test('incremental shipment contains only its explicit additional decks in original append order', () => {
  expect(
    bundledPacks()
      .slice(132)
      .map((pack) => pack.id),
  ).toEqual(shipment.additionalDeckIds);
});
