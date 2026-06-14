import { connectorPosition, connectorStatus } from '../Stepper.model';

/** Line between the last step and the sibling completion mark; width 0 unless the active step is the last one. */
export const StepperTrailingConnector = ({
  isOnLastStep,
  isComplete,
}: {
  isOnLastStep: boolean;
  isComplete: boolean;
}) => (
  <li
    aria-hidden={'true'}
    className={'ds-trailing-connector'}
    data-position={connectorPosition(isOnLastStep)}
    data-status={connectorStatus(isComplete)}
  />
);
