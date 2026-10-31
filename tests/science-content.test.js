import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';
import { importPack } from '../src/domain/packs.js';

test('all 224 independently reviewed Science additions bind exact pack bytes, claims and source evidence', () => {
  const bytes = readFileSync('docs/phase-11-science-sources.json');
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(
    '72d14967cfc1d65ad15622270a94c52fd561172a7e49d406eb657bdb0b5bcf5a',
  );
  /** @type {{packs: {id: string, sha256: string, entryIds: string[]}[],
   * entries: {id: string, claim: string, answer: string, aliases: string[],
   * initial: string, evidence: {url: string}[]}[]}} */
  const ledger = JSON.parse(bytes.toString());
  const additions = bundledPacks().filter((pack) =>
    /^science-(cs|en)-(easy|medium|hard)-\d{2}$/.test(pack.id),
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
    }
  }
});

test.each(
  /** @type {const} */ ([
    ['science-cs-medium-01-04', ['Hřídelový čep'], ['Čárový kód']],
    ['science-cs-hard-01-19', ['Ramanův jev'], ['Brillouinův rozptyl']],
    ['science-en-easy-01-27', ['International yard', 'yd'], ['Yarn']],
    [
      'science-cs-easy-02-28',
      ['Žárové pozinkování'],
      ['Elektrolytické zinkování'],
    ],
    [
      'science-en-easy-02-18',
      ['Caustic lime', 'Calcia', 'Oxide of calcium'],
      ['Calcium hydroxide'],
    ],
    ['science-en-medium-02-12', ['kW h', 'kW⋅h', 'kW·h'], ['Kilowatt']],
    [
      'science-en-medium-02-21',
      ['Shunt resistor', 'Ammeter shunt'],
      ['Resistor'],
    ],
  ]),
)(
  '%s preserves reviewed finite answers and rejects different concepts',
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
