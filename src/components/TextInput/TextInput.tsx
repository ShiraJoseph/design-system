import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { useTextInputModel } from './TextInput.model';
import './TextInput.css';

/** Control size, matches `Button` so the two align in a form row. */
export type TextInputSize = 'sm' | 'md' | 'lg';

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label text. Required for accessibility. */
  label: string;
  /**
   * When `true`, hides the label visually but keeps it for assistive
   * tech via the standard sr-only pattern. Use sparingly, visible
   * labels are nearly always more accessible than placeholder-only
   * patterns. Note: the required asterisk lives inside the same
   * `<label>` so it's hidden too; sighted users won't see "required"
   * styling, screen-reader users still hear the label.
   */
  visuallyHideLabel?: boolean;
  /** Helper copy rendered below the input. Linked via `aria-describedby`. */
  helperText?: string;
  /**
   * Error message. When present, the input enters the error state,
   * `aria-invalid` is set, and the message is announced via
   * `aria-describedby`. Pass an empty string or `undefined` to clear.
   */
  error?: string;
  /**
   * Marks the field as required. Renders a small asterisk next to the
   * label that turns red when the input enters the error state (i.e.,
   * after a failed submit attempt populates `error`).
   */
  required?: boolean;
  /** Icon rendered inside the input on the leading edge. Decorative. */
  leadingIcon?: ReactNode;
  /** Icon rendered inside the input on the trailing edge. Decorative. */
  trailingIcon?: ReactNode;
  size?: TextInputSize;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Single-line text input with built-in label, helper, and error
 * affordances. Wires up the `<label for>` / `aria-describedby` /
 * `aria-invalid` triad so consumers don't have to.
 *
 * Required fields show a small asterisk next to the label. The mark
 * is muted by default and turns red when `error` is set, giving a
 * direct visual signal that this field is the one to fix after a
 * failed submit. Screen readers rely on the native `required` /
 * `aria-required` attributes, so the asterisk is decorative.
 */
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
}: TextInputProps) => {
  const {intl, inputId, helperId, errorId, describedBy} = useTextInputModel({
    id,
    helperText,
    error,
    ariaDescribedBy: rest['aria-describedby'],
  });

  const wrapperClasses = [
    'ds-text-input',
    `ds-size-${size}`,
    error && 'ds-errored',
    disabled && 'ds-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <label
        htmlFor={inputId}
        className={visuallyHideLabel ? 'ds-visually-hidden' : 'ds-label'}
      >
        {label}
        {required && (
          <span className="ds-required-mark" aria-hidden="true">*</span>
        )}
      </label>

      <div className="ds-field">
        {leadingIcon && (
          <span className="ds-leading-icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className="ds-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          required={required}
          disabled={disabled}
          {...rest}
        />
        {trailingIcon && (
          <span className="ds-trailing-icon" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </div>

      {helperText && !error && (
        <p id={helperId} className="ds-helper">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="ds-error" role="alert">
          <span className="ds-visually-hidden">
            {intl.formatMessage({id: 'input.errorPrefix'})}{' '}
          </span>
          {error}
        </p>
      )}
    </div>
  );
};
