import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  renameSync,
  statSync,
  symlinkSync,
  unlinkSync,
  readdirSync,
} from 'node:fs';
import { basename, join } from 'node:path';
import { createHash } from 'node:crypto';
import { atomicFile, files, plainPath, removeOwned, REVISION } from './io.js';

const MAX_BUILD_BYTES = 32 * 1024 * 1024;
const MAX_ASSET_BYTES = 512 * 1024 * 1024;
const ASSET = /^[a-zA-Z0-9_-]+-[a-zA-Z0-9_-]{8,}\.(js|css|svg|png|woff2?)$/;

/** @param {string} path */
export function digest(path) {
  plainPath(path);
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/** @param {string} dist */
export function validateBuild(dist) {
  const entries = files(dist);
  if (entries.length < 2 || entries.length > 512)
    throw new Error('Build must contain index and bounded hashed assets');
  if (
    entries.reduce((size, file) => size + statSync(file).size, 0) >
    MAX_BUILD_BYTES
  )
    throw new Error('Build exceeds 32 MiB');
  const assets = entries.filter((file) => file !== join(dist, 'index.html'));
  for (const asset of assets) {
    if (
      asset !== join(dist, 'assets', basename(asset)) ||
      !ASSET.test(basename(asset))
    )
      throw new Error(`Unexpected build asset: ${asset}`);
  }
  validateIndex(dist);
  return assets;
}

/** @param {string} dist */
function validateIndex(dist) {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(
    (match) => match[1],
  );
  if (!references.some((url) => url.endsWith('.js')))
    throw new Error('Missing JavaScript entry');
  for (const url of references) {
    if (!url.startsWith('/hexy/assets/') || !ASSET.test(url.slice(13)))
      throw new Error(`Build is not rooted at /hexy/: ${url}`);
    if (!existsSync(join(dist, url.slice(6))))
      throw new Error(`Missing referenced asset: ${url}`);
  }
}

/** @param {string} root @param {string} revision @param {string} dist */
export function stage(root, revision, dist) {
  if (!REVISION.test(revision)) throw new Error('Invalid revision');
  const assets = validateBuild(dist);
  const assetRoot = join(root, 'site/assets');
  const existing = files(assetRoot);
  const additions = assets.filter(
    (file) => !existsSync(join(assetRoot, basename(file))),
  );
  const size = [...existing, ...additions].reduce(
    (total, file) => total + statSync(file).size,
    0,
  );
  if (size > MAX_ASSET_BYTES || existing.length + additions.length > 16384)
    throw new Error(
      'Retained asset quota reached; keep current, see operations guide',
    );
  for (const file of assets) {
    const target = join(assetRoot, basename(file));
    plainPath(target);
    if (existsSync(target) && digest(target) !== digest(file))
      throw new Error(`Hashed asset collision: ${basename(file)}`);
  }
  for (const file of additions) {
    const target = join(assetRoot, basename(file));
    plainPath(`${target}.next`);
    copyFileSync(file, `${target}.next`);
    renameSync(`${target}.next`, target);
  }
  const release = join(root, 'site/releases', revision);
  plainPath(release);
  if (existsSync(release)) throw new Error('Release already exists');
  const staged = join(root, 'work/release');
  plainPath(staged);
  mkdirSync(staged, { recursive: true });
  copyFileSync(join(dist, 'index.html'), join(staged, 'index.html'));
  atomicFile(join(staged, 'version.json'), JSON.stringify({ revision }) + '\n');
  const hashes = Object.fromEntries(
    assets.map((file) => [basename(file), digest(file)]),
  );
  atomicFile(
    join(staged, 'manifest.json'),
    JSON.stringify({
      index: digest(join(staged, 'index.html')),
      assets: hashes,
    }) + '\n',
  );
  renameSync(staged, release);
}

/** @param {string} root @param {'current'|'candidate'} name */
export function selected(root, name) {
  const path = join(root, 'site', name);
  let target;
  try {
    target = readlinkSync(path);
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === 'ENOENT')
      return null;
    throw error;
  }
  if (!/^releases\/[a-f0-9]{40}$/.test(target))
    throw new Error(`Unsafe ${name} link`);
  plainPath(join(root, 'site', target));
  return target.slice(9);
}

/** @param {string} root @param {'current'|'candidate'} name @param {string|null} revision */
export function select(root, name, revision) {
  selected(root, name);
  const path = join(root, 'site', name);
  const next = `${path}.next`;
  if (!revision) {
    if (existsSync(path)) unlinkSync(path);
    return;
  }
  if (!REVISION.test(revision)) throw new Error('Invalid revision');
  plainPath(join(root, 'site/releases', revision));
  // A crash may leave this unpublished link; never follow it.
  if (readlinkIfPresent(next)) unlinkSync(next);
  else plainPath(next);
  symlinkSync(`releases/${revision}`, next);
  renameSync(next, path);
}

/** @param {string} path */
function readlinkIfPresent(path) {
  try {
    return readlinkSync(path);
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === 'ENOENT')
      return null;
    throw error;
  }
}

/** @param {string} root @param {string} revision */
export function manifest(root, revision) {
  if (!REVISION.test(revision)) throw new Error('Invalid revision');
  const release = join(root, 'site/releases', revision);
  files(release);
  const version = JSON.parse(
    readFileSync(join(release, 'version.json'), 'utf8'),
  );
  if (version.revision !== revision) throw new Error('Revision mismatch');
  /** @type {{index: string, assets: Record<string, string>}} */
  const saved = JSON.parse(
    readFileSync(join(release, 'manifest.json'), 'utf8'),
  );
  if (saved.index !== digest(join(release, 'index.html')))
    throw new Error('Release index mismatch');
  const hashes = saved.assets;
  if (!Object.keys(hashes).length) throw new Error('Empty release');
  for (const [name, hash] of Object.entries(hashes)) {
    if (!ASSET.test(name) || digest(join(root, 'site/assets', name)) !== hash)
      throw new Error('Release asset mismatch');
  }
  return saved;
}

/** @param {string} root @param {string[]} protectedRevisions */
export function prune(root, protectedRevisions) {
  const releases = join(root, 'site/releases');
  const entries = readdirSync(releases);
  if (entries.some((name) => !REVISION.test(name)))
    throw new Error('Unexpected release directory; cleanup refused');
  for (const name of entries) plainPath(join(releases, name));
  const sorted = entries.sort(
    (a, b) =>
      statSync(join(releases, b)).mtimeMs - statSync(join(releases, a)).mtimeMs,
  );
  const keep = new Set([...protectedRevisions, ...sorted.slice(0, 3)]);
  for (const revision of sorted) {
    if (!keep.has(revision)) removeOwned(root, `site/releases/${revision}`);
  }
}
