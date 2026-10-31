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
  '%s phase-12 additions 03–05 preserve every existing normalized name',
  (language) => {
    const baseline = bundledPacks().filter(
      (pack) => !/-(easy|medium|hard)-0[3-5]$/.test(pack.id),
    );
    const t = preparationStrings[language];
    const before = catalogNames(t, baseline);
    const additions = DIFFICULTIES.flatMap((level) =>
      ['03', '04', '05'].map((number) => ({
        ...sourcePack(language),
        id: `general-${language}-${level}-${number}`,
        difficulty: level,
      })),
    );
    additions.forEach((pack) => {
      pack.questions = pack.questions.map((question) => ({
        ...question,
        category: 'general',
        difficulty: pack.difficulty,
      }));
    });
    const after = catalogNames(t, [...additions, ...baseline].reverse());
    for (const [id, name] of before) expect(after.get(id)).toBe(name);
    for (const pack of additions)
      expect(after.get(pack.id)).toBe(
        `${t.categories.general} · ${t.difficulties[pack.difficulty]} · ${pack.id.slice(-2)}`,
      );
  },
);

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
