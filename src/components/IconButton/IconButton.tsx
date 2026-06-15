import { type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { type IconButtonShape, type IconButtonSize, type IconButtonVariant, useIconButtonModel } from './IconButton.model';
import './IconButton.css';

/** Icon-only button; requires `aria-label`. The `sm` size enforces a min-height under `pointer:coarse` to meet the WCAG 2.5.5 (AAA) 44x44 CSS pixel target. */
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
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required accessible name; phrase as the action ("Close dialog", "Delete row"), not the icon name. */
  'aria-label': string;
  /** Must accept `currentColor` so it inherits the button's color. */
  icon: ReactNode;
  /** Defaults to `'secondary'`. */
  variant?: IconButtonVariant;
  /** Defaults to `'md'`. */
  size?: IconButtonSize;
  /** Defaults to `'square'`. */
  shape?: IconButtonShape;
  loading?: boolean;
  /** Suppresses the press-release bounce for icon buttons that trigger another animated affordance. */
  quiet?: boolean;
  ref?: Ref<HTMLButtonElement>;
}) => {
  const {classes, isDisabled, ariaBusy, handleClick, handleAnimationEnd} = useIconButtonModel({
    variant,
    size,
    shape,
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
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      {loading ? (
        <span className={'ds-spinner'} aria-hidden={'true'}/>
      ) : (
        <span className={'ds-icon'} aria-hidden={'true'}>
          {icon}
        </span>
      )}
    </button>
  );
};
