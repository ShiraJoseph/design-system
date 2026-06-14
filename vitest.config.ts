import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unitTest } from './vitest.unit.config';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/components/**/*.tsx'],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/components/AskAI/miniMarkdown/miniMarkdown.tsx',
        'src/**/*.d.ts',
      ],
      reporter: ['text', 'html'],
    },
    projects: [
      {
        extends: true,
        test: unitTest,
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
