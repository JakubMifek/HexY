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
