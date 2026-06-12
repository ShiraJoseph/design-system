import { type PropsWithChildren, useEffect, useState } from 'react';
import { create, themes, type ThemeVars } from 'storybook/theming';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';

/**
 * Build a Storybook docs theme using the live CSS custom properties
 * from the active story theme. Reading from `getComputedStyle` means
 * the docs chrome (page background, code blocks, toolbar, TOC) uses
 * the same Reverie / Aurora tokens as the components themselves
 * instead of Storybook's generic light / dark palette.
 */
const buildDocsTheme = (mode: 'light' | 'dark'): ThemeVars => {
  if (typeof document === 'undefined') {
    return mode === 'light' ? themes.light : themes.dark;
  }

  const styles = getComputedStyle(document.documentElement);
  const get = (name: string, fallback = '') => styles.getPropertyValue(name).trim() || fallback;

  return create({
    base: mode,
    appBg: get('--ds-color-bg-page'),
    appContentBg: get('--ds-color-bg-page'),
    appPreviewBg: get('--ds-color-bg-page'),
    appBorderColor: get('--ds-color-border-subtle'),
    appBorderRadius: 10,
    barBg: get('--ds-color-bg-page'),
    barTextColor: get('--ds-color-text-secondary'),
    barSelectedColor: get('--ds-color-text-primary'),
    barHoverColor: get('--ds-color-text-primary'),
    textColor: get('--ds-color-text-primary'),
    textInverseColor: get('--ds-color-bg-page'),
    textMutedColor: get('--ds-color-text-muted'),
    colorPrimary: get('--ds-color-action-primary-bg'),
    colorSecondary: get('--ds-color-text-accent'),
    fontBase: get('--ds-font-family-sans'),
    fontCode: get('--ds-font-family-mono'),
  });
};

/**
 * Wraps Storybook's DocsContainer and switches the docs-chrome theme
 * (page background, code blocks, table of contents) in lockstep with
 * the active story theme. The story theme is set on
 * `document.documentElement[data-theme]` by the `withTheme` decorator
 * in `preview.tsx`; we observe it so the docs page re-themes when the
 * user toggles the toolbar without a full reload.
 */
export const ThemedDocsContainer = ({
  children,
  context,
}: PropsWithChildren<DocsContainerProps>) => {
  // Rebuild the docs-chrome theme from the live tokens on every `data-theme`
  // change. We rebuild (not just track the mode string) because the tokens
  // must be read AFTER the `withTheme` decorator sets `data-theme`: at first
  // mount the attribute isn't set yet, so reading then would pick up the
  // light `:root` defaults and leave the Storybook DocBlocks (toolbar, args
  // table) cream in dark mode.
  const [docsTheme, setDocsTheme] = useState<ThemeVars>(() =>
    buildDocsTheme(
      typeof document === 'undefined'
        ? 'dark'
        : (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') ?? 'dark',
    ),
  );

  useEffect(() => {
    const root = document.documentElement;
    const rebuild = () =>
      setDocsTheme(buildDocsTheme((root.getAttribute('data-theme') as 'dark' | 'light') ?? 'dark'));
    rebuild();
    const observer = new MutationObserver(rebuild);
    observer.observe(root, {attributes: true, attributeFilter: ['data-theme']});

    return () => observer.disconnect();
  }, []);

  return (
    <DocsContainer context={context} theme={docsTheme}>
      {children}
    </DocsContainer>
  );
};
