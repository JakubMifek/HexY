export const ALPHABETS = Object.freeze({
  cs: Object.freeze([
    'A',
    'B',
    'C',
    'Č',
    'D',
    'E',
    'F',
    'G',
    'H',
    'Ch',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'R',
    'Ř',
    'S',
    'Š',
    'T',
    'U',
    'V',
    'W',
    'Z',
    'Ž',
  ]),
  en: Object.freeze([
    'A',
    'B',
    'C',
    'CH',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'SH',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]),
});

/** @param {string} answer */
export function normalizeAnswer(answer) {
  return answer
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/gu, ' ');
}

/** @param {import('./types.js').Question} question @param {string} answer */
export function acceptsAnswer(question, answer) {
  const normalized = normalizeAnswer(answer);
  return [question.answer, ...question.aliases].some(
    (accepted) => normalizeAnswer(accepted) === normalized,
  );
}
