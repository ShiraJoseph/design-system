import type { ReactNode } from 'react';

export interface StepperPanelProps {
  content: ReactNode;
  panelId: string;
}

/**
 * Content panel below (horizontal) or beside (vertical) the step
 * indicators. The whole StepperPanel is given a `key` by its parent
 * that changes on step change, which remounts this so the new content
 * appears as a fresh element rather than animating in.
 */
export const StepperPanel = ({content, panelId}: StepperPanelProps) => (
  <div className="ds-panel-viewport">
    <div id={panelId} className="ds-panel">
      {content}
    </div>
  </div>
);
