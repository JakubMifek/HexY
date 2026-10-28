import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTAINER, PORT, run, stateRoot } from './io.js';
import { rollback, update } from './update.js';
import { startServer } from './server.js';
import { checkRoute, install } from './install.js';

/** @param {string[]} args */
async function main(args) {
  const [action, suppliedRoot, revision] = args;
  const root = suppliedRoot ?? join(homedir(), '.local/share/hexy-preview');
  if (action === 'install') {
    await install(root, join(homedir(), '.config/systemd/user'));
    return;
  }
  if (action === 'check-route') {
    routePreflight();
    return;
  }
  stateRoot(root);
  if (action === 'start') {
    await startServer(root, CONTAINER, PORT, true);
    return;
  }
  if (action === 'update' || action === 'rollback') {
    locked(action, root, revision);
    return;
  }
  if (action === 'locked-update') await update(root);
  else if (action === 'locked-rollback' && revision)
    await rollback(root, revision);
  else
    throw new Error(
      'Usage: cli.js install|start|update|rollback|check-route [state] [revision]',
    );
}

function routePreflight() {
  const existingHttps = checkRoute(
    run('tailscale', ['serve', 'status', '--json']),
  );
  if (!existingHttps && run('ss', ['-H', '-ltn', 'sport = :443']))
    throw new Error(
      'Port 443 already has a non-Serve listener; inspect without changing it',
    );
  console.log(
    'No conflicting Serve route or Funnel on 443; recheck immediately before activation.',
  );
}

/** @param {string} action @param {string} root @param {string|undefined} revision */
function locked(action, root, revision) {
  const result = spawnSync(
    'flock',
    [
      '--nonblock',
      '--conflict-exit-code',
      '75',
      join(root, 'lock'),
      process.execPath,
      fileURLToPath(import.meta.url),
      `locked-${action}`,
      root,
      ...(revision ? [revision] : []),
    ],
    { stdio: 'inherit' },
  );
  if (result.error) throw result.error;
  if (result.status === 75)
    console.error('HexY updater is already locked; no competing build started');
  process.exitCode = result.status ?? 1;
}

main(process.argv.slice(2)).catch((error) => {
  console.error('HexY preview failed:', error);
  process.exitCode = 1;
});
