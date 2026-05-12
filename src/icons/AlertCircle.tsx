import { createIcon } from './createIcon';

/** Circle with exclamation, paired with error / warning copy. */
export const AlertCircle = createIcon(
  'AlertCircle',
  <>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 8v5"/>
    <circle cx="12" cy="16.5" r="0.4" fill="currentColor" stroke="none"/>
  </>,
);
