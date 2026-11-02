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
 * @typedef {{id: string, verdict: string, distribution: Record<string, number>,
 * rationale: string}} GeneralBucketRating
 */

/**
 * @typedef {{packId: string, proposedDifficulty: string, entriesRead: number,
 * editorialBuckets: Record<string, number>, difficultyVerdict: string,
 * contentVerdict: string, latestCrossCategoryVerdict: string}} GeneralEditorialRating
 */

/**
 * @typedef {{deckId: string, declared: string, independentlyAcceptedDominantAdultLevel: string,
 * accepted: boolean, individualDistribution: Record<string, number>,
 * all28EntryReceiptsRetained: boolean}} GeographyB02Rating
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
 * GeneralBatchRating | GeographyDeckRating | LocalizedGeneralRating | ScienceInstrumentRating | ScienceHardBridgeRating | GeneralBucketRating} EstablishedRating
 */

/** @typedef {EstablishedRating | GeneralEditorialRating | GeographyB02Rating} AcceptedRating */

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
 * @param {LocalizedGeneralRating | GeneralBucketRating} rating
 * @param {string} deckId
 * @param {string} difficulty
 */
function expectLocalizedGeneralRating(rating, deckId, difficulty) {
  if (!('entries' in rating)) {
    expectGeneralBucketRating(rating, deckId, difficulty);
    return;
  }
  if (deckId === 'general-cs-hard-04') {
    expect(difficulty).toBe('hard');
    expect(rating.id).toBe(deckId);
    expect(digest(JSON.stringify(rating))).toBe(
      'e01a1add7aa1f88ca8248d326a528bf47772a0165f6b31c95ffbe8ac19d3d325',
    );
    expect(rating.entries).toEqual(
      Array.from(
        { length: 28 },
        (_, index) => `${deckId}-${String(index + 1).padStart(2, '0')}`,
      ),
    );
    expect(rating.distribution).toEqual({
      'specialist-but-fair': 22,
      informed: 3,
      common: 3,
    });
    expect(rating.verdict).toBe(
      'ACCEPTED whole-deck adult difficulty; localized aliases remain separate findings',
    );
    return;
  }
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

/** @param {GeneralBucketRating} rating @param {string} deckId @param {string} difficulty */
function expectGeneralBucketRating(rating, deckId, difficulty) {
  /** @type {Record<string, {difficulty: string, sha256: string, distribution: Record<string, number>}>} */
  const accepted = {
    'general-cs-easy-03': {
      difficulty: 'easy',
      sha256:
        'a89a3251371a85f465be18463a24f84eac7c4dcb3d0879ef0d4d06c2349220c3',
      distribution: { easy: 28 },
    },
    'general-cs-medium-03': {
      difficulty: 'medium',
      sha256:
        '86ba62d13c5239a9897d6d959f4ee68a7610944d1b31601c11d0449b69b38f20',
      distribution: { medium: 27, easy: 1 },
    },
    'general-cs-hard-03': {
      difficulty: 'hard',
      sha256:
        'bed96564119260b806aaf31dc5b319e4a95b1ed933d881665f15768a318f9d43',
      distribution: { hard: 26, easy: 1, medium: 1 },
    },
  };
  const expected = accepted[deckId];
  if (!expected) throw new Error(`Unknown original General rating ${deckId}`);
  expect(difficulty).toBe(expected.difficulty);
  expect(rating.id).toBe(deckId);
  expect(digest(JSON.stringify(rating))).toBe(expected.sha256);
  expect(rating.verdict).toBe('ACCEPTED whole-deck adult difficulty');
  expect(rating.distribution).toEqual(expected.distribution);
  if (difficulty === 'hard')
    expect(rating.rationale).toContain('Neither is relabelled Hard');
}

/** @param {GeneralEditorialRating} rating @param {string} deckId @param {string} difficulty */
function expectGeneralEditorialRating(rating, deckId, difficulty) {
  /** @type {Record<string, {difficulty: string, sha256: string, distribution: Record<string, number>, historicalSemanticVerdict: string}>} */
  const accepted = {
    'general-en-easy-04': {
      difficulty: 'easy',
      sha256:
        '42ac15195b74ba5581cd310814cfc8ba1dd6e5fc19919489b4d700ee19e55d6a',
      distribution: { easy: 27, medium: 1, hard: 0 },
      historicalSemanticVerdict:
        'No notified b03 entry overlap in this deck; not a category/global clearance',
    },
    'general-en-medium-04': {
      difficulty: 'medium',
      sha256:
        '6bdb63664625e355d948af1f237e52146cdf306cb115310bac3dfd9da8212001',
      distribution: { easy: 2, medium: 21, hard: 5 },
      historicalSemanticVerdict: 'BLOCKED unresolved live Arts reservations',
    },
    'general-en-hard-04': {
      difficulty: 'hard',
      sha256:
        '1ed89ee877efc25339c99ad6ac8d234c65463efc4fd62b5b21ab180bf73c60f7',
      distribution: { easy: 0, medium: 2, hard: 26 },
      historicalSemanticVerdict: 'BLOCKED unresolved live Arts reservations',
    },
  };
  const expected = accepted[deckId];
  if (!expected) throw new Error(`Unknown original General rating ${deckId}`);
  expect(difficulty).toBe(expected.difficulty);
  expect(digest(JSON.stringify(rating))).toBe(expected.sha256);
  expect(rating.packId).toBe(deckId);
  expect(rating.proposedDifficulty).toBe(difficulty);
  expect(rating.entriesRead).toBe(28);
  expect(rating.editorialBuckets).toEqual(expected.distribution);
  expect(rating.difficultyVerdict).toContain('CLEARED: deck demand');
  expect(rating.contentVerdict).toBe('CLEARED isolated corrected deck only');
  expect(rating.latestCrossCategoryVerdict).toBe(
    expected.historicalSemanticVerdict,
  );
}

/** @param {GeographyB02Rating} rating @param {string} deckId @param {string} difficulty */
function expectGeographyB02Rating(rating, deckId, difficulty) {
  /** @type {Record<string, {difficulty: string, sha256: string, distribution: Record<string, number>}>} */
  const accepted = {
    'geography-cs-easy-03': {
      difficulty: 'easy',
      sha256:
        'c260e2727772ba6f7dd3b8d3feb3864b5f57ffd041131d27e763296f9297b445',
      distribution: { Easy: 23, Medium: 5 },
    },
    'geography-cs-medium-03': {
      difficulty: 'medium',
      sha256:
        'f5fdd2f70c94aeca7b66aa30e92d6188c0f8157ccc050ce1c5474154d645326b',
      distribution: { Medium: 22, Easy: 4, Hard: 2 },
    },
    'geography-cs-hard-03': {
      difficulty: 'hard',
      sha256:
        '1877c0acc5706dc02b9f47c2dc9404afaad3194569854f6092147b9ada838f56',
      distribution: { Hard: 20, Easy: 1, Medium: 7 },
    },
  };
  const expected = accepted[deckId];
  if (!expected) throw new Error(`Unknown original Geography rating ${deckId}`);
  expect(difficulty).toBe(expected.difficulty);
  expect(digest(JSON.stringify(rating))).toBe(expected.sha256);
  expect(rating.deckId).toBe(deckId);
  expect(rating.declared).toBe(difficulty);
  expect(rating.independentlyAcceptedDominantAdultLevel).toBe(
    difficulty[0].toUpperCase() + difficulty.slice(1),
  );
  expect(rating.accepted).toBe(true);
  expect(rating.all28EntryReceiptsRetained).toBe(true);
  expect(rating.individualDistribution).toEqual(expected.distribution);
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
  if ('independentlyAcceptedDominantAdultLevel' in rating) {
    expectGeographyB02Rating(rating, deckId, difficulty);
  } else if ('editorialBuckets' in rating) {
    expectGeneralEditorialRating(rating, deckId, difficulty);
  } else {
    expectEstablishedRating(rating, deckId, difficulty);
  }
}

/** @param {EstablishedRating} rating @param {string} deckId @param {string} difficulty */
function expectEstablishedRating(rating, deckId, difficulty) {
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
