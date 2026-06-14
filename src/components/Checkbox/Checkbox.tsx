import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { Check, Minus } from '../../icons';
import { type CheckboxSize, useCheckboxModel } from './Checkbox.model';
import './Checkbox.css';

/** Boolean form input built on the native `<input type="checkbox">` so keyboard, focus, and form submission are correct without extra ARIA. */
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
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label: ReactNode;
  /** Linked to the input via `aria-describedby`. */
  description?: ReactNode;
  /** Hide the label visually while keeping it accessible. */
  visuallyHideLabel?: boolean;
  /** Renders a dash mark and sets the native `indeterminate` property on the input. */
  indeterminate?: boolean;
  /** Defaults to `'md'`. */
  size?: CheckboxSize;
  ref?: Ref<HTMLInputElement>;
}) => {
  const {
    inputId,
    descriptionId,
    wrapperClasses,
    boxClasses,
    setMergedRef,
    handleChange,
    handleBoxAnimationEnd,
  } = useCheckboxModel({id, description, indeterminate, size, disabled, className, ref, onChange});

  return (
    <div className={wrapperClasses}>
      <label htmlFor={inputId} className={'ds-row'}>
        <span className={'ds-control'}>
          <input
            ref={setMergedRef}
            id={inputId}
            type={'checkbox'}
            className={'ds-input'}
            disabled={disabled}
            aria-describedby={descriptionId}
            onChange={handleChange}
            {...rest}
          />
          <span
            className={boxClasses}
            aria-hidden={'true'}
            onAnimationEnd={handleBoxAnimationEnd}
          >
            <Check className={'ds-check'}/>
            <Minus className={'ds-dash'}/>
          </span>
        </span>
        <span className={'ds-text'}>
          <span className={visuallyHideLabel ? 'ds-visually-hidden' : 'ds-label'}>
            {label}
          </span>
          {description && (
            <span id={descriptionId} className={'ds-description'}>
              {description}
            </span>
          )}
        </span>
      </label>
    </div>
  );
};
