import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { type CardElevation, type CardPadding, useCardModel } from './Card.model';
import './Card.css';

/** Generic surface for grouping related content; pair with `CardHeader`, `CardBody`, and `CardFooter`. Adds no semantics of its own. */
export const Card = ({
  elevation = 'raised',
  padding = 'lg',
  interactive = false,
  className,
  children,
  ref,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  /** Defaults to `'raised'`. */
  elevation?: CardElevation;
  /** Defaults to `'lg'`. */
  padding?: CardPadding;
  /** Makes the card a focusable affordance; for navigation, wrap the card in an `<a>` instead. */
  interactive?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) => {
  const {classes, tabIndex} = useCardModel({elevation, padding, interactive, className});

  return (
    <div ref={ref} className={classes} tabIndex={tabIndex} {...rest}>
      {children}
    </div>
  );
};
