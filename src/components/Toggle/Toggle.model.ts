import { type AnimationEvent, type ChangeEvent, type ReactNode, useId } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

interface UseToggleModelArgs {
  id?: string;
  description?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface UseToggleModelResult {
  inputId: string;
  descriptionId: string | undefined;
  bouncing: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleThumbAnimationEnd: (event: AnimationEvent<HTMLSpanElement>) => void;
}

/**
 * Per-instance ids for Toggle's input + optional description, plus the
 * JS-triggered slide-bounce wiring. Listens specifically for the
 * `ds-slide-bounce` animation name so unrelated nested animations
 * can't accidentally clear the bouncing flag.
 */
export const useToggleModel = ({
  id,
  description,
  onChange,
}: UseToggleModelArgs): UseToggleModelResult => {
  const reactId = useId();
  const inputId = id ?? `ds-toggle-${reactId}`;
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange({
    animationName: 'ds-slide-bounce',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    triggerBounce();
    onChange?.(event);
  };

  return {
    inputId,
    descriptionId,
    bouncing,
    handleChange,
    handleThumbAnimationEnd: handleBounceAnimationEnd,
  };
};
