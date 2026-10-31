import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';
import { importPack } from '../src/domain/packs.js';

test('all 224 independently reviewed Politics additions bind exact pack bytes, claims and source evidence', () => {
  const bytes = readFileSync('docs/phase-11-politics-sources.json');
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(
    'b65e5e6b203b9231fa956d3db1de191206e3e8192d64385a6ea2a58a0b76c7ca',
  );
  /** @type {{packs: {id: string, sha256: string, entryIds: string[]}[],
   * entries: {id: string, claim: string, answer: string, aliases: string[],
   * initial: string, evidence: {url: string}[]}[]}} */
  const ledger = JSON.parse(bytes.toString());
  const additions = bundledPacks().filter((pack) =>
    /^politics-(cs|en)-(easy|medium|hard)-\d{2}$/.test(pack.id),
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
    ['politics-cs-easy-01-19', ['Republika'], ['Volební monarchie']],
    [
      'politics-cs-hard-02-06',
      ['Exekvatur', 'Konzulární exekvatur'],
      ['Agrément'],
    ],
    ['politics-cs-hard-02-10', ['Khan'], ['Sultán']],
    ['politics-cs-hard-02-11', ['Iredenta'], ['Anexe']],
    ['politics-en-easy-01-03', ['Council of ministers'], ['Parliament']],
    ['politics-en-easy-01-04', ['Chancellor of Germany'], ['President']],
    ['politics-en-easy-01-19', ['Republic'], ['Elective monarchy']],
    [
      'politics-en-easy-02-10',
      ['Swearing-in', 'Swearing in', 'Swearing-in ceremony'],
      ['Election'],
    ],
    ['politics-en-easy-02-15', ['Neutrality'], ['Non-belligerency']],
    ['politics-en-easy-02-16', ['Oath', 'Affirmation'], ['Manifesto']],
    [
      'politics-en-easy-02-18',
      ['Question period', 'Oral questions'],
      ['Referendum'],
    ],
    [
      'politics-en-easy-02-24',
      ['Vice president of the United States', 'VP', 'VPOTUS', 'Veep'],
      ['President'],
    ],
    [
      'politics-en-easy-02-28',
      ['Zapatista'],
      ['EZLN', 'Zapatista Army of National Liberation'],
    ],
    [
      'politics-en-medium-01-26',
      ['X-Article', 'The X-Article'],
      ['The Sources of Soviet Conduct'],
    ],
    [
      'politics-en-medium-01-27',
      ['French Yellow Book', 'Livre jaune'],
      ['Yellow Paper', 'French Yellow Paper'],
    ],
  ]),
)(
  '%s preserves reviewed finite answers and rejects different scopes',
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
