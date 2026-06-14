import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { regionClasses } from '../Card.model';

export const CardBody = ({
  children,
  className,
  ref,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) => (
  <div ref={ref} className={regionClasses('ds-card-body', className)} {...rest}>
    {children}
  </div>
);
