import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { regionClasses } from '../Card.model';

export const CardFooter = ({
  children,
  className,
  ref,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) => (
  <div ref={ref} className={regionClasses('ds-card-footer', className)} {...rest}>
    {children}
  </div>
);
