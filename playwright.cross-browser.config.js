import { defineConfig } from '@playwright/test';
import base from './playwright.config.js';

export default defineConfig({
  ...base,
  outputDir: '.artifacts/playwright-cross-browser',
  reporter: [
    ['list'],
    [
      'html',
      { outputFolder: '.artifacts/cross-browser-report', open: 'never' },
    ],
  ],
  testMatch: [
    'game.spec.js',
    'duels.spec.js',
    'review-fixes.spec.js',
    'resilience.spec.js',
    'recovery-review.spec.js',
    'visual.spec.js',
    'release.spec.js',
    'guided-ui.spec.js',
    'tile-flip.spec.js',
    'modal-readiness.spec.js',
    'clock-error-fit.spec.js',
    'phase-ten*.spec.js',
    'phase-eleven.spec.js',
    'computing-scope.spec.js',
  ],
  projects: [
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
