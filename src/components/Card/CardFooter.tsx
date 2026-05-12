import { type HTMLAttributes, type ReactNode, type Ref } from 'react';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** Bottom region of a Card, actions and metadata. */
export const CardFooter = ({children, className, ref, ...rest}: CardFooterProps) => (
  <div ref={ref} className={['ds-card-footer', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);
