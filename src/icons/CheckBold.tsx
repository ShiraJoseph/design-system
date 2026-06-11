import { type SVGAttributes } from 'react';

/**
 * Small, bold checkmark drawn in a 16x16 viewBox with a 2px stroke,
 * heavier than the standard 24x24 `Check` icon so it stays legible at
 * the small control sizes it serves: the Checkbox box and the Stepper
 * completed-step indicators. Sized by the consumer via a class or
 * `width`/`height`.
 */
export const CheckBold = ({className, ...rest}: SVGAttributes<SVGSVGElement>) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" {...rest}>
    <path
      d="m3.5 8.5 3 3 6-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
