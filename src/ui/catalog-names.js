import { DIFFICULTIES } from '../domain/difficulty.js';
import inventory from '../../docs/phase-12-deck-inventory.json';

// Native IDs can arrive out of order; published display numbers must not change.
const deliveryOrder = new Map(
  inventory.additionalDeckIds.map((id, index) => [id, index + 1]),
);

/** @typedef {import('../domain/types.js').Pack} Pack */
/** @typedef {import('./preparation-strings.js').PreparationTexts} Texts */

/** @param {Texts} t @param {Pack[]} bundled */
export function catalogNames(t, bundled) {
  const categories = /** @type {Record<string, string>} */ (t.categories);
  /** @type {Map<string, number>} */
  const counts = new Map();
  /** @type {Map<string, string>} */
  const names = new Map();
  for (const pack of [...bundled].sort(
    (a, b) =>
      (deliveryOrder.get(a.id) ?? 0) - (deliveryOrder.get(b.id) ?? 0) ||
      a.id.localeCompare(b.id, 'en', { numeric: true }),
  )) {
    const category = pack.questions[0].category;
    const levels = DIFFICULTIES.filter((level) =>
      [pack.difficulty].flat().includes(level),
    );
    const key = `${pack.language}/${category}/${levels.join('/')}`;
    const number = (counts.get(key) ?? 0) + 1;
    counts.set(key, number);
    names.set(
      pack.id,
      `${categories[category]} · ${levels.map((level) => t.difficulties[level]).join(' / ')} · ${String(number).padStart(2, '0')}`,
    );
  }
  return names;
}

/** @param {Pack[]} packs @param {Map<string, string>} names
 * @param {string} language */
export function sortedDecks(packs, names, language) {
  const collator = new Intl.Collator(language, {
    numeric: true,
    sensitivity: 'base',
  });
  return [...packs].sort(
    (a, b) =>
      difficultyRank(a) - difficultyRank(b) ||
      collator.compare(
        names.get(a.id) ?? a.title,
        names.get(b.id) ?? b.title,
      ) ||
      collator.compare(a.id, b.id),
  );
}

/** @param {Pack} pack */
function difficultyRank(pack) {
  return Math.min(
    ...[pack.difficulty].flat().map((level) => DIFFICULTIES.indexOf(level)),
  );
}
