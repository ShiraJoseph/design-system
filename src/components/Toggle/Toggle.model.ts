import { type ChangeEvent, type ReactNode, useId } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

export type ToggleSize = 'sm' | 'md';

/** Per-instance ids, class derivation, and slide-bounce wiring for Toggle; listens for the `ds-slide-bounce` animation name so nested animations can't clear the bouncing flag. */
export const useToggleModel = ({
  id,
  description,
  size,
  disabled,
  className,
  visuallyHideLabel,
  onChange,
}: {
  id?: string;
  description?: ReactNode;
  size: ToggleSize;
  disabled?: boolean;
  className?: string;
  visuallyHideLabel: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
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

  const wrapperClasses = [
    'ds-toggle',
    `ds-size-${size}`,
    disabled && 'ds-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const thumbClasses = ['ds-thumb', bouncing && 'ds-bouncing'].filter(Boolean).join(' ');

  return {
    inputId,
    descriptionId,
    wrapperClasses,
    thumbClasses,
    labelClass: visuallyHideLabel ? 'ds-visually-hidden' : 'ds-label',
    handleChange,
    handleThumbAnimationEnd: handleBounceAnimationEnd,
  };
};
