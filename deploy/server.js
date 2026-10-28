import { createServer } from 'node:net';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { CANDIDATE_PORT, IMAGE, PORT, run } from './io.js';
import { manifest } from './releases.js';

/** @param {number} port */
export async function freePort(port) {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => server.close(resolve));
  });
}

/** @param {string} name @param {import('./io.js').Runner} [execute] */
export function absentContainer(name, execute = run) {
  const names = execute('docker', [
    'container',
    'ls',
    '-a',
    '--format',
    '{{.Names}}',
  ]);
  if (names.split('\n').includes(name))
    throw new Error(`Container name occupied: ${name}`);
}

/** @param {string} root @param {string} name
 * @param {{port: number, candidatePort: number}} ports
 * @param {boolean} persistent @param {import('./io.js').Runner} [execute] */
export async function startServer(
  root,
  name,
  ports,
  persistent,
  execute = run,
) {
  absentContainer(name, execute);
  await Promise.all([freePort(ports.port), freePort(ports.candidatePort)]);
  execute('docker', [
    'run',
    '-d',
    '--name',
    name,
    '--label',
    'org.hexy.preview=1',
    '--restart',
    persistent ? 'unless-stopped' : 'no',
    '--read-only',
    '--user',
    '101:101',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges:true',
    '--pids-limit=64',
    '--memory=64m',
    '--cpus=0.5',
    '--log-driver=local',
    '--log-opt=max-size=5m',
    '--log-opt=max-file=2',
    '--tmpfs',
    '/run:rw,noexec,nosuid,size=4m,uid=101,gid=101',
    '--publish',
    `127.0.0.1:${ports.port}:8080`,
    '--publish',
    `127.0.0.1:${ports.candidatePort}:8081`,
    '--mount',
    `type=bind,src=${join(root, 'site')},dst=/srv/site,readonly`,
    '--mount',
    `type=bind,src=${join(root, 'runtime/nginx.conf')},dst=/etc/nginx/nginx.conf,readonly`,
    '--entrypoint',
    'nginx',
    IMAGE,
    '-g',
    'daemon off;',
  ]);
}

/** @param {string} root @param {string} revision
 * @param {'current'|'candidate'} target
 * @param {{port?: number, candidatePort?: number}} [options] */
export async function health(root, revision, target, options = {}) {
  const { port = PORT, candidatePort = CANDIDATE_PORT } = options;
  const endpoint = target === 'candidate' ? candidatePort : port;
  const expected = manifest(root, revision);
  /** @param {string} path */
  async function get(path) {
    const response = await fetch(`http://127.0.0.1:${endpoint}/${path}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok)
      throw new Error(`Health HTTP ${response.status}: ${path}`);
    return Buffer.from(await response.arrayBuffer());
  }
  if (JSON.parse((await get('version.json')).toString()).revision !== revision)
    throw new Error('Served revision mismatch');
  for (const [path, hash] of [
    ['index.html', expected.index],
    ...Object.entries(expected.assets).map(([name, hash]) => [
      `assets/${name}`,
      hash,
    ]),
  ]) {
    const actual = createHash('sha256')
      .update(await get(path))
      .digest('hex');
    if (actual !== hash) throw new Error(`Served asset mismatch: ${path}`);
  }
}
