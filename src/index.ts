/**
 * @file Public entry point for the design system.
 *
 * Consumers should import the tokens CSS once at app boot:
 *
 * ```ts
 * import 'design-system/tokens';
 * ```
 *
 * Components, icons, hooks, and types are re-exported below.
 */

export * from './components/Button';
export * from './components/IconButton';
export * from './components/TextInput';
export * from './components/Toggle';
export * from './components/Card';
export * from './components/GridLayout';
export * from './components/Modal';
export * from './components/AskAI';
export * from './components/Checkbox';
export * from './components/FAB';
export * from './components/Radio';
export * from './components/Stepper';
export * from './components/Tabs';
export * from './components/Toolbar';
export * from './icons';
export * from './tokens';
export { IntlProvider, type Locale } from './i18n';
