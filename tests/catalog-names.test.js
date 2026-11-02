import { createHash } from 'node:crypto';
import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { catalogNames, sortedDecks } from '../src/ui/catalog-names.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';
import { sourcePack } from './fixtures.js';
import { DIFFICULTIES } from '../src/domain/difficulty.js';

test.each(/** @type {const} */ (['cs', 'en']))(
  '%s bundled display names are unique, normalized and stable across filters',
  (language) => {
    const packs = bundledPacks();
    const original = structuredClone(packs);
    const names = catalogNames(preparationStrings[language], packs);
    const general = packs.filter(
      (pack) =>
        pack.language === language && pack.questions[0].category === 'general',
    );
    const ordered = sortedDecks(general, names, language);
    expect(ordered.map((pack) => pack.difficulty)).toEqual(
      DIFFICULTIES.flatMap((level) =>
        general.filter((pack) => pack.difficulty === level).map(() => level),
      ),
    );
    expect(ordered.map((pack) => names.get(pack.id))).toEqual(
      DIFFICULTIES.flatMap((level) =>
        general
          .filter((pack) => pack.difficulty === level)
          .map(
            (_, index) =>
              `${preparationStrings[language].categories.general} · ${preparationStrings[language].difficulties[level]} · ${String(index + 1).padStart(2, '0')}`,
          ),
      ),
    );
    const second = ordered[1];
    expect(names.get(sortedDecks([second], names, language)[0].id)).toBe(
      names.get(second.id),
    );
    expect(
      catalogNames(preparationStrings[language], [...packs].reverse()),
    ).toEqual(names);
    expect(packs).toEqual(original);
  },
);

test.each(/** @type {const} */ (['cs', 'en']))(
  '%s each delivered append preserves all preceding normalized names',
  (language) => {
    const packs = bundledPacks();
    const baseline = packs.slice(0, 132);
    const t = preparationStrings[language];
    let before = catalogNames(t, baseline);
    for (const addition of packs.slice(132)) {
      baseline.push(addition);
      const after = catalogNames(t, [...baseline].reverse());
      for (const [id, name] of before) expect(after.get(id)).toBe(name);
      before = after;
    }
  },
);

test.each(/** @type {const} */ (['cs', 'en']))(
  '%s all 149 previously shipped names retain their exact historical bindings',
  (language) => {
    const packs = bundledPacks();
    const ids = new Set(packs.slice(0, 149).map((pack) => pack.id));
    const entries = [...catalogNames(preparationStrings[language], packs)]
      .filter(([id]) => ids.has(id))
      .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }));
    expect(entries).toHaveLength(149);
    const expected = {
      cs: 'a48d821283d038b62c7e497fe387849ef43fe2ddf5a0d7b66f7c408090fb073c',
      en: 'e65e0b045b3ac4691f7535e51046a787753b22384620b80491669989614ae4ee',
    };
    expect(
      createHash('sha256').update(JSON.stringify(entries)).digest('hex'),
    ).toBe(expected[language]);
  },
);

test('a later lower-ID deck receives the next display number without renumbering its predecessor', () => {
  const names = catalogNames(preparationStrings.cs, bundledPacks());
  expect(names.get('general-cs-hard-04')).toBe(
    'Všeobecné znalosti · Těžká · 03',
  );
  expect(names.get('general-cs-hard-03')).toBe(
    'Všeobecné znalosti · Těžká · 04',
  );
});

test('custom names stay intact and sort by level, localized natural title, then ID', () => {
  const items = [
    { id: 'hard', title: 'A', difficulty: 'hard' },
    { id: 'easy-ten', title: 'Deck 10', difficulty: 'easy' },
    { id: 'medium', title: 'A', difficulty: 'medium' },
    { id: 'easy-two-b', title: 'Deck 2', difficulty: 'easy' },
    { id: 'easy-two-a', title: 'Deck 2', difficulty: 'easy' },
  ].map((values) => ({
    ...sourcePack(),
    ...values,
    difficulty: /** @type {'easy'|'medium'|'hard'} */ (values.difficulty),
  }));
  const before = structuredClone(items);
  expect(sortedDecks(items, new Map(), 'en').map((pack) => pack.id)).toEqual([
    'easy-two-a',
    'easy-two-b',
    'easy-ten',
    'medium',
    'hard',
  ]);
  expect(items).toEqual(before);
});

test('mixed imported decks sort by their easiest included level without losing labels', () => {
  const mixed = sourcePack('cs');
  mixed.difficulty = ['easy', 'hard'];
  mixed.title = 'Žlutý';
  const easy = {
    ...sourcePack('cs'),
    id: 'easy',
    title: 'Červený',
    difficulty: /** @type {const} */ ('easy'),
  };
  const medium = sourcePack('cs');
  const before = structuredClone(mixed);
  expect(sortedDecks([mixed, medium, easy], new Map(), 'cs')).toEqual([
    easy,
    mixed,
    medium,
  ]);
  expect(mixed).toEqual(before);
});
