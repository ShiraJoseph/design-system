import { type ChangeEvent, type ReactNode, type Ref, useId } from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';
import { assignRefs } from '../../utils/assignRefs';

export type CheckboxSize = 'sm' | 'md';

/** Checkbox wiring: per-instance ids, bounce-on-change, class/state derivation, and the ref that pushes `indeterminate` to the native input. */
export const useCheckboxModel = ({
  id,
  description,
  indeterminate,
  size,
  disabled,
  className,
  ref,
  onChange,
}: {
  id?: string;
  description?: ReactNode;
  indeterminate: boolean;
  size: CheckboxSize;
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const reactId = useId();
  const inputId = id ?? `ds-checkbox-${reactId}`;
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange();

  const setMergedRef = (node: HTMLInputElement | null) => {
    if (node) {
      node.indeterminate = indeterminate;
    }

    assignRefs(node, ref);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    triggerBounce();
    onChange?.(event);
  };

  const wrapperClasses = [
    'ds-checkbox',
    `ds-size-${size}`,
    indeterminate && 'ds-indeterminate',
    disabled && 'ds-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const boxClasses = ['ds-box', bouncing && 'ds-bouncing']
    .filter(Boolean)
    .join(' ');

  return {
    inputId,
    descriptionId,
    wrapperClasses,
    boxClasses,
    /** Attach to the input; forwards any external ref and pushes `indeterminate` (which has no JSX prop) straight to the node. */
    setMergedRef,
    handleChange,
    handleBoxAnimationEnd: handleBounceAnimationEnd,
  };
};
