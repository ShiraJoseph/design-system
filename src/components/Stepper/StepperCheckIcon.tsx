import { CheckBold } from '../../icons';

/** The tightly-drawn check used both on completed step indicators and on
 *  the completion mark to the right of the last step. Sized via the
 *  `.ds-stepper-check` class (see Stepper.css) rather than fixed px. */
export const StepperCheckIcon = () => <CheckBold className="ds-stepper-check"/>;
