import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import './GridLayout.css';

/** Per-column minimum width before the grid wraps to fewer columns: 8 / 16 / 24rem. */
export type GridLayoutSize = 'sm' | 'md' | 'lg';

/** Responsive grid whose columns reflow via `auto-fit` + `minmax(min(grid-min, 100%), 1fr)`, so a lone item shrinks below its floor instead of overflowing narrow viewports. */
export const GridLayout = ({
  size = 'md',
  className,
  children,
  ref,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  /** Defaults to `'md'`. */
  size?: GridLayoutSize;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) => {
  const classes = ['ds-grid-layout', `ds-grid-layout-size-${size}`, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  );
};
