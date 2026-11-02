import { phaseElevenSources } from './phase-eleven-packs.js';

import natureEnEasy3 from './nature-en-easy-03.json';
import natureEnMedium3 from './nature-en-medium-03.json';
import natureEnHard3 from './nature-en-hard-03.json';
import geographyEnMedium3 from './geography-en-medium-03.json';
import scienceEnHard3 from './science-en-hard-03.json';
import { validatePack } from '../domain/packs.js';
import scienceEnEasy3 from './science-en-easy-03.json';
import generalEnHard3 from './general-en-hard-03.json';
import geographyEnHard3 from './geography-en-hard-03.json';
import scienceEnMedium3 from './science-en-medium-03.json';
import geographyEnEasy3 from './geography-en-easy-03.json';

const bundledSources = [
  ...phaseElevenSources,
  natureEnEasy3,
  natureEnMedium3,
  scienceEnHard3,
  natureEnHard3,
  geographyEnMedium3,
  scienceEnEasy3,
  generalEnHard3,
  geographyEnHard3,
  scienceEnMedium3,
  geographyEnEasy3,
];

export function bundledPacks() {
  return bundledSources.map(validatePack);
}

/** @param {import('../domain/types.js').Pack[]} packs
 * @param {Set<string>} bundledIds
 * @param {{difficulty: string, origin: string}} filters
 * @param {string} language */
export function filterPacks(packs, bundledIds, filters, language) {
  return packs.filter((pack) => {
    const origin = bundledIds.has(pack.id) ? 'bundled' : 'custom';
    return (
      pack.language === language &&
      (!filters.origin || origin === filters.origin) &&
      (!filters.difficulty ||
        [pack.difficulty].flat().some((level) => level === filters.difficulty))
    );
  });
}
