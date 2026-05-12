import { StepperCheckIcon } from './StepperCheckIcon';

export interface StepperCompletionMarkProps {
  visible: boolean;
}

/** The check that appears once the user reaches the last step. Sits as a
 *  flex sibling to the right of (or below) the indicators-and-connectors
 *  list, NOT inside the trailing connector. */
export const StepperCompletionMark = ({visible}: StepperCompletionMarkProps) => (
  <span className="ds-completion-mark" data-visible={visible}>
    <StepperCheckIcon/>
  </span>
);
