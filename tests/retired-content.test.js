// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';
import { createGame } from '../src/domain/game.js';
import { validatePack } from '../src/domain/packs.js';
import { Recovery, GAME_KEY } from '../src/runtime/recovery.js';
import { config, savedGame } from './fixtures.js';

afterEach(() => localStorage.clear());

const retiredIds = [
  'entertainment-cs-01',
  'entertainment-cs-02',
  'entertainment-en-01',
  'entertainment-en-02',
];

test.each(retiredIds)(
  '%s remains byte-bound, importable and recoverable without a catalog registration',
  async (id) => {
    const bytes = readFileSync(`docs/retired/${id}.json`);
    const pack = validatePack(JSON.parse(bytes.toString()));
    /** @type {{packs: {id: string, archivePath: string, sha256: string}[]}} */
    const receipt = JSON.parse(
      readFileSync('docs/phase-11-entertainment-retirement.json', 'utf8'),
    );
    expect(receipt.packs.find((entry) => entry.id === id)).toMatchObject({
      archivePath: `docs/retired/${id}.json`,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
    expect(bundledPacks().some((current) => current.id === id)).toBe(false);
    const state = createGame(pack, config(), 1000, 'retired-original');
    const json = savedGame(state);
    localStorage.setItem(GAME_KEY, json);
    const recovery = new Recovery();
    try {
      expect(recovery.load(1500, 'retired-reload')?.pack).toEqual(pack);
      expect(localStorage.getItem(GAME_KEY)).toBe(json);
      expect(recovery.discardCurrent()).toBe(true);
      const imported = await recovery.import(
        { text: async () => json },
        () => 2000,
        () => 'retired-import',
      );
      expect(imported?.pack).toEqual(pack);
      expect(imported?.sessionId).toBe('retired-import');
    } finally {
      recovery.dispose();
    }
  },
);

test('retirement preserves the old US-title scope without narrowing the new regional-title scope', () => {
  const old = validatePack(
    JSON.parse(readFileSync('docs/retired/entertainment-en-02.json', 'utf8')),
  ).questions[27];
  const current = bundledPacks()
    .find((pack) => pack.id === 'movies-en-easy-01')
    ?.questions.find((question) => question.id === 'movies-en-easy-01-28');
  if (!current) throw new Error('Missing reviewed regional-title question');
  expect(old.text).toContain('US title');
  expect(acceptsAnswer(old, 'Zootopia')).toBe(true);
  expect(acceptsAnswer(old, 'Zootropolis')).toBe(false);
  expect(acceptsAnswer(current, 'Zootopia')).toBe(true);
  expect(acceptsAnswer(current, 'Zootropolis')).toBe(true);
});
