import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { useToggleModel } from './Toggle.Model';
import './Toggle.css';

export type ToggleSize = 'sm' | 'md';

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Visible label. Sits beside the switch unless `visuallyHideLabel`. */
  label: ReactNode;
  /** Helper / description, linked via `aria-describedby`. */
  description?: ReactNode;
  /** Hide the label visually while keeping it accessible. */
  visuallyHideLabel?: boolean;
  size?: ToggleSize;
  ref?: Ref<HTMLInputElement>;
}

/**
 * On/off switch built on a native checkbox. The native `<input>` keeps
 * keyboard semantics (Space toggles, Enter submits an enclosing form),
 * focus management, and form-data inclusion correct without any
 * JavaScript shims.
 *
 * The visual track and thumb sit *behind* the input via CSS, while the
 * input itself fills the hit area for pointer accuracy. `role="switch"`
 * is added so screen readers announce "switch" rather than "checkbox" ,
 * the WAI-ARIA recommendation for binary on/off toggles.
 */
export const Toggle = ({
  label,
  description,
  visuallyHideLabel = false,
  size = 'md',
  id,
  disabled,
  className,
  onChange,
  ref,
  ...rest
}: ToggleProps) => {
  const {inputId, descriptionId, bouncing, handleChange, handleThumbAnimationEnd} = useToggleModel({
    id,
    description,
    onChange,
  });

  const wrapperClasses = [
    'ds-toggle',
    `ds-size-${size}`,
    disabled && 'ds-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const thumbClasses = ['ds-thumb', bouncing && 'ds-bouncing'].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <label htmlFor={inputId} className="ds-row">
        <span className="ds-control">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            className="ds-input"
            disabled={disabled}
            aria-describedby={descriptionId}
            onChange={handleChange}
            {...rest}
          />
          <span className="ds-track" aria-hidden="true">
            <span className={thumbClasses} onAnimationEnd={handleThumbAnimationEnd}/>
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
