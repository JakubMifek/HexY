import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';

test('all 224 independently reviewed Arts additions bind exact pack bytes, claims and source evidence', () => {
  const bytes = readFileSync('docs/phase-11-arts-sources.json');
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(
    '59d581f50c4e04c8a8490609e2648c0f8c281d9a887c0a6cca91bf4552db173b',
  );
  /** @type {{packs: {id: string, sha256: string, entryIds: string[]}[],
   * entries: {id: string, claim: string, answer: string, aliases: string[],
   * initial: string, evidence: {url: string}[]}[]}} */
  const ledger = JSON.parse(bytes.toString());
  const additions = bundledPacks().filter((pack) =>
    /^arts-(cs|en)-(easy|medium|hard)-\d{2}$/.test(pack.id),
  );
  expect(additions).toHaveLength(8);
  expect(ledger.entries).toHaveLength(224);
  expect(ledger.entries.map((entry) => entry.id).sort()).toEqual(
    additions.flatMap((pack) => pack.questions.map((q) => q.id)).sort(),
  );
  for (const pack of additions) {
    const receipt = ledger.packs.find((entry) => entry.id === pack.id);
    if (!receipt) throw new Error(`Missing receipt ${pack.id}`);
    expect(receipt.sha256).toBe(
      createHash('sha256')
        .update(readFileSync(`src/content/${pack.id}.json`))
        .digest('hex'),
    );
    expect(receipt.entryIds).toEqual(pack.questions.map((q) => q.id));
    for (const question of pack.questions) {
      const claim = ledger.entries.find((entry) => entry.id === question.id);
      if (!claim) throw new Error(`Missing claim ${question.id}`);
      expect(claim).toMatchObject({
        claim: question.text,
        answer: question.answer,
        aliases: question.aliases,
        initial: question.initial,
      });
      expect(new Set(claim.evidence.map((source) => source.url))).toEqual(
        new Set(question.sources),
      );
      for (const answer of [question.answer, ...question.aliases])
        expect(acceptsAnswer(question, answer)).toBe(true);
    }
  }
});

test('Computing scope renames only inherited pack titles, retaining original questions and difficulty evidence', () => {
  /** @type {{changes: {id: string, title: string, currentSha256: string,
   * unchangedQuestionsSha256: string}[]}} */
  const amendment = JSON.parse(
    readFileSync('docs/phase-11-computing-metadata.json', 'utf8'),
  );
  expect(amendment.changes.map((entry) => entry.id)).toEqual([
    'programming-cs-01',
    'programming-cs-02',
    'programming-en-01',
    'programming-en-02',
  ]);
  for (const entry of amendment.changes) {
    const bytes = readFileSync(`src/content/${entry.id}.json`);
    const pack = JSON.parse(bytes.toString());
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(
      entry.currentSha256,
    );
    expect(pack.title).toBe(entry.title);
    expect(
      createHash('sha256').update(JSON.stringify(pack.questions)).digest('hex'),
    ).toBe(entry.unchangedQuestionsSha256);
    expect(
      pack.questions.every(
        (/** @type {{category: string}} */ q) => q.category === 'programming',
      ),
    ).toBe(true);
    expect(pack.difficulty).toBe('hard');
  }
});
