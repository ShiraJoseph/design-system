import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { useRadioModel } from './Radio.Model';
import './Radio.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Visible label. Sits beside the control. Required for accessibility. */
  label: ReactNode;
  /** Optional helper text below the label. Linked via aria-describedby. */
  description?: ReactNode;
  /** Hide the label visually while keeping it accessible. */
  visuallyHideLabel?: boolean;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Single radio input. Group with `name` and identical `value`s on a
 * shared parent or via `RadioGroup`. On change, the entire ring
 * (outer + inner dot) plays a 4-stop bounce, the same press-release
 * animation Button uses, so the dot stays a constant size relative
 * to the ring.
 *
 * Built on the native `<input type="radio">` so keyboard navigation,
 * arrow-key cycling within a group, and form submission are correct
 * by default.
 */
export const Radio = ({
  label,
  description,
  visuallyHideLabel = false,
  id,
  disabled,
  className,
  onChange,
  ref,
  ...rest
}: RadioProps) => {
  const {inputId, descriptionId, bouncing, handleChange, handleRingAnimationEnd} = useRadioModel({
    id,
    description,
    onChange,
  });

  const wrapperClasses = [
    'ds-radio',
    disabled && 'ds-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const ringClasses = ['ds-ring', bouncing && 'ds-bouncing']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <label htmlFor={inputId} className="ds-row">
        <span className="ds-control">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            className="ds-input"
            disabled={disabled}
            aria-describedby={descriptionId}
            onChange={handleChange}
            {...rest}
          />
          <span
            className={ringClasses}
            aria-hidden="true"
            onAnimationEnd={handleRingAnimationEnd}
          >
            <span className="ds-dot"/>
          </span>
        </span>
        <span className="ds-text">
          <span className={visuallyHideLabel ? 'ds-visually-hidden' : 'ds-label'}>
            {label}
          </span>
          {description && (
            <span id={descriptionId} className="ds-description">
              {description}
            </span>
          )}
        </span>
      </label>
    </div>
  );
};
