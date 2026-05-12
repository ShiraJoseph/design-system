import { type HTMLAttributes, type ReactNode, type Ref } from 'react';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** Top region of a Card, title and supporting actions. */
export const CardHeader = ({children, className, ref, ...rest}: CardHeaderProps) => (
  <div ref={ref} className={['ds-card-header', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);
