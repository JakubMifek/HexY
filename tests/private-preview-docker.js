import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { createServer, request } from 'node:http';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { ORIGIN, removeOwned, run, stateRoot } from '../deploy/io.js';
import { manifest, selected, stage } from '../deploy/releases.js';
import { health, startServer } from '../deploy/server.js';
import { promote, rollback, update } from '../deploy/update.js';
import { serviceUpdate } from './private-preview-service.js';

const directory = resolve('.artifacts', `preview-docker-${randomUUID()}`);
const root = join(directory, 'state');
const name = `hexy-preview-test-${randomUUID()}`;
const port = 4185;
const candidatePort = 4186;
const proxyPort = 4187;
const serviceContext = process.argv.includes('--service-context');
const probe = /** @type {import('../deploy/update.js').Probe} */ (
  (revision, target) => health(root, revision, target, { port, candidatePort })
);
process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve('.artifacts/browsers');
process.env.TMPDIR = resolve('.artifacts');
const { chromium, expect } = await import('@playwright/test');

async function priorMainBuild() {
  for (const part of ['source', 'home', 'tmp', 'cache'])
    mkdirSync(join(root, 'work', part), { recursive: true });
  const source = join(root, 'work/source');
  run('git', ['init', '--quiet', source], source);
  run(
    'git',
    [
      '-c',
      'credential.helper=',
      'fetch',
      '--quiet',
      '--depth=2',
      '--no-tags',
      ORIGIN,
      '+refs/heads/main:refs/remotes/origin/main',
    ],
    source,
  );
  const previous = run(
    'git',
    ['rev-parse', 'refs/remotes/origin/main^'],
    source,
  );
  const upstream = run(
    'git',
    ['rev-parse', 'refs/remotes/origin/main'],
    source,
  );
  run('git', ['checkout', '--quiet', '--detach', previous], source);
  run(
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
  run('npm', ['run', 'build', '--', '--base=/hexy/'], source, 180);
  stage(root, previous, join(source, 'dist'));
  removeOwned(root, 'work');
  return { previous, upstream };
}

function stripPrefixProxy() {
  return createServer((incoming, outgoing) => {
    const url = incoming.url ?? '/';
    if (url !== '/hexy' && !url.startsWith('/hexy/')) {
      outgoing.writeHead(404).end();
      return;
    }
    // Mirrors Tailscale's StripPrefix("/hexy", proxy); it is not a live tailnet test.
    const forwarded = request(
      `http://127.0.0.1:${port}${url.slice(5) || '/'}`,
      {
        method: incoming.method,
      },
      (response) => {
        outgoing.writeHead(response.statusCode ?? 502, response.headers);
        response.pipe(outgoing);
      },
    );
    forwarded.on('error', () => outgoing.writeHead(502).end());
    incoming.pipe(forwarded);
  });
}

async function waitForNginx() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/version.json`, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.status === 404) return;
    } catch {
      // Only the bounded container-start readiness probe retries connection failures.
    }
    await setTimeout(100);
  }
  throw new Error('NGINX did not become responsive');
}

/** @param {string} revision */
async function routingAndCache(revision) {
  const base = `http://127.0.0.1:${proxyPort}/hexy`;
  for (const suffix of ['', '/', '/index.html', '/version.json']) {
    const response = await fetch(base + suffix);
    assert.equal(response.status, 200, suffix);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  const version = await fetch(`${base}/version.json`);
  assert.equal((await version.json()).revision, revision);
  const hashes = manifest(root, revision).assets;
  for (const asset of Object.keys(hashes)) {
    const response = await fetch(`${base}/assets/${asset}`);
    assert.equal(response.status, 200, asset);
    assert.equal(
      response.headers.get('cache-control'),
      'public, max-age=31536000, immutable',
    );
  }
  for (const path of [
    '/manifest.json',
    '/releases/',
    '/.git/config',
    '/assets/missing.js',
  ]) {
    assert.equal((await fetch(base + path)).status, 404, path);
  }
}

/** @param {import('@playwright/test').Page} page */
async function startLiveGame(page) {
  await page.clock.install({ time: new Date('2026-10-28T12:00:00Z') });
  await page.goto(`http://127.0.0.1:${proxyPort}/hexy/`);
  await page.clock.pauseAt(new Date('2026-10-28T12:01:00Z'));
  await page.locator('#ui-language').selectOption('en');
  await page.locator('#language').selectOption('en');
  await page.locator('#answerMode').selectOption('hosted');
  await page.locator('#starter').selectOption('A');
  await page.locator('#start').click();
  await page.locator('#cell-1').click();
  await page.locator('#judge-correct').click();
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
  return page.evaluate(() => JSON.stringify(localStorage));
}

function containerBoundaries() {
  const info = JSON.parse(run('docker', ['inspect', name]))[0];
  assert.equal(info.Config.User, '101:101');
  assert.equal(info.HostConfig.ReadonlyRootfs, true);
  assert.deepEqual(info.HostConfig.CapDrop, ['ALL']);
  assert.equal(info.HostConfig.RestartPolicy.Name, 'no');
  assert.equal(info.HostConfig.PortBindings['8080/tcp'][0].HostIp, '127.0.0.1');
  assert.equal(info.HostConfig.PortBindings['8081/tcp'][0].HostIp, '127.0.0.1');
  assert.equal(
    info.HostConfig.PortBindings['8081/tcp'][0].HostPort,
    String(candidatePort),
  );
  assert.deepEqual(Object.keys(info.HostConfig.PortBindings).sort(), [
    '8080/tcp',
    '8081/tcp',
  ]);
  assert.equal(
    info.Mounts.filter(/** @param {{RW: boolean}} mount */ (mount) => mount.RW)
      .length,
    0,
  );
  assert.equal(info.Mounts.length, 2);
}

/** @param {import('@playwright/test').Page} page @param {string} previous @param {string} upstream */
async function updateWhilePlaying(page, previous, upstream) {
  const storage = await startLiveGame(page);
  /** @type {string[]} */
  const navigations = [];
  page.on('framenavigated', (frame) => navigations.push(frame.url()));
  const oldHtml = await (await fetch(`http://127.0.0.1:${port}/`)).text();
  if (serviceContext) serviceUpdate(root, name, { port, candidatePort });
  else await update(root, { probe });
  assert.equal(selected(root, 'current'), upstream);
  assert.notEqual(previous, upstream);
  assert.deepEqual(navigations, []);
  assert.ok(
    (await page.evaluate(() => JSON.stringify(localStorage))) === storage,
    'Deployment must not change any live localStorage bytes',
  );
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
  for (const [, url] of oldHtml.matchAll(/(?:src|href)="([^"]+)"/g))
    assert.equal(
      (await fetch(`http://127.0.0.1:${proxyPort}${url}`)).status,
      200,
    );
  await page.screenshot({ path: '.artifacts/preview-docker-live-game.png' });
  await routingAndCache(upstream);
  await page.reload();
  await expect(page.locator('#cell-1')).toHaveAttribute('data-owner', 'A');
  assertRecovered(
    storage,
    await page.evaluate(() => JSON.stringify(localStorage)),
  );
}

/** @param {string} before @param {string} after */
function assertRecovered(before, after) {
  const oldStorage = JSON.parse(before);
  const newStorage = JSON.parse(after);
  assert.deepEqual(
    Object.keys(newStorage).sort(),
    Object.keys(oldStorage).sort(),
  );
  assert.ok(
    newStorage['hexy.library.v1'] === oldStorage['hexy.library.v1'],
    'Library unchanged',
  );
  const oldGame = JSON.parse(oldStorage['hexy.game.v1']);
  const newGame = JSON.parse(newStorage['hexy.game.v1']);
  assert.notEqual(newGame.sessionId, oldGame.sessionId);
  assert.equal(newGame.revision, oldGame.revision + 1);
  assert.ok(newGame.lastNow >= oldGame.lastNow);
  for (const key of ['sessionId', 'revision', 'lastNow']) {
    delete newGame[key];
    delete oldGame[key];
  }
  assert.ok(
    JSON.stringify(newGame) === JSON.stringify(oldGame),
    'Recovery preserves entire locked pack, board and game',
  );
}

/** @param {string} previous @param {string} upstream */
async function rollbackAndFailure(previous, upstream) {
  await rollback(root, previous, probe);
  await routingAndCache(previous);
  await assert.rejects(
    promote(root, upstream, async (revision, target) => {
      await probe(revision, target);
      if (target === 'current') throw new Error('Injected post-switch failure');
    }),
    /Injected/,
  );
  assert.equal(selected(root, 'current'), previous);
  await routingAndCache(previous);
  await update(root, { probe });
  await routingAndCache(upstream);
}

mkdirSync(directory, { recursive: true });
stateRoot(root, true);
mkdirSync(join(root, 'runtime'));
copyFileSync('deploy/nginx.conf', join(root, 'runtime/nginx.conf'));
const proxy = stripPrefixProxy();
let started = false;
/** @type {import('@playwright/test').Browser | undefined} */
let browser;
try {
  await startServer(root, name, { port, candidatePort }, false);
  started = true;
  await waitForNginx();
  await new Promise((resolve, reject) => {
    proxy.once('error', reject);
    proxy.listen(proxyPort, '127.0.0.1', () => resolve(undefined));
  });
  containerBoundaries();
  const { previous, upstream } = await priorMainBuild();
  console.log('Fetched real main ancestry:', { previous, upstream });
  await promote(root, previous, probe);
  await routingAndCache(previous);
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1365, height: 900 },
  });
  /** @type {string[]} */
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await updateWhilePlaying(page, previous, upstream);
  await rollbackAndFailure(previous, upstream);
  assert.deepEqual(errors, []);
  console.log(
    'PASS: real main builds, hardened Docker, stripped /hexy/, cache, live game, old assets, rollback',
  );
  console.log(readFileSync(join(root, 'status.json'), 'utf8'));
} finally {
  await browser?.close();
  proxy.closeAllConnections();
  await new Promise((resolve) => proxy.close(resolve));
  if (started) run('docker', ['rm', '--force', name]);
  rmSync(directory, { recursive: true });
}
