import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import './Stepper.css';
import { StepperStep } from './StepperStep';
import { StepperConnector } from './StepperConnector';
import { StepperTrailingConnector } from './StepperTrailingConnector';
import { StepperCompletionMark } from './StepperCompletionMark';
import { StepperPanel } from './StepperPanel';
import { useStepperModel } from './Stepper.Model';

export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepDescriptor {
  /** Visible label below (horizontal) or beside (vertical) the step. */
  label: ReactNode;
  /** Optional secondary description. */
  description?: ReactNode;
  /** Panel content rendered when this step is active. */
  content?: ReactNode;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  steps: StepDescriptor[];
  /** Index of the currently-active step. Controlled. */
  activeStep: number;
  /** When provided, step indicators become clickable. */
  onStepChange?: (index: number) => void;
  orientation?: StepperOrientation;
  /** Optional accessible label for the stepper navigation. */
  'aria-label'?: string;
  /**
   * Predicate the stepper invokes during render to determine whether
   * the trailing connector (between the last step and the completion
   * mark) should fill in. Imagine a form that only signals "valid"
   * when its fields pass: pass a function here that returns the form's
   * validity. When omitted, the connector never fills in.
   */
  isComplete?: () => boolean;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Sequential progress indicator with optional clickable steps and
 * keyed content panels. Horizontal and vertical layouts ship as
 * orientation variants.
 *
 * Step indicators meet the 44 x 44 CSS pixel touch target (WCAG
 * 2.5.5 AAA) so they're reliably clickable for users with motor
 * impairments. The connector immediately following the active step
 * flex-grows so the active step "leans into" the next; on the last
 * step, the trailing connector + completion checkmark expands so
 * the user gets the same visual confirmation regardless of position.
 *
 * Connector flex-grow transitions use the shared ds-motion-bounce
 * linear() multi-stop so the slide settles with a small bounce-back
 * toward start, matching the design-system bounce-up family. Panel
 * content is text and gets no animation on step change.
 */
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
}: StepperProps) => {
  const {
    ariaLabel,
    baseId,
    isInteractive,
    isOnLastStep,
    completed,
    activeContent,
    stepStatuses,
  } = useStepperModel({steps, activeStep, ariaLabelProp, onStepChange, isComplete});

  const containerClasses = [
    'ds-stepper',
    `ds-orientation-${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const stepNodes = steps.flatMap((step, index) => {
    const stepEl = (
      <StepperStep
        key={`step-${index}`}
        step={step}
        index={index}
        status={stepStatuses[index]}
        isInteractive={isInteractive}
        onStepChange={onStepChange}
      />
    );

    return index === steps.length - 1
      ? [stepEl]
      : [
        stepEl,
        <StepperConnector
          key={`connector-${index}`}
          isComplete={index < activeStep}
          isExpanded={index === activeStep}
        />,
      ];
  });

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      <nav className="ds-navigation" aria-label={ariaLabel}>
        <ol className="ds-list">
          {stepNodes}
          <StepperTrailingConnector
            isOnLastStep={isOnLastStep}
            isComplete={completed}
          />
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
