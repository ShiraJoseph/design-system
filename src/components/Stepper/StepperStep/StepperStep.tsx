import { Check } from '../../../icons';
import { type StepView } from '../Stepper.model';

/** One step in the Stepper: indicator (number or check) + label/description. */
export const StepperStep = ({
  view,
  isInteractive,
  onStepChange,
}: {
  view: StepView;
  isInteractive: boolean;
  onStepChange?: (index: number) => void;
}) => {
  const indicator = (
    <span className={'ds-indicator-inner'}>
      {view.status === 'complete' ? <Check className={'ds-stepper-check'}/> : (
        <span className={'ds-indicator-number'}>{view.index + 1}</span>
      )}
    </span>
  );

  return (
    <li className={'ds-step'} data-status={view.status} aria-current={view.ariaCurrent}>
      {isInteractive ? (
        <button
          type={'button'}
          className={'ds-indicator'}
          onClick={() => onStepChange?.(view.index)}
          aria-label={view.indicatorLabel}
        >
          {indicator}
        </button>
      ) : (
        <span className={'ds-indicator'}>{indicator}</span>
      )}
      <span className={'ds-text'}>
        <span className={'ds-label'}>{view.step.label}</span>
        {view.step.description && (
          <span className={'ds-description'}>{view.step.description}</span>
        )}
      </span>
    </li>
  );
};
