import { Check } from '../../../icons';

/** Check shown on the last step; a flex sibling of the indicator list, not inside the trailing connector. */
export const StepperCompletionMark = ({visible}: {visible: boolean}) => (
  <span className={'ds-completion-mark'} data-visible={visible}>
    <Check className={'ds-stepper-check'}/>
  </span>
);
