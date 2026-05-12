import type { Decorator, Preview } from '@storybook/react-vite';
import { IntlProvider, type Locale } from '../src';
import { ThemedDocsContainer } from './ThemedDocsContainer';
import '../src/tokens/tokens.css';
import '../src/styles/global.css';
import '../src/styles/animations.css';

const withIntl: Decorator = (Story, context) => {
  const locale = (context.globals.locale ?? 'en') as Locale;

  return (
    <IntlProvider locale={locale}>
      <Story/>
    </IntlProvider>
  );
};

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light';

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.background = 'var(--ds-color-bg-page)';
    document.body.style.color = 'var(--ds-color-text-primary)';
    document.body.style.fontFamily = 'var(--ds-font-family-sans), sans-serif';
  }

  return <Story/>;
};

const preview: Preview = {
  parameters: {
    docs: {
      // Theme the docs page chrome (page background, table of contents,
      // code blocks) in lockstep with the active story theme so it
      // doesn't render the wrong palette against the story body.
      container: ThemedDocsContainer,
    },
    backgrounds: {disable: true},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
      config: {
        rules: [
          {id: 'color-contrast', enabled: true},
          {id: 'focus-order-semantics', enabled: true},
        ],
      },
    },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Introduction', 'Color', 'Typography', 'Spacing', 'Accessibility', 'Tokens'],
          'Components',
          'Patterns',
        ],
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
    locale: 'en',
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          {value: 'dark', title: 'Aurora'},
          {value: 'light', title: 'Reverie'},
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'UI locale',
      defaultValue: 'en',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          {value: 'en', title: 'English'},
          {value: 'es', title: 'Español'},
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withIntl, withTheme],
  tags: ['autodocs'],
};

export default preview;
