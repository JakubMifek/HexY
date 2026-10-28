import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { stateRoot } from '../deploy/io.js';

export const FIRST = 'a'.repeat(40);
export const SECOND = 'b'.repeat(40);

export function fixture() {
  const directory = resolve('.artifacts', `preview-unit-${randomUUID()}`);
  mkdirSync(directory, { recursive: true });
  const root = join(directory, 'state');
  stateRoot(root, true);
  return { directory, root };
}

/** @param {string} dist @param {string} [label] */
export function buildFixture(dist, label = 'first') {
  mkdirSync(join(dist, 'assets'), { recursive: true });
  const asset = `index-${label}12345678.js`;
  writeFileSync(join(dist, 'assets', asset), `console.log("${label}");\n`);
  writeFileSync(
    join(dist, 'index.html'),
    `<html><script type="module" src="/hexy/assets/${asset}"></script></html>\n`,
  );
  return asset;
}

/** @param {string} root @param {string} revision @param {string} [fail] */
export function fakeCommands(root, revision, fail = '') {
  /** @type {Array<{command: string, args: string[], cwd?: string}>} */
  const calls = [];
  /** @type {import('../deploy/io.js').Runner} */
  const execute = (command, args, cwd) => {
    calls.push({ command, args, cwd });
    if (args.includes(fail)) throw new Error(`Injected ${fail} failure`);
    if (args[0] === 'rev-parse') return revision;
    if (command === 'npm' && args[0] === 'run')
      buildFixture(join(root, 'work/source/dist'), revision.slice(0, 8));
    return '';
  };
  return { execute, calls };
}
