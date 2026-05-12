import { type MouseEvent, type ReactNode, type RefObject, useEffect, useId, useRef, } from 'react';
import { useIntl } from 'react-intl';

interface UseModalModelArgs {
  open: boolean;
  onClose: () => void;
  description?: ReactNode;
  dismissOnBackdropClick: boolean;
  closeLabel?: string;
}

interface UseModalModelResult {
  dialogRef: RefObject<HTMLDialogElement | null>;
  titleId: string;
  descId: string | undefined;
  resolvedCloseLabel: string;
  handleBackdropClick: (event: MouseEvent<HTMLDialogElement>) => void;
}

/**
 * Drives the native <dialog> lifecycle: shows/closes in response to
 * the `open` prop, intercepts the browser's ESC `cancel` event so
 * `onClose` is the single source of truth, and computes the backdrop-
 * click handler (clicks on the dialog element itself, outside the
 * visible card, count as outside-the-modal).
 */
export const useModalModel = ({
  open,
  onClose,
  description,
  dismissOnBackdropClick,
  closeLabel,
}: UseModalModelArgs): UseModalModelResult => {
  const intl = useIntl();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reactId = useId();
  const titleId = `ds-modal-title-${reactId}`;
  const descId = description ? `ds-modal-desc-${reactId}` : undefined;
  const resolvedCloseLabel = closeLabel ?? intl.formatMessage({id: 'modal.close'});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', handleCancel);

    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (!dismissOnBackdropClick) return;
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return {dialogRef, titleId, descId, resolvedCloseLabel, handleBackdropClick};
};
