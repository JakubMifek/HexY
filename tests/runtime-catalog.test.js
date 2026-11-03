// @vitest-environment jsdom
import { afterEach, expect, test, vi } from 'vitest';
import {
  loadCatalog,
  validateCatalog,
} from '../src/content/runtime-catalog.js';
import { startApplication } from '../src/runtime/startup.js';
import { sourcePack } from './fixtures.js';
import { bundledPacks } from './bundled-packs.js';
import { App } from '../src/app.js';
import { browserClock } from '../src/runtime/clock.js';
import { defaultSetup } from '../src/ui/setup.js';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  localStorage.clear();
  document.body.replaceChildren();
});

test('loads and validates the data response without bundling or changing question bytes', async () => {
  const pack = sourcePack();
  const fetcher = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(
      new Response(JSON.stringify({ schemaVersion: 1, packs: [pack] })),
    );
  const signal = new AbortController().signal;
  expect(await loadCatalog('/hexy/catalog.json', signal)).toEqual([pack]);
  expect(fetcher).toHaveBeenCalledWith('/hexy/catalog.json', {
    signal: expect.any(AbortSignal),
    cache: 'no-store',
  });
  fetcher.mockResolvedValueOnce(new Response('', { status: 503 }));
  await expect(loadCatalog('/hexy/catalog.json', signal)).rejects.toThrow(
    'HTTP 503',
  );
});

test('rejects invalid versions, empty catalogs, duplicated packs and question IDs', () => {
  const pack = sourcePack();
  for (const value of [
    { schemaVersion: 2, packs: [pack] },
    { schemaVersion: 1, packs: [] },
    { schemaVersion: 1, packs: [pack, pack] },
    { schemaVersion: 1, packs: [pack, { ...pack, id: 'other' }] },
    { schemaVersion: 1, packs: [{ ...pack, questions: [] }] },
  ])
    expect(() => validateCatalog(value)).toThrow();
});

test('failed startup is localized and retry loads the current catalog without modifying storage', async () => {
  const root = document.createElement('main');
  document.body.append(root);
  const create = vi.fn(() => ({ dispose: vi.fn() }));
  vi.spyOn(globalThis, 'fetch')
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ schemaVersion: 1, packs: bundledPacks() })),
    );
  const startup = startApplication(
    root,
    create,
    '/catalog.json',
    'cs',
    globalThis.fetch,
  );
  await startup.ready;
  expect(root.querySelector('[role="alert"]')?.textContent).toContain(
    'Uložené hry',
  );
  expect(create).not.toHaveBeenCalled();
  root.querySelector('button')?.click();
  await vi.waitFor(() => expect(create).toHaveBeenCalledOnce());
  startup.dispose();
  expect(create.mock.results[0].value.dispose).toHaveBeenCalledOnce();
});

test('leaving during fetch aborts startup and rejects late completion', async () => {
  const root = document.createElement('main');
  const create = vi.fn(() => ({ dispose() {} }));
  /** @type {(response: Response) => void} */
  let resolveResponse = () => {};
  const fetcher = vi.spyOn(globalThis, 'fetch').mockImplementation(
    () =>
      new Promise((resolve) => {
        resolveResponse = resolve;
      }),
  );
  const startup = startApplication(
    root,
    create,
    '/catalog.json',
    'en',
    globalThis.fetch,
  );
  startup.dispose();
  resolveResponse(
    new Response(JSON.stringify({ schemaVersion: 1, packs: [sourcePack()] })),
  );
  await startup.ready;
  expect(create).not.toHaveBeenCalled();
  expect(root.childElementCount).toBe(0);
  expect(fetcher.mock.calls[0][1]?.signal?.aborted).toBe(true);
});

test.each(['headers', 'body'])(
  'a stalled catalog %s reaches retry after a bounded wait',
  async (stage) => {
    vi.useFakeTimers();
    const root = document.createElement('main');
    const create = vi.fn(() => ({ dispose() {} }));
    const response = new Response('{}');
    vi.spyOn(response, 'json').mockImplementation(() => new Promise(() => {}));
    const fetcher = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() =>
        stage === 'headers' ? new Promise(() => {}) : Promise.resolve(response),
      );
    const startup = startApplication(root, create, '/catalog.json', 'en');
    await vi.advanceTimersByTimeAsync(15_000);
    await startup.ready;
    expect(root.querySelector('#retry-catalog')).not.toBeNull();
    expect(fetcher.mock.calls[0][1]?.signal?.aborted).toBe(true);
    fetcher.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          schemaVersion: 1,
          packs: bundledPacks(),
        }),
      ),
    );
    root.querySelector('button')?.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(create).toHaveBeenCalledOnce();
    expect(fetcher.mock.calls[1][1]?.signal?.aborted).toBe(false);
    startup.dispose();
    expect(vi.getTimerCount()).toBe(0);
  },
);

test('incomplete data is recoverable before real App construction with saved Czech preferences', async () => {
  const root = document.createElement('main');
  document.body.append(root);
  const saved = JSON.stringify({
    schemaVersion: 1,
    packs: [],
    preferences: {
      language: 'cs',
      theme: 'light',
      setup: { ...defaultSetup('cs'), mode: 'letters' },
    },
  });
  localStorage.setItem('hexy.library.v1', saved);
  const create = vi.fn(
    /** @param {import('../src/domain/types.js').Pack[]} packs */
    (packs) =>
      new App(
        root,
        browserClock,
        () => 0,
        () => 'real-app',
        packs,
      ),
  );
  const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        schemaVersion: 1,
        packs: bundledPacks().filter((pack) => pack.language === 'en'),
      }),
    ),
  );
  const startup = startApplication(root, create, '/catalog.json', 'cs');
  await startup.ready;
  expect(create).not.toHaveBeenCalled();
  expect(root.querySelector('#retry-catalog')).not.toBeNull();
  expect(localStorage.getItem('hexy.library.v1')).toBe(saved);
  fetcher.mockResolvedValueOnce(
    new Response(JSON.stringify({ schemaVersion: 1, packs: bundledPacks() })),
  );
  root.querySelector('button')?.click();
  await vi.waitFor(() =>
    expect(root.querySelector('#new-game')).not.toBeNull(),
  );
  expect(create).toHaveBeenCalledOnce();
  expect(localStorage.getItem('hexy.library.v1')).toBe(saved);
  startup.dispose();
});
