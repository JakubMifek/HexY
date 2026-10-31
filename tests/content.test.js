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
  expect(strings.en.catalogHelp).toContain('132 fixed packs');
  expect(strings.cs.catalogHelp).toContain('132 pevných sad');
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

test('complete inventory includes eleven category quotas and every shipped JSON', () => {
  const packs = bundledPacks();
  expect(packs).toHaveLength(132);
  expect(packs.map((pack) => `${pack.id}.json`).sort()).toEqual(
    readdirSync('src/content')
      .filter((name) => name.endsWith('.json'))
      .sort(),
  );
  expect(new Set(packs.map((pack) => pack.id)).size).toBe(132);
  const questions = packs.flatMap((pack) => pack.questions);
  expect(questions).toHaveLength(3696);
  expect(new Set(questions.map((q) => q.id)).size).toBe(3696);
  for (const language of ['cs', 'en']) {
    const localized = questions.filter((q) => q.language === language);
    expect(new Set(localized.map((q) => normalizeAnswer(q.text))).size).toBe(
      1848,
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
      'games',
      'movies',
      'sports',
    ]) {
      const matching = packs.filter(
        (pack) =>
          pack.language === language &&
          pack.questions.every((q) => q.category === category),
      );
      expect(matching).toHaveLength(6);
    }
  }
});

test.each(
  /** @type {const} */ ([
    [
      'cs',
      [
        ['arts-cs-hard-02-04', 'sports-cs-hard-01-04'],
        ['arts-cs-hard-02-20', 'sports-cs-medium-02-20'],
        ['games-cs-easy-01-06', 'sports-cs-medium-02-06'],
        ['games-cs-medium-02-20', 'movies-cs-hard-02-20'],
        ['general-cs-01-20', 'movies-cs-easy-01-20', 'sports-cs-easy-01-20'],
        ['general-cs-02-14', 'programming-cs-easy-02-14'],
        ['general-cs-02-27', 'programming-cs-easy-02-27'],
        ['general-cs-easy-01-06', 'sports-cs-easy-02-06'],
        ['general-cs-easy-01-24', 'movies-cs-medium-01-24'],
        ['geography-cs-01-15', 'movies-cs-easy-02-15'],
        ['geography-cs-01-20', 'politics-cs-easy-01-20'],
        ['geography-cs-01-28', 'politics-cs-easy-02-28'],
        ['geography-cs-easy-01-07', 'politics-cs-easy-02-07'],
        ['geography-cs-easy-02-22', 'politics-cs-easy-02-22'],
        ['geography-cs-easy-02-26', 'politics-cs-easy-02-26'],
        ['games-cs-medium-01-10', 'nature-cs-01-10'],
        ['nature-cs-01-01', 'sports-cs-hard-01-01'],
        ['programming-cs-01-22', 'programming-cs-easy-02-22'],
        ['programming-cs-02-08', 'science-cs-easy-01-08'],
        ['programming-cs-easy-02-07', 'science-cs-easy-01-07'],
        ['games-cs-medium-01-20', 'science-cs-easy-01-20'],
      ],
    ],
    [
      'en',
      [
        ['arts-en-02-27', 'politics-en-medium-01-27'],
        ['games-en-easy-01-01', 'sports-en-medium-02-01'],
        ['games-en-easy-01-12', 'politics-en-easy-01-12'],
        ['games-en-easy-01-18', 'politics-en-easy-01-18'],
        ['games-en-hard-02-18', 'movies-en-medium-01-18'],
        ['games-en-medium-01-13', 'programming-en-easy-02-13'],
        ['games-en-medium-02-10', 'politics-en-medium-01-10'],
        ['general-en-medium-01-18', 'programming-en-medium-02-18'],
        ['general-en-medium-01-21', 'politics-en-medium-02-21'],
        ['geography-en-01-14', 'movies-en-easy-01-14'],
        ['geography-en-02-27', 'movies-en-easy-01-27'],
        [
          'geography-en-easy-01-26',
          'politics-en-easy-01-26',
          'programming-en-easy-01-26',
        ],
        ['geography-en-easy-02-04', 'movies-en-medium-01-04'],
        ['nature-en-easy-01-02', 'sports-en-medium-02-02'],
        ['programming-en-01-27', 'science-en-medium-01-27'],
        ['programming-en-02-08', 'science-en-easy-02-08'],
        ['science-en-easy-01-09', 'sports-en-hard-01-09'],
      ],
    ],
  ]),
)(
  '%s shared canonicals are only exact independently reviewed distinct facts or senses',
  (language, expected) => {
    /** @type {Map<string, string[]>} */
    const groups = new Map();
    for (const question of bundledPacks().flatMap((pack) => pack.questions)) {
      if (question.language !== language) continue;
      const key = normalizeAnswer(question.answer);
      const ids = groups.get(key) ?? [];
      ids.push(question.id);
      groups.set(key, ids);
    }
    expect(
      [...groups.values()]
        .filter((ids) => ids.length > 1)
        .map((ids) => ids.sort())
        .sort(),
    ).toEqual(expected.map((ids) => [...ids].sort()).sort());
  },
);

test.each([
  ['general', 'cs'],
  ['general', 'en'],
  ['nature', 'cs'],
  ['nature', 'en'],
  ['geography', 'cs'],
  ['geography', 'en'],
  ['history', 'cs'],
  ['history', 'en'],
  ['science', 'cs'],
  ['science', 'en'],
  ['politics', 'cs'],
  ['politics', 'en'],
  ['arts', 'cs'],
  ['arts', 'en'],
  ['programming', 'cs'],
  ['programming', 'en'],
  ['games', 'cs'],
  ['games', 'en'],
  ['movies', 'cs'],
  ['movies', 'en'],
  ['sports', 'cs'],
  ['sports', 'en'],
])(
  '%s %s has exactly two authored decks at every adult difficulty',
  (category, language) => {
    const packs = bundledPacks().filter(
      (pack) =>
        pack.language === language &&
        pack.questions.every((q) => q.category === category),
    );
    expect(packs.flatMap((pack) => pack.questions)).toHaveLength(168);
    for (const difficulty of ['easy', 'medium', 'hard'])
      expect(
        packs.filter((pack) => pack.difficulty === difficulty),
      ).toHaveLength(2);
  },
);

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
        [
          `general-${language}-02`,
          `programming-${language}-02`,
          `arts-${language}-02`,
          `games-${language}-easy-02`,
          `movies-${language}-easy-02`,
          `sports-${language}-easy-02`,
        ].includes(pack.id),
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
  const questions = [
    ...bundledPacks(),
    ...readdirSync('docs/retired').map((name) =>
      validatePack(JSON.parse(readFileSync(`docs/retired/${name}`, 'utf8'))),
    ),
  ].flatMap((pack) => pack.questions);
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
  const film = validatePack(
    JSON.parse(readFileSync('docs/retired/entertainment-cs-02.json', 'utf8')),
  ).questions[19];
  expect(film.id).toBe('entertainment-cs-02-20');
  expect(film.text).toContain('2019');
  expect(film.text).not.toContain('1989');
});

test.each(
  bundledPacks().filter(
    (pack) => !['general-cs-01', 'general-en-01'].includes(pack.id),
  ),
)('$id does not literally supply any automatically accepted answer', (pack) => {
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

test('historical source evidence covers 32 retained and four exact archived packs', () => {
  const evidence = readFileSync('docs/content-sources.md', 'utf8');
  const rows = evidence
    .split('\n')
    .filter((line) => line.startsWith('- `') && line.includes('` — **'));
  expect(rows).toHaveLength(1008);
  const historical = JSON.parse(
    readFileSync('docs/phase-11-classification.json', 'utf8'),
  );
  const retained = bundledPacks().filter((pack) =>
    historical.packs.some(
      (/** @type {{id: string}} */ entry) => entry.id === pack.id,
    ),
  );
  expect(retained).toHaveLength(32);
  const retired = readdirSync('docs/retired').map((name) =>
    validatePack(JSON.parse(readFileSync(`docs/retired/${name}`, 'utf8'))),
  );
  expect(retired).toHaveLength(4);
  for (const pack of [...retained, ...retired]) {
    const path = `${retired.includes(pack) ? 'docs/retired' : 'src/content'}/${pack.id}.json`;
    const digest = createHash('sha256')
      .update(readFileSync(path))
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

/** @param {{fetchedAt:string, passage:string, sourceTextSha256:string, sourceBodySha256?:string}[]} evidence
 * @param {string} category */
function checkInspectedEvidence(evidence, category) {
  for (const source of evidence) {
    expect(source.fetchedAt).toMatch(/^2026-10-30T/);
    expect(source.passage.length).toBeGreaterThan(30);
    expect(source.passage).not.toContain('MISSING');
    expect(source.passage).not.toContain('nebyl nalezen');
    expect(source.sourceTextSha256).toMatch(/^[a-f0-9]{64}$/);
    if (['nature', 'geography'].includes(category))
      expect(source.sourceBodySha256).toMatch(/^[a-f0-9]{64}$/);
  }
}

const geographyCorrectionIds = [
  'geography-en-easy-02-23',
  'geography-en-easy-01-19',
  'geography-en-hard-01-14',
  'geography-cs-hard-01-15',
  'geography-en-hard-01-10',
];

test.each(['general', 'nature', 'geography'])(
  '%s source evidence covers exactly 224 shipped IDs, claims, aliases, URLs and pack hashes',
  (category) => {
    const ledger = JSON.parse(
      readFileSync(`docs/phase-11-${category}-sources.json`, 'utf8'),
    );
    const added = bundledPacks().filter((pack) =>
      new RegExp(`^${category}-(cs|en)-(easy|medium|hard)-\\d{2}$`).test(
        pack.id,
      ),
    );
    expect(added).toHaveLength(8);
    expect(ledger.packs).toHaveLength(8);
    expect(ledger.entries).toHaveLength(224);
    expect(
      ledger.entries
        .map((/** @type {{id: string}} */ entry) => entry.id)
        .sort(),
    ).toEqual(added.flatMap((pack) => pack.questions.map((q) => q.id)).sort());
    for (const pack of added) {
      const receipt = ledger.packs.find(
        (/** @type {{id: string}} */ entry) => entry.id === pack.id,
      );
      expect(receipt.sha256).toBe(
        createHash('sha256')
          .update(readFileSync(`src/content/${pack.id}.json`))
          .digest('hex'),
      );
      expect(receipt.entryIds).toEqual(pack.questions.map((q) => q.id));
      expect(receipt.language).toBe(pack.language);
      expect(receipt.difficulty).toBe(pack.difficulty);
      if (['nature', 'geography'].includes(category))
        expect(readFileSync('docs/content-sources.md', 'utf8')).toContain(
          receipt.sha256,
        );
      for (const question of pack.questions) {
        const entry = ledger.entries.find(
          (/** @type {{id: string}} */ entry) => entry.id === question.id,
        );
        expect(entry.claim).toBe(question.text);
        expect(entry.answer).toBe(question.answer);
        expect(entry.initial).toBe(question.initial);
        expect(entry.aliases).toEqual(question.aliases);
        expect(entry.reviewStatus).toBe(
          geographyCorrectionIds.includes(question.id)
            ? 'developer-corrected P11-GEO-R1–R4; independent narrow recheck pending'
            : 'developer-inspected; independent review pending',
        );
        expect(
          entry.evidence.map(
            (/** @type {{url: string}} */ source) => source.url,
          ),
        ).toEqual(question.sources);
        checkInspectedEvidence(entry.evidence, category);
      }
    }
  },
);

test('accepted General source ledger remains byte-identical through Nature authoring', () => {
  expect(
    createHash('sha256')
      .update(readFileSync('docs/phase-11-general-sources.json'))
      .digest('hex'),
  ).toBe('d7c67ea8e4a92760ebaf3636f0e9ebded8aa8c54690a1852426687ad5c058a2b');
});

test.each(/** @type {const} */ (['cs', 'en']))(
  'Nature %s new-only mixtures retain actual source levels, never introduce Medium in English',
  (language) => {
    const sources = bundledPacks().filter(
      (pack) =>
        pack.language === language &&
        /^nature-(cs|en)-(easy|medium|hard)-\d{2}$/.test(pack.id),
    );
    expect(sources).toHaveLength(4);
    const mixed = generateNumbers(
      sources,
      language,
      () => 0.41,
      'nature-mix',
      'Nature mix',
    );
    const actualLevels = ['easy', 'medium', 'hard'].filter((level) =>
      mixed.questions.some((q) => q.difficulty === level),
    );
    expect(mixed.difficulty).toEqual(actualLevels);
    expect(actualLevels).toEqual(
      language === 'cs' ? ['easy', 'medium', 'hard'] : ['easy', 'hard'],
    );
    for (const question of mixed.questions) {
      const source = sources.find(
        (pack) => pack.id === question.origins?.[0].packId,
      );
      expect(source).toBeDefined();
      expect(question.difficulty).toBe(source?.difficulty);
      expect(question.category).toBe('nature');
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

test.each([
  {
    id: 'general-cs-medium-01-16',
    canonical: 'Numismatika',
    variants: ['numizmatika'],
    wrong: 'notafilie',
  },
  {
    id: 'general-cs-hard-02-18',
    canonical: 'Pendentiv',
    variants: ['pandantiv', 'pandántiv'],
    wrong: 'tambur',
  },
  {
    id: 'general-en-hard-01-07',
    canonical: 'Foucault pendulum',
    variants: ["Foucault's pendulum", 'Foucault’s pendulum'],
    wrong: 'gyroscope',
  },
  {
    id: 'general-en-hard-01-16',
    canonical: 'Ogham',
    variants: ['ogam'],
    wrong: 'runes',
  },
  {
    id: 'general-en-hard-02-21',
    canonical: 'Shekel',
    variants: ['sheqel'],
    wrong: 'dinar',
  },
  {
    id: 'general-en-hard-02-26',
    canonical: 'Xebec',
    variants: ['chebec', 'zebec'],
    wrong: 'galley',
  },
  {
    id: 'general-cs-easy-01-13',
    canonical: 'Kolo',
    variants: ['jízdní kolo', 'bicykl'],
    wrong: 'koloběžka',
  },
  {
    id: 'general-en-hard-01-09',
    canonical: 'Hapax legomenon',
    variants: ['hapax'],
    wrong: 'dis legomenon',
  },
])(
  'P11-GR1/GR2 $id accepts scoped equivalents, not a wrong concept',
  (entry) => {
    const question = bundledPacks()
      .flatMap((pack) => pack.questions)
      .find((q) => q.id === entry.id);
    if (!question) throw new Error(`Missing ${entry.id}`);
    expect(question.answer).toBe(entry.canonical);
    for (const answer of [entry.canonical, ...entry.variants]) {
      expect(acceptsAnswer(question, answer), answer).toBe(true);
      expect(acceptsAnswer(question, `  ${answer.toUpperCase()}  `)).toBe(true);
    }
    expect(acceptsAnswer(question, entry.wrong)).toBe(false);
  },
);

test.each([
  ['general-cs-easy-01-13', 'jedním slovem', 'jednostopému'],
  ['general-en-hard-01-09', 'two-word', 'only once'],
])(
  'P11-GR2 %s removes only the contradictory word-count qualifier',
  (id, restriction, concept) => {
    const question = bundledPacks()
      .flatMap((pack) => pack.questions)
      .find((q) => q.id === id);
    if (!question) throw new Error(`Missing ${id}`);
    expect(question.text).not.toContain(restriction);
    expect(question.text).toContain(concept);
  },
);

test.each([
  [
    'general-cs-medium-01-16',
    'numizmatika',
    '8cc141cc05c1673687ea84f75e1f32ecfdd93c21457dd84f77749f3359571184',
  ],
  [
    'general-cs-hard-02-18',
    'pandantiv',
    'ea242495c8b0df2c69ee7017a611deabfb742ced7583342125f56c0d0408b958',
  ],
  [
    'general-en-hard-01-07',
    "Foucault's pendulum is a simple device",
    '3ebe7cce794fa4a6b780791a5fb02967663e3da13a284eebd9ae68914c93be9b',
  ],
  [
    'general-en-hard-01-16',
    'also ogam',
    '8258731a4f2bff36c614ff8494be69e936beb367b3870179a3466545e2b56ea5',
  ],
  [
    'general-en-hard-02-21',
    'A shekel or sheqel',
    'abd8885dfe60387a4a55a700bc89ac522fb5e48607a1d5f2d85638d5081b3e92',
  ],
  [
    'general-en-hard-02-26',
    'also spelled zebec',
    'cdf239e7221deccb8ace364e772ccc8072ba22a63d8b9e93d5f5612a2e080d3d',
  ],
])(
  'P11-GR1 %s binds the naming passage to the reviewed source body',
  (id, naming, digest) => {
    const ledger = JSON.parse(
      readFileSync('docs/phase-11-general-sources.json', 'utf8'),
    );
    const entry = ledger.entries.find(
      (/** @type {{id: string}} */ row) => row.id === id,
    );
    expect(entry.evidence[0].passage).toContain(naming);
    expect(entry.evidence[0].sourceTextSha256).toBe(digest);
  },
);

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
