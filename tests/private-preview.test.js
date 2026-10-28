import {
  existsSync,
  closeSync,
  ftruncateSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { afterEach, expect, it, vi } from 'vitest';
import {
  atomicFile,
  files,
  ORIGIN,
  run,
  removeOwned,
  stateRoot,
} from '../deploy/io.js';
import {
  manifest,
  prune,
  select,
  selected,
  stage,
  validateBuild,
} from '../deploy/releases.js';
import { promote, rollback, update } from '../deploy/update.js';
import {
  absentContainer,
  freePort,
  health,
  startServer,
} from '../deploy/server.js';
import {
  checkRoute,
  install,
  SERVICE,
  TIMER,
  units,
} from '../deploy/install.js';
import {
  buildFixture,
  fakeCommands,
  FIRST,
  fixture,
  SECOND,
} from './private-preview-fixtures.js';

/** @type {string[]} */
const owned = [];
function setup() {
  const value = fixture();
  owned.push(value.directory);
  return value;
}
afterEach(() => {
  vi.restoreAllMocks();
  for (const directory of owned.splice(0))
    rmSync(directory, { recursive: true });
});

it.each(['current', 'candidate'])(
  'hash-checks %s over its own loopback HTTP endpoint without Docker',
  async (target) => {
    const { root } = setup();
    const dist = join(root, 'work/dist');
    const asset = buildFixture(dist);
    writeFileSync(
      join(dist, 'assets', asset),
      new Uint8Array([0, 255, 13, 10]),
    );
    stage(root, FIRST, dist);
    const fetcher = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (input) => {
        const path = new URL(String(input)).pathname.slice(1);
        const file = path.startsWith('assets/')
          ? join(root, 'site', path)
          : join(root, 'site/releases', FIRST, path);
        return new Response(new Uint8Array(readFileSync(file)));
      });
    const endpoint = target === 'current' ? '42000' : '42001';
    await health(root, FIRST, /** @type {'current'|'candidate'} */ (target), {
      port: 42000,
      candidatePort: 42001,
    });
    expect(fetcher.mock.calls).toHaveLength(3);
    expect(
      fetcher.mock.calls.every(([url]) =>
        String(url).startsWith(`http://127.0.0.1:${endpoint}/`),
      ),
    ).toBe(true);
    fetcher.mockResolvedValueOnce(new Response('unavailable', { status: 503 }));
    await expect(health(root, FIRST, 'candidate')).rejects.toThrow(
      'Health HTTP 503',
    );
  },
);

it('rejects an occupied candidate listener before creating a container', async () => {
  const { root } = setup();
  const listener = createServer();
  await new Promise((resolve) =>
    listener.listen(0, '127.0.0.1', () => resolve(undefined)),
  );
  const { port } = /** @type {import('node:net').AddressInfo} */ (
    listener.address()
  );
  const execute = vi.fn(
    (/** @type {string} */ _command, /** @type {string[]} */ _args) => '',
  );
  try {
    await expect(
      startServer(
        root,
        'hexy-test',
        { port: 0, candidatePort: port },
        false,
        execute,
      ),
    ).rejects.toThrow('EADDRINUSE');
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute.mock.calls[0]?.[0]).toBe('docker');
  } finally {
    await new Promise((resolve) => listener.close(resolve));
  }
});

/** @param {string} root @param {string} revision */
function release(root, revision) {
  removeOwned(root, 'work');
  const dist = join(root, 'work/dist');
  const asset = buildFixture(dist, revision.slice(0, 8));
  stage(root, revision, dist);
  return asset;
}

it('validates /hexy/ builds and retains exact old assets across atomic promotion', async () => {
  const { root } = setup();
  const oldAsset = release(root, FIRST);
  await promote(root, FIRST, async () => {});
  const old = readFileSync(join(root, 'site/assets', oldAsset));
  release(root, SECOND);
  /** @type {Array<[string, string|null]>} */
  const observed = [];
  await promote(root, SECOND, async (_revision, target) => {
    observed.push([target, selected(root, 'current')]);
  });
  expect(observed).toEqual([
    ['candidate', FIRST],
    ['current', SECOND],
  ]);
  expect(readFileSync(join(root, 'site/assets', oldAsset))).toEqual(old);
  expect(
    JSON.parse(readFileSync(join(root, 'site/current/version.json'), 'utf8')),
  ).toEqual({ revision: SECOND });
});

it.each(['candidate', 'current'])(
  'rolls back on failed %s health',
  async (failure) => {
    const { root } = setup();
    release(root, FIRST);
    select(root, 'current', FIRST);
    const before = readFileSync(join(root, 'site/current/index.html'));
    release(root, SECOND);
    await expect(
      promote(root, SECOND, async (_sha, target) => {
        if (target === failure) throw new Error('Unhealthy');
      }),
    ).rejects.toThrow('Unhealthy');
    expect(selected(root, 'current')).toBe(FIRST);
    expect(readFileSync(join(root, 'site/current/index.html'))).toEqual(before);
    expect(existsSync(join(root, 'pending.json'))).toBe(false);
  },
);

it('rejects an incomplete existing release without changing current', async () => {
  const { root } = setup();
  release(root, FIRST);
  select(root, 'current', FIRST);
  mkdirSync(join(root, 'site/releases', SECOND));
  await expect(promote(root, SECOND, async () => {})).rejects.toThrow();
  expect(selected(root, 'current')).toBe(FIRST);
});

it.each(['../escape', '/outside', 'x'.repeat(40)])(
  'rejects unsafe revision %s',
  (revision) => {
    const { root } = setup();
    expect(() => select(root, 'current', revision)).toThrow('Invalid revision');
    expect(() => manifest(root, revision)).toThrow('Invalid revision');
    expect(() => removeOwned(root, `site/releases/${revision}`)).toThrow();
  },
);

it('refuses state, current, assets and source symlink escapes', () => {
  const { directory, root } = setup();
  const alias = join(directory, 'alias');
  symlinkSync(root, alias);
  expect(() => stateRoot(alias)).toThrow('Symlink');
  symlinkSync('../outside', join(root, 'site/current'));
  expect(() => selected(root, 'current')).toThrow('Unsafe');
  symlinkSync(directory, join(root, 'site/assets/escape'));
  expect(() => files(join(root, 'site/assets'))).toThrow('Non-regular');
  const dist = join(root, 'work/dist');
  buildFixture(dist);
  symlinkSync(directory, join(dist, 'escape'));
  expect(() => validateBuild(dist)).toThrow('Non-regular');
  expect(() => removeOwned(root, 'site/assets')).toThrow('Unsafe cleanup');
});

it('rejects missing, root-based, nested and oversized assets', () => {
  const { root } = setup();
  const dist = join(root, 'work/dist');
  const asset = buildFixture(dist);
  writeFileSync(
    join(dist, 'index.html'),
    '<script src="/assets/index-12345678.js"></script>',
  );
  expect(() => validateBuild(dist)).toThrow('not rooted');
  writeFileSync(
    join(dist, 'index.html'),
    '<script src="/hexy/assets/missing-12345678.js"></script>',
  );
  expect(() => validateBuild(dist)).toThrow('Missing referenced');
  buildFixture(dist);
  writeFileSync(join(dist, 'assets', asset), Buffer.alloc(33 * 1024 * 1024));
  expect(() => validateBuild(dist)).toThrow('32 MiB');
});

it('refuses hash collisions and tampered immutable releases', () => {
  const { root } = setup();
  const dist = join(root, 'work/dist');
  const asset = buildFixture(dist);
  stage(root, FIRST, dist);
  writeFileSync(join(dist, 'assets', asset), 'different bytes');
  expect(() => stage(root, SECOND, dist)).toThrow('collision');
  expect(() => manifest(root, FIRST)).not.toThrow();
  writeFileSync(join(root, 'site/releases', FIRST, 'index.html'), '');
  expect(() => manifest(root, FIRST)).toThrow('index mismatch');
});

it('fails closed at the retained-asset disk cap without changing the release', () => {
  const { root } = setup();
  release(root, FIRST);
  select(root, 'current', FIRST);
  const quota = openSync(join(root, 'site/assets/quota-12345678.js'), 'w');
  try {
    ftruncateSync(quota, 512 * 1024 * 1024);
  } finally {
    closeSync(quota);
  }
  const dist = join(root, 'work/new-dist');
  buildFixture(dist, 'second');
  expect(() => stage(root, SECOND, dist)).toThrow('quota');
  expect(selected(root, 'current')).toBe(FIRST);
  expect(existsSync(join(root, 'site/releases', SECOND))).toBe(false);
});

it('cleans npm symlinks without following their target outside owned work', () => {
  const { directory, root } = setup();
  const protectedFile = join(directory, 'protected');
  writeFileSync(protectedFile, 'keep');
  mkdirSync(join(root, 'work'));
  symlinkSync(directory, join(root, 'work/npm-bin'));
  removeOwned(root, 'work');
  expect(readFileSync(protectedFile, 'utf8')).toBe('keep');
});

it('bounds external commands and does not pass unrelated environment credentials', () => {
  expect(() =>
    run(
      process.execPath,
      ['-e', 'setInterval(() => {}, 1000)'],
      undefined,
      0.05,
    ),
  ).toThrow();
  process.env.HEXY_PREVIEW_TEST_SECRET = 'synthetic-test-value';
  try {
    expect(
      run(process.execPath, [
        '-p',
        'typeof process.env.HEXY_PREVIEW_TEST_SECRET',
      ]),
    ).toBe('undefined');
  } finally {
    delete process.env.HEXY_PREVIEW_TEST_SECRET;
  }
});

it('keeps at most three recent releases plus a protected rollback and never prunes assets', () => {
  const { root } = setup();
  for (const char of ['a', 'b', 'c', 'd', 'e']) release(root, char.repeat(40));
  const before = files(join(root, 'site/assets'));
  prune(root, [FIRST]);
  expect(files(join(root, 'site/releases')).length).toBeLessThanOrEqual(12);
  expect(existsSync(join(root, 'site/releases', FIRST))).toBe(true);
  expect(files(join(root, 'site/assets'))).toEqual(before);
});

it('rolls back to a retained verified revision', async () => {
  const { root } = setup();
  release(root, FIRST);
  release(root, SECOND);
  select(root, 'current', SECOND);
  await rollback(root, FIRST, async () => {});
  expect(selected(root, 'current')).toBe(FIRST);
  expect(readFileSync(join(root, 'status.json'), 'utf8')).toContain(
    'Manual rollback',
  );
});
it('fetches only public remote main into isolated source and installs missing build tools', async () => {
  const { root } = setup();
  const { execute, calls } = fakeCommands(root, FIRST);
  await update(root, { execute, probe: async () => {} });
  expect(calls.find((call) => call.args.includes('fetch'))?.args).toEqual([
    '-c',
    'credential.helper=',
    'fetch',
    '--quiet',
    '--depth=1',
    '--no-tags',
    ORIGIN,
    '+refs/heads/main:refs/remotes/origin/main',
  ]);
  expect(calls.every((call) => call.cwd === join(root, 'work/source'))).toBe(
    true,
  );
  expect(calls.find((call) => call.args[0] === 'checkout')?.args).toEqual([
    'checkout',
    '--quiet',
    '--detach',
    FIRST,
  ]);
  expect(calls.find((call) => call.args[0] === 'run')?.args).toEqual([
    'run',
    'build',
    '--',
    '--base=/hexy/',
  ]);
  expect(existsSync(join(root, 'work'))).toBe(false);
  expect(selected(root, 'current')).toBe(FIRST);
});

it.each(['fetch', 'ci', 'build'])(
  'preserves exact current on %s failure, reports upstream honestly',
  async (failure) => {
    const { root } = setup();
    release(root, FIRST);
    select(root, 'current', FIRST);
    const before = readFileSync(join(root, 'site/current/index.html'));
    const { execute } = fakeCommands(root, SECOND, failure);
    await expect(
      update(root, { execute, probe: async () => {} }),
    ).rejects.toThrow('Injected');
    expect(selected(root, 'current')).toBe(FIRST);
    expect(readFileSync(join(root, 'site/current/index.html'))).toEqual(before);
    const status = JSON.parse(readFileSync(join(root, 'status.json'), 'utf8'));
    expect(status.upstream).toBe(failure === 'fetch' ? null : SECOND);
    expect(status.error).toContain('Injected');
    expect(existsSync(join(root, 'work'))).toBe(false);
  },
);

it('checks unchanged main without rebuilding and never accepts an unfetched cached revision', async () => {
  const { root } = setup();
  release(root, FIRST);
  select(root, 'current', FIRST);
  const { execute, calls } = fakeCommands(root, FIRST);
  await update(root, { execute, probe: async () => {} });
  expect(calls.some((call) => call.command === 'npm')).toBe(false);
  expect(calls.some((call) => call.args.includes('fetch'))).toBe(true);
});

it('rejects a successful build command that produces an incomplete release', async () => {
  const { root } = setup();
  release(root, FIRST);
  select(root, 'current', FIRST);
  const before = readFileSync(join(root, 'site/current/index.html'));
  const { execute } = fakeCommands(root, SECOND);
  await expect(
    update(root, {
      execute: (command, args, cwd) => {
        const result = execute(command, args, cwd);
        if (command === 'npm' && args[0] === 'run')
          writeFileSync(
            join(root, 'work/source/dist/index.html'),
            '<script src="/hexy/assets/missing-12345678.js"></script>',
          );
        return result;
      },
      probe: async () => {},
    }),
  ).rejects.toThrow('Missing referenced asset');
  expect(selected(root, 'current')).toBe(FIRST);
  expect(readFileSync(join(root, 'site/current/index.html'))).toEqual(before);
});

it('recovers a crash between pointer switch and health before attempting fetch', async () => {
  const { root } = setup();
  release(root, FIRST);
  release(root, SECOND);
  select(root, 'current', SECOND);
  atomicFile(
    join(root, 'pending.json'),
    JSON.stringify({ previous: FIRST, revision: SECOND }),
  );
  await expect(
    update(root, {
      execute: fakeCommands(root, SECOND, 'fetch').execute,
    }),
  ).rejects.toThrow('Injected');
  expect(selected(root, 'current')).toBe(FIRST);
  expect(existsSync(join(root, 'pending.json'))).toBe(false);
});

it('rejects concurrent update with the actual kernel lock and releases it on exit', async () => {
  const { root } = setup();
  const holder = spawn('flock', [
    '--no-fork',
    join(root, 'lock'),
    process.execPath,
    '-e',
    'process.stdout.write("locked"); setInterval(() => {}, 1000);',
  ]);
  try {
    await new Promise((resolve, reject) => {
      holder.stdout.once('data', resolve);
      holder.once('error', reject);
    });
    const result = spawnSync(
      process.execPath,
      ['deploy/cli.js', 'update', root],
      { encoding: 'utf8' },
    );
    expect(result.status).toBe(75);
    expect(result.stderr).toContain('already locked');
    expect(existsSync(join(root, 'work'))).toBe(false);
  } finally {
    holder.kill('SIGTERM');
    await new Promise((resolve) => holder.once('exit', resolve));
  }
  expect(
    spawnSync('flock', ['--nonblock', join(root, 'lock'), 'true']).status,
  ).toBe(0);
});
it('creates only scoped units/runtime without starting anything', async () => {
  const { directory } = setup();
  const root = join(directory, 'installed');
  const unitDirectory = join(directory, 'units');
  /** @type {Array<[string, string[]]>} */
  const calls = [];
  await install(
    root,
    unitDirectory,
    (command, args) => {
      calls.push([command, args]);
      return command === 'systemctl' ? 'unrelated.service enabled\n' : '';
    },
    () => freePort(0),
  );
  expect(calls.map(([command]) => command)).toEqual(['systemctl', 'docker']);
  expect(readFileSync(join(unitDirectory, SERVICE), 'utf8')).toContain(
    'KillMode=control-group',
  );
  expect(readFileSync(join(unitDirectory, TIMER), 'utf8')).toContain(
    'OnUnitInactiveSec=60s',
  );
  expect(existsSync(join(root, 'runtime/nginx.conf'))).toBe(true);
  await expect(install(root, unitDirectory, () => '')).rejects.toThrow(
    'already exists',
  );
  expect(units(root)[SERVICE]).toContain(
    `${root}/runtime/cli.js update ${root}`,
  );
});

it('rejects container and unit conflicts without replacing them', async () => {
  const { directory } = setup();
  const unitDirectory = join(directory, 'units');
  mkdirSync(unitDirectory);
  writeFileSync(join(unitDirectory, SERVICE), 'unrelated');
  await expect(
    install(join(directory, 'new'), unitDirectory, () => ''),
  ).rejects.toThrow('already exists');
  expect(readFileSync(join(unitDirectory, SERVICE), 'utf8')).toBe('unrelated');
  expect(() => absentContainer('occupied', () => 'other\noccupied')).toThrow(
    'occupied',
  );
  await expect(
    install(
      join(directory, 'new'),
      join(directory, 'other-units'),
      () => SERVICE,
    ),
  ).rejects.toThrow('already exists');
  expect(existsSync(join(directory, 'new'))).toBe(false);
});

it('refuses an occupied listener and pins a read-only loopback-only static container', async () => {
  const { root } = setup();
  const listener = createServer();
  await new Promise((resolve) =>
    listener.listen(0, '127.0.0.1', () => resolve(undefined)),
  );
  const address = /** @type {import('node:net').AddressInfo} */ (
    listener.address()
  );
  try {
    await expect(
      startServer(
        root,
        'hexy-test',
        { port: address.port, candidatePort: 0 },
        false,
        () => '',
      ),
    ).rejects.toThrow('EADDRINUSE');
  } finally {
    await new Promise((resolve) => listener.close(resolve));
  }
  /** @type {string[][]} */
  const calls = [];
  await startServer(
    root,
    'hexy-test',
    { port: 0, candidatePort: 0 },
    false,
    (_command, args) => {
      calls.push(args);
      return '';
    },
  );
  const args = calls[1];
  expect(args).toContain('127.0.0.1:0:8080');
  expect(args).toContain('127.0.0.1:0:8081');
  expect(args).toContain('--read-only');
  expect(args).toContain('101:101');
  expect(args).toContain('--cap-drop=ALL');
  expect(args.join(' ')).not.toContain('docker.sock');
  expect(args.join(' ')).toContain('nginx@sha256:');
});

it.each([
  { AllowFunnel: { 'node:443': true } },
  { TCP: { 443: { TCPForward: 'somewhere:8443' } } },
  { Web: { 'node:443': { Handlers: { '/hexy/': {} } } } },
  { Web: { 'node:443': { Handlers: { '/': {} } } } },
  { Foreground: { existing: {} } },
])(
  'rejects incompatible/public/overlapping Tailscale configuration',
  (config) => {
    expect(() => checkRoute(JSON.stringify(config))).toThrow();
  },
);

it('preserves unrelated routes and never issues a Tailscale mutation', () => {
  const config = {
    TCP: { 443: { HTTPS: true } },
    Web: {
      'node:443': {
        Handlers: { '/other/': { Proxy: 'http://127.0.0.1:9000' } },
      },
    },
  };
  const before = JSON.stringify(config);
  expect(() => checkRoute(before)).not.toThrow();
  expect(JSON.stringify(config)).toBe(before);
  expect(() => stateRoot(resolve('.'))).toThrow();
});
