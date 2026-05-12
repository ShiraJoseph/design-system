/**
 * @file Public entry point for the i18n module.
 *
 * Wrap your app once with `IntlProvider`:
 *
 * ```tsx
 * import { IntlProvider } from 'design-system/i18n';
 * <IntlProvider locale="es"><App /></IntlProvider>
 * ```
 *
 * Components consume strings via `react-intl` hooks. For the
 * application-supplied strings (button labels, headings, etc.),
 * pass them directly as React children or props.
 */

export { IntlProvider, type Locale } from './IntlProvider';
