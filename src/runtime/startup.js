import { loadCatalog } from '../content/runtime-catalog.js';
import { strings } from '../ui/strings.js';
import { button, element } from '../ui/dom.js';
import { requireValue } from '../domain/errors.js';
import { validatePlayable } from '../domain/generation.js';

/** @param {import('../domain/types.js').Pack[]} packs */
function validateStartupPacks(packs) {
  for (const language of ['cs', 'en']) {
    const first = packs.find((pack) => pack.language === language);
    requireValue(first?.mode === 'letters', 'selectFixed');
    validatePlayable(first);
  }
}

/** @param {HTMLElement} root
 * @param {(packs: import('../domain/types.js').Pack[]) => {dispose: () => void}} create
 * @param {string} url
 * @param {import('../domain/types.js').Language} language
 * @param {typeof fetch} [fetcher] */
export function startApplication(root, create, url, language, fetcher = fetch) {
  const controller = new AbortController();
  /** @type {{dispose: () => void}|undefined} */
  let app;
  const t = strings[language];
  async function load() {
    root.replaceChildren(element('p', t.catalogLoading, { role: 'status' }));
    let packs;
    try {
      packs = await loadCatalog(url, controller.signal, fetcher);
      validateStartupPacks(packs);
    } catch {
      if (controller.signal.aborted) return;
      root.replaceChildren(
        element('p', t.catalogUnavailable, { role: 'alert' }),
        button(
          t.retryCatalog,
          'retry-catalog',
          () => void load(),
          controller.signal,
        ),
      );
      return;
    }
    if (!controller.signal.aborted) app = create(packs);
  }
  const ready = load();
  return {
    ready,
    dispose() {
      controller.abort();
      app?.dispose();
      root.replaceChildren();
    },
  };
}
