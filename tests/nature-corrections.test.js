import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { acceptsAnswer } from '../src/domain/answers.js';
import { importPack } from '../src/domain/packs.js';

const corrections = [
  {
    id: 'nature-cs-easy-01-02',
    variants: ['bříza bradavičnatá', 'bříza bílá'],
    wrong: ['buk', 'břízabradavičnatá'],
    naming: 'také bříza bradavičnatá nebo bříza bílá',
  },
  {
    id: 'nature-cs-easy-01-04',
    variants: ['česnek setý'],
    wrong: ['cibule', 'česneksetý'],
    naming: 'též česnek setý',
  },
  {
    id: 'nature-cs-easy-02-02',
    variants: ['sosna'],
    wrong: ['smrk'],
    naming: 'též sosna',
  },
  {
    id: 'nature-cs-easy-02-10',
    variants: ['špargl'],
    wrong: ['pórek'],
    naming: 'lidově též „špargl“',
  },
  {
    id: 'nature-cs-medium-01-03',
    variants: ['celulosa'],
    wrong: ['škrob'],
    naming: 'chemický název celulosa',
  },
  {
    id: 'nature-en-easy-01-03',
    variants: ['cactuses'],
    wrong: ['aloe'],
    naming: 'pl.: cacti, cactuses',
  },
  {
    id: 'nature-en-easy-01-10',
    variants: ['European ivy'],
    wrong: ['poison ivy', 'Europeanivy'],
    naming: 'English ivy,[2] European ivy',
  },
  {
    id: 'nature-en-easy-01-15',
    variants: ["bird's nest", 'bird’s nest'],
    wrong: ['burrow', 'birds nest', 'birdsnest'],
    naming: "The study of birds' nests",
  },
  {
    id: 'nature-en-easy-01-22',
    variants: ['bole'],
    wrong: ['branch'],
    naming: 'Trunks, also called boles',
  },
  {
    id: 'nature-en-easy-02-22',
    variants: ['terrapin'],
    wrong: ['crocodile'],
    naming: 'land-dwelling tortoises and freshwater terrapins',
  },
  {
    id: 'nature-en-easy-02-25',
    variants: ['spiderweb', "spider's web", 'spider’s web', 'cobweb'],
    wrong: ['cocoon', 'spiders web'],
    naming: "spider web, spiderweb, spider's web, cobweb",
  },
  {
    id: 'nature-en-hard-01-19',
    variants: ['rootstalk', 'creeping rootstalk'],
    wrong: ['taproot', 'creepingrootstalk'],
    naming: 'creeping rootstalks or just rootstalks',
  },
];

test.each(corrections)(
  'P11-NR1 $id accepts explicit evidenced equivalents without fuzzy matching',
  ({ id, variants, wrong, naming }) => {
    const pack = bundledPacks().find((pack) =>
      pack.questions.some((question) => question.id === id),
    );
    if (!pack) throw new Error(`Missing ${id}`);
    const question = pack.questions.find((question) => question.id === id);
    if (!question) throw new Error(`Missing ${id}`);
    expect(question.aliases).toEqual(expect.arrayContaining(variants));
    for (const answer of [question.answer, ...question.aliases]) {
      expect(acceptsAnswer(question, answer), answer).toBe(true);
      expect(acceptsAnswer(question, `  ${answer.toUpperCase()}  `)).toBe(true);
    }
    for (const answer of wrong)
      expect(acceptsAnswer(question, answer), answer).toBe(false);
    expect(importPack(JSON.stringify(pack))).toEqual(pack);
    const ledger = JSON.parse(
      readFileSync('docs/phase-11-nature-sources.json', 'utf8'),
    );
    const entry = ledger.entries.find(
      (/** @type {{id: string}} */ entry) => entry.id === id,
    );
    expect(entry.aliases).toEqual(question.aliases);
    expect(entry.evidence[0].passage).toContain(naming);
  },
);

test('P11-NR2 identifies the same animal group without a historical-name restriction', () => {
  const pack = bundledPacks().find((pack) => pack.id === 'nature-en-hard-01');
  const question = pack?.questions.find(
    (question) => question.id === 'nature-en-hard-01-23',
  );
  if (!question) throw new Error('Missing Urochordata question');
  expect(question.text).toBe(
    'Which group of marine chordates, ranked as a subphylum, includes sea squirts, salps and larvaceans?',
  );
  expect(question.text).not.toMatch(/older|historical|former/i);
  expect(question.answer).toBe('Urochordata');
  expect(question.initial).toBe('U');
  expect(question.aliases).toEqual(['Tunicata', 'tunicates', 'Urochorda']);
  for (const answer of [question.answer, ...question.aliases])
    expect(acceptsAnswer(question, answer)).toBe(true);
  for (const wrong of ['Cephalochordata', 'Chordata', 'Ascidiacea'])
    expect(acceptsAnswer(question, wrong)).toBe(false);
  const ledger = JSON.parse(
    readFileSync('docs/phase-11-nature-sources.json', 'utf8'),
  );
  const entry = ledger.entries.find(
    (/** @type {{id: string}} */ entry) => entry.id === question.id,
  );
  expect(entry.claim).toBe(question.text);
  expect(entry.evidence[0].passage).toContain(
    'The subphylum was at one time called Urochordata',
  );
  expect(entry.evidence[0].passage).toContain(
    'Tunicata is almost invariably used in modern scientific works',
  );
  expect(entry.evidence[0].passage).toContain(
    'Thaliaceans (pyrosomes, doliolids, and salps) and larvaceans',
  );
  expect(entry.evidence[0].passage).toContain('Sea squirts are so named');
});
