import { type AnimationEvent, type MouseEvent } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

export type IconButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
/** Prefer `md`/`lg` for primary tap targets on touch to meet the 44x44 CSS pixel target size; `sm` is for dense UI only. */
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonShape = 'square' | 'circle';

interface UseIconButtonModelArgs {
  variant: IconButtonVariant;
  size: IconButtonSize;
  shape: IconButtonShape;
  loading: boolean;
  quiet: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface UseIconButtonModelResult {
  classes: string;
  isDisabled: boolean;
  ariaBusy: true | undefined;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleAnimationEnd: (event: AnimationEvent<HTMLButtonElement>) => void;
}

/** IconButton's press-release bounce, click forwarding, and class/state derivation. */
export const useIconButtonModel = ({
  variant,
  size,
  shape,
  loading,
  quiet,
  disabled,
  className,
  onClick,
}: UseIconButtonModelArgs): UseIconButtonModelResult => {
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!quiet) {
      triggerBounce();
    }

    onClick?.(event);
  };

  const classes = [
    'ds-icon-button',
    `ds-variant-${variant}`,
    `ds-size-${size}`,
    `ds-shape-${shape}`,
    loading && 'ds-loading',
    quiet && 'ds-quiet',
    bouncing && 'ds-bouncing',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    classes,
    isDisabled: disabled || loading,
    ariaBusy: loading || undefined,
    handleClick,
    handleAnimationEnd: handleBounceAnimationEnd,
  };
};
