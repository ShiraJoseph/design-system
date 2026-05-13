import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { useToolbarItemModel } from './ToolbarItem.model';

export interface ToolbarItemProps extends HTMLAttributes<HTMLButtonElement> {
  /** Item id, matched against `Toolbar.selectedItemId` for segmented mode. */
  id: string;
  /** Label or icon content. */
  children: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Segmented item inside a Toolbar. Becomes "selected" when its `id`
 * matches the parent Toolbar's `selectedItemId`. The selection
 * indicator plays the standard 4-stop bounce on activation.
 */
export const ToolbarItem = ({
  id,
  children,
  disabled,
  onSelect,
  className,
  onClick,
  ref,
  ...rest
}: ToolbarItemProps) => {
  const {handleClick} = useToolbarItemModel({onSelect, onClick});
  const classes = ['ds-item', className].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type="button"
      data-toolbar-item
      data-item-id={id}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      <span className="ds-item-label">{children}</span>
    </button>
  );
};
