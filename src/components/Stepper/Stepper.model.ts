import { type ReactNode, useId } from 'react';
import { useIntl } from 'react-intl';

export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepDescriptor {
  label: ReactNode;
  description?: ReactNode;
  /** Panel content rendered when this step is active. */
  content?: ReactNode;
}

export type StepStatus = 'complete' | 'current' | 'upcoming';

/** Per-step view data the parent maps over; keeps status/label derivation out of the `.tsx`. */
export interface StepView {
  step: StepDescriptor;
  index: number;
  status: StepStatus;
  /** `aria-current="step"` on the active step, otherwise `undefined`. */
  ariaCurrent: 'step' | undefined;
  /** Accessible label for the clickable indicator button. */
  indicatorLabel: string;
  /** True when this step is followed by a connector (every step except the last). */
  hasConnector: boolean;
  /** Connector after this step is filled in (the step is already complete). */
  connectorComplete: boolean;
  /** Connector after this step flex-grows because this is the active step. */
  connectorExpanded: boolean;
}

interface UseStepperModelArgs {
  steps: StepDescriptor[];
  activeStep: number;
  orientation: StepperOrientation;
  ariaLabelProp: string | undefined;
  onStepChange?: (index: number) => void;
  isComplete?: () => boolean;
  className?: string;
}

interface UseStepperModelResult {
  classes: string;
  ariaLabel: string;
  baseId: string;
  isInteractive: boolean;
  isOnLastStep: boolean;
  completed: boolean;
  activeContent: ReactNode | undefined;
  stepViews: StepView[];
}

const stepStatus = (index: number, activeStep: number): StepStatus => {
  if (index < activeStep) return 'complete';
  if (index === activeStep) return 'current';

  return 'upcoming';
};

/** Computes the Stepper's derived state, container classes, and per-step view data from its props. */
export const useStepperModel = ({
  steps,
  activeStep,
  orientation,
  ariaLabelProp,
  onStepChange,
  isComplete,
  className,
}: UseStepperModelArgs): UseStepperModelResult => {
  const intl = useIntl();
  const reactId = useId();
  const isInteractive = typeof onStepChange === 'function';

  const stepViews: StepView[] = steps.map((step, index) => ({
    step,
    index,
    status: stepStatus(index, activeStep),
    ariaCurrent: index === activeStep ? 'step' : undefined,
    indicatorLabel: `Step ${index + 1}: ${typeof step.label === 'string' ? step.label : ''}`,
    hasConnector: index !== steps.length - 1,
    connectorComplete: index < activeStep,
    connectorExpanded: index === activeStep,
  }));

  return {
    classes: [`ds-stepper`, `ds-orientation-${orientation}`, className].filter(Boolean).join(' '),
    ariaLabel: ariaLabelProp ?? intl.formatMessage({id: 'stepper.progress'}),
    baseId: `ds-stepper-${reactId}`,
    isInteractive,
    isOnLastStep: activeStep === steps.length - 1,
    completed: isComplete?.() === true,
    activeContent: steps[activeStep]?.content,
    stepViews,
  };
};

/** Maps a boolean completion/expansion state to a connector's `data-status`/`data-position` value. Shared by the two connector wrappers so the merge never lives inline in a `.tsx`. */
export const connectorStatus = (isComplete: boolean): StepStatus =>
  isComplete ? 'complete' : 'upcoming';

export const connectorPosition = (isExpanded: boolean): 'expanded' | 'normal' =>
  isExpanded ? 'expanded' : 'normal';
