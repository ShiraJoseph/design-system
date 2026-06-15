import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { type ToolbarOrientation, useToolbarModel } from './Toolbar.model';
import { Card } from '../Card';
import './Toolbar.css';

/**
 * Container for action controls, usable as a segmented control via `selectedItemId` plus
 * `<ToolbarItem>` children. Uses roving tabindex: any `<button>`-rendering child participates.
 */
export const Toolbar = ({
  orientation = 'horizontal',
  'aria-label': ariaLabel,
  selectedItemId,
  children,
  className,
  onKeyDown,
  ref,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  /** Defaults to `'horizontal'`. */
  orientation?: ToolbarOrientation;
  'aria-label': string;
  /** Id of the currently-selected item, for segmented-control use. */
  selectedItemId?: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) => {
  const {classes, setMergedRef, onContainerKeyDown} = useToolbarModel({
    orientation,
    className,
    ref,
    onKeyDown,
  });

  return (
    <Card
      ref={setMergedRef}
      elevation={'raised'}
      padding={'sm'}
      role={'toolbar'}
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={classes}
      data-selected-item={selectedItemId}
      onKeyDown={onContainerKeyDown}
      {...rest}
    >
      {children}
    </Card>
  );
};
