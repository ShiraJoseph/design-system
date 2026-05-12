import { type AnimationEvent, type MouseEvent } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

interface UseFABModelArgs {
  quiet: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface UseFABModelResult {
  bouncing: boolean;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleAnimationEnd: (event: AnimationEvent<HTMLButtonElement>) => void;
}

/** FAB's press-release bounce + click forwarding, pulled out of the JSX file. */
export const useFABModel = ({quiet, onClick}: UseFABModelArgs): UseFABModelResult => {
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
