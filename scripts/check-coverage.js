import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const report = JSON.parse(
  await readFile('coverage/coverage-summary.json', 'utf8'),
);
const measures = ['lines', 'statements', 'functions', 'branches'];
const groups = {
  critical: { thresholds: [95, 95, 95, 90], files: [] },
  remaining: { thresholds: [85, 85, 85, 80], files: [] },
};
const entries = await readdir('src', { recursive: true });
const files = entries
  .filter((entry) => entry.endsWith('.js') && entry !== 'domain/types.js')
  .sort();
let failed = false;
for (const file of files) {
  const group =
    file === 'app.js' ||
    file.startsWith('domain/') ||
    file.startsWith('runtime/')
      ? 'critical'
      : 'remaining';
  const metrics = report[path.resolve('src', file)];
  if (!metrics) {
    console.error(`Missing production file in coverage: src/${file}`);
    failed = true;
  } else groups[group].files.push({ file: `src/${file}`, metrics });
}
for (const [name, group] of Object.entries(groups)) {
  console.log(
    `\n${name}: ${group.files.length} files (including untested sources)`,
  );
  for (const { file } of group.files) console.log(`  ${file}`);
  for (const [index, measure] of measures.entries()) {
    const total = group.files.reduce(
      (sum, item) => sum + item.metrics[measure].total,
      0,
    );
    const covered = group.files.reduce(
      (sum, item) => sum + item.metrics[measure].covered,
      0,
    );
    const percentage = total ? (covered / total) * 100 : 100;
    console.log(
      `${measure}: ${covered}/${total} = ${percentage.toFixed(2)}% (required ${group.thresholds[index]}%)`,
    );
    if (!Number.isFinite(percentage) || percentage < group.thresholds[index])
      failed = true;
  }
}
if (failed) process.exitCode = 1;
