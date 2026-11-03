import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { validateCatalog } from '../src/content/runtime-catalog.js';

/** @param {string} root */
export function contentData(root) {
  /** @type {unknown} */
  const order = JSON.parse(
    readFileSync(join(root, 'src/content-order.json'), 'utf8'),
  );
  if (
    !Array.isArray(order) ||
    !order.every(
      (name) => typeof name === 'string' && /^[a-z0-9-]+\.json$/.test(name),
    )
  )
    throw new Error('Invalid content order');
  const files = readdirSync(join(root, 'src/content'))
    .filter((name) => name.endsWith('.json'))
    .sort();
  if (
    new Set(order).size !== order.length ||
    JSON.stringify([...order].sort()) !== JSON.stringify(files)
  )
    throw new Error('Catalog must list every question pack exactly once');
  const packs = order.map((name) =>
    JSON.parse(readFileSync(join(root, 'src/content', name), 'utf8')),
  );
  const catalog = { schemaVersion: 1, packs };
  validateCatalog(catalog);
  return catalog;
}
