import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import {
  atomicFile,
  ORIGIN,
  plainPath,
  removeOwned,
  REVISION,
  run,
  stateRoot,
} from './io.js';
import { manifest, prune, select, selected, stage } from './releases.js';
import { health } from './server.js';

/** @typedef {(revision: string, target: 'current'|'candidate') => Promise<void>} Probe */
/** @param {string} root */
function recoverPromotion(root) {
  const pending = join(root, 'pending.json');
  plainPath(pending);
  if (!existsSync(pending)) return;
  const { previous } = JSON.parse(readFileSync(pending, 'utf8'));
  if (previous !== null) manifest(root, previous);
  select(root, 'current', previous);
  unlinkSync(pending);
  console.log('Recovered interrupted promotion to', previous);
}

/** @param {string} root @param {string} revision @param {Probe} probe */
export async function promote(root, revision, probe) {
  manifest(root, revision);
  const previous = selected(root, 'current');
  select(root, 'candidate', revision);
  await probe(revision, 'candidate');
  atomicFile(
    join(root, 'pending.json'),
    JSON.stringify({ previous, revision }),
  );
  try {
    select(root, 'current', revision);
    await probe(revision, 'current');
  } catch (error) {
    select(root, 'current', previous);
    unlinkSync(join(root, 'pending.json'));
    throw error;
  }
  unlinkSync(join(root, 'pending.json'));
  return previous;
}

/** @param {string} root @param {import('./io.js').Runner} execute */
function fetchMain(root, execute) {
  removeOwned(root, 'work');
  const work = join(root, 'work');
  for (const dir of ['source', 'home', 'tmp', 'cache'])
    mkdirSync(join(work, dir), { recursive: true });
  const source = join(work, 'source');
  execute('git', ['init', '--quiet', source], source);
  execute(
    'git',
    [
      '-c',
      'credential.helper=',
      'fetch',
      '--quiet',
      '--depth=1',
      '--no-tags',
      ORIGIN,
      '+refs/heads/main:refs/remotes/origin/main',
    ],
    source,
  );
  const revision = execute(
    'git',
    ['rev-parse', 'refs/remotes/origin/main'],
    source,
  );
  if (!REVISION.test(revision))
    throw new Error('Invalid fetched main revision');
  execute('git', ['checkout', '--quiet', '--detach', revision], source);
  return { source, revision };
}

/** @param {string} root @param {string|null} upstream @param {string|null} error */
function status(root, upstream, error) {
  atomicFile(
    join(root, 'status.json'),
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        upstream,
        served: selected(root, 'current'),
        error,
      },
      null,
      2,
    ) + '\n',
  );
}

/** @param {string} root
 * @param {{execute?: import('./io.js').Runner, probe?: Probe}} [options] */
export async function update(root, options = {}) {
  stateRoot(root);
  const execute = options.execute ?? run;
  const probe =
    options.probe ?? ((revision, target) => health(root, revision, target));
  let upstream = null;
  try {
    recoverPromotion(root);
    const { source, revision } = fetchMain(root, execute);
    upstream = revision;
    if (selected(root, 'current') === revision) {
      await probe(revision, 'current');
      status(root, upstream, null);
      return;
    }
    if (!existsSync(join(root, 'site/releases', revision))) {
      execute(
        'npm',
        [
          'ci',
          '--ignore-scripts',
          '--no-audit',
          '--no-fund',
          '--cache',
          join(root, 'work/cache'),
        ],
        source,
        300,
      );
      execute('npm', ['run', 'build', '--', '--base=/hexy/'], source, 180);
      stage(root, revision, join(source, 'dist'));
    }
    const previous = selected(root, 'current');
    prune(root, previous ? [revision, previous] : [revision]);
    await promote(root, revision, probe);
    status(root, upstream, null);
    console.log(`Serving pushed main ${revision}`);
  } catch (error) {
    status(root, upstream, String(error));
    throw error;
  } finally {
    removeOwned(root, 'work');
  }
}

/** @param {string} root @param {string} revision @param {Probe} [probe] */
export async function rollback(
  root,
  revision,
  probe = (sha, target) => health(root, sha, target),
) {
  stateRoot(root);
  recoverPromotion(root);
  await promote(root, revision, probe);
  status(
    root,
    null,
    'Manual rollback; timer must remain stopped until ready to follow main',
  );
}
