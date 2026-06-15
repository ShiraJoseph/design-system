import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { useToolbarItemModel } from './ToolbarItem.model';

/** Segmented item inside a Toolbar; selected when its `id` matches the parent's `selectedItemId`. */
export const ToolbarItem = ({
  id,
  children,
  disabled,
  onSelect,
  className,
  onClick,
  ref,
  ...rest
}: HTMLAttributes<HTMLButtonElement> & {
  /** Matched against `Toolbar.selectedItemId` for segmented mode. */
  id: string;
  children: ReactNode;
  disabled?: boolean;
  /** Fired before the user's `onClick`. */
  onSelect?: () => void;
  ref?: Ref<HTMLButtonElement>;
}) => {
  const {classes, handleClick} = useToolbarItemModel({className, onSelect, onClick});

  return (
    <button
      ref={ref}
      type={'button'}
      data-toolbar-item
      data-item-id={id}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      <span className={'ds-item-label'}>{children}</span>
    </button>
  );
};
