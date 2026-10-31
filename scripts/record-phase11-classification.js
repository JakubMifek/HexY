import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const baseline = '54b34b1505a6ff3087269bdaae4a4ca790ea4f18';
const hash = (value) => createHash('sha256').update(value).digest('hex');
let sources = readFileSync('docs/content-sources.md', 'utf8');
const packs = readdirSync('src/content')
  .filter((file) => file.endsWith('.json'))
  .map((file) => {
    const path = `src/content/${file}`;
    const original = execFileSync('git', ['show', `${baseline}:${path}`]);
    const current = readFileSync(path);
    const old = JSON.parse(original);
    const pack = JSON.parse(current);
    assert.deepEqual(
      { ...pack, schemaVersion: 1, difficulty: undefined },
      { ...old, difficulty: undefined },
    );
    assert.ok(['easy', 'medium', 'hard'].includes(pack.difficulty));
    const priorHash = hash(original);
    const currentHash = hash(current);
    assert.ok(
      sources.includes(priorHash) || sources.includes(currentHash),
      `Missing source ledger: ${file}`,
    );
    sources = sources.replace(priorHash, currentHash);
    return {
      id: pack.id,
      category: pack.questions[0].category,
      language: pack.language,
      difficulty: pack.difficulty,
      baselineSha256: priorHash,
      currentSha256: currentHash,
      unchangedQuestionsSha256: hash(JSON.stringify(pack.questions)),
      entryIds: pack.questions.map((question) => question.id),
    };
  });
writeFileSync(
  'docs/phase-11-classification.json',
  JSON.stringify(
    {
      baseline,
      status:
        'Developer proposals; every classification awaits independent review. No new facts or wording.',
      sourceEvidence:
        'docs/content-sources.md and reviews/phase-05.md through phase-07.md; prior inspected evidence retained, no new fetch claim.',
      packs,
    },
    null,
    2,
  ) + '\n',
);
writeFileSync('docs/content-sources.md', sources);
console.log(
  `Recorded ${packs.length} pack classifications / ${packs.reduce((sum, pack) => sum + pack.entryIds.length, 0)} unchanged entries.`,
);
