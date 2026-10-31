import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { expect } from '@playwright/test';
import { preparationStrings } from '../src/ui/preparation-strings.js';

// Chromium's PDF embeds font-to-Unicode maps; decode them to check actual print text.
function unicodeMap(cmap) {
  const map = new Map();
  for (const chunk of cmap.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const match of chunk[1].matchAll(/<(\w+)> <(\w+)>/g))
      map.set(
        match[1].toUpperCase(),
        String.fromCodePoint(parseInt(match[2], 16)),
      );
  }
  for (const chunk of cmap.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const match of chunk[1].matchAll(/<(\w+)> <(\w+)> <(\w+)>/g)) {
      const start = parseInt(match[1], 16);
      const end = parseInt(match[2], 16);
      for (let code = start; code <= end; code++)
        map.set(
          code.toString(16).toUpperCase().padStart(match[1].length, '0'),
          String.fromCodePoint(parseInt(match[3], 16) + code - start),
        );
    }
  }
  const width = cmap.match(/begincodespacerange\s*<(\w+)>/)[1].length;
  return { map, width };
}

function pageText(object, fonts, stream) {
  const resources = new Map(
    [...object.matchAll(/\/(F\d+) (\d+) 0 R/g)].map((match) => [
      match[1],
      fonts.get(match[2]),
    ]),
  );
  const contents = stream(object.match(/\/Contents (\d+) 0 R/)[1]);
  let font;
  let text = '';
  for (const match of contents.matchAll(
    /\/(F\d+) [\d.]+ Tf|<([A-Fa-f0-9]+)> Tj/g,
  )) {
    if (match[1]) font = resources.get(match[1]);
    else
      for (let offset = 0; offset < match[2].length; offset += font.width)
        text +=
          font.map.get(
            match[2].slice(offset, offset + font.width).toUpperCase(),
          ) ?? '�';
  }
  return text;
}

function printedText(file) {
  const raw = readFileSync(file).toString('latin1');
  const objects = new Map(
    [...raw.matchAll(/(\d+) 0 obj\n([\s\S]*?)\nendobj/g)].map((match) => [
      match[1],
      match[2],
    ]),
  );
  const stream = (id) => {
    const object = objects.get(id);
    const start = object.indexOf('stream\n');
    const bytes = Buffer.from(
      object.slice(start + 7, object.lastIndexOf('\nendstream')),
      'latin1',
    );
    return (
      object.includes('/FlateDecode') ? inflateSync(bytes) : bytes
    ).toString();
  };
  const fonts = new Map();
  for (const [id, object] of objects) {
    const unicode = object.match(/\/ToUnicode (\d+) 0 R/);
    if (unicode) fonts.set(id, unicodeMap(stream(unicode[1])));
  }
  return [...objects.values()]
    .filter((object) => /\/Type \/Page\b/.test(object))
    .map((object) => pageText(object, fonts, stream))
    .join('');
}

export function verifyPrintedSheet(file, pack, language) {
  const normalize = (text) => text.normalize('NFKC').replace(/\s/g, '');
  const t = preparationStrings[language];
  const heading = [t.number, t.id, t.initial, t.question, t.answer, t.aliases];
  // A row taller than a printed page can contain the repeated table header.
  const text = normalize(printedText(file)).replaceAll(
    normalize(heading.join('')),
    '',
  );
  let position = 0;
  for (const [index, q] of pack.questions.entries()) {
    const row = normalize(
      [index + 1, q.id, q.initial, q.text, q.answer, ...q.aliases].join(''),
    );
    const found = text.indexOf(row, position);
    expect(found, `PDF main row ${q.id}`).toBeGreaterThanOrEqual(position);
    position = found + row.length;
  }
  const appendix = text.indexOf(normalize(t.provenance), position);
  expect(appendix, 'PDF factual-source appendix').toBeGreaterThanOrEqual(
    position,
  );
  position = appendix;
  for (const [index, q] of pack.questions.entries()) {
    const citation = normalize(
      `${t.number}: ${index + 1} · ${t.id}: ${q.id}${q.sources.join('')}`,
    );
    const found = text.indexOf(citation, position);
    expect(
      found,
      `PDF citations mapped to cell ${index + 1} / ${q.id}`,
    ).toBeGreaterThanOrEqual(position);
    position = found + citation.length;
  }
  for (const credit of [pack.id, ...pack.authors, pack.license])
    expect(text).toContain(normalize(credit));
  for (const origin of pack.questions.flatMap((q) => q.origins ?? []))
    for (const credit of [origin.packId, ...origin.authors, origin.license])
      expect(text).toContain(normalize(credit));
}
