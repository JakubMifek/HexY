import { contentData } from '../scripts/content-data.js';
import { validateCatalog } from '../src/content/runtime-catalog.js';

const packs = validateCatalog(contentData(process.cwd()));

export function bundledPacks() {
  return structuredClone(packs);
}
