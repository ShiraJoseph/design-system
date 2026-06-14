import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { type TextInputSize, useTextInputModel } from './TextInput.model';
import './TextInput.css';

/** Single-line text input that wires up the `<label for>` / `aria-describedby` / `aria-invalid` triad so consumers don't have to. */
export const TextInput = ({
  label,
  visuallyHideLabel = false,
  helperText,
  error,
  required = false,
  leadingIcon,
  trailingIcon,
  size = 'md',
  id,
  className,
  disabled,
  ref,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string;
  /** Hides the label visually but keeps it for assistive tech; the required asterisk lives inside the same label so it's hidden too. */
  visuallyHideLabel?: boolean;
  helperText?: string;
  /** When present, the input enters the error state. Pass an empty string or `undefined` to clear. */
  error?: string;
  required?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Defaults to `'md'`. */
  size?: TextInputSize;
  ref?: Ref<HTMLInputElement>;
}) => {
  const {
    intl,
    inputId,
    helperId,
    errorId,
    describedBy,
    wrapperClasses,
    labelClass,
    hasError,
    ariaInvalid,
    ariaRequired,
    showHelperText,
  } = useTextInputModel({
    id,
    size,
    helperText,
    error,
    required,
    disabled,
    visuallyHideLabel,
    className,
    ariaDescribedBy: rest['aria-describedby'],
  });

  return (
    <div className={wrapperClasses}>
      <label htmlFor={inputId} className={labelClass}>
        {label}
        {required && (
          <span className={'ds-required-mark'} aria-hidden={'true'}>*</span>
        )}
      </label>

      <div className={'ds-field'}>
        {leadingIcon && (
          <span className={'ds-leading-icon'} aria-hidden={'true'}>
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={'ds-input'}
          aria-invalid={ariaInvalid}
          aria-describedby={describedBy}
          aria-required={ariaRequired}
          required={required}
          disabled={disabled}
          {...rest}
        />
        {trailingIcon && (
          <span className={'ds-trailing-icon'} aria-hidden={'true'}>
            {trailingIcon}
          </span>
        )}
      </div>

      {showHelperText && (
        <p id={helperId} className={'ds-helper'}>
          {helperText}
        </p>
      )}
      {hasError && (
        <p id={errorId} className={'ds-error'} role={'alert'}>
          <span className={'ds-visually-hidden'}>
            {intl.formatMessage({id: 'input.errorPrefix'})}{' '}
          </span>
          {error}
        </p>
      )}
    </div>
  );
};
