import { expect, test } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { bundledPacks } from '../src/content/catalog.js';

/** @type {{deckId: string, sourcePackSha256: string,
 * exactQuestionAndEntireEvidenceBindings: {id: string, questionSha256: string, evidenceSha256: string}[],
 * entries: {id: string, evidence: unknown[]}[],
 * wholeDeckRatingSha256: string,
 * wholeDeckGeneralAdultRating: {entriesReviewed: number, independentDominantGeneralAdultRating: string}}} */
const ledger = JSON.parse(
  readFileSync('docs/phase-12-nature-en-easy-03-sources.json', 'utf8'),
);
const digest = (/** @type {string | Buffer} */ bytes) =>
  createHash('sha256').update(bytes).digest('hex');

test('incremental Nature deck preserves all28 raw questions, entire evidence arrays and original adult rating', () => {
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
  expect(ledger.wholeDeckGeneralAdultRating.entriesReviewed).toBe(28);
  expect(
    ledger.wholeDeckGeneralAdultRating.independentDominantGeneralAdultRating,
  ).toBe('easy');
  expect(
    bundledPacks()
      .slice(132)
      .map((pack) => pack.id),
  ).toEqual([ledger.deckId]);
});
