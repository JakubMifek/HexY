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
 * @typedef {{id: string, entries: string[], verdict: string,
 * distribution: Record<string, number>}} LocalizedGeneralRating
 */

/**
 * @typedef {{id: string, verdict: string, reason: string,
 * easierAnchors: string[], specialistOutliers: string[],
 * outlierReason: string}} ScienceInstrumentRating
 */

/**
 * @typedef {{id: string, verdict: string, reason: string,
 * informedBridges: string[], bridgeReason: string}} ScienceHardBridgeRating
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
 * GeneralBatchRating | GeographyDeckRating | LocalizedGeneralRating | ScienceInstrumentRating | ScienceHardBridgeRating} AcceptedRating
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
 * @param {LocalizedGeneralRating} rating
 * @param {string} deckId
 * @param {string} difficulty
 */
function expectLocalizedGeneralRating(rating, deckId, difficulty) {
  expect(deckId).toBe('general-cs-medium-04');
  expect(difficulty).toBe('medium');
  expect(rating.id).toBe(deckId);
  expect(digest(JSON.stringify(rating))).toBe(
    '6500328345784b0229145385855ad0f7f39fbb9a3f41e4a6990a34e9dec7efd5',
  );
  expect(rating.entries).toEqual(
    Array.from(
      { length: 28 },
      (_, index) => `${deckId}-${String(index + 1).padStart(2, '0')}`,
    ),
  );
  expect(rating.distribution).toEqual({
    informed: 19,
    'specialist-but-fair': 3,
    common: 6,
  });
  expect(rating.verdict).toBe(
    'ACCEPTED whole-deck adult difficulty; localized aliases remain separate findings',
  );
}

/**
 * @param {ScienceInstrumentRating} rating
 * @param {string} deckId
 * @param {string} difficulty
 */
function expectScienceInstrumentRating(rating, deckId, difficulty) {
  expect(deckId).toBe('science-en-medium-04');
  expect(difficulty).toBe('medium');
  expect(rating.id).toBe(deckId);
  expect(digest(JSON.stringify(rating))).toBe(
    '6ecfc915d133f15fb5f8a4e228f8314d2b2d6f1b6f7da512d4f02c1cc95be0c6',
  );
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
}

/**
 * @param {ScienceHardBridgeRating} rating
 * @param {string} deckId
 * @param {string} difficulty
 */
function expectScienceHardBridgeRating(rating, deckId, difficulty) {
  expect(deckId).toBe('science-en-hard-04');
  expect(difficulty).toBe('hard');
  expect(rating.id).toBe(deckId);
  expect(digest(JSON.stringify(rating))).toBe(
    '64aa583f45324e41e93ebf7a2749d12d4ab9dcd6f833f4ddf8d562ba42ef12f3',
  );
  expect(rating.verdict).toBe('ACCEPT HARD');
  expect(rating.informedBridges).toEqual([
    'science-en-hard-04-03',
    'science-en-hard-04-20',
    'science-en-hard-04-24',
  ]);
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
  } else if ('distribution' in rating) {
    expectLocalizedGeneralRating(rating, deckId, difficulty);
  } else if ('informedBridges' in rating) {
    expectScienceHardBridgeRating(rating, deckId, difficulty);
  } else if ('easierAnchors' in rating) {
    expectScienceInstrumentRating(rating, deckId, difficulty);
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
