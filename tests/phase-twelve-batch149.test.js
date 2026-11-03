import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import inventory from '../docs/phase-12-deck-inventory.json';
import { bundledPacks } from './bundled-packs.js';
import { acceptsAnswer } from '../src/domain/answers.js';

/**
 * @typedef {{id: string, rawQuestion: unknown, aliases: string[], evidence: unknown[],
 * entireRawSourceEntry: unknown, entireSupportingEvidenceArray: unknown[],
 * questionSha256: string, entireSupportingEvidenceArraySha256: string,
 * entireSourceEntrySha256: string, aliasesSha256: string,
 * individualAdultRating: unknown, individualAdultRatingSha256: string}} SourceEntry
 */

/** @param {unknown} object */
function objectHash(object) {
  const serialized = JSON.stringify(object);
  if (serialized === undefined)
    throw new Error('Missing complete source object.');
  return createHash('sha256').update(serialized).digest('hex');
}

for (const deckId of [
  'general-cs-hard-03',
  'general-en-medium-04',
  'geography-cs-easy-03',
  'general-cs-easy-03',
  'general-cs-medium-03',
  'geography-cs-medium-03',
  'geography-cs-hard-03',
  'general-en-easy-04',
  'general-en-hard-04',
].filter((id) => inventory.additionalDeckIds.includes(id))) {
  /** @type {{deckId: string, entries: SourceEntry[],
   * sourcePackSha256: string, originalAuthorSourcePackSha256: string,
   * entireAuthorOriginalOwnEntries: {id: string}[],
   * wholeDeckGeneralAdultRating: unknown, wholeDeckRatingSha256: string,
   * originalAuthorProjection: {entries: SourceEntry[], wholeDeckGeneralAdultRating: unknown},
   * nativeCandidate: {sha256: string}}} */
  const ledger = JSON.parse(
    readFileSync(`docs/phase-12-${deckId}-sources.json`, 'utf8'),
  );
  /** @type {{id: string, questions: {id: string, aliases: string[]}[]}} */
  const raw = JSON.parse(readFileSync(`src/content/${deckId}.json`, 'utf8'));

  test(`${deckId} retains the exact accepted native objects and complete original projection`, () => {
    expect(raw.id).toBe(deckId);
    expect(raw.questions).toHaveLength(28);
    expect(raw.questions).toEqual(
      ledger.entries.map((entry) => entry.rawQuestion),
    );
    expect(ledger.entries).toEqual(ledger.originalAuthorProjection.entries);
    expect(ledger.originalAuthorSourcePackSha256).toBe(
      ledger.nativeCandidate.sha256,
    );
    expect(
      createHash('sha256')
        .update(readFileSync(`src/content/${deckId}.json`))
        .digest('hex'),
    ).toBe(ledger.sourcePackSha256);
  });

  test.each(ledger.entries)(
    '$id retains whole supporting evidence, all aliases and individual difficulty judgment',
    (entry) => {
      const question = raw.questions.find((item) => item.id === entry.id);
      const runtime = bundledPacks()
        .find((pack) => pack.id === deckId)
        ?.questions.find((item) => item.id === entry.id);
      if (!question || !runtime)
        throw new Error(`Missing accepted entry ${entry.id}`);
      expect(objectHash(question)).toBe(entry.questionSha256);
      expect(question.aliases).toEqual(entry.aliases);
      expect(objectHash(question.aliases)).toBe(entry.aliasesSha256);
      expect(entry.evidence).toEqual(entry.entireSupportingEvidenceArray);
      expect(objectHash(entry.evidence)).toBe(
        entry.entireSupportingEvidenceArraySha256,
      );
      expect(entry.entireRawSourceEntry).toEqual(
        ledger.entireAuthorOriginalOwnEntries.find(
          (item) => item.id === entry.id,
        ),
      );
      expect(objectHash(entry.entireRawSourceEntry)).toBe(
        entry.entireSourceEntrySha256,
      );
      expect(objectHash(entry.individualAdultRating)).toBe(
        entry.individualAdultRatingSha256,
      );
      for (const form of [runtime.answer, ...runtime.aliases])
        expect(acceptsAnswer(runtime, form)).toBe(true);
    },
  );

  test(`${deckId} preserves the original whole-adult rating without rewriting its historical verdicts`, () => {
    expect(ledger.wholeDeckGeneralAdultRating).toEqual(
      ledger.originalAuthorProjection.wholeDeckGeneralAdultRating,
    );
    expect(objectHash(ledger.wholeDeckGeneralAdultRating)).toBe(
      ledger.wholeDeckRatingSha256,
    );
  });
}
