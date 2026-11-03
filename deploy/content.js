import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, relative } from 'node:path';
import { files, plainPath } from './io.js';

/** @param {string} source */
export function applicationKey(source) {
  const inputs = ['src', 'scripts', 'deploy', 'public']
    .filter((name) => existsSync(join(source, name)))
    .flatMap((name) => files(join(source, name)))
    .filter(
      (file) =>
        !/^src\/content\/[^/]+\.json$/.test(relative(source, file)) &&
        !['src/content-order.json', 'public/catalog.json'].includes(
          relative(source, file),
        ),
    );
  inputs.push(
    ...readdirSync(source)
      .filter((name) =>
        /^(package(-lock)?\.json|index\.html|.*config\.(js|json|mjs))$/.test(
          name,
        ),
      )
      .map((name) => join(source, name)),
  );
  const hash = createHash('sha256');
  for (const file of inputs.sort()) {
    plainPath(file);
    hash
      .update(relative(source, file))
      .update('\0')
      .update(readFileSync(file))
      .update('\0');
  }
  return hash.digest('hex');
}

/** @param {string} html @param {string} catalog */
export function catalogIndex(html, catalog) {
  const tag = `<meta name="hexy-catalog" content="/hexy/assets/${catalog}">`;
  if (/<meta name="hexy-catalog" content="[^"]+">/.test(html))
    return html.replace(/<meta name="hexy-catalog" content="[^"]+">/, tag);
  if (!html.includes('</head>')) throw new Error('Missing document head');
  return html.replace('</head>', `${tag}\n</head>`);
}

/** @param {string} dist */
export function prepareCatalogAsset(dist) {
  files(dist);
  const path = join(dist, 'catalog.json');
  if (!existsSync(path)) return null;
  const bytes = readFileSync(path);
  const data = JSON.parse(bytes.toString());
  if (
    data.schemaVersion !== 1 ||
    !Array.isArray(data.packs) ||
    !data.packs.length
  )
    throw new Error('Invalid runtime catalog');
  const name = `catalog-${createHash('sha256').update(bytes).digest('hex')}.json`;
  mkdirSync(join(dist, 'assets'), { recursive: true });
  plainPath(join(dist, 'assets', name));
  writeFileSync(join(dist, 'assets', name), bytes);
  const index = join(dist, 'index.html');
  writeFileSync(index, catalogIndex(readFileSync(index, 'utf8'), name));
  return name;
}

/** @param {string} root @param {string} revision @param {string} source
 * @param {{assets: Record<string,string>, catalog?: string|null}} saved */
export function reuseApplication(root, revision, source, saved) {
  const dist = join(source, 'dist');
  mkdirSync(join(dist, 'assets'), { recursive: true });
  copyFileSync(
    join(root, 'site/releases', revision, 'index.html'),
    join(dist, 'index.html'),
  );
  for (const name of Object.keys(saved.assets)) {
    if (name !== saved.catalog)
      copyFileSync(
        join(root, 'site/assets', name),
        join(dist, 'assets', basename(name)),
      );
  }
  copyFileSync(join(source, 'public/catalog.json'), join(dist, 'catalog.json'));
}
