/**
 * Storybook play-function setup for Vitest. The Storybook addon
 * registers each story as a test; this file lets us inject project-
 * level annotations (decorators, parameters) so tests run with the
 * same tokens, fonts, and i18n the actual Storybook iframe uses.
 */
import { setProjectAnnotations } from '@storybook/react-vite';
import { beforeAll } from 'vitest';
import * as preview from './preview';

const project = setProjectAnnotations([preview.default ?? preview]);

beforeAll(project.beforeAll);
