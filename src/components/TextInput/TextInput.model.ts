import { useId } from 'react';
import { type IntlShape, useIntl } from 'react-intl';

/** Matches `Button` sizes so the two align in a form row. */
export type TextInputSize = 'sm' | 'md' | 'lg';

interface UseTextInputModelArgs {
  id?: string;
  size: TextInputSize;
  helperText?: string;
  error?: string;
  required: boolean;
  disabled?: boolean;
  visuallyHideLabel: boolean;
  className?: string;
  ariaDescribedBy?: string;
}

interface UseTextInputModelResult {
  intl: IntlShape;
  inputId: string;
  helperId: string | undefined;
  errorId: string | undefined;
  describedBy: string | undefined;
  wrapperClasses: string;
  labelClass: string;
  hasError: boolean;
  ariaInvalid: true | undefined;
  ariaRequired: true | undefined;
  showHelperText: boolean;
}

/** Per-instance ids, class derivation, and the `aria-describedby`/`aria-invalid`/`aria-required` wiring for TextInput, plus the `intl` shape for the localized error prefix. */
export const useTextInputModel = ({
  id,
  size,
  helperText,
  error,
  required,
  disabled,
  visuallyHideLabel,
  className,
  ariaDescribedBy,
}: UseTextInputModelArgs): UseTextInputModelResult => {
  const intl = useIntl();
  const reactId = useId();
  const inputId = id ?? `ds-input-${reactId}`;
  const hasError = Boolean(error);
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const describedBy =
    [helperId, errorId, ariaDescribedBy].filter(Boolean).join(' ').trim() || undefined;

  const wrapperClasses = [
    'ds-text-input',
    `ds-size-${size}`,
    hasError && 'ds-errored',
    disabled && 'ds-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    intl,
    inputId,
    helperId,
    errorId,
    describedBy,
    wrapperClasses,
    labelClass: visuallyHideLabel ? 'ds-visually-hidden' : 'ds-label',
    hasError,
    ariaInvalid: hasError || undefined,
    ariaRequired: required || undefined,
    showHelperText: Boolean(helperText) && !hasError,
  };
};
