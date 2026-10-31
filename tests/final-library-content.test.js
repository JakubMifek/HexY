import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';

test.each(
  /** @type {const} */ ([
    ['programming', 8, 224],
    ['games', 12, 336],
    ['movies', 12, 336],
    ['sports', 12, 336],
  ]),
)(
  '%s final additions preserve every reviewed claim and pack binding',
  (category, count, entries) => {
    /** @type {{packs: {id: string, sha256: string, entryIds: string[]}[],
     * entries: {id: string, claim: string, answer: string, aliases: string[],
     * initial: string, evidence: {url: string}[]}[]}} */
    const ledger = JSON.parse(
      readFileSync(`docs/phase-11-${category}-sources.json`, 'utf8'),
    );
    const packs = bundledPacks().filter(
      (pack) =>
        pack.questions[0].category === category &&
        new RegExp(`^${category}-(cs|en)-(easy|medium|hard)-\\d{2}$`).test(
          pack.id,
        ),
    );
    expect(packs).toHaveLength(count);
    expect(ledger.packs).toHaveLength(count);
    expect(ledger.entries).toHaveLength(entries);
    expect(ledger.entries.map((entry) => entry.id).sort()).toEqual(
      packs.flatMap((pack) => pack.questions.map((q) => q.id)).sort(),
    );
    for (const pack of packs) {
      const binding = ledger.packs.find((entry) => entry.id === pack.id);
      if (!binding) throw new Error(`Missing receipt ${pack.id}`);
      expect(binding.sha256).toBe(
        createHash('sha256')
          .update(readFileSync(`src/content/${pack.id}.json`))
          .digest('hex'),
      );
      expect(binding.entryIds).toEqual(pack.questions.map((q) => q.id));
      for (const question of pack.questions) {
        const entry = ledger.entries.find((item) => item.id === question.id);
        if (!entry) throw new Error(`Missing claim ${question.id}`);
        expect(entry).toMatchObject({
          claim: question.text,
          answer: question.answer,
          aliases: question.aliases,
          initial: question.initial,
        });
        expect(new Set(entry.evidence.map((source) => source.url))).toEqual(
          new Set(question.sources),
        );
      }
    }
  },
);

test.each([
  ['games-cs-medium-02-10', 'Vláďa Chvátil'],
  ['games-cs-hard-02-03', 'Caverna: Sedláci z jeskyní'],
  ['movies-cs-easy-02-23', 'Tom and Jerry'],
  ['movies-cs-hard-02-04', 'Černá kočka bílý kocour'],
  ['movies-cs-hard-02-04', 'Crna mačka beli mačor'],
  ['movies-cs-hard-02-04', 'Black Cat White Cat'],
  ['movies-cs-hard-02-05', 'Dekalog:The Ten Commandments'],
  ['movies-cs-hard-02-15', 'Mulholland Dr'],
])('%s accepts independently corrected finite form %s', (id, answer) => {
  const question = bundledPacks()
    .flatMap((pack) => pack.questions)
    .find((question) => question.id === id);
  if (!question) throw new Error(`Missing ${id}`);
  expect(acceptsAnswer(question, answer)).toBe(true);
});

test('Computing GitHub clue identifies the sourced Octocat instead of also describing GitLab', () => {
  const question = bundledPacks()
    .find((pack) => pack.id === 'programming-en-medium-02')
    ?.questions.find(
      (question) => question.id === 'programming-en-medium-02-08',
    );
  if (!question) throw new Error('Missing GitHub question');
  expect(question.text).toContain('Octocat');
  expect(acceptsAnswer(question, 'GitHub.com')).toBe(true);
  expect(acceptsAnswer(question, 'GitLab')).toBe(false);
});

test('Sports uses the native Czech skating event name, not tennis singles terminology', () => {
  const question = bundledPacks()
    .find((pack) => pack.id === 'sports-cs-hard-02')
    ?.questions.find((question) => question.id === 'sports-cs-hard-02-22');
  if (!question) throw new Error('Missing Olympic skating question');
  expect(question.text).toContain('soutěž žen');
  expect(question.text).not.toContain('dvouhru');
});
