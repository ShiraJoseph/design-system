import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { CardHeader } from './CardHeader';
import { CardBody } from './CardBody';
import { CardFooter } from './CardFooter';

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>hello</Card>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('applies the elevation modifier class', () => {
    const {container} = render(<Card elevation="flat">x</Card>);
    expect(container.querySelector('.ds-card')?.className).toMatch(/ds-elevation-flat/);
  });

  it('defaults elevation to raised', () => {
    const {container} = render(<Card>x</Card>);
    expect(container.querySelector('.ds-card')?.className).toMatch(/ds-elevation-raised/);
  });

  it('applies the padding modifier class', () => {
    const {container} = render(<Card padding="lg">x</Card>);
    expect(container.querySelector('.ds-card')?.className).toMatch(/ds-padding-lg/);
  });

  it('adds ds-interactive + tabIndex when interactive', () => {
    const {container} = render(<Card interactive>x</Card>);
    const node = container.querySelector('.ds-card');
    expect(node?.className).toMatch(/ds-interactive/);
    expect(node?.getAttribute('tabIndex')).toBe('0');
  });

  it('does not set tabIndex when interactive is false', () => {
    const {container} = render(<Card>x</Card>);
    expect(container.querySelector('.ds-card')?.getAttribute('tabIndex')).toBeNull();
  });
});

describe('CardHeader / CardBody / CardFooter', () => {
  it('CardHeader applies the ds-card-header class and renders children', () => {
    const {container} = render(<CardHeader>header</CardHeader>);
    expect(container.querySelector('.ds-card-header')).toHaveTextContent('header');
  });

  it('CardBody applies the ds-card-body class and renders children', () => {
    const {container} = render(<CardBody>body</CardBody>);
    expect(container.querySelector('.ds-card-body')).toHaveTextContent('body');
  });

  it('CardFooter applies the ds-card-footer class and renders children', () => {
    const {container} = render(<CardFooter>footer</CardFooter>);
    expect(container.querySelector('.ds-card-footer')).toHaveTextContent('footer');
  });
});
