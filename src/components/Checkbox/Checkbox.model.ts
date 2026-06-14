import {
  type AnimationEvent,
  type ChangeEvent,
  type ReactNode,
  type Ref,
  useEffect,
  useId,
  useRef,
} from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';
import { assignRefs } from '../../utils/assignRefs';

export type CheckboxSize = 'sm' | 'md';

interface UseCheckboxModelArgs {
  id?: string;
  description?: ReactNode;
  indeterminate: boolean;
  size: CheckboxSize;
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface UseCheckboxModelResult {
  inputId: string;
  descriptionId: string | undefined;
  wrapperClasses: string;
  boxClasses: string;
  /** Attach to the input; merges the internal ref with any external ref and pushes `indeterminate` to the node. */
  setMergedRef: (node: HTMLInputElement | null) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBoxAnimationEnd: (event: AnimationEvent<HTMLSpanElement>) => void;
}

/** Checkbox wiring: per-instance ids, bounce-on-change, class/state derivation, and the merged ref that pushes `indeterminate` to the native input. */
export const useCheckboxModel = ({
  id,
  description,
  indeterminate,
  size,
  disabled,
  className,
  ref,
  onChange,
}: UseCheckboxModelArgs): UseCheckboxModelResult => {
  const reactId = useId();
  const inputId = id ?? `ds-checkbox-${reactId}`;
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const internalRef = useRef<HTMLInputElement | null>(null);
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange();

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const setMergedRef = (node: HTMLInputElement | null) => assignRefs(node, internalRef, ref);

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
    setMergedRef,
    handleChange,
    handleBoxAnimationEnd: handleBounceAnimationEnd,
  };
};
