export interface StepperConnectorProps {
  /** True when the step before this connector is already complete. */
  isComplete: boolean;
  /** True when this connector sits immediately after the active step (lean-in). */
  isExpanded: boolean;
}

/** Line between two adjacent steps. Width grows when it sits after the active step. */
export const StepperConnector = ({
  isComplete,
  isExpanded,
}: StepperConnectorProps) => (
  <li
    aria-hidden="true"
    className="ds-connector"
    data-status={isComplete ? 'complete' : 'upcoming'}
    data-position={isExpanded ? 'expanded' : 'normal'}
  />
);
