import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { Button } from './Button';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Button', () => {
  it('renders the label', () => {
    renderWithIntl(<Button>Save</Button>);
    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
  });

  it('forwards onClick', async () => {
    const handleClick = vi.fn();
    renderWithIntl(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('survives a click when no onClick is provided', async () => {
    renderWithIntl(<Button>No handler</Button>);
    await expect(userEvent.click(screen.getByRole('button'))).resolves.toBeUndefined();
  });

  it('disables when loading is true and sets aria-busy', () => {
    renderWithIntl(<Button loading>Saving</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('renders a spinner instead of leading icon when loading', () => {
    renderWithIntl(
      <Button loading leadingIcon={<span data-testid="leading"/>}>
        Saving
      </Button>,
    );
    expect(screen.queryByTestId('leading')).not.toBeInTheDocument();
    expect(document.querySelector('.ds-spinner')).toBeInTheDocument();
  });

  it('reflects disabled prop', () => {
    renderWithIntl(<Button disabled>Locked</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not bounce when quiet is true', async () => {
    renderWithIntl(<Button quiet>Quiet</Button>);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(button.className).not.toMatch(/bouncing/);
  });

  it('bounces on click when quiet is false', async () => {
    renderWithIntl(<Button>Loud</Button>);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(button.className).toMatch(/bouncing/);
  });

  it('applies the variant data attribute', () => {
    renderWithIntl(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'danger');
  });

  it('applies the size data attribute', () => {
    renderWithIntl(<Button size="lg">Big</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
  });

  it('applies the ds-full-width class when fullWidth is set', () => {
    renderWithIntl(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole('button').className).toMatch(/ds-full-width/);
  });

  it('renders leading and trailing icons (decoratively) when not loading', () => {
    renderWithIntl(
      <Button leadingIcon={<span data-testid="leading"/>} trailingIcon={<span data-testid="trailing"/>}>
        With icons
      </Button>,
    );
    expect(screen.getByTestId('leading')).toBeInTheDocument();
    expect(screen.getByTestId('trailing')).toBeInTheDocument();
  });

  it('forwards a ref to the underlying button element', () => {
    let captured: HTMLButtonElement | null = null;
    const setRef = (node: HTMLButtonElement | null) => {
      captured = node;
    };
    renderWithIntl(<Button ref={setRef}>Ref me</Button>);
    expect(captured).toBeInstanceOf(HTMLButtonElement);
  });
});
