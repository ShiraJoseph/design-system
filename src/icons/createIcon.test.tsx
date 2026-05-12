import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createIcon } from './createIcon';

const TestIcon = createIcon('TestIcon', <circle cx={12} cy={12} r={5}/>);

describe('createIcon', () => {
  it('sets the displayName on the resulting component', () => {
    expect(TestIcon.displayName).toBe('TestIcon');
  });

  it('renders an aria-hidden svg by default (decorative)', () => {
    const {container} = render(<TestIcon/>);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('exposes an accessible name via role=img + aria-label when title is set', () => {
    const {container} = render(<TestIcon title="A circle"/>);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'A circle');
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it('applies the size prop to width and height', () => {
    const {container} = render(<TestIcon size={32}/>);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('defaults to 1em width/height when size is not provided', () => {
    const {container} = render(<TestIcon/>);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '1em');
    expect(svg).toHaveAttribute('height', '1em');
  });

  it('renders the path content inside the svg', () => {
    const {container} = render(<TestIcon/>);
    expect(container.querySelector('svg circle')).toBeInTheDocument();
  });
});
