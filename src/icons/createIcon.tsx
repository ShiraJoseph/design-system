import { type ReactNode, type Ref, type SVGAttributes } from 'react';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Accessible name. When omitted the icon is decorative (`aria-hidden="true"`), the right default beside a text label. */
  title?: string;
  /** Defaults to `1em`, so the icon inherits the surrounding font size. */
  size?: number | string;
  ref?: Ref<SVGSVGElement>;
}

/**
 * Internal factory: produces an icon component from a path fragment.
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
