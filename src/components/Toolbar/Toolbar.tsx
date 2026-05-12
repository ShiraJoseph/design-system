import { type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { type ToolbarOrientation, useToolbarModel } from './Toolbar.Model';
import './Toolbar.css';

export type { ToolbarOrientation } from './Toolbar.Model';

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ToolbarOrientation;
  /** Required accessible label for the toolbar. */
  'aria-label': string;
  /** Optional id of the currently-selected item, for segmented-control use. */
  selectedItemId?: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Horizontal or vertical container for action controls. Use for
 * grouped actions (e.g., editor toolbar) or as a segmented control
 * by passing `selectedItemId` and rendering `<ToolbarItem id=...>`
 * children.
 *
 * Accessibility:
 * - Renders with `role="toolbar"` and the appropriate `aria-orientation`.
 * - The `aria-label` prop is required so screen readers can announce
 *   the toolbar's purpose.
 * - Roving tabindex: only one item is in the tab order at a time.
 *   ArrowLeft/Right (horizontal) or ArrowUp/Down (vertical) cycle
 *   focus between items; Home/End jump to first/last. Any
 *   `<button>`-rendering child participates (IconButton, ToolbarItem,
 *   plain button); disabled items are skipped and the focus index
 *   self-clamps when items toggle disabled at runtime.
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
}: ToolbarProps) => {
  const {containerRef, handleKeyDown} = useToolbarModel({orientation});

  const setMergedRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const onContainerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    handleKeyDown(event);
  };

  const classes = [
    'ds-toolbar',
    `ds-orientation-${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={setMergedRef}
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={classes}
      data-selected-item={selectedItemId}
      onKeyDown={onContainerKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
};
