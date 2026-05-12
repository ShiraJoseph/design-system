import { type MouseEvent } from 'react';

interface UseToolbarItemModelArgs {
  onSelect?: () => void;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface UseToolbarItemModelResult {
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** Composes `onSelect` and the user's `onClick` into a single click handler for ToolbarItem. */
export const useToolbarItemModel = ({
  onSelect,
  onClick,
}: UseToolbarItemModelArgs): UseToolbarItemModelResult => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onSelect?.();
    onClick?.(event);
  };

  return {handleClick};
};
