import type { ReactNode } from 'react';

/** Content panel for the active step; the parent passes a per-step `key` so it remounts on step change rather than animating in. */
export const StepperPanel = ({content, panelId}: {content: ReactNode; panelId: string}) => (
  <div className={'ds-panel-viewport'}>
    <div id={panelId} className={'ds-panel'}>
      {content}
    </div>
  </div>
);
