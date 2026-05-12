import { type ReactNode } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import enMessages from './messages/en.json';
import esMessages from './messages/es.json';

/**
 * BCP 47 language tags supported out of the box. Add more by dropping a
 * matching `messages/<tag>.json` file into the i18n directory and
 * extending this union.
 */
export type Locale = 'en' | 'es';

const catalogs: Record<Locale, Record<string, string>> = {
  en: enMessages,
  es: esMessages,
};

interface IntlProviderProps {
  /** Active locale. Defaults to `'en'` if not provided. */
  locale?: Locale;
  /**
   * Optional message overrides merged on top of the bundled catalog.
   * Useful for application-level strings consumers want to localize
   * alongside the design system messages.
   */
  messages?: Record<string, string>;
  children: ReactNode;
}

const noop = () => {};

/**
 * Wraps the app (or a Storybook story) in `react-intl`'s provider with
 * the design system's bundled message catalogs.
 *
 * Falls back to English if the requested locale is missing, the
 * `defaultLocale` prop ensures react-intl doesn't throw on a missing
 * key, just logs in development.
 */
export const IntlProvider = ({locale = 'en', messages, children}: IntlProviderProps) => {
  const merged = {...catalogs[locale], ...messages};

  return (
    <ReactIntlProvider
      locale={locale}
      defaultLocale="en"
      messages={merged}
      onError={noop}
    >
      {children}
    </ReactIntlProvider>
  );
};
