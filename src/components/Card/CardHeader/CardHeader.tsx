import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { regionClasses } from '../Card.model';

export const CardHeader = ({
  children,
  className,
  ref,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) => (
  <div ref={ref} className={regionClasses('ds-card-header', className)} {...rest}>
    {children}
  </div>
);
