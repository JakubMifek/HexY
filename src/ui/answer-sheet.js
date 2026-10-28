import { validatePlayable } from '../domain/generation.js';
import { preparationStrings } from './preparation-strings.js';

/** @param {string} value */
function escape(value) {
  return value.replace(
    /[&<>"']/g,
    (character) => `&#${character.charCodeAt(0)};`,
  );
}

/** @param {import('../domain/types.js').Pack} value
 * @param {import('../domain/types.js').Language} language */
export function answerSheet(value, language) {
  const pack = validatePlayable(value);
  const t = preparationStrings[language];
  const headings = [t.number, t.id, t.initial, t.question, t.answer, t.aliases];
  const rows = pack.questions
    .map(
      (question, index) =>
        `<tr>${[
          String(index + 1),
          question.id,
          question.initial,
          question.text,
          question.answer,
          question.aliases.join('\n'),
        ]
          .map((text) => `<td>${escape(text)}</td>`)
          .join('')}</tr>`,
    )
    .join('\n');
  return `<!doctype html>
<html lang="${language}"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(pack.title)} · HexY</title>
<style>
body{font-family:system-ui,sans-serif;color:#111;background:white;margin:1.5rem;overflow-wrap:anywhere}
table{width:100%;border-collapse:collapse;font-size:10pt}
th,td{border:1px solid #555;padding:.4rem;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere}
thead{display:table-header-group}tr{break-inside:avoid}h1{font-size:18pt}
th:first-child,td:first-child{min-width:2.5rem;white-space:nowrap}
@page{size:landscape;margin:12mm}@media print{body{margin:0}.screen-only{display:none}}
</style>
<h1>HexY · ${escape(t.privateSheet)}</h1>
<p class="screen-only">${escape(t.sheetHelp)}</p>
<h2>${escape(pack.title)}</h2>
<p>${escape(t.boardId)}: <b>${escape(pack.id)}</b> · ${escape(t.mode)}: ${escape(t[pack.mode === 'letters' ? 'letters' : 'numbers'])} · ${escape(t.language)}: ${pack.language}</p>
<table><thead><tr>${headings.map((label) => `<th scope="col">${escape(label)}</th>`).join('')}</tr></thead>
<tbody>${rows}</tbody></table>
<p>${escape(pack.authors.join(', '))} · ${escape(pack.license)}</p>
${sheetAttribution(pack, t)}
</html>`;
}

/** @param {import('../domain/types.js').Pack} pack
 * @param {import('./preparation-strings.js').PreparationTexts} t */
function sheetAttribution(pack, t) {
  /** @type {Map<string, {text: string, cells: Set<number>}>} */
  const credits = new Map();
  pack.questions.forEach((question, index) => {
    for (const origin of question.origins ?? []) {
      const key = JSON.stringify([
        origin.packId,
        origin.authors,
        origin.license,
      ]);
      const credit = credits.get(key) ?? {
        text: `${origin.packId} — ${origin.authors.join(', ')} — ${origin.license}`,
        cells: new Set(),
      };
      credit.cells.add(index + 1);
      credits.set(key, credit);
    }
  });
  if (!credits.size) return '';
  const items = [...credits.values()]
    .map(
      (credit) =>
        `<li>${escape(credit.text)} · ${escape(t.number)}: ${[...credit.cells].join(', ')}</li>`,
    )
    .join('');
  return `<h2>${escape(t.origins)}</h2><ul>${items}</ul>`;
}
