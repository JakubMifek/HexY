import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';
import { verifyPrintedSheet } from './pdf-helpers.js';
import { preparationStrings } from '../src/ui/preparation-strings.js';

const directory = mkdtempSync(join(tmpdir(), 'hexy-pdf-regression-'));
test.afterEach(() => rmSync(join(directory, 'sheet.pdf'), { force: true }));
test.afterAll(() => rmSync(directory, { recursive: true }));

function fixture(language, width, mutate = (text) => text) {
  const t = preparationStrings[language];
  const pack = {
    id: 'pdf-regression',
    authors: ['Test author'],
    license: 'CC0',
    questions: [
      {
        id: 'pdf-01',
        initial: 'K',
        text: 'Komi?',
        answer: 'Komi',
        aliases: ['コミ出し', '贴目', '貼目', '덤'],
        sources: ['https://example.org/komi'],
      },
    ],
  };
  const q = pack.questions[0];
  const header = [
    t.number,
    t.id,
    t.initial,
    t.question,
    t.answer,
    t.aliases,
  ].join('');
  const row = [1, q.id, q.initial, q.text, q.answer, ...q.aliases].join('');
  const text = mutate(
    `${header}${row}${t.provenance}${t.number}: 1 · ${t.id}: ${q.id}${q.sources[0]}${pack.id}${pack.authors[0]}${pack.license}`,
  );
  const chars = [...new Set(text)];
  const code = (index) => (index + 1).toString(16).padStart(width, '0');
  const cmap = `begincmap\n1 begincodespacerange\n<${'0'.repeat(width)}> <${'F'.repeat(width)}>\nendcodespacerange\n${chars.length} beginbfchar\n${chars.map((char, index) => `<${code(index)}> <${char.codePointAt(0).toString(16)}>`).join('\n')}\nendbfchar\nendcmap`;
  const contents = `/F1 10 Tf <${[...text].map((char) => code(chars.indexOf(char))).join('')}> Tj`;
  const object = (id, body) => `${id} 0 obj\n${body}\nendobj\n`;
  const file = join(directory, 'sheet.pdf');
  writeFileSync(
    file,
    object(1, '/Type /Page /Resources << /F1 2 0 R >> /Contents 3 0 R') +
      object(2, '/ToUnicode 4 0 R') +
      object(3, `stream\n${contents}\nendstream`) +
      object(4, `stream\n${cmap}\nendstream`),
  );
  return { file, pack, header };
}

test.describe('native PDF extraction regressions', () => {
  for (const width of [2, 4])
    test(`decodes ${width}-digit font codes without losing CJK aliases`, () => {
      const { file, pack } = fixture('cs', width);
      expect(() => verifyPrintedSheet(file, pack, 'cs')).not.toThrow();
    });

  for (const language of ['cs', 'en'])
    test(`retains an oversized row around only the exact ${language} header`, () => {
      const t = preparationStrings[language];
      const header = [
        t.number,
        t.id,
        t.initial,
        t.question,
        t.answer,
        t.aliases,
      ].join('');
      const { file, pack } = fixture(language, 4, (text) =>
        text.replace('贴目貼目', `贴目${header}貼目`),
      );
      expect(() => verifyPrintedSheet(file, pack, language)).not.toThrow();
    });

  const mutations = [
    (text) => text.replace('コミ出し', '����'),
    (text) => text.replace('貼目', ''),
    (text) => text.replace('貼目덤', '덤貼目'),
    (text) => text.replace('https://example.org/komi', ''),
    (text) => text.replace('CC0', ''),
    (text) => text.replace('贴目貼目', '贴目unrelated heading貼目'),
  ];
  for (const [index, mutate] of mutations.entries())
    test(`rejects missing, reordered or unrelated printed content ${index + 1}`, () => {
      const { file, pack } = fixture('cs', 4, mutate);
      expect(() => verifyPrintedSheet(file, pack, 'cs')).toThrow();
    });
});
