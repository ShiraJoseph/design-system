import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { type ToggleSize, useToggleModel } from './Toggle.model';
import './Toggle.css';

/** On/off switch built on a native checkbox with `role="switch"` so screen readers announce "switch" rather than "checkbox". */
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
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  label: ReactNode;
  /** Linked to the input via `aria-describedby`. */
  description?: ReactNode;
  /** Hide the label visually while keeping it accessible. */
  visuallyHideLabel?: boolean;
  /** Defaults to `'md'`. */
  size?: ToggleSize;
  ref?: Ref<HTMLInputElement>;
}) => {
  const {
    inputId,
    descriptionId,
    wrapperClasses,
    thumbClasses,
    labelClass,
    handleChange,
    handleThumbAnimationEnd,
  } = useToggleModel({
    id,
    description,
    size,
    disabled,
    className,
    visuallyHideLabel,
    onChange,
  });

  return (
    <div className={wrapperClasses}>
      <label htmlFor={inputId} className={'ds-row'}>
        <span className={'ds-control'}>
          <input
            ref={ref}
            id={inputId}
            type={'checkbox'}
            role={'switch'}
            className={'ds-input'}
            disabled={disabled}
            aria-describedby={descriptionId}
            onChange={handleChange}
            {...rest}
          />
          <span className={'ds-track'} aria-hidden={'true'}>
            <span className={thumbClasses} onAnimationEnd={handleThumbAnimationEnd}/>
          </span>
        </span>
        <span className={'ds-text'}>
          <span className={labelClass}>{label}</span>
          {description && (
            <span id={descriptionId} className={'ds-description'}>
              {description}
            </span>
          )}
        </span>
      </label>
    </div>
  );
};
