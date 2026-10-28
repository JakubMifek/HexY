import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CANDIDATE_PORT,
  CONTAINER,
  plainPath,
  PORT,
  run,
  stateRoot,
} from './io.js';
import { absentContainer, freePort } from './server.js';

export const SERVICE = 'hexy-preview-update.service';
export const TIMER = 'hexy-preview-update.timer';

/** @param {string} root */
export function units(root) {
  const command = `${process.execPath} ${root}/runtime/cli.js update ${root}`;
  return {
    [SERVICE]: `[Unit]
Description=HexY pushed-main private preview update

[Service]
Type=oneshot
ExecStart=${command}
Environment=PATH=${dirname(process.execPath)}:/usr/local/bin:/usr/bin:/bin
TimeoutStartSec=12min
KillMode=control-group
UMask=0022
StandardOutput=journal
StandardError=journal
`,
    [TIMER]: `[Unit]
Description=Check HexY pushed main every minute

[Timer]
OnBootSec=30s
OnUnitInactiveSec=60s
AccuracySec=1s
Unit=${SERVICE}

[Install]
WantedBy=timers.target
`,
  };
}

/** @param {string} root @param {string} unitDirectory
 * @param {import('./io.js').Runner} [execute]
 * @param {() => Promise<void>} [checkPort] */
export async function install(
  root,
  unitDirectory,
  execute = run,
  checkPort = async () => {
    await Promise.all([freePort(PORT), freePort(CANDIDATE_PORT)]);
  },
) {
  plainPath(root);
  plainPath(unitDirectory);
  if (existsSync(root))
    throw new Error('State directory already exists; refusing replacement');
  for (const name of [SERVICE, TIMER]) {
    plainPath(join(unitDirectory, name));
    if (existsSync(join(unitDirectory, name)))
      throw new Error(`Unit file already exists: ${name}`);
  }
  const existing = execute('systemctl', [
    '--user',
    'list-unit-files',
    '--no-legend',
    '--no-pager',
  ]);
  if (existing.split('\n').some((line) => line.startsWith('hexy-preview-')))
    throw new Error('A HexY unit already exists in the user manager');
  absentContainer(CONTAINER, execute);
  await checkPort();
  if (!/^[a-zA-Z0-9/_.-]+$/.test(process.execPath))
    throw new Error('Node executable path cannot be safely used in a unit');
  stateRoot(root, true);
  const runtime = join(root, 'runtime');
  mkdirSync(runtime);
  const source = dirname(fileURLToPath(import.meta.url));
  for (const name of [
    'io.js',
    'releases.js',
    'server.js',
    'update.js',
    'install.js',
    'cli.js',
    'nginx.conf',
  ]) {
    copyFileSync(join(source, name), join(runtime, name));
  }
  writeFileSync(join(runtime, 'package.json'), '{"type":"module"}\n');
  chmodSync(join(runtime, 'nginx.conf'), 0o644);
  mkdirSync(unitDirectory, { recursive: true });
  for (const [name, content] of Object.entries(units(root)))
    writeFileSync(join(unitDirectory, name), content, { flag: 'wx' });
  console.log('Prepared only. No container, timer or Tailscale route started.');
}

/** @param {string} json */
export function checkRoute(json) {
  const config = JSON.parse(json);
  const tcp = config.TCP?.['443'];
  if (tcp && (!tcp.HTTPS || tcp.TCPForward))
    throw new Error('Tailscale port 443 is not an HTTPS Serve listener');
  if (
    Object.entries(config.AllowFunnel ?? {}).some(
      ([host, enabled]) => host.endsWith(':443') && enabled,
    )
  )
    throw new Error('Funnel is enabled on 443; refusing public exposure');
  checkWebRoutes(config.Web ?? {});
  if (Object.keys(config.Foreground ?? {}).length)
    throw new Error(
      'Foreground Tailscale routes exist; inspect before activation',
    );
  return Boolean(tcp);
}

/** @param {Record<string, {Handlers?: object}>} routes */
function checkWebRoutes(routes) {
  for (const [host, web] of Object.entries(routes)) {
    if (!host.endsWith(':443')) continue;
    for (const path of Object.keys(web.Handlers ?? {})) {
      if (path === '/' || path === '/hexy' || path.startsWith('/hexy/'))
        throw new Error(`Existing Tailscale route overlaps HexY: ${path}`);
    }
  }
}
