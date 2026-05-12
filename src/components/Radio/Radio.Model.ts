import { type AnimationEvent, type ChangeEvent, type ReactNode, useId } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

interface UseRadioModelArgs {
  id?: string;
  description?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface UseRadioModelResult {
  inputId: string;
  descriptionId: string | undefined;
  bouncing: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRingAnimationEnd: (event: AnimationEvent<HTMLSpanElement>) => void;
}

/** Per-instance ids, bounce-on-change wiring, and onChange forwarding for Radio. */
export const useRadioModel = ({id, description, onChange}: UseRadioModelArgs): UseRadioModelResult => {
  const reactId = useId();
  const inputId = id ?? `ds-radio-${reactId}`;
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    triggerBounce();
    onChange?.(event);
  };

  return {
    inputId,
    descriptionId,
    bouncing,
    handleChange,
    handleRingAnimationEnd: handleBounceAnimationEnd,
  };
};
