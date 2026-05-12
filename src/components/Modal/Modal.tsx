import { type ReactNode } from 'react';
import './Modal.css';
import { IconButton } from '../IconButton';
import { Close } from '../../icons';
import { useModalModel } from './Modal.Model';

export interface ModalProps {
  /** Controls whether the modal is open. */
  open: boolean;
  /**
   * Called when the user requests close (close button, backdrop click,
   * or ESC key). The parent decides whether to actually close.
   */
  onClose: () => void;
  /**
   * Accessible heading. Rendered as the dialog's `aria-labelledby`
   * target. Pass a string for the default heading style or a node
   * for custom layout.
   */
  title: ReactNode;
  /** Optional sub-line below the title, linked via `aria-describedby`. */
  description?: ReactNode;
  /** Modal body content. */
  children?: ReactNode;
  /** Footer slot, typically holds confirm/cancel buttons. */
  footer?: ReactNode;
  /**
   * When `true`, clicking the backdrop dismisses. Defaults to `true`.
   * Set to `false` for destructive confirmations where accidental
   * dismissal would lose data.
   */
  dismissOnBackdropClick?: boolean;
  /**
   * Override the close button's accessible label. Defaults to a
   * localized "Close dialog" string.
   */
  closeLabel?: string;
}

/**
 * Modal dialog built on the native `<dialog>` element. The browser
 * handles focus trapping, ESC-to-close, scroll-locking, and the
 * backdrop, which is significantly more accessible than a hand-rolled
 * div + portal pattern.
 *
 * Focus is moved to the first focusable element inside the dialog when
 * it opens, then restored to the previously-focused element on close
 * (the platform's default behavior with `showModal()`).
 *
 * @example
 * const [open, setOpen] = useState(false);
 * <Modal open={open} onClose={() => setOpen(false)} title="Confirm">
 *   ...
 * </Modal>
 */
export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  dismissOnBackdropClick = true,
  closeLabel,
}: ModalProps) => {
  const {dialogRef, titleId, descId, resolvedCloseLabel, handleBackdropClick} = useModalModel({
    open,
    onClose,
    description,
    dismissOnBackdropClick,
    closeLabel,
  });

  return (
    <dialog
      ref={dialogRef}
      className="ds-modal"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={handleBackdropClick}
    >
      <div className="ds-modal-card" role="document">
        <header className="ds-modal-header">
          <div>
            <h2 id={titleId} className="ds-modal-title">
              {title}
            </h2>
            {description && (
              <p id={descId} className="ds-modal-description">
                {description}
              </p>
            )}
          </div>
          <IconButton
            aria-label={resolvedCloseLabel}
            icon={<Close/>}
            variant="ghost"
            size="sm"
            onClick={onClose}
          />
        </header>
        {children && <div className="ds-modal-body">{children}</div>}
        {footer && <footer className="ds-modal-footer">{footer}</footer>}
      </div>
    </dialog>
  );
};
