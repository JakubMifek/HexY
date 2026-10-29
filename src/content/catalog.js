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
import historyCs1 from './history-cs-01.json';
import historyCs2 from './history-cs-02.json';
import historyEn1 from './history-en-01.json';
import historyEn2 from './history-en-02.json';
import politicsCs1 from './politics-cs-01.json';
import politicsCs2 from './politics-cs-02.json';
import politicsEn1 from './politics-en-01.json';
import politicsEn2 from './politics-en-02.json';
import scienceCs1 from './science-cs-01.json';
import scienceCs2 from './science-cs-02.json';
import scienceEn1 from './science-en-01.json';
import scienceEn2 from './science-en-02.json';
import programmingCs1 from './programming-cs-01.json';
import programmingCs2 from './programming-cs-02.json';
import programmingEn1 from './programming-en-01.json';
import programmingEn2 from './programming-en-02.json';
import artsCs1 from './arts-cs-01.json';
import artsCs2 from './arts-cs-02.json';
import artsEn1 from './arts-en-01.json';
import artsEn2 from './arts-en-02.json';
import entertainmentCs1 from './entertainment-cs-01.json';
import entertainmentCs2 from './entertainment-cs-02.json';
import entertainmentEn1 from './entertainment-en-01.json';
import entertainmentEn2 from './entertainment-en-02.json';
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
    historyCs1,
    historyCs2,
    historyEn1,
    historyEn2,
    politicsCs1,
    politicsCs2,
    politicsEn1,
    politicsEn2,
    scienceCs1,
    scienceCs2,
    scienceEn1,
    scienceEn2,
    programmingCs1,
    programmingCs2,
    programmingEn1,
    programmingEn2,
    artsCs1,
    artsCs2,
    artsEn1,
    artsEn2,
    entertainmentCs1,
    entertainmentCs2,
    entertainmentEn1,
    entertainmentEn2,
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
