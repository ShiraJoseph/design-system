import { type AnimationEvent, type MouseEvent } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

interface UseButtonModelArgs {
  quiet: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface UseButtonModelResult {
  bouncing: boolean;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleAnimationEnd: (event: AnimationEvent<HTMLButtonElement>) => void;
}

/**
 * Wires up a Button's press-release bounce + click forwarding. Pulled
 * out of Button.tsx so the component file stays JSX-only per CODE_STYLE.
 */
export const useButtonModel = ({quiet, onClick}: UseButtonModelArgs): UseButtonModelResult => {
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!quiet) {
      triggerBounce();
    }

    onClick?.(event);
  };

  return {
    bouncing,
    handleClick,
    handleAnimationEnd: handleBounceAnimationEnd,
  };
};
