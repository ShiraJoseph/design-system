import { type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { useFABModel } from './FAB.Model';
import './FAB.css';

export type FABSize = 'md' | 'lg';
export type FABVariant = 'primary' | 'secondary';

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Required accessible name. The icon is decorative; this is what
   * screen readers announce. Phrase as the action ("Compose message",
   * "New project").
   */
  'aria-label': string;
  /** Icon content. Should accept `currentColor`. */
  icon: ReactNode;
  /**
   * Optional label that expands beside the icon when set. Useful for
   * extended FABs ("Compose"). Hidden on `sm` size since space is
   * tight there.
   */
  label?: ReactNode;
  variant?: FABVariant;
  size?: FABSize;
  /** When `true`, suppresses the press-release bounce. */
  quiet?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Floating action button. A high-emphasis circular control intended
 * to sit above content, typically anchored to a corner of the page.
 *
 * Apply positioning at the consumer (e.g., `style={{ position: 'fixed',
 * bottom: '1.5rem', right: '1.5rem' }}`); the component itself does
 * not impose any positioning so it can be reused inside layouts that
 * don't need fixed positioning.
 */
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
}: FABProps) => {
  const {bouncing, handleClick, handleAnimationEnd} = useFABModel({quiet, onClick});

  const classes = [
    'ds-fab',
    `ds-variant-${variant}`,
    `ds-size-${size}`,
    label && 'ds-extended',
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
      disabled={disabled}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      <span className="ds-icon" aria-hidden="true">{icon}</span>
      {label && <span className="ds-label">{label}</span>}
    </button>
  );
};
