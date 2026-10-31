import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';
import { generateNumbers } from '../src/domain/generation.js';
import { importPack } from '../src/domain/packs.js';

test('Geography authoring preserves the independently accepted Nature receipt bytes', () => {
  expect(
    createHash('sha256')
      .update(readFileSync('docs/phase-11-nature-sources.json'))
      .digest('hex'),
  ).toBe('56d4e21794ceda9bcdc7df27f40ce624c7c306dd20941b95e235c0a0aaf15e19');
});

test.each(
  /** @type {const} */ ([
    ['geography-cs-easy-01-03', ['Katánie', 'Catania'], 'Palermo'],
    ['geography-cs-easy-01-18', ['Paris', 'Paříž'], 'Lyon'],
    ['geography-cs-easy-02-18', ['Beijing', 'Pej-ťing'], 'Nanking'],
    [
      'geography-cs-easy-02-28',
      ['Genfersee', 'Genfer See', 'Lac de Genève'],
      'Bodamské jezero',
    ],
    [
      'geography-cs-medium-01-02',
      ['İstanbul Boğazı', 'Istanbul Bogazi'],
      'Dardanely',
    ],
    [
      'geography-cs-medium-01-05',
      ['Çanakkale Boğazı', 'Canakkale Bogazi'],
      'Bospor',
    ],
    [
      'geography-en-easy-01-04',
      ["People's Republic of China", 'People’s Republic of China'],
      'Taiwan',
    ],
    ['geography-en-easy-01-09', ['Hawaiʻi', "Hawai'i", 'Hawai’i'], 'Oʻahu'],
    [
      'geography-en-easy-02-18',
      ['Tāhuna', 'Queenstown, New Zealand'],
      'Queensland',
    ],
    [
      'geography-en-hard-01-16',
      ['great circle route', 'geodesic'],
      'loxodrome',
    ],
    ['geography-en-hard-01-18', ['karez', 'foggara', 'daoudi falaj'], 'falaj'],
  ]),
)(
  '%s retains scoped local names and explicit literal spelling variants',
  (id, accepted, rejected) => {
    const question = bundledPacks()
      .flatMap((pack) => pack.questions)
      .find((q) => q.id === id);
    if (!question) throw new Error(`Missing ${id}`);
    for (const answer of accepted)
      expect(acceptsAnswer(question, answer)).toBe(true);
    expect(acceptsAnswer(question, rejected)).toBe(false);
    expect(question.text).not.toMatch(/česky|starting with|one word/i);
  },
);

test.each(/** @type {const} */ (['cs', 'en']))(
  'Geography %s new-only numbers retain all actual difficulty levels and source identities',
  (language) => {
    const sources = bundledPacks().filter(
      (pack) =>
        pack.language === language &&
        /^geography-(cs|en)-(easy|medium|hard)-\d{2}$/.test(pack.id),
    );

    expect(sources).toHaveLength(4);
    const mixed = generateNumbers(
      sources,
      language,
      () => 0.41,
      'geography-mix',
      'Geography mix',
    );
    expect(mixed.difficulty).toEqual(['easy', 'medium', 'hard']);
    expect(new Set(mixed.questions.map((q) => q.difficulty))).toEqual(
      new Set(['easy', 'medium', 'hard']),
    );
    for (const question of mixed.questions) {
      const source = sources.find(
        (pack) => pack.id === question.origins?.[0].packId,
      );
      expect(source).toBeDefined();
      expect(question.difficulty).toBe(source?.difficulty);
      expect(question.category).toBe('geography');
      expect(source?.questions.find((q) => q.id === question.id)).toMatchObject(
        {
          text: question.text,
          answer: question.answer,
          aliases: question.aliases,
          sources: question.sources,
        },
      );
    }
    expect(importPack(JSON.stringify(mixed))).toEqual(mixed);
  },
);

test.each(
  /** @type {const} */ ([
    ['geography-en-easy-02-23', ['Great Britain', 'England']],
    ['geography-en-easy-01-19', ['artificial canal', 'canal']],
    ['geography-en-hard-01-14', ['till', 'glacial till']],
    ['geography-cs-hard-01-15', ['till', 'ledovcový sediment']],
    ['geography-en-hard-01-10', ['plain', 'plateau']],
  ]),
)(
  '%s preserves its complete finite accepted set and rejects %s',
  (id, wrong) => {
    const pack = bundledPacks().find((p) =>
      p.questions.some((q) => q.id === id),
    );
    const question = pack?.questions.find((q) => q.id === id);
    if (!question) throw new Error(`Missing ${id}`);
    for (const answer of [question.answer, ...question.aliases])
      expect(acceptsAnswer(question, answer)).toBe(true);
    for (const answer of wrong)
      expect(acceptsAnswer(question, answer)).toBe(false);
    expect(
      importPack(JSON.stringify(pack)).questions.find((q) => q.id === id),
    ).toEqual(question);
    if (id === 'geography-en-easy-02-23')
      expect(acceptsAnswer(question, 'Britain')).toBe(true);
    if (id === 'geography-en-easy-01-19')
      expect(acceptsAnswer(question, 'stream')).toBe(true);
  },
);

test('moraine clues ask for landforms of unsorted debris, not the material alone', () => {
  const questions = bundledPacks().flatMap((pack) => pack.questions);
  const english = questions.find((q) => q.id === 'geography-en-hard-01-14');
  const czech = questions.find((q) => q.id === 'geography-cs-hard-01-15');
  expect(english?.text).toBe(
    'What landform, often a ridge or mound, is made of unsorted debris transported and deposited by a glacier?',
  );
  expect(czech?.text).toBe(
    'Jak se nazývá terénní tvar, často val či pahorek, tvořený nevytříděnými úlomky hornin přenesenými a uloženými ledovcem?',
  );
  expect([english?.initial, czech?.initial]).toEqual(['M', 'M']);
});

test('both inselberg names fit the landform clue without a German-name restriction', () => {
  const question = bundledPacks()
    .flatMap((pack) => pack.questions)
    .find((q) => q.id === 'geography-en-hard-01-10');
  expect(question?.text).toBe(
    'What is an isolated rock hill rising abruptly from a surrounding plain called?',
  );
  expect(question?.aliases).toEqual(['monadnock']);
});
