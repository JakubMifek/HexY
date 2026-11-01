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

for (const deckId of shipment.additionalDeckIds) {
  /** @type {{deckId: string, sourcePackSha256: string,
   * exactQuestionAndEntireEvidenceBindings: {id: string, questionSha256: string, evidenceSha256: string}[],
   * entries: {id: string, evidence: unknown[]}[],
   * wholeDeckRatingSha256: string,
   * wholeDeckGeneralAdultRating:
   * {entriesReviewed: number, independentDominantGeneralAdultRating: string} |
   * {id: string, decision: string, commonEasyIndices: number[],
   * informedMediumIndices: number[], specialistHardIndices: number[]}}} */
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
    const rating = ledger.wholeDeckGeneralAdultRating;
    if ('entriesReviewed' in rating) {
      expect(rating.entriesReviewed).toBe(28);
      expect(rating.independentDominantGeneralAdultRating).toBe(raw.difficulty);
    } else {
      expect(rating.id).toBe(deckId);
      expect(rating.decision).toBe(
        `Accept dominant ${raw.difficulty[0].toUpperCase()}${raw.difficulty.slice(1)}`,
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
  });
}

test('incremental shipment contains only its explicit additional decks in original append order', () => {
  expect(
    bundledPacks()
      .slice(132)
      .map((pack) => pack.id),
  ).toEqual(shipment.additionalDeckIds);
});
