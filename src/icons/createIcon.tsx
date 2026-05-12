import { type ReactNode, type Ref, type SVGAttributes } from 'react';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /**
   * Accessible name for the icon. Provide when the icon stands alone
   * (e.g, inside an `IconButton` whose only content is the icon, when
   * no `aria-label` is set on the button itself).
   *
   * If omitted, the icon is treated as decorative (`aria-hidden="true"`)
   *, the recommended default when the icon sits next to a text label.
   */
  title?: string;
  /** Pixel size applied to width and height. Defaults to 1em (inherits font size). */
  size?: number | string;
  ref?: Ref<SVGSVGElement>;
}

/**
 * Internal factory: produces an icon component from a path fragment.
 * Keeps every icon's accessibility, sizing, and stroke defaults
 * consistent without repeating boilerplate.
 *
 * @internal
 */
export const createIcon = (displayName: string, path: ReactNode) => {
  const Icon = ({title, size = '1em', ref, ...rest}: IconProps) => {
    const ariaProps = title
      ? {role: 'img', 'aria-label': title}
      : {'aria-hidden': true as const, focusable: false as const};

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...ariaProps}
        {...rest}
      >
        {path}
      </svg>
    );
  };
  Icon.displayName = displayName;

  return Icon;
};
