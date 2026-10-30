// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import {
  LocalLibrary,
  LIBRARY_KEY,
  validateLibrary,
} from '../src/runtime/library.js';
import { validatePreferences } from '../src/domain/preferences.js';
import { defaultSetup } from './fixtures.js';
import { bundledPacks } from '../src/content/catalog.js';

function data() {
  return {
    schemaVersion: /** @type {const} */ (1),
    packs: [bundledPacks()[1]],
    preferences: {
      language: /** @type {const} */ ('en'),
      theme: 'dark',
      setup: defaultSetup('en'),
    },
  };
}

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test('versioned local library roundtrips owned packs and complete settings', () => {
  const library = new LocalLibrary();
  expect(library.load()).toBeNull();
  const original = data();
  library.save(original);
  expect(new LocalLibrary().load()).toEqual(original);
  original.packs[0].title = 'Later edit';
  expect(new LocalLibrary().load()?.packs[0].title).not.toBe('Later edit');
  expect(
    validateLibrary(JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? '{}'))
      .preferences,
  ).toEqual(original.preferences);
});

test.each(['{', '{"schemaVersion":2}', '{"schemaVersion":1}', 'null'])(
  'unreadable or incompatible local library %s is never overwritten',
  (json) => {
    localStorage.setItem(LIBRARY_KEY, json);
    const library = new LocalLibrary();
    expect(() => library.load()).toThrow(
      expect.objectContaining({
        code: json.includes(':2') ? 'libraryVersion' : 'storageCorrupt',
      }),
    );
    expect(() => library.save(data())).toThrow(
      expect.objectContaining({ code: 'storageBlocked' }),
    );
    expect(localStorage.getItem(LIBRARY_KEY)).toBe(json);
  },
);

test('duplicate stored pack IDs and invalid preferences reject the complete snapshot', () => {
  const original = data();
  original.packs.push(original.packs[0]);
  expect(() => validateLibrary(original)).toThrow(
    expect.objectContaining({ code: 'packIdConflict' }),
  );
  for (const setup of [
    { ...defaultSetup('en'), seconds: 3601 },
    { ...defaultSetup('en'), seconds: 0 },
    {
      ...defaultSetup('en'),
      players: {
        A: { name: 'A', color: 'red' },
        B: { name: 'B', color: '#ffffff' },
      },
    },
  ])
    expect(() =>
      validatePreferences({ ...original.preferences, setup }),
    ).toThrow();
});

test('denied access and read errors block writes without losing the stored original', () => {
  const library = new LocalLibrary(() => {
    throw new DOMException('Denied', 'SecurityError');
  });
  expect(() => library.load()).toThrow(
    expect.objectContaining({ code: 'storageReadUnavailable' }),
  );
  expect(() => library.save(data())).toThrow(
    expect.objectContaining({ code: 'storageBlocked' }),
  );
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Read failed');
  });
  expect(() => new LocalLibrary().load()).toThrow(
    expect.objectContaining({ code: 'storageReadUnavailable' }),
  );
});

test('quota and write failures preserve previously saved data; retry can succeed', () => {
  const library = new LocalLibrary();
  library.load();
  library.save(data());
  const original = localStorage.getItem(LIBRARY_KEY);
  const write = vi
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError');
    });
  expect(() => library.save(data())).toThrow(
    expect.objectContaining({ code: 'storageQuota' }),
  );
  expect(localStorage.getItem(LIBRARY_KEY)).toBe(original);
  write.mockImplementation(() => {
    throw new Error('Denied');
  });
  expect(() => library.save(data())).toThrow(
    expect.objectContaining({ code: 'storageUnavailable' }),
  );
  write.mockRestore();
  library.save(data());
  expect(library.load()).toEqual(data());
});

test('a failed reread revokes earlier write permission instead of overwriting damaged data', () => {
  const library = new LocalLibrary();
  library.load();
  library.save(data());
  localStorage.setItem(LIBRARY_KEY, '{');
  expect(() => library.load()).toThrow(
    expect.objectContaining({ code: 'storageCorrupt' }),
  );
  expect(() => library.save(data())).toThrow(
    expect.objectContaining({ code: 'storageBlocked' }),
  );
  expect(localStorage.getItem(LIBRARY_KEY)).toBe('{');
});
