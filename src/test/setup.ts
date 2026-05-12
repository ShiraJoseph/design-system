/**
 * Vitest unit-test setup. Loaded once before any test file in the
 * `unit` project. Pulls in jest-dom matchers and resets DOM state
 * between tests so individual assertions stay isolated.
 */
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
