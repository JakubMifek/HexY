import assert from 'node:assert/strict';
import { copyFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { run, stateRoot } from '../deploy/io.js';
import { health } from '../deploy/server.js';
import { selected } from '../deploy/releases.js';
import { update } from '../deploy/update.js';

const LEGACY = 'b4a2c75457d26cbad94c82949f827396f812d8d9';

/** @param {string} root @param {string} name
 * @param {{port: number, candidatePort: number}} ports */
export function serviceUpdate(root, name, ports) {
  const runtime = join(root, 'runtime');
  for (const file of ['io.js', 'releases.js'])
    copyFileSync(join('deploy', file), join(runtime, file));
  writeFileSync(join(runtime, 'package.json'), '{"type":"module"}\n');
  writeFileSync(
    join(runtime, 'legacy-server.js'),
    run('git', ['show', `${LEGACY}:deploy/server.js`]) + '\n',
  );
  const unit = `hexy-preview-pva1-${randomUUID()}.service`;
  try {
    console.log(
      run(
        'systemd-run',
        [
          '--user',
          '--wait',
          '--pipe',
          '--collect',
          `--unit=${unit}`,
          '--property=Type=exec',
          '--property=RuntimeMaxSec=12min',
          '--property=KillMode=control-group',
          '--property=UMask=0022',
          `--property=WorkingDirectory=${process.cwd()}`,
          process.execPath,
          fileURLToPath(import.meta.url),
          root,
          name,
          String(ports.port),
          String(ports.candidatePort),
        ],
        undefined,
        780,
      ),
    );
  } finally {
    const state = run('systemctl', [
      '--user',
      'show',
      unit,
      '--property=LoadState',
      '--value',
    ]);
    if (state !== 'not-found') run('systemctl', ['--user', 'stop', unit]);
  }
}

/** @param {string[]} args */
async function serviceWorker(args) {
  const [root, name, portText, candidateText] = args;
  assert.ok(root.startsWith(resolve('.artifacts', 'preview-docker-')));
  assert.ok(name.startsWith('hexy-preview-test-'));
  stateRoot(root);
  const port = Number(portText);
  const candidatePort = Number(candidateText);
  assert.ok(Number.isInteger(port) && port > 4184 && port < 65536);
  assert.ok(
    Number.isInteger(candidatePort) &&
      candidatePort > 4184 &&
      candidatePort < 65536,
  );
  const previous = selected(root, 'current');
  assert.ok(previous);
  console.log('Actual user-service groups:', run('id', ['-G']));
  const legacy = await import(
    pathToFileURL(join(root, 'runtime/legacy-server.js')).href
  );
  await assert.rejects(
    legacy.health(root, previous, 'candidate', { name, port }),
    /permission denied/i,
  );
  console.log(
    'PV-A1 reproduced: approved legacy candidate health cannot access Docker in this user manager',
  );
  const probe = /** @type {import('../deploy/update.js').Probe} */ (
    (revision, target) =>
      health(root, revision, target, { port, candidatePort })
  );
  await probe(previous, 'candidate');
  await update(root, { probe });
  console.log(
    'PASS: unchanged service credentials performed real fetch/build/candidate health/promotion/live health without Docker',
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  serviceWorker(process.argv.slice(2)).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
