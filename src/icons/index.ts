/**
 * @file Icon exports. The standard icons render inside a 24x24 viewBox
 * with a 1.75-stroke geometry, tuned to read well at the typography
 * ramp's `sm`–`lg` sizes against both light and dark backgrounds.
 *
 * Decorative by default (`aria-hidden`); pass a `title` prop to expose
 * an accessible name when the icon stands alone.
 *
 * `CheckBold` is the one exception: a 16x16, 2px-stroke checkmark for
 * the small control glyphs (Checkbox, Stepper indicators) where the
 * standard `Check` reads too light.
 */

export { ArrowRight } from './ArrowRight';
export { Check } from './Check';
export { CheckBold } from './CheckBold';
export { Close } from './Close';
export { Search } from './Search';
export { AlertCircle } from './AlertCircle';
export { Trash } from './Trash';
export { Settings } from './Settings';
export { Plus } from './Plus';
export { createIcon, type IconProps } from './createIcon';
