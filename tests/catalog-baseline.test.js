import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import baseline from '../docs/phase-11-catalog-baseline.json';
import shipment from '../docs/phase-12-deck-inventory.json';
import { bundledPacks } from './bundled-packs.js';
import { validatePack } from '../src/domain/packs.js';

test('catalog retains the accepted Phase11 order and explicit incremental order', () => {
  expect(baseline.packs).toHaveLength(132);
  expect(bundledPacks().map((pack) => pack.id)).toEqual([
    ...baseline.packs.map((pack) => pack.id),
    ...shipment.additionalDeckIds,
  ]);
  for (const binding of baseline.packs) {
    expect(
      createHash('sha256').update(readFileSync(binding.path)).digest('hex'),
    ).toBe(binding.sha256);
  }
});

test('extracted Phase11 sources retain ordinary production validation', () => {
  const phaseElevenSources = baseline.packs.map((pack) =>
    JSON.parse(readFileSync(pack.path, 'utf8')),
  );
  expect(phaseElevenSources).toHaveLength(132);
  expect(phaseElevenSources.map(validatePack)).toEqual(
    bundledPacks().slice(0, 132),
  );
});
