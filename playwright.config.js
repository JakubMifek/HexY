import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

mkdirSync('.artifacts', { recursive: true });
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve('.artifacts/browsers');
process.env.TMPDIR = path.resolve('.artifacts');

export default defineConfig({
  testDir: './browser',
  outputDir: '.artifacts/playwright',
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: '.artifacts/browser-report', open: 'never' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4182',
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4182 --strictPort',
    url: 'http://127.0.0.1:4182',
    reuseExistingServer: false,
  },
});
