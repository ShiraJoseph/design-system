import {
  type AnimationEvent,
  type ChangeEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
} from 'react';
import { useBounceOnChange } from '../../hooks/useBounceOnChange';

interface UseCheckboxModelArgs {
  id?: string;
  description?: ReactNode;
  indeterminate: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface UseCheckboxModelResult {
  inputId: string;
  descriptionId: string | undefined;
  bouncing: boolean;
  /** Internal ref the consumer must attach to the input (merge with any external ref in component scope). */
  internalRef: RefObject<HTMLInputElement | null>;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBoxAnimationEnd: (event: AnimationEvent<HTMLSpanElement>) => void;
}

/**
 * Checkbox wiring: per-instance ids, bounce-on-change, the effect that
 * pushes `indeterminate` to the native input, and the internal ref the
 * component attaches to the <input> so it can write `indeterminate`.
 * Merging the internal ref with an external prop ref happens in the
 * component file (keeps the hook free of ref mutation).
 */
export const useCheckboxModel = ({
  id,
  description,
  indeterminate,
  onChange,
}: UseCheckboxModelArgs): UseCheckboxModelResult => {
  const reactId = useId();
  const inputId = id ?? `ds-checkbox-${reactId}`;
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const internalRef = useRef<HTMLInputElement>(null);
  const {bouncing, triggerBounce, handleBounceAnimationEnd} = useBounceOnChange();

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    triggerBounce();
    onChange?.(event);
  };

  return {
    inputId,
    descriptionId,
    bouncing,
    internalRef,
    handleChange,
    handleBoxAnimationEnd: handleBounceAnimationEnd,
  };
};
