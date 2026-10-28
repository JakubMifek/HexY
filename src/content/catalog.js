import cs from './general-cs-01.json';
import en from './general-en-01.json';
import generalCs from './general-cs-02.json';
import generalEn from './general-en-02.json';
import natureCs1 from './nature-cs-01.json';
import natureCs2 from './nature-cs-02.json';
import natureEn1 from './nature-en-01.json';
import natureEn2 from './nature-en-02.json';
import geographyCs1 from './geography-cs-01.json';
import geographyCs2 from './geography-cs-02.json';
import geographyEn1 from './geography-en-01.json';
import geographyEn2 from './geography-en-02.json';
import { validatePack } from '../domain/packs.js';
import { normalizeAnswer } from '../domain/answers.js';

export function bundledPacks() {
  return [
    cs,
    en,
    generalCs,
    generalEn,
    natureCs1,
    natureCs2,
    natureEn1,
    natureEn2,
    geographyCs1,
    geographyCs2,
    geographyEn1,
    geographyEn2,
  ].map(validatePack);
}

/** @param {import('../domain/types.js').Pack[]} packs
 * @param {Set<string>} bundledIds
 * @param {{search: string, category: string, language: string, origin: string}} filters */
export function filterPacks(packs, bundledIds, filters) {
  const query = normalizeAnswer(filters.search);
  return packs.filter((pack) => {
    const origin = bundledIds.has(pack.id) ? 'bundled' : 'custom';
    return (
      (!filters.language || pack.language === filters.language) &&
      (!filters.origin || origin === filters.origin) &&
      (!filters.category ||
        pack.questions.some((q) => q.category === filters.category)) &&
      normalizeAnswer(`${pack.title} ${pack.id}`).includes(query)
    );
  });
}
