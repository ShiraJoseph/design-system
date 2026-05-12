import { type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { useIconButtonModel } from './IconButton.Model';
import './IconButton.css';

/** Visual treatment of the icon button. */
export type IconButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/** Control size. Touch target rules apply, see `tap-target-min` token. */
export type IconButtonSize = 'sm' | 'md' | 'lg';

/** Border-radius profile. `square` uses the medium radius; `circle` is round. */
export type IconButtonShape = 'square' | 'circle';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Required accessible name. The icon is decorative; the label is what
   * screen readers announce. Phrase as the action ("Close dialog",
   * "Delete row"), not the icon name.
   */
  'aria-label': string;
  /** Icon node. Must accept `currentColor` so it inherits the button's color. */
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: IconButtonShape;
  /** When `true`, shows a spinner and sets `aria-busy`. */
  loading?: boolean;
  /**
   * When `true`, suppresses the press-release bounce animation. Use
   * for icon buttons that trigger another animated affordance.
   */
  quiet?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * A button whose only content is an icon. Always exposes an accessible
 * name via `aria-label` (required prop, enforced by the type) so it
 * never becomes an unlabeled control under assistive tech.
 *
 * Sizing meets the WCAG 2.5.5 (AAA) 44x44 CSS pixel target on coarse
 * pointers, the `sm` size enforces a min-height under `pointer:coarse`.
 */
export const IconButton = ({
  icon,
  variant = 'secondary',
  size = 'md',
  shape = 'square',
  loading = false,
  quiet = false,
  disabled,
  className,
  type = 'button',
  onClick,
  ref,
  ...rest
}: IconButtonProps) => {
  const {bouncing, handleClick, handleAnimationEnd} = useIconButtonModel({quiet, onClick});

  const classes = [
    'ds-icon-button',
    `ds-variant-${variant}`,
    `ds-size-${size}`,
    `ds-shape-${shape}`,
    loading && 'ds-loading',
    quiet && 'ds-quiet',
    bouncing && 'ds-bouncing',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      {loading ? (
        <span className="ds-spinner" aria-hidden="true"/>
      ) : (
        <span className="ds-icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};
