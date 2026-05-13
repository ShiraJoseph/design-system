import { type AnimationEvent, type MouseEvent } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

interface UseIconButtonModelArgs {
  quiet: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface UseIconButtonModelResult {
  bouncing: boolean;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleAnimationEnd: (event: AnimationEvent<HTMLButtonElement>) => void;
}

/** IconButton's press-release bounce + click forwarding, pulled out of the JSX file. */
export const useIconButtonModel = ({quiet, onClick}: UseIconButtonModelArgs): UseIconButtonModelResult => {
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
