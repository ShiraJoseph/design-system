import { StepperCheckIcon } from './StepperCheckIcon';
import type { StepDescriptor } from './Stepper';

export interface StepperStepProps {
  step: StepDescriptor;
  index: number;
  status: 'complete' | 'current' | 'upcoming';
  isInteractive: boolean;
  onStepChange?: (index: number) => void;
}

/** One step in the Stepper: indicator (number or check) + label/description. */
export const StepperStep = ({
  step,
  index,
  status,
  isInteractive,
  onStepChange,
}: StepperStepProps) => {
  const indicator = (
    <span className="ds-indicator-inner">
      {status === 'complete' ? <StepperCheckIcon/> : (
        <span className="ds-indicator-number">{index + 1}</span>
      )}
    </span>
  );

  return (
    <li
      className="ds-step"
      data-status={status}
      aria-current={status === 'current' ? 'step' : undefined}
    >
      {isInteractive ? (
        <button
          type="button"
          className="ds-indicator"
          onClick={() => onStepChange?.(index)}
          aria-label={`Step ${index + 1}: ${typeof step.label === 'string' ? step.label : ''}`}
        >
          {indicator}
        </button>
      ) : (
        <span className="ds-indicator">{indicator}</span>
      )}
      <span className="ds-text">
        <span className="ds-label">{step.label}</span>
        {step.description && (
          <span className="ds-description">{step.description}</span>
        )}
      </span>
    </li>
  );
};
