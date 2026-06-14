import { type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { type ButtonSize, type ButtonVariant, useButtonModel } from './Button.model';
import './Button.css';

/** Primary control for triggering an action; renders a native `<button>` and toggles `aria-busy`/`disabled` together when `loading`. */
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
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Defaults to `'primary'`. */
  variant?: ButtonVariant;
  /** Defaults to `'md'`. */
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  /** Hidden from AT (`aria-hidden`). */
  leadingIcon?: ReactNode;
  /** Hidden from AT (`aria-hidden`). */
  trailingIcon?: ReactNode;
  /** Suppresses the press-release bounce so it doesn't compete with another animated affordance the button triggers (Modal opening, Toast appearing). */
  quiet?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}) => {
  const {classes, isDisabled, ariaBusy, handleClick, handleAnimationEnd} = useButtonModel({
    variant,
    size,
    fullWidth,
    loading,
    quiet,
    disabled,
    className,
    onClick,
  });

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={ariaBusy}
      data-variant={variant}
      data-size={size}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      {loading && <span className={'ds-spinner'} aria-hidden={'true'}/>}
      {!loading && leadingIcon && (
        <span className={'ds-icon'} aria-hidden={'true'}>
          {leadingIcon}
        </span>
      )}
      <span className={loading ? 'ds-label-loading' : 'ds-label'}>{children}</span>
      {!loading && trailingIcon && (
        <span className={'ds-icon'} aria-hidden={'true'}>
          {trailingIcon}
        </span>
      )}
    </button>
  );
};
