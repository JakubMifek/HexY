import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

/** @param {string[]} paths */
export function assertContentOnly(paths) {
  const allowed =
    /^(src\/content\/[a-z0-9-]+\.json|src\/content-order\.json|(?:docs|reviews)\/.+\.(?:json|md)|(?:README|PLAN|REVIEW|IMPLEMENTATION_PHASES)\.md)$/;
  for (const path of paths)
    assert(
      allowed.test(path),
      `Application/tool/test change requires the full gate: ${path}`,
    );
}

/** @param {string} baseline */
export function checkContentRelease(baseline) {
  assert(
    /^[a-f0-9]{40}$/.test(baseline),
    'Supply the exact delivered baseline commit',
  );
  /** @param {string[]} args */
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
  git('merge-base', '--is-ancestor', baseline, 'HEAD');
  const changed = git('diff', '--name-only', '--no-renames', '-z', baseline)
    .split('\0')
    .filter(Boolean);
  const untracked = git('ls-files', '--others', '--exclude-standard', '-z')
    .split('\0')
    .filter(Boolean);
  assertContentOnly([...changed, ...untracked]);
  const prior = JSON.parse(git('show', `${baseline}:src/content-order.json`));
  const next = JSON.parse(readFileSync('src/content-order.json', 'utf8'));
  assert.deepEqual(
    next.slice(0, prior.length),
    prior,
    'Preserve every delivered deck position',
  );
  assert.equal(
    next.length,
    prior.length + 1,
    'Publish exactly one independently accepted deck',
  );
  for (const name of prior) {
    const path = `src/content/${name}`;
    assert.deepEqual(
      readFileSync(path),
      execFileSync('git', ['show', `${baseline}:${path}`]),
      `Delivered questions must remain immutable: ${path}`,
    );
  }
  execFileSync('npm', ['run', 'check:content'], { stdio: 'inherit' });
  console.log(
    `Content-only release gate passed against ${baseline}; unchanged app checks inherited.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  checkContentRelease(process.argv[2]);
