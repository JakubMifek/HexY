import { ALPHABETS } from './answers.js';
import { requireValue, DomainError } from './errors.js';
import { choice, list, record, strings, text } from './validation.js';

/** @param {unknown} value @param {string} path
 * @returns {import('./types.js').Question} */
function parseQuestion(value, path) {
  const data = record(value, path);
  const language = choice(
    data.language,
    /** @type {const} */ (['cs', 'en']),
    `${path}.language`,
  );
  const initial = choice(data.initial, ALPHABETS[language], `${path}.initial`);
  const answer = text(data.answer, `${path}.answer`);
  requireValue(
    answer
      .normalize('NFC')
      .toLocaleUpperCase(language)
      .startsWith(initial.toLocaleUpperCase(language)),
    'answerInitial',
    `${path}.answer`,
  );
  const sources = strings(data.sources, `${path}.sources`);
  requireValue(sources.length > 0, 'missingProvenance', `${path}.sources`);
  return {
    id: text(data.id, `${path}.id`),
    text: text(data.text, `${path}.text`),
    initial,
    answer,
    language,
    aliases: strings(data.aliases, `${path}.aliases`),
    category: text(data.category, `${path}.category`),
    sources,
    ...(data.origins === undefined
      ? {}
      : { origins: parseOrigins(data.origins, `${path}.origins`) }),
  };
}

/** @param {unknown} value @param {string} path */
function parseOrigins(value, path) {
  const origins = list(value, path).map((item, index) => {
    const data = record(item, `${path}.${index}`);
    const authors = strings(data.authors, `${path}.${index}.authors`);
    requireValue(authors.length > 0, 'missingProvenance', path);
    return {
      packId: text(data.packId, `${path}.${index}.packId`),
      questionId: text(data.questionId, `${path}.${index}.questionId`),
      authors,
      license: text(data.license, `${path}.${index}.license`),
    };
  });
  requireValue(origins.length > 0, 'missingProvenance', path);
  return origins;
}

/** @param {unknown} value @returns {import('./types.js').Pack} */
export function validatePack(value) {
  const data = record(value, 'pack');
  requireValue(data.schemaVersion === 1, 'packVersion', 'schemaVersion');
  const language = choice(
    data.language,
    /** @type {const} */ (['cs', 'en']),
    'language',
  );
  const mode = choice(
    data.mode,
    /** @type {const} */ (['source', 'letters', 'numbers']),
    'mode',
  );
  const questions = list(data.questions, 'questions').map((item, i) =>
    parseQuestion(item, `questions.${i}`),
  );
  requireValue(questions.length > 0, 'emptyPack', 'questions');
  requireValue(
    new Set(questions.map(({ id }) => id)).size === questions.length,
    'duplicateQuestion',
    'questions',
  );
  requireValue(
    questions.every((q) => q.language === language),
    'mixedLanguage',
    'questions',
  );
  validatePlacement(mode, language, questions);
  const authors = strings(data.authors, 'authors');
  requireValue(authors.length > 0, 'missingProvenance', 'authors');
  return {
    schemaVersion: 1,
    id: text(data.id, 'id'),
    title: text(data.title, 'title'),
    language,
    mode,
    authors,
    license: text(data.license, 'license'),
    questions,
  };
}

/** @param {import('./types.js').PackMode} mode
 * @param {import('./types.js').Language} language
 * @param {import('./types.js').Question[]} questions */
function validatePlacement(mode, language, questions) {
  if (mode === 'source') return;
  requireValue(questions.length === 28, 'boardCount', 'questions');
  if (mode === 'letters') {
    requireValue(
      questions.every((q, i) => q.initial === ALPHABETS[language][i]),
      'letterPlacement',
      'questions',
    );
  }
}

/** @param {string} json */
export function importPack(json) {
  let value;
  try {
    value = JSON.parse(json);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    throw new DomainError('invalidJson');
  }
  return validatePack(value);
}
