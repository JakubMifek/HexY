import {
  existsSync,
  chmodSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

export const ORIGIN = 'https://github.com/JakubMifek/HexY.git';
export const IMAGE =
  'nginx@sha256:dede8895648b461178c3bc604f7eed4423efe5220b2c4d839f5eb3d34ac3f8f7';
export const CONTAINER = 'hexy-private-preview';
export const PORT = 4183;
export const REVISION = /^[a-f0-9]{40}$/;

/** @param {string} path */
export function plainPath(path) {
  if (!path.startsWith('/') || resolve(path) !== path)
    throw new Error(`Expected a canonical absolute path: ${path}`);
  if (path === '/') return;
  plainPath(dirname(path));
  if (lstatSync(path, { throwIfNoEntry: false })?.isSymbolicLink())
    throw new Error(`Symlink is not allowed: ${path}`);
}

/** @param {string} root @param {boolean} [create] */
export function stateRoot(root, create = false) {
  plainPath(root);
  if (!/^[a-zA-Z0-9/_.-]+$/.test(root) || root === '/')
    throw new Error('Unsafe state directory');
  const marker = join(root, '.hexy-preview');
  if (create) {
    if (existsSync(root)) throw new Error(`State already exists: ${root}`);
    mkdirSync(root, { recursive: true, mode: 0o700 });
    writeFileSync(marker, 'hexy-preview-v1\n', { flag: 'wx' });
    for (const name of ['site', 'site/releases', 'site/assets']) {
      mkdirSync(join(root, name));
      chmodSync(join(root, name), 0o755);
    }
  }
  plainPath(marker);
  if (readFileSync(marker, 'utf8') !== 'hexy-preview-v1\n')
    throw new Error('Not a HexY preview state directory');
  for (const name of ['site', 'site/releases', 'site/assets', 'lock'])
    plainPath(join(root, name));
  return root;
}

/** @param {string} path @param {string} data */
export function atomicFile(path, data) {
  plainPath(path);
  plainPath(`${path}.next`);
  writeFileSync(`${path}.next`, data);
  renameSync(`${path}.next`, path);
}

/** @param {string} path @returns {string[]} */
export function files(path) {
  plainPath(path);
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const child = join(path, entry.name);
    if (entry.isDirectory()) return files(child);
    if (!entry.isFile()) throw new Error(`Non-regular build file: ${child}`);
    return [child];
  });
}

/** Only these disposable, owned subtrees may be removed.
 * @param {string} root @param {string} name */
export function removeOwned(root, name) {
  if (!/^(work|site\/releases\/[a-f0-9]{40})$/.test(name))
    throw new Error('Unsafe cleanup target');
  stateRoot(root);
  const path = join(root, name);
  plainPath(path);
  if (!existsSync(path)) return;
  // npm creates .bin symlinks; rm removes those links, never their targets.
  if (name !== 'work') files(path);
  rmSync(path, { recursive: true });
}

/** @typedef {(command: string, args: string[], cwd?: string, seconds?: number) => string} Runner */
/** @type {Runner} */
export function run(command, args, cwd, seconds = 120) {
  const env = {
    PATH: process.env.PATH,
    HOME: cwd ? join(cwd, '..', 'home') : process.env.HOME,
    TMPDIR: cwd ? join(cwd, '..', 'tmp') : process.env.TMPDIR,
    XDG_RUNTIME_DIR: cwd ? undefined : process.env.XDG_RUNTIME_DIR,
    DBUS_SESSION_BUS_ADDRESS: cwd
      ? undefined
      : process.env.DBUS_SESSION_BUS_ADDRESS,
    GIT_TERMINAL_PROMPT: '0',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: '/dev/null',
    LANG: 'C.UTF-8',
  };
  return execFileSync(
    'timeout',
    ['--kill-after=5s', `${seconds}s`, command, ...args],
    { cwd, env, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
  ).trim();
}
