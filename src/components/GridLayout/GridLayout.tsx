import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import './GridLayout.css';

/**
 * Column minimum width: the floor each column shrinks to before the grid
 * wraps to fewer columns. `sm`/`md`/`lg` step up the floor (8 / 16 / 24rem).
 */
export type GridLayoutSize = 'sm' | 'md' | 'lg';

export interface GridLayoutProps extends HTMLAttributes<HTMLDivElement> {
  size?: GridLayoutSize;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * General-purpose responsive grid. Lay out any items — cards, tiles, a row's
 * worth of fields — and the columns reflow to the available width via
 * `auto-fit` + `minmax(min(grid-min, 100%), 1fr)`, so a lone item shrinks
 * below its floor all the way down to very narrow viewports instead of
 * overflowing. The gap is fixed across every size so grids of different
 * `size` line up on a shared page. `md` suits content-sized items, `sm`
 * packs dense grids like token swatches, and `lg` is for wide content.
 */
export const GridLayout = ({
  size = 'md',
  className,
  children,
  ref,
  ...rest
}: GridLayoutProps) => {
  const classes = ['ds-grid-layout', `ds-grid-layout-size-${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  );
};
