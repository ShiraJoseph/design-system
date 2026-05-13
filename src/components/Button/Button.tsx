import { type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { useButtonModel } from './Button.model';
import './Button.css';

/** Visual treatment of the button. */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/** Control height. `md` is the default. `sm` is reserved for dense UI;
 *  prefer `md` or `lg` when the button is a primary tap target on touch
 *  devices to meet the 44x44 CSS pixel target size. */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. Defaults to `'primary'`. */
  variant?: ButtonVariant;
  /** Control size. Defaults to `'md'`. */
  size?: ButtonSize;
  /** When `true`, fills the available inline space. */
  fullWidth?: boolean;
  /**
   * When `true`, shows a loading indicator and disables interaction.
   * `aria-busy` is set so assistive tech announces the state change.
   */
  loading?: boolean;
  /** Icon rendered before the label. Hidden from AT (`aria-hidden`). */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. Hidden from AT (`aria-hidden`). */
  trailingIcon?: ReactNode;
  /**
   * When `true`, suppresses the press-release bounce animation. Use
   * for buttons that trigger another animated affordance (a Modal
   * opening, a Toast appearing) so the two motions don't compete.
   */
  quiet?: boolean;
  /** Button label. Required for accessibility, never render an empty button. */
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Primary control for triggering an action.
 *
 * Accessibility:
 * - Renders a native `<button>` so keyboard activation, focus, and
 *   form-submission semantics come for free.
 * - `loading` toggles `aria-busy` and `disabled` together so screen
 *   readers announce the in-flight state.
 * - Focus uses the global `:focus-visible` ring (3:1 non-text contrast
 *   per WCAG 2.1 SC 1.4.11), do not override per-component.
 * - Decorative icons are wrapped with `aria-hidden`; if your icon
 *   *is* the label, use `IconButton` instead and supply `aria-label`.
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  quiet = false,
  disabled,
  leadingIcon,
  trailingIcon,
  children,
  className,
  type = 'button',
  onClick,
  ref,
  ...rest
}: ButtonProps) => {
  const {bouncing, handleClick, handleAnimationEnd} = useButtonModel({quiet, onClick});

  const classes = [
    'ds-button',
    `ds-variant-${variant}`,
    `ds-size-${size}`,
    fullWidth && 'ds-full-width',
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
      data-variant={variant}
      data-size={size}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      {loading && <span className="ds-spinner" aria-hidden="true"/>}
      {!loading && leadingIcon && (
        <span className="ds-icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className={loading ? 'ds-label-loading' : 'ds-label'}>{children}</span>
      {!loading && trailingIcon && (
        <span className="ds-icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
};
