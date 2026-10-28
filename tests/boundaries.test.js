import { expect, test } from 'vitest';
import {
  validateConfig,
  deadlineAfter,
  MAX_DUEL_SEQUENCE_LENGTH,
} from '../src/domain/config.js';
import { DomainError } from '../src/domain/errors.js';
import { message } from '../src/messages.js';
import { validatePack } from '../src/domain/packs.js';
import { config, sourcePack } from './fixtures.js';

test('domain failures carry localized codes and actionable field paths', () => {
  try {
    validatePack({ ...sourcePack(), questions: [] });
    throw new Error('expected boundary error');
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    if (!(error instanceof DomainError)) throw error;
    expect(error.path).toBe('questions');
    expect(message('en', error.code)).toBe('Add at least one question.');
    expect(message('cs', error.code)).toBe('Přidejte alespoň jednu otázku.');
  }
});

test('configuration requires explicit positive timing and distinct symbols', () => {
  const valid = config();
  expect(validateConfig(valid)).toEqual(valid);
  for (const field of ['previewMs', 'symbolMs', 'length']) {
    expect(() =>
      validateConfig({ ...valid, duel: { ...valid.duel, [field]: 0 } }),
    ).toThrow('invalidNumber');
  }
  for (const symbols of [[], ['x'], ['x', 'x']]) {
    expect(() =>
      validateConfig({ ...valid, duel: { ...valid.duel, symbols } }),
    ).toThrow('duelSymbols');
  }
  expect(() => deadlineAfter(Number.MAX_SAFE_INTEGER, 1)).toThrow(
    'invalidNumber',
  );
  expect(() =>
    validateConfig({
      ...valid,
      duel: { ...valid.duel, length: MAX_DUEL_SEQUENCE_LENGTH + 1 },
    }),
  ).toThrow('duelLength');
});

test('all boundary error codes have both language messages and unknown codes fail loudly', () => {
  const codes = [
    'invalidObject',
    'invalidText',
    'invalidList',
    'invalidNumber',
    'invalidChoice',
    'invalidCell',
    'answerInitial',
    'missingProvenance',
    'packVersion',
    'saveVersion',
    'emptyPack',
    'duplicateQuestion',
    'mixedLanguage',
    'boardCount',
    'letterPlacement',
    'invalidJson',
    'duelSymbols',
    'randomRange',
    'invalidPress',
    'clockBackwards',
    'correctionUnavailable',
    'invalidVictory',
    'invalidRound',
    'invalidDeadline',
    'invalidDuel',
    'foundation',
    'sessionReused',
    'duelLength',
  ];
  for (const code of codes) {
    expect(message('cs', code).length).toBeGreaterThan(10);
    expect(message('en', code).length).toBeGreaterThan(10);
  }
  expect(() => message('en', 'absent')).toThrow('Unknown localization code');
});
