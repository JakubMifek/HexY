import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, expect, test } from 'vitest';
import { applicationKey } from '../deploy/content.js';
import { manifest, selected } from '../deploy/releases.js';
import { update } from '../deploy/update.js';
import { contentData } from '../scripts/content-data.js';
import {
  buildFixture,
  FIRST,
  SECOND,
  fixture,
} from './private-preview-fixtures.js';
import { sourcePack } from './fixtures.js';
import { assertContentOnly } from '../scripts/check-content-release.js';

test('content-only gate rejects application, tooling and test changes instead of skipping their checks', () => {
  expect(() =>
    assertContentOnly([
      'src/content/new-pack.json',
      'src/content-order.json',
      'docs/phase-12-deck-inventory.json',
      'README.md',
    ]),
  ).not.toThrow();
  for (const path of [
    'src/app.js',
    'src/ui/strings.js',
    'src/content/catalog.js',
    'scripts/prepare-content.js',
    'tests/content.test.js',
    'package.json',
    'deploy/update.js',
    'vite.config.js',
  ])
    expect(() => assertContentOnly([path])).toThrow('full gate');
});

/** @type {string[]} */
const owned = [];
afterEach(() => {
  for (const path of owned.splice(0)) rmSync(path, { recursive: true });
});

function setup() {
  const { directory, root } = fixture();
  owned.push(directory);
  let revision = FIRST;
  let code = 'console.log("app");';
  let pack = sourcePack();
  /** @type {string[]} */
  const calls = [];
  /** @type {import('../deploy/io.js').Runner} */
  const execute = (command, args) => {
    calls.push(`${command} ${args.join(' ')}`);
    const source = join(root, 'work/source');
    if (args[0] === 'rev-parse') return revision;
    if (args[0] === 'checkout') {
      mkdirSync(join(source, 'src/content'), { recursive: true });
      writeFileSync(join(source, 'src/main.js'), code);
      writeFileSync(
        join(source, 'src/content-order.json'),
        '["test-source.json"]',
      );
      writeFileSync(
        join(source, 'src/content/test-source.json'),
        JSON.stringify(pack),
      );
    }
    if (command === 'node' || (command === 'npm' && args[0] === 'run')) {
      mkdirSync(join(source, 'public'), { recursive: true });
      const data = JSON.stringify(contentData(source));
      writeFileSync(join(source, 'public/catalog.json'), data);
      if (command === 'npm') {
        const dist = join(source, 'dist');
        buildFixture(dist);
        writeFileSync(
          join(dist, 'index.html'),
          '<html><head></head><script src="/hexy/assets/index-first12345678.js"></script></html>',
        );
        writeFileSync(join(dist, 'catalog.json'), data);
      }
    }
    return '';
  };
  return {
    root,
    calls,
    execute,
    next(/** @type {string} */ nextCode = code) {
      revision = SECOND;
      code = nextCode;
      pack = { ...pack, title: 'Updated question deck' };
      calls.length = 0;
    },
  };
}

test('question-only promotion reuses byte-identical JS without npm install/build and retains rollback data', async () => {
  const state = setup();
  await update(state.root, { execute: state.execute, probe: async () => {} });
  const before = manifest(state.root, FIRST);
  state.next();
  await update(state.root, { execute: state.execute, probe: async () => {} });
  const after = manifest(state.root, SECOND);
  expect(state.calls.some((call) => call.startsWith('npm '))).toBe(false);
  expect(state.calls).toContain('node scripts/prepare-content.js');
  expect(after.application).toBe(before.application);
  expect(after.assets['index-first12345678.js']).toBe(
    before.assets['index-first12345678.js'],
  );
  expect(after.catalog).not.toBe(before.catalog);
  expect(manifest(state.root, FIRST)).toEqual(before);
  expect(
    readFileSync(
      join(state.root, 'site/releases', SECOND, 'index.html'),
      'utf8',
    ),
  ).toContain(after.catalog);
});

test('application changes rebuild, while failed data health never replaces the current release', async () => {
  const state = setup();
  await update(state.root, { execute: state.execute, probe: async () => {} });
  state.next('console.log("new application");');
  await expect(
    update(state.root, {
      execute: state.execute,
      probe: async () => {
        throw new Error('unhealthy catalog');
      },
    }),
  ).rejects.toThrow('unhealthy catalog');
  expect(state.calls.some((call) => call.startsWith('npm run build'))).toBe(
    true,
  );
  expect(selected(state.root, 'current')).toBe(FIRST);
});

test('catalog generation rejects unlisted or malformed packs; application fingerprint includes executable changes', () => {
  const { directory } = fixture();
  owned.push(directory);
  const source = join(directory, 'source');
  mkdirSync(join(source, 'src/content'), { recursive: true });
  writeFileSync(join(source, 'src/content-order.json'), '[]');
  writeFileSync(
    join(source, 'src/content/extra.json'),
    JSON.stringify(sourcePack()),
  );
  expect(() => contentData(source)).toThrow('exactly once');
  writeFileSync(join(source, 'src/content-order.json'), '["../extra.json"]');
  expect(() => contentData(source)).toThrow('Invalid content order');
  const before = applicationKey(source);
  writeFileSync(join(source, 'src/main.js'), 'changed();');
  expect(applicationKey(source)).not.toBe(before);
});
