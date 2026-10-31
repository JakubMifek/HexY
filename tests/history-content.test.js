import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';
import { importPack } from '../src/domain/packs.js';

test('all 224 reviewed History entries retain exact claims, aliases, evidence and pack bytes', () => {
  const bytes = readFileSync('docs/phase-11-history-sources.json');
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(
    '77edfba0ed773273d36e5e5dcc41a87396a0ac4ef3e342b7b401373f1f81b7db',
  );
  /** @type {{packs: {id: string, sha256: string, entryIds: string[]}[],
   * entries: {id: string, claim: string, answer: string, aliases: string[],
   * initial: string, evidence: {url: string}[]}[]}} */
  const ledger = JSON.parse(bytes.toString());
  const additions = bundledPacks().filter((pack) =>
    /^history-(cs|en)-(easy|medium|hard)-\d{2}$/.test(pack.id),
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
      expect(claim.evidence.map((source) => source.url)).toEqual(
        question.sources,
      );
    }
  }
});

test.each(
  /** @type {const} */ ([
    ['history-en-medium-01-07', ['Feudal system'], ['Capitalism']],
    [
      'history-cs-hard-01-21',
      ['Sokol pražský', 'Pražská tělocvičná jednota Sokol'],
      ['Česká obec sokolská'],
    ],
    [
      'history-en-medium-01-28',
      ['Zululand', 'Kingdom of Zululand'],
      ['British Empire'],
    ],
  ]),
)(
  '%s accepts reviewed finite aliases without broadening context',
  (id, added, wrong) => {
    const pack = bundledPacks().find((pack) =>
      pack.questions.some((question) => question.id === id),
    );
    if (!pack) throw new Error(`Missing ${id}`);
    const question = pack.questions.find((question) => question.id === id);
    if (!question) throw new Error(`Missing ${id}`);
    for (const answer of [question.answer, ...question.aliases, ...added])
      expect(acceptsAnswer(question, answer)).toBe(true);
    for (const answer of wrong)
      expect(acceptsAnswer(question, answer)).toBe(false);
    expect(importPack(JSON.stringify(pack))).toEqual(pack);
  },
);
