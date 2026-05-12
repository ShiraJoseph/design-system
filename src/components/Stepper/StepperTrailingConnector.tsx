export interface StepperTrailingConnectorProps {
  /** True when the active step is the last one. Drives the line's expand. */
  isOnLastStep: boolean;
  /** True when the consumer's `isComplete` predicate returned true. Fills the line in. */
  isComplete: boolean;
}

/** Line between the last step and the (sibling) completion mark. Width 0
 *  unless the active step is the last one. */
export const StepperTrailingConnector = ({
  isOnLastStep,
  isComplete,
}: StepperTrailingConnectorProps) => (
  <li
    aria-hidden="true"
    className="ds-trailing-connector"
    data-position={isOnLastStep ? 'expanded' : 'normal'}
    data-status={isComplete ? 'complete' : 'upcoming'}
  />
);
