import { type AnimationEvent, type MouseEvent, type ReactNode } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

export type FABSize = 'md' | 'lg';
export type FABVariant = 'primary' | 'secondary';

interface UseFABModelArgs {
  variant: FABVariant;
  size: FABSize;
  label?: ReactNode;
  quiet: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface UseFABModelResult {
  classes: string;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleAnimationEnd: (event: AnimationEvent<HTMLButtonElement>) => void;
}

/** FAB's press-release bounce, click forwarding, and class derivation. */
export const useFABModel = ({
  variant,
  size,
  label,
  quiet,
  className,
  onClick,
}: UseFABModelArgs): UseFABModelResult => {
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!quiet) {
      triggerBounce();
    }

    onClick?.(event);
  };

  const classes = [
    'ds-fab',
    `ds-variant-${variant}`,
    `ds-size-${size}`,
    label && 'ds-extended',
    quiet && 'ds-quiet',
    bouncing && 'ds-bouncing',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    classes,
    handleClick,
    handleAnimationEnd: handleBounceAnimationEnd,
  };
};
