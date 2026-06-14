export type CardElevation = 'flat' | 'raised' | 'overlay';

export type CardPadding = 'sm' | 'lg';

interface UseCardModelArgs {
  elevation: CardElevation;
  padding: CardPadding;
  interactive: boolean;
  className?: string;
}

interface UseCardModelResult {
  classes: string;
  tabIndex: 0 | undefined;
}

/** Card's class derivation and focusability from the `interactive` flag. */
export const useCardModel = ({
  elevation,
  padding,
  interactive,
  className,
}: UseCardModelArgs): UseCardModelResult => ({
  classes: [
    'ds-card',
    `ds-elevation-${elevation}`,
    `ds-padding-${padding}`,
    interactive && 'ds-interactive',
    className,
  ]
    .filter(Boolean)
    .join(' '),
  tabIndex: interactive ? 0 : undefined,
});

/** Merges a region's base class (`ds-card-header`/`-body`/`-footer`) with a consumer-passed className. Shared by the Card region wrappers so the merge never lives inline in a `.tsx`. */
export const regionClasses = (base: string, className?: string): string =>
  [base, className].filter(Boolean).join(' ');
