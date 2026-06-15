import { type ReactNode } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import enMessages from './messages/en.json';
import esMessages from './messages/es.json';

/** Add a locale by dropping a `messages/<tag>.json` file in and extending this union. */
export type Locale = 'en' | 'es';

const catalogs: Record<Locale, Record<string, string>> = {
  en: enMessages,
  es: esMessages,
};

interface IntlProviderProps {
  locale?: Locale;
  /** Overrides merged on top of the bundled catalog, for consumer app-level strings. */
  messages?: Record<string, string>;
  children: ReactNode;
}

const noop = () => {};

/**
 * Wraps the app (or a story) in react-intl's provider with the bundled catalogs,
 * falling back to English so a missing key logs in dev instead of throwing.
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
