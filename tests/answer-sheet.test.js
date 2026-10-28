// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { bundledPacks } from '../src/content/catalog.js';
import { generateNumbers } from '../src/domain/generation.js';
import { answerSheet } from '../src/ui/answer-sheet.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';

test.each(/** @type {const} */ (['cs', 'en']))(
  'P5-R3 %s fixed/generated sheets preserve exact cell sources as inert text',
  (language) => {
    const fixed = bundledPacks().find((pack) => pack.language === language);
    if (!fixed) throw new Error(`Missing ${language} starter`);
    fixed.questions[0].sources = [
      '<img src=x onerror="alert(1)"> & \'quoted\'',
      'javascript:alert(1)',
      'https://example.org/?x=<script>alert(1)</script>&y="test"',
    ];
    const generated = generateNumbers(
      [fixed],
      language,
      () => 0,
      'mixed',
      'Mixed',
    );
    expect(generated.questions[0].id).not.toBe(fixed.questions[0].id);
    for (const pack of [fixed, generated]) {
      const doc = new DOMParser().parseFromString(
        answerSheet(pack, language),
        'text/html',
      );
      const t = preparationStrings[language];
      expect(doc.querySelector('#source-appendix h2')?.textContent).toBe(
        t.provenance,
      );
      expect(doc.querySelectorAll('tbody tr')).toHaveLength(28);
      expect(
        [...doc.querySelectorAll('.source-entry')].map((entry) => [
          entry.querySelector('h3')?.textContent,
          entry.querySelector('p')?.textContent,
        ]),
      ).toEqual(
        pack.questions.map((q, index) => [
          `${t.number}: ${index + 1} · ${t.id}: ${q.id}`,
          q.sources.join('\n'),
        ]),
      );
      expect(
        doc.querySelectorAll('a,img,script,iframe,object,link'),
      ).toHaveLength(0);
      expect(doc.body.textContent).toContain(pack.license);
      expect(doc.body.textContent).toContain(pack.authors[0]);
      if (pack.mode === 'numbers')
        expect(doc.querySelector('ul')?.textContent).toContain(fixed.id);
    }
  },
);
