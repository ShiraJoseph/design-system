import { useId } from 'react';
import { type IntlShape, useIntl } from 'react-intl';

interface UseTextInputModelArgs {
  id?: string;
  helperText?: string;
  error?: string;
  ariaDescribedBy?: string;
}

interface UseTextInputModelResult {
  intl: IntlShape;
  inputId: string;
  helperId: string | undefined;
  errorId: string | undefined;
  describedBy: string | undefined;
}

/**
 * Per-instance ids for TextInput's input, helper text, and error
 * message, plus the merged `aria-describedby` string. Exposes the
 * `intl` shape so the JSX can render the localized error prefix.
 */
export const useTextInputModel = ({
  id,
  helperText,
  error,
  ariaDescribedBy,
}: UseTextInputModelArgs): UseTextInputModelResult => {
  const intl = useIntl();
  const reactId = useId();
  const inputId = id ?? `ds-input-${reactId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [helperId, errorId, ariaDescribedBy].filter(Boolean).join(' ').trim() || undefined;

  return {intl, inputId, helperId, errorId, describedBy};
};
