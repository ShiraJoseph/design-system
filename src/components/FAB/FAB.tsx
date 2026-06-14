import { type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { type FABSize, type FABVariant, useFABModel } from './FAB.model';
import './FAB.css';

/** High-emphasis circular floating action button; imposes no positioning, so anchor it at the consumer (e.g. `position: fixed`). */
export const FAB = ({
  icon,
  label,
  variant = 'primary',
  size = 'md',
  quiet = false,
  disabled,
  className,
  type = 'button',
  onClick,
  ref,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required accessible name; phrase as the action ("Compose message", "New project"). */
  'aria-label': string;
  /** Should accept `currentColor`. */
  icon: ReactNode;
  /** Expands beside the icon for extended FABs; the label is not rendered on `sm`. */
  label?: ReactNode;
  /** Defaults to `'primary'`. */
  variant?: FABVariant;
  /** Defaults to `'md'`. */
  size?: FABSize;
  /** Suppresses the press-release bounce so it doesn't compete with another animated affordance the FAB triggers (Modal opening, Toast appearing). */
  quiet?: boolean;
  ref?: Ref<HTMLButtonElement>;
}) => {
  const {classes, handleClick, handleAnimationEnd} = useFABModel({
    variant,
    size,
    label,
    quiet,
    className,
    onClick,
  });

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      <span className={'ds-icon'} aria-hidden={'true'}>{icon}</span>
      {label && <span className={'ds-label'}>{label}</span>}
    </button>
  );
};
