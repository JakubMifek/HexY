import { normalizeAnswer } from './answers.js';
import { randomIndex } from './config.js';
import { requireValue } from './errors.js';
import { validatePack } from './packs.js';
import { DIFFICULTIES, questionDifficulty } from './difficulty.js';

/** @param {import('./types.js').Pack} pack */
export function attributedCopy(pack) {
  const copy = validatePack(pack);
  for (const question of copy.questions) {
    const origin = {
      packId: pack.id,
      questionId: question.id,
      authors: [...pack.authors],
      license: pack.license,
    };
    question.origins ??= [];
    if (
      !question.origins.some(
        (prior) => JSON.stringify(prior) === JSON.stringify(origin),
      )
    )
      question.origins.push(origin);
  }
  return copy;
}

/** @param {import('./types.js').Pack[]} sources
 * @param {import('./types.js').Language} language
 * @param {() => number} random @param {string} id @param {string} title */
export function generateNumbers(sources, language, random, id, title) {
  requireValue(sources.length > 0, 'selectSources');
  const packs = sources.map(attributedCopy);
  requireValue(
    packs.every((pack) => pack.language === language),
    'mixedSources',
  );
  const questions = uniqueQuestions(packs);
  requireValue(questions.length >= 28, 'insufficientQuestions');
  for (let i = questions.length - 1; i > 0; i -= 1) {
    const next = randomIndex(random, i + 1);
    [questions[i], questions[next]] = [questions[next], questions[i]];
  }
  const selected = questions.slice(0, 28);
  const levels = DIFFICULTIES.filter((level) =>
    selected.some((question) => question.difficulty === level),
  );
  return validatePack({
    schemaVersion: 2,
    id,
    title,
    language,
    mode: 'numbers',
    difficulty: levels.length === 1 ? levels[0] : levels,
    authors: [...new Set(packs.flatMap((pack) => pack.authors))],
    license: [...new Set(packs.map((pack) => pack.license))].join('\n'),
    questions: selected,
  });
}

/** @param {import('./types.js').Pack[]} packs */
function uniqueQuestions(packs) {
  /** @type {Map<string, string>} */
  const identities = new Map();
  const texts = new Set();
  /** @type {import('./types.js').Question[]} */
  const questions = [];
  for (const pack of packs) {
    for (const question of pack.questions) {
      const content = {
        ...question,
        difficulty: questionDifficulty(pack, question),
      };
      delete content.origins;
      const fingerprint = JSON.stringify(content);
      const prior = identities.get(question.id);
      requireValue(!prior || prior === fingerprint, 'conflictingQuestionId');
      identities.set(question.id, fingerprint);
      const normalized = normalizeAnswer(question.text);
      if (texts.has(normalized)) continue;
      texts.add(normalized);
      questions.push({
        ...question,
        difficulty: questionDifficulty(pack, question),
      });
    }
  }
  return questions;
}

/** @param {import('./types.js').Pack} pack */
export function validatePlayable(pack) {
  const copy = validatePack(pack);
  requireValue(copy.mode !== 'source', 'boardCount');
  requireValue(
    new Set(copy.questions.map((question) => normalizeAnswer(question.text)))
      .size === 28,
    'repeatedQuestion',
  );
  return copy;
}
