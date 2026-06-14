import { type ReactNode } from 'react';
import './Modal.css';
import { Card } from '../Card';
import { IconButton } from '../IconButton';
import { Close } from '../../icons';
import { useModalModel } from './Modal.model';

/**
 * Modal dialog built on the native `<dialog>` element so the browser
 * provides focus trapping, ESC-to-close, scroll lock, and the backdrop.
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
}: {
  open: boolean;
  /** Fires on a close request (button, backdrop, ESC); the parent decides whether to actually close. */
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** Defaults to `true`. Set `false` for destructive confirmations where accidental dismissal would lose data. */
  dismissOnBackdropClick?: boolean;
  /** Defaults to a localized "Close dialog". */
  closeLabel?: string;
}) => {
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
      className={'ds-modal'}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={handleBackdropClick}
    >
      <Card className={'ds-modal-card'} role={'document'} elevation={'overlay'} padding={'lg'}>
        <header className={'ds-modal-header'}>
          <div>
            <h2 id={titleId} className={'ds-modal-title'}>
              {title}
            </h2>
            {description && (
              <p id={descId} className={'ds-modal-description'}>
                {description}
              </p>
            )}
          </div>
          <IconButton
            aria-label={resolvedCloseLabel}
            icon={<Close/>}
            variant={'ghost'}
            size={'sm'}
            onClick={onClose}
          />
        </header>
        {children && <div className={'ds-modal-body'}>{children}</div>}
        {footer && <footer className={'ds-modal-footer'}>{footer}</footer>}
      </Card>
    </dialog>
  );
};
