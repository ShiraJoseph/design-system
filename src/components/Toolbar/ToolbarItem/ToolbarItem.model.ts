import { type MouseEvent } from 'react';

interface UseToolbarItemModelArgs {
  className?: string;
  onSelect?: () => void;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface UseToolbarItemModelResult {
  classes: string;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** Composes `onSelect` and the user's `onClick` into a single click handler for ToolbarItem and derives its class list. */
export const useToolbarItemModel = ({
  className,
  onSelect,
  onClick,
}: UseToolbarItemModelArgs): UseToolbarItemModelResult => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onSelect?.();
    onClick?.(event);
  };

  const classes = ['ds-item', className].filter(Boolean).join(' ');

  return {classes, handleClick};
};
