import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Two test projects in one config:
 *
 * - `unit`: classic jsdom Vitest for component tests in `src/**\/*.test.tsx`
 * - `storybook`: Storybook's `play` functions surfaced as Vitest tests
 *   via `@storybook/addon-vitest` (browser mode through Playwright).
 *
 * Run all: `npm test`. Filter to one project: `npm test -- --project=unit`.
 */
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: [resolve(here, 'src/test/setup.ts')],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: resolve(here, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{browser: 'chromium'}],
          },
          setupFiles: [resolve(here, '.storybook/vitest.setup.ts')],
        },
      },
    ],
  },
});
