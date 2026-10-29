import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { generateNumbers } from '../src/domain/generation.js';
import { ALPHABETS, acceptsAnswer } from '../src/domain/answers.js';
import { strings } from '../src/ui/strings.js';
import { validatePack, importPack } from '../src/domain/packs.js';
import { normalizeAnswer } from '../src/domain/answers.js';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

test.each(/** @type {const} */ (['cs', 'en']))(
  'complete original %s starter has fixed labels, unique facts and provenance',
  (language) => {
    const pack = bundledPacks()[language === 'cs' ? 0 : 1];
    expect(pack.questions).toHaveLength(28);
    expect(pack.questions.map((q) => q.initial)).toEqual(ALPHABETS[language]);
    expect(new Set(pack.questions.map((q) => q.id)).size).toBe(28);
    expect(new Set(pack.questions.map((q) => q.text)).size).toBe(28);
    expect(new Set(pack.questions.map((q) => q.answer)).size).toBe(28);
    for (const question of pack.questions) {
      expect(question.category).toBe('general');
      expect(
        question.sources.every((source) => source.startsWith('https://')),
      ).toBe(true);
      for (const answer of [question.answer, ...question.aliases]) {
        expect(
          acceptsAnswer(
            question,
            answer.toLowerCase().normalize('NFD').replace(/\p{M}/gu, ''),
          ),
        ).toBe(true);
      }
    }
  },
);

test('number preparation shuffles only its chosen starter and never mutates the fixed pack', () => {
  const original = bundledPacks()[1];
  const shuffled = generateNumbers(
    [original],
    'en',
    () => 0,
    'numbers',
    'Numbers',
  );
  expect(shuffled.mode).toBe('numbers');
  expect(shuffled.questions).not.toEqual(original.questions);
  expect(shuffled.questions.map((q) => q.id).sort()).toEqual(
    original.questions.map((q) => q.id).sort(),
  );
  expect(bundledPacks()[1]).toEqual(original);
});

test('all UI messages exist in both languages', () => {
  expect(Object.keys(strings.cs).sort()).toEqual(
    Object.keys(strings.en).sort(),
  );
  expect(Object.values(strings.cs).every(Boolean)).toBe(true);
  expect(strings.en.catalogHelp).toContain('36 fixed packs');
  expect(strings.cs.catalogHelp).toContain('36 pevných sad');
  expect(strings.en.limit).toContain('saved games recover');
  expect(strings.cs.limit).toContain(
    'uložená hra se po obnovení stránky obnoví',
  );
});

test('English B asks about erupted ridge lava, not the volume of the entire oceanic crust', () => {
  const question = bundledPacks()[1].questions[1];
  expect(question.id).toBe('general-en-01-02');
  expect(question.initial).toBe('B');
  expect(question.text).toBe(
    'Which dark, fine-grained volcanic rock typically forms when lava erupts and cools at mid-ocean ridges?',
  );
  expect(question.sources).toContain(
    'https://opentextbc.ca/physicalgeology2ed/chapter/18-2-the-geology-of-the-oceanic-crust/',
  );
  expect(acceptsAnswer(question, 'basalt')).toBe(true);
  expect(acceptsAnswer(question, 'gabbro')).toBe(false);
});

test('final inventory includes exactly two packs per category/language and every shipped JSON', () => {
  const packs = bundledPacks();
  expect(packs).toHaveLength(36);
  expect(packs.map((pack) => `${pack.id}.json`).sort()).toEqual(
    readdirSync('src/content')
      .filter((name) => name.endsWith('.json'))
      .sort(),
  );
  expect(new Set(packs.map((pack) => pack.id)).size).toBe(36);
  const questions = packs.flatMap((pack) => pack.questions);
  expect(questions).toHaveLength(1008);
  expect(new Set(questions.map((q) => q.id)).size).toBe(1008);
  for (const language of ['cs', 'en']) {
    const localized = questions.filter((q) => q.language === language);
    expect(new Set(localized.map((q) => normalizeAnswer(q.text))).size).toBe(
      504,
    );
    expect(new Set(localized.map((q) => normalizeAnswer(q.answer))).size).toBe(
      504,
    );
    for (const category of [
      'general',
      'nature',
      'geography',
      'history',
      'politics',
      'science',
      'programming',
      'arts',
      'entertainment',
    ]) {
      const matching = packs.filter(
        (pack) =>
          pack.language === language &&
          pack.questions.every((q) => q.category === category),
      );
      expect(matching).toHaveLength(2);
      expect(matching.map((pack) => pack.id).sort()).toEqual([
        `${category}-${language}-01`,
        `${category}-${language}-02`,
      ]);
    }
  }
});

test.each(bundledPacks().map((pack) => [pack.id, pack]))(
  '%s preserves fixed placement, valid answers, sources and export/number integration',
  (_id, value) => {
    const pack = validatePack(value);
    const before = structuredClone(pack);
    expect(pack.questions.map((q) => q.initial)).toEqual(
      ALPHABETS[pack.language],
    );
    expect(
      new Set(pack.questions.map((q) => normalizeAnswer(q.answer))).size,
    ).toBe(28);
    expect(pack.authors).toEqual(['HexY contributors']);
    expect(pack.license).toBe('CC BY 4.0');
    expect(importPack(JSON.stringify(pack))).toEqual(pack);
    for (const q of pack.questions) {
      expect(q.id).toMatch(new RegExp(`^${pack.id}-\\d{2}$`));
      expect(q.language).toBe(pack.language);
      for (const url of q.sources) expect(new URL(url).protocol).toBe('https:');
      for (const answer of [q.answer, ...q.aliases])
        expect(
          acceptsAnswer(q, `  ${normalizeAnswer(answer).toUpperCase()}  `),
        ).toBe(true);
    }
    const generated = generateNumbers(
      [pack],
      pack.language,
      () => 0.25,
      'generated',
      'Generated',
    );
    expect(new Set(generated.questions.map((q) => q.id))).toEqual(
      new Set(pack.questions.map((q) => q.id)),
    );
    expect(
      generated.questions.every((q) => q.origins?.[0].packId === pack.id),
    ).toBe(true);
    expect(importPack(JSON.stringify(generated))).toEqual(generated);
    expect(pack).toEqual(before);
    expect(
      JSON.parse(readFileSync(`src/content/${pack.id}.json`, 'utf8')),
    ).toEqual(pack);
  },
);

test('mixed-category number games include only explicitly selected same-language content', () => {
  const sources = bundledPacks().filter((pack) =>
    ['nature-en-02', 'geography-en-02'].includes(pack.id),
  );
  const generated = generateNumbers(sources, 'en', () => 0.5, 'mix', 'Mix');
  const ids = new Set(
    sources.flatMap((pack) => pack.questions.map((q) => q.id)),
  );
  expect(generated.questions).toHaveLength(28);
  expect(new Set(generated.questions.map((q) => q.id)).size).toBe(28);
  expect(generated.questions.every((q) => ids.has(q.id))).toBe(true);
  expect(new Set(generated.questions.map((q) => q.category))).toEqual(
    new Set(['nature', 'geography']),
  );
});

test.each(/** @type {const} */ (['cs', 'en']))(
  'final %s catalog and old/new selections preserve every chosen question and origin',
  (language) => {
    const available = bundledPacks().filter(
      (pack) => pack.language === language,
    );
    for (const sources of [
      available,
      available.filter((pack) =>
        ['general', 'programming', 'arts', 'entertainment'].some(
          (category) => pack.id === `${category}-${language}-02`,
        ),
      ),
    ]) {
      const original = structuredClone(sources);
      const generated = generateNumbers(
        sources,
        language,
        () => 0.41,
        'mix',
        'Mix',
      );
      expect(generated.questions).toHaveLength(28);
      expect(new Set(generated.questions.map((q) => q.id)).size).toBe(28);
      for (const question of generated.questions) {
        const source = sources.find(
          (pack) => pack.id === question.origins?.[0].packId,
        );
        const originalQuestion = source?.questions.find(
          (q) => q.id === question.id,
        );
        if (!originalQuestion) throw new Error(`Missing ${question.id}`);
        expect(question).toMatchObject(originalQuestion);
        expect(question.origins?.[0]).toMatchObject({
          authors: ['HexY contributors'],
          license: 'CC BY 4.0',
        });
      }
      expect(importPack(JSON.stringify(generated))).toEqual(generated);
      expect(sources).toEqual(original);
    }
  },
);

test('P7-01 asks for the publishing surname rather than the author identity', () => {
  const pack = bundledPacks().find((pack) => pack.id === 'arts-en-01');
  const question = pack?.questions[15];
  if (!question) throw new Error('Missing arts-en-01-16');
  expect(question.id).toBe('arts-en-01-16');
  expect(question.initial).toBe('O');
  expect(question.text).toBe(
    'Under which surname did Eric Arthur Blair publish Animal Farm and Nineteen Eighty-Four?',
  );
  expect(question.answer).toBe('Orwell');
  expect(question.aliases).toEqual(['George Orwell']);
  for (const answer of ['Orwell', 'George Orwell', ' george   orwell '])
    expect(acceptsAnswer(question, answer)).toBe(true);
  for (const answer of ['Eric Arthur Blair', 'Eric Blair', 'Blair'])
    expect(acceptsAnswer(question, answer)).toBe(false);
  expect(normalizeAnswer(question.text)).not.toContain('orwell');
});

test('phase-seven language-specific titles and terms reject disclosed or out-of-scope aliases', () => {
  const questions = bundledPacks().flatMap((pack) => pack.questions);
  const scopes = /** @type {const} */ ([
    ['entertainment-en-02-28', 'Zootopia', ['Zootropolis']],
    ['entertainment-cs-02-11', 'Inception', ['Počátek']],
    ['entertainment-cs-02-24', 'Up', ['Vzhůru do oblak']],
    ['entertainment-cs-01-26', 'WALL·E', ['VALL-I']],
    ['programming-cs-01-02', 'Boolean', ['logický typ']],
    ['programming-cs-01-06', 'Enumerace', ['výčtový typ']],
  ]);
  for (const [id, accepted, rejected] of scopes) {
    const question = questions.find((q) => q.id === id);
    if (!question) throw new Error(`Missing ${id}`);
    expect(acceptsAnswer(question, accepted)).toBe(true);
    for (const answer of rejected)
      expect(acceptsAnswer(question, answer)).toBe(false);
  }
});

test('phase-seven clues avoid embedded identifier giveaways and reciprocal vocabulary examples', () => {
  const questions = bundledPacks().flatMap((pack) => pack.questions);
  for (const [id, forbidden] of [
    ['programming-en-02-28', '.zig'],
    ['programming-en-02-01', 'AssertionError'],
    ['programming-en-02-26', 'extensible markup language'],
    ['programming-cs-01-15', 'import'],
    ['programming-en-02-12', 'return'],
    ['programming-en-01-07', 'return'],
  ]) {
    const question = questions.find((q) => q.id === id);
    if (!question) throw new Error(`Missing ${id}`);
    expect(normalizeAnswer(question.text)).not.toContain(
      normalizeAnswer(forbidden),
    );
  }
  const film = questions.find((q) => q.id === 'entertainment-cs-02-20');
  expect(film?.text).toContain('2019');
  expect(film?.text).not.toContain('1989');
});

test('new questions do not literally supply any automatically accepted answer', () => {
  const starters = new Set(['general-cs-01', 'general-en-01']);
  for (const pack of bundledPacks().filter((pack) => !starters.has(pack.id))) {
    for (const question of pack.questions) {
      const prompt = normalizeAnswer(question.text);
      const accepted = [question.answer, ...question.aliases].map(
        normalizeAnswer,
      );
      expect(new Set(accepted).size, question.id).toBe(accepted.length);
      for (const answer of accepted) {
        const literal = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        expect(
          new RegExp(`(^|[^\\p{L}])${literal}([^\\p{L}]|$)`, 'u').test(prompt),
          `${question.id}: ${answer}`,
        ).toBe(false);
      }
    }
  }
});

test('phase-six resistor clue does not accept the inflected property disclosed in its prompt', () => {
  const question = bundledPacks()
    .flatMap((pack) => pack.questions)
    .find((q) => q.id === 'science-cs-01-19');
  if (!question) throw new Error('Missing resistor question');
  expect(question.text).toContain('odporu');
  expect(acceptsAnswer(question, 'rezistor')).toBe(true);
  expect(acceptsAnswer(question, 'odpor')).toBe(false);
});

test.each([
  {
    id: 'politics-cs-02-06',
    canonical: 'Exekutiva',
    aliases: [],
    rejected: ['výkonná moc'],
    clue: 'výkonnou složku státní moci',
  },
  {
    id: 'history-en-01-23',
    canonical: 'U-boat',
    aliases: ['U boat'],
    rejected: ['Unterseeboot'],
    clue: 'What English term',
  },
  {
    id: 'politics-en-02-14',
    canonical: 'Motion of no confidence',
    aliases: ['no-confidence motion'],
    rejected: ['Motion of confidence', 'vote of no confidence'],
    clue: "no longer has the legislature's support to remain in office",
  },
  {
    id: 'history-cs-01-26',
    canonical: 'Washington',
    aliases: ['George Washington'],
    rejected: ['Westfálský mír', 'Vestfálský mír'],
    clue: 'prvním prezidentem Spojených států amerických',
  },
])(
  'P6 review correction $id accepts only answers in the revised scope',
  (entry) => {
    const question = bundledPacks()
      .flatMap((pack) => pack.questions)
      .find((q) => q.id === entry.id);
    if (!question) throw new Error(`Missing ${entry.id}`);
    for (const answer of [entry.canonical, ...entry.aliases])
      expect(acceptsAnswer(question, answer)).toBe(true);
    for (const answer of entry.rejected)
      expect(acceptsAnswer(question, answer)).toBe(false);
    expect(question.answer).toBe(entry.canonical);
    expect(question.aliases).toEqual(entry.aliases);
    expect(question.text).toContain(entry.clue);
    expect(question.initial).toBe(entry.canonical[0]);
  },
);

test('source evidence covers every shipped entry and the exact authored files', () => {
  const evidence = readFileSync('docs/content-sources.md', 'utf8');
  const rows = evidence
    .split('\n')
    .filter((line) => line.startsWith('- `') && line.includes('` — **'));
  expect(rows).toHaveLength(1008);
  for (const pack of bundledPacks()) {
    const digest = createHash('sha256')
      .update(readFileSync(`src/content/${pack.id}.json`))
      .digest('hex');
    expect(evidence, pack.id).toContain(digest);
    for (const question of pack.questions) {
      const matching = rows.filter((row) =>
        row.startsWith(`- \`${question.id}\` —`),
      );
      expect(matching, question.id).toHaveLength(1);
      expect(matching[0]).toContain(
        `\`${question.id}\` — **${question.answer}** (\`${question.initial}\`)`,
      );
      for (const source of question.sources)
        expect(matching[0], question.id).toContain(source);
    }
  }
});

test('P5-R1 asks for the lichen community rather than its symbiotic relationship', () => {
  const question = bundledPacks()
    .flatMap((pack) => pack.questions)
    .find((q) => q.id === 'nature-cs-01-14');
  if (!question) throw new Error('Missing lichen question');
  expect(question?.text).toContain('společenství houby a řasy nebo sinice');
  expect(question?.text).toContain('vytváří společnou stélku');
  expect(question?.text).not.toContain('soužití');
  expect(acceptsAnswer(question, 'Lišejník')).toBe(true);
  expect(acceptsAnswer(question, 'lichenismus')).toBe(false);
});

test.each([
  ['general-cs-02-08', 'Gól', ['branka']],
  [
    'general-en-02-24',
    'Velcro',
    ['hook-and-loop fastener', 'hook and loop fastener'],
  ],
])(
  'P5-R2 %s rejects answers outside its requested word scope',
  (id, answer, rejected) => {
    const question = bundledPacks()
      .flatMap((pack) => pack.questions)
      .find((q) => q.id === id);
    if (!question) throw new Error(`Missing ${id}`);
    expect(acceptsAnswer(question, answer)).toBe(true);
    for (const alias of rejected)
      expect(acceptsAnswer(question, alias)).toBe(false);
  },
);

test('P5-R4 does not give away the Rhine through the declined city name', () => {
  const question = bundledPacks()
    .flatMap((pack) => pack.questions)
    .find((q) => q.id === 'geography-cs-01-19');
  if (!question) throw new Error('Missing Rhine question');
  expect(question?.text).toContain('Kolínem v Německu');
  expect(question?.text).not.toContain('Rýnem');
  expect(acceptsAnswer(question, 'Rýn')).toBe(true);
  expect(acceptsAnswer(question, 'Rhein')).toBe(true);
});
