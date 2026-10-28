import cs from './general-cs-01.json';
import en from './general-en-01.json';
import { validatePack } from '../domain/packs.js';
import { randomIndex } from '../domain/config.js';

/** @param {import('../ui/setup.js').Setup} setup @param {() => number} random */
export function prepareStarter(setup, random) {
  const pack = validatePack(setup.language === 'cs' ? cs : en);
  if (setup.mode === 'letters') return pack;
  pack.mode = 'numbers';
  for (let i = pack.questions.length - 1; i > 0; i -= 1) {
    const next = randomIndex(random, i + 1);
    [pack.questions[i], pack.questions[next]] = [
      pack.questions[next],
      pack.questions[i],
    ];
  }
  return pack;
}
