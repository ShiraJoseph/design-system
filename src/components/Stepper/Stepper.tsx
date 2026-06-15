import { type HTMLAttributes, type Ref } from 'react';
import './Stepper.css';
import { StepperStep } from './StepperStep/StepperStep';
import { StepperConnector } from './StepperConnector/StepperConnector';
import { StepperTrailingConnector } from './StepperTrailingConnector/StepperTrailingConnector';
import { StepperCompletionMark } from './StepperCompletionMark/StepperCompletionMark';
import { StepperPanel } from './StepperPanel/StepperPanel';
import { type StepDescriptor, type StepperOrientation, useStepperModel } from './Stepper.model';

/** Sequential progress indicator with optional clickable steps (44px touch targets) and keyed content panels; the connector after the active step flex-grows so the step leans into the next. */
export const Stepper = ({
  steps,
  activeStep,
  onStepChange,
  orientation = 'horizontal',
  'aria-label': ariaLabelProp,
  isComplete,
  className,
  ref,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  steps: StepDescriptor[];
  activeStep: number;
  /** When provided, step indicators become clickable. */
  onStepChange?: (index: number) => void;
  orientation?: StepperOrientation;
  'aria-label'?: string;
  /** Called during render to decide whether the trailing connector fills in; when omitted it never fills. */
  isComplete?: () => boolean;
  ref?: Ref<HTMLDivElement>;
}) => {
  const {classes, ariaLabel, baseId, isInteractive, isOnLastStep, completed, activeContent, stepViews} =
    useStepperModel({steps, activeStep, orientation, ariaLabelProp, onStepChange, isComplete, className});

  return (
    <div ref={ref} className={classes} {...rest}>
      <nav className={'ds-navigation'} aria-label={ariaLabel}>
        <ol className={'ds-list'}>
          {stepViews.flatMap((view) => [
            <StepperStep
              key={`step-${view.index}`}
              view={view}
              isInteractive={isInteractive}
              onStepChange={onStepChange}
            />,
            ...(view.hasConnector
              ? [
                <StepperConnector
                  key={`connector-${view.index}`}
                  isComplete={view.connectorComplete}
                  isExpanded={view.connectorExpanded}
                />,
              ]
              : []),
          ])}
          <StepperTrailingConnector isOnLastStep={isOnLastStep} isComplete={completed}/>
        </ol>
        <StepperCompletionMark visible={isOnLastStep}/>
      </nav>
      {activeContent !== undefined && (
        <StepperPanel
          key={activeStep}
          content={activeContent}
          panelId={`${baseId}-panel-${activeStep}`}
        />
      )}
    </div>
  );
};
