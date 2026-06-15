import { type MouseEvent } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
/** Prefer `md`/`lg` for primary tap targets on touch to meet the 44x44 CSS pixel target size; `sm` is for dense UI only. */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Button's press-release bounce, click forwarding, and class/state derivation. */
export const useButtonModel = ({
  variant,
  size,
  fullWidth,
  loading,
  quiet,
  disabled,
  className,
  onClick,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  loading: boolean;
  quiet: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}) => {
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!quiet) {
      triggerBounce();
    }

    onClick?.(event);
  };

  const classes = [
    'ds-button',
    `ds-variant-${variant}`,
    `ds-size-${size}`,
    fullWidth && 'ds-full-width',
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
