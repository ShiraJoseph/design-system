import { defineConfig } from 'vitest/config';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export const unitTest = {
  name: 'unit',
  environment: 'jsdom',
  globals: true,
  include: ['src/**/*.test.{ts,tsx}'],
  setupFiles: [resolve(here, 'src/test/setup.ts')],
};

export default defineConfig({
  test: {
    ...unitTest,
    coverage: {
      provider: 'v8',
      include: [
        'src/**/*.model.ts',
        'src/hooks/**/*.ts',
        'src/utils/**/*.ts',
        'src/components/AskAI/miniMarkdown/miniMarkdown.tsx',
        'src/components/AskAI/providers/**/*.ts',
        'src/icons/createIcon.tsx',
      ],
      reporter: ['text', 'html'],
      reportsDirectory: './coverage/unit',
    },
  },
});
