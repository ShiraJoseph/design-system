import { type ReactNode, useId } from 'react';
import { useIntl } from 'react-intl';
import type { StepDescriptor } from './Stepper';

type StepStatus = 'complete' | 'current' | 'upcoming';

interface UseStepperModelArgs {
  steps: StepDescriptor[];
  activeStep: number;
  ariaLabelProp: string | undefined;
  onStepChange?: (index: number) => void;
  isComplete?: () => boolean;
}

interface UseStepperModelResult {
  ariaLabel: string;
  baseId: string;
  isInteractive: boolean;
  isOnLastStep: boolean;
  completed: boolean;
  activeContent: ReactNode | undefined;
  stepStatuses: StepStatus[];
}

/**
 * Computes the derived state for the Stepper: localized aria label,
 * stable id base, interactivity flag, last-step / completion flags,
 * the active step's panel content, and a per-step status array used
 * to drive indicator/connector classes.
 */
export const useStepperModel = ({
  steps,
  activeStep,
  ariaLabelProp,
  onStepChange,
  isComplete,
}: UseStepperModelArgs): UseStepperModelResult => {
  const intl = useIntl();
  const ariaLabel = ariaLabelProp ?? intl.formatMessage({id: 'stepper.progress'});
  const reactId = useId();
  const baseId = `ds-stepper-${reactId}`;
  const isInteractive = typeof onStepChange === 'function';
  const isOnLastStep = activeStep === steps.length - 1;
  const completed = isComplete?.() === true;
  const activeContent = steps[activeStep]?.content;

  const stepStatuses: StepStatus[] = steps.map((_step, index) => {
    if (index < activeStep) return 'complete';
    if (index === activeStep) return 'current';

    return 'upcoming';
  });

  return {
    ariaLabel,
    baseId,
    isInteractive,
    isOnLastStep,
    completed,
    activeContent,
    stepStatuses,
  };
};
