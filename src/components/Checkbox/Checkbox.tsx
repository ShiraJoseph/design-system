import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { CheckBold } from '../../icons';
import { useCheckboxModel } from './Checkbox.model';
import './Checkbox.css';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Visible label. Required for accessibility. */
  label: ReactNode;
  /** Helper text linked via aria-describedby. */
  description?: ReactNode;
  /** Hide the label visually while keeping it accessible. */
  visuallyHideLabel?: boolean;
  /**
   * Tri-state checkbox. When `true`, the box renders an indeterminate
   * dash mark instead of a checkmark. The native `indeterminate`
   * property is set on the underlying input.
   */
  indeterminate?: boolean;
  size?: CheckboxSize;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Boolean form input. Built on the native `<input type="checkbox">` so
 * keyboard activation, focus order, and form submission are correct
 * without any extra ARIA. On change, the entire box (border + check)
 * plays a 4-stop bounce, the same press-release animation Button uses,
 * so the check stays a constant size relative to its container.
 */
export const Checkbox = ({
  label,
  description,
  visuallyHideLabel = false,
  indeterminate = false,
  size = 'md',
  id,
  disabled,
  className,
  onChange,
  ref,
  ...rest
}: CheckboxProps) => {
  const {
    inputId,
    descriptionId,
    bouncing,
    internalRef,
    handleChange,
    handleBoxAnimationEnd,
  } = useCheckboxModel({id, description, indeterminate, onChange});

  const setMergedRef = (node: HTMLInputElement | null) => {
    internalRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
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

  return (
    <div className={wrapperClasses}>
      <label htmlFor={inputId} className="ds-row">
        <span className="ds-control">
          <input
            ref={setMergedRef}
            id={inputId}
            type="checkbox"
            className="ds-input"
            disabled={disabled}
            aria-describedby={descriptionId}
            onChange={handleChange}
            {...rest}
          />
          <span
            className={boxClasses}
            aria-hidden="true"
            onAnimationEnd={handleBoxAnimationEnd}
          >
            <CheckBold className="ds-check"/>
            <span className="ds-dash"/>
          </span>
        </span>
        <span className="ds-text">
          <span className={visuallyHideLabel ? 'ds-visually-hidden' : 'ds-label'}>
            {label}
          </span>
          {description && (
            <span id={descriptionId} className="ds-description">
              {description}
            </span>
          )}
        </span>
      </label>
    </div>
  );
};
