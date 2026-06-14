import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { useRadioModel } from './Radio.model';
import './Radio.css';

/** Single radio input built on the native `<input type="radio">`; group with `name` on a shared parent or via `RadioGroup`. */
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
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label: ReactNode;
  /** Linked to the input via `aria-describedby`. */
  description?: ReactNode;
  /** Hide the label visually while keeping it accessible. */
  visuallyHideLabel?: boolean;
  ref?: Ref<HTMLInputElement>;
}) => {
  const {inputId, descriptionId, wrapperClasses, ringClasses, handleChange, handleRingAnimationEnd} =
    useRadioModel({
      id,
      description,
      disabled,
      className,
      onChange,
    });

  return (
    <div className={wrapperClasses}>
      <label htmlFor={inputId} className={'ds-row'}>
        <span className={'ds-control'}>
          <input
            ref={ref}
            id={inputId}
            type={'radio'}
            className={'ds-input'}
            disabled={disabled}
            aria-describedby={descriptionId}
            onChange={handleChange}
            {...rest}
          />
          <span className={ringClasses} aria-hidden={'true'} onAnimationEnd={handleRingAnimationEnd}>
            <span className={'ds-dot'}/>
          </span>
        </span>
        <span className={'ds-text'}>
          <span className={visuallyHideLabel ? 'ds-visually-hidden' : 'ds-label'}>{label}</span>
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
