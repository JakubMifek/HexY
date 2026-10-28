import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { generateNumbers } from '../src/domain/generation.js';
import { ALPHABETS, acceptsAnswer } from '../src/domain/answers.js';
import { strings } from '../src/ui/strings.js';

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
