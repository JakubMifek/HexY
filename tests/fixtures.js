import { createGame, transition } from '../src/domain/game.js';
import { ALPHABETS } from '../src/domain/answers.js';
import { DEFAULT_QUESTION_TIME_MS } from '../src/domain/config.js';
import { defaultSetup as defaults } from '../src/ui/setup.js';

/** @param {import('../src/domain/types.js').Language} language */
export function defaultSetup(language) {
  return {
    ...defaults(language),
    mode: /** @type {const} */ ('letters'),
    starter: /** @type {const} */ ('A'),
  };
}

/** @param {import('../src/domain/types.js').Game} game */
export function savedGame(game) {
  return JSON.stringify({
    format: 'hexy-game',
    schemaVersion: 1,
    keys: { A: 'ShiftLeft', B: 'ShiftRight' },
    game,
    settings: {
      ...defaultSetup(game.pack.language),
      mode: game.pack.mode,
      answerMode: game.config.answerMode,
      seconds: game.config.timeLimitMs / 1000,
      starter: game.config.starter,
    },
  });
}

/** @param {import('../src/domain/types.js').Language} [language]
 * @returns {import('../src/domain/types.js').Pack} */
export function sourcePack(language = 'en') {
  return {
    schemaVersion: 2,
    difficulty: 'medium',
    id: 'test-source',
    title: 'Synthetic test fixture',
    language,
    mode: 'source',
    authors: ['HexY test authors'],
    license: 'CC BY 4.0',
    questions: [
      {
        id: 'test-q',
        text: 'Which letter begins the test word Alpha?',
        initial: 'A',
        answer: 'Alpha',
        aliases: ['A'],
        category: 'test',
        language,
        sources: ['Original synthetic fixture, not a factual content pack.'],
      },
    ],
  };
}

/** @param {import('../src/domain/types.js').PackMode} [mode]
 * @param {import('../src/domain/types.js').Language} [language] */
export function boardPack(mode = 'numbers', language = 'en') {
  const pack = sourcePack(language);
  pack.mode = mode;
  pack.questions = Array.from({ length: 28 }, (_, i) => ({
    ...pack.questions[0],
    id: `test-${i}`,
    initial: mode === 'letters' ? ALPHABETS[language][i] : 'A',
    answer: mode === 'letters' ? `${ALPHABETS[language][i]}-fixture` : 'Alpha',
  }));
  return pack;
}

/** @param {'hosted'|'automatic'} [answerMode] */
export function config(answerMode = 'hosted') {
  return {
    answerMode,
    starter: /** @type {const} */ ('A'),
    timeLimitMs: DEFAULT_QUESTION_TIME_MS,
    duel: {
      previewMs: 100,
      symbolMs: 100,
      length: 7,
      symbols: [
        'circle',
        'star',
        'square',
        'triangle',
        'hexagon',
        'heart',
        'sun',
      ],
    },
  };
}

/** @param {'hosted'|'automatic'} [answerMode] */
export function game(answerMode = 'hosted') {
  return createGame(boardPack(), config(answerMode), 1_000, 'test-session');
}

/** @param {import('../src/domain/types.js').Game} state
 * @param {import('../src/domain/types.js').ActionBody} action
 * @param {number} [now] @param {() => number} [random] */
export function act(state, action, now = state.lastNow, random = () => 0) {
  return transition(
    state,
    { ...action, sessionId: state.sessionId, revision: state.revision },
    { now, random },
  ).state;
}

/** @param {'hosted'|'automatic'} [answerMode] */
export function question(answerMode = 'hosted') {
  return act(game(answerMode), { type: 'select', cell: 1 });
}

/** @param {() => number} [random] */
export function duel(random = () => 0) {
  const black = act(game(), { type: 'set-cell', cell: 1, owner: 'black' });
  return act(black, { type: 'select', cell: 1 }, 1_000, random);
}
