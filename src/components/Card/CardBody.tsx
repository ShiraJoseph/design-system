import { type HTMLAttributes, type ReactNode, type Ref } from 'react';

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** Main content region of a Card. */
export const CardBody = ({children, className, ref, ...rest}: CardBodyProps) => (
  <div ref={ref} className={['ds-card-body', className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);
