import { type ChangeEvent, type ReactNode, useId } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

/** Per-instance ids, bounce-on-change wiring, onChange forwarding, and class derivation for Radio. */
export const useRadioModel = ({
  id,
  description,
  disabled,
  className,
  onChange,
}: {
  id?: string;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const reactId = useId();
  const inputId = id ?? `ds-radio-${reactId}`;
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    triggerBounce();
    onChange?.(event);
  };

  const wrapperClasses = ['ds-radio', disabled && 'ds-disabled', className]
    .filter(Boolean)
    .join(' ');

  const ringClasses = ['ds-ring', bouncing && 'ds-bouncing'].filter(Boolean).join(' ');

  return {
    inputId,
    descriptionId,
    wrapperClasses,
    ringClasses,
    handleChange,
    handleRingAnimationEnd: handleBounceAnimationEnd,
  };
};
