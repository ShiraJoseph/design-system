import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import './Card.css';

/** Surface elevation. Higher levels add stronger shadows and contrast. */
export type CardElevation = 'flat' | 'raised' | 'overlay';

/** Internal padding scale. */
export type CardPadding = 'sm' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  padding?: CardPadding;
  /**
   * When provided, the entire card becomes a focusable affordance, use
   * for clickable cards. The `as` prop pattern is intentionally avoided
   * here because making a generic `<div>` keyboard-accessible quickly
   * grows complex; for navigation, wrap the card in an `<a>` instead.
   */
  interactive?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Generic surface for grouping related content. Defaults to `raised`
 * elevation. Pair with `CardHeader`, `CardBody`, and `CardFooter` for
 * consistent internal layout.
 *
 * Accessibility: Card itself adds no semantics. If the card represents
 * a discrete region (e.g, a settings panel), wrap content in
 * `<section aria-labelledby>` and reference the heading inside.
 */
export const Card = ({
  elevation = 'raised',
  padding = 'lg',
  interactive = false,
  className,
  children,
  ref,
  ...rest
}: CardProps) => {
  const classes = [
    'ds-card',
    `ds-elevation-${elevation}`,
    `ds-padding-${padding}`,
    interactive && 'ds-interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      tabIndex={interactive ? 0 : undefined}
      {...rest}
    >
      {children}
    </div>
  );
};
