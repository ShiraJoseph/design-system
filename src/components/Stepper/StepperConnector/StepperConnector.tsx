import { connectorPosition, connectorStatus } from '../Stepper.model';

/** Line between two adjacent steps; width grows when it sits after the active step. */
export const StepperConnector = ({
  isComplete,
  isExpanded,
}: {
  isComplete: boolean;
  /** True when this connector sits immediately after the active step (lean-in). */
  isExpanded: boolean;
}) => (
  <li
    aria-hidden={'true'}
    className={'ds-connector'}
    data-status={connectorStatus(isComplete)}
    data-position={connectorPosition(isExpanded)}
  />
);
