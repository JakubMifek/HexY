import { expect, test } from 'vitest';
import {
  portableGame,
  recoverPortable,
  validatePortable,
  MAX_GAME_BYTES,
} from '../src/domain/portable.js';
import { importPack } from '../src/domain/packs.js';
import { keysToBindings } from '../src/domain/controls.js';
import { game, question, duel, savedGame } from './fixtures.js';

test.each(['hosted', 'automatic'])(
  'complete %s game retains exact locked content, ownership, settings and deadlines',
  (mode) => {
    const original = question(/** @type {'hosted'|'automatic'} */ (mode));
    const data = JSON.parse(savedGame(original));
    data.settings.players = {
      A: { name: 'Éowyn', color: '#abcdef' },
      B: { name: 'Gimli', color: '#012345' },
    };
    const restored = recoverPortable(
      JSON.stringify(data),
      1500,
      'portable-new',
    );
    expect(restored.settings).toEqual(data.settings);
    expect(restored.game.pack).toEqual(original.pack);
    expect(restored.game.cells).toEqual(original.cells);
    expect(restored.game.stage).toEqual(original.stage);
    expect(restored.game.sessionId).not.toBe(original.sessionId);
    expect(portableGame(restored.game, data.settings)).toEqual({
      format: 'hexy-game',
      schemaVersion: 2,
      settings: data.settings,
      bindings: keysToBindings(data.keys),
      game: restored.game,
    });
  },
);

test.each([
  ['format', 'question-pack'],
  ['schemaVersion', 99],
  ['settings', null],
  ['settings.language', 'cs'],
  ['settings.mode', 'letters'],
  ['settings.answerMode', 'automatic'],
  ['settings.seconds', 90],
  ['settings.starter', 'B'],
  ['settings.players.A.color', 'url(evil)'],
  ['settings.players.B.name', 'W'.repeat(31)],
  ['game.cells', []],
  ['game.schemaVersion', 999],
  ['keys.A', 'Tab'],
  ['keys.B', 'ShiftLeft'],
])('rejects modified %s before adopting any metadata', (path, value) => {
  const data = JSON.parse(savedGame(game()));
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((node, key) => node[key], data);
  target[/** @type {string} */ (last)] = value;
  expect(() => validatePortable(data)).toThrow();
});

test('imports distinguish full games from packs and legacy local records without silently losing either', () => {
  const original = game();
  expect(() =>
    recoverPortable(JSON.stringify(original.pack), 1000, 'new'),
  ).toThrow('gameFormat');
  expect(() => recoverPortable(JSON.stringify(original), 1000, 'new')).toThrow(
    'gameFormat',
  );
  expect(
    recoverPortable(JSON.stringify(original), 1000, 'new', true).game.pack,
  ).toEqual(original.pack);
  expect(() => recoverPortable('{', 1000, 'new')).toThrow('invalidJson');
  expect(() =>
    recoverPortable(' '.repeat(MAX_GAME_BYTES + 1), 1000, 'new'),
  ).toThrow('gameSize');
});

test('interrupted imported duels never award and elapsed question imports never extend deadlines', () => {
  const interrupted = recoverPortable(savedGame(duel()), 1200, 'new');
  expect(interrupted.game.stage.phase).toBe('duel-interrupted');
  expect(interrupted.game.cells[0]).toBe('black');
  const expired = recoverPortable(savedGame(question()), 31_000, 'new');
  expect(expired.game.stage).toMatchObject({
    phase: 'opponent',
    round: { deadline: 31_000 },
  });
});

test('generous playable limits retain all exact accepted text and reject longer custom content', () => {
  const data = game().pack;
  data.questions[0].text = 'W'.repeat(600);
  data.questions[0].answer = 'A'.repeat(120);
  expect(importPack(JSON.stringify(data))).toEqual(data);
  data.questions[0].text += 'W';
  expect(() => importPack(JSON.stringify(data))).toThrow('playTextLimit');
  data.questions[0].text = 'Question';
  data.questions[0].answer += 'A';
  expect(() => importPack(JSON.stringify(data))).toThrow('playTextLimit');
});

test('oversized metadata cannot create a game that exports an unimportable backup', () => {
  const data = JSON.parse(savedGame(game()));
  data.game.pack.questions[0].sources = ['W'.repeat(MAX_GAME_BYTES)];
  expect(() => portableGame(data.game, data.settings)).toThrow('gameSize');
});

test('a compact file must also reserve space for later rounds, counters and recovery scope', () => {
  const data = JSON.parse(savedGame(game()));
  data.game.pack.questions[0].sources = [''];
  const base = new TextEncoder().encode(JSON.stringify(data)).length;
  data.game.pack.questions[0].sources = [
    'W'.repeat(MAX_GAME_BYTES - base - 100),
  ];
  expect(new TextEncoder().encode(JSON.stringify(data)).length).toBeLessThan(
    MAX_GAME_BYTES,
  );
  expect(() => validatePortable(data)).toThrow('gameSize');
});
