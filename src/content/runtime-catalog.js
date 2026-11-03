import { validatePack } from '../domain/packs.js';
import { requireValue } from '../domain/errors.js';
import { list, record } from '../domain/validation.js';

/** @param {unknown} value */
export function validateCatalog(value) {
  const data = record(value, 'catalog');
  requireValue(data.schemaVersion === 1, 'packVersion', 'catalog');
  const values = list(data.packs, 'catalog.packs');
  requireValue(values.length > 0 && values.length <= 330, 'emptyPack');
  const packs = values.map(validatePack);
  requireValue(
    new Set(packs.map((pack) => pack.id)).size === packs.length,
    'packIdConflict',
  );
  const ids = packs.flatMap((pack) =>
    pack.questions.map((question) => question.id),
  );
  requireValue(new Set(ids).size === ids.length, 'duplicateQuestion');
  return packs;
}

/** @param {string} url @param {AbortSignal} signal
 * @param {typeof fetch} [fetcher] */
export async function loadCatalog(url, signal, fetcher = fetch) {
  signal.throwIfAborted();
  const request = new AbortController();
  const abort = () => request.abort();
  signal.addEventListener('abort', abort, { once: true });
  /** @type {Promise<never>} */
  const cancelled = new Promise((_, reject) => {
    request.signal.addEventListener(
      'abort',
      () => reject(new Error('Catalog request cancelled or timed out')),
      { once: true },
    );
  });
  const timeout = setTimeout(abort, 15_000);
  try {
    return await Promise.race([
      fetcher(url, { signal: request.signal, cache: 'no-store' }).then(
        async (response) => {
          if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`);
          return validateCatalog(await response.json());
        },
      ),
      cancelled,
    ]);
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort', abort);
  }
}
