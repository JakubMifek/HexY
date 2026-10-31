import { requireValue } from './errors.js';

export const DIFFICULTIES = /** @type {const} */ (['easy', 'medium', 'hard']);

/** @param {unknown} value @param {string} path */
export function difficultyLevel(value, path) {
  requireValue(
    value === 'easy' || value === 'medium' || value === 'hard',
    'packDifficulty',
    path,
  );
  return value;
}

/** @param {unknown} value @param {string} mode
 * @returns {import('./types.js').Difficulty | import('./types.js').Difficulty[]} */
export function packDifficulty(value, mode) {
  if (!Array.isArray(value)) return difficultyLevel(value, 'difficulty');
  const levels = value.map((level) => difficultyLevel(level, 'difficulty'));
  requireValue(
    mode === 'numbers' &&
      levels.length >= 2 &&
      levels.length <= DIFFICULTIES.length &&
      DIFFICULTIES.filter((level) => levels.includes(level)).join() ===
        levels.join(),
    'packDifficulty',
    'difficulty',
  );
  return levels;
}

/** @param {import('./types.js').Pack} pack
 * @param {import('./types.js').Question} question */
export function questionDifficulty(pack, question) {
  if (question.difficulty) return question.difficulty;
  requireValue(
    typeof pack.difficulty === 'string',
    'packDifficulty',
    'questions',
  );
  return pack.difficulty;
}

/** @param {import('./types.js').Difficulty | import('./types.js').Difficulty[]} difficulty
 * @param {import('./types.js').Question[]} questions */
export function validateDifficulties(difficulty, questions) {
  if (!Array.isArray(difficulty)) {
    requireValue(
      questions.every(
        (question) =>
          !question.difficulty || question.difficulty === difficulty,
      ),
      'packDifficulty',
      'questions',
    );
    return;
  }
  requireValue(
    questions.every(
      (question) =>
        question.difficulty && difficulty.includes(question.difficulty),
    ) &&
      difficulty.every((level) =>
        questions.some((question) => question.difficulty === level),
      ),
    'packDifficulty',
    'questions',
  );
}
