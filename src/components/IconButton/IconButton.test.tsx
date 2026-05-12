import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n/IntlProvider';
import { IconButton } from './IconButton';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('IconButton', () => {
  it('exposes the aria-label as the accessible name', () => {
    renderWithIntl(<IconButton aria-label="Close" icon={<span/>}/>);
    expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument();
  });

  it('renders the icon decoratively when not loading', () => {
    renderWithIntl(<IconButton aria-label="Close" icon={<span data-testid="icon"/>}/>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('hides the icon and shows a spinner when loading', () => {
    renderWithIntl(<IconButton aria-label="Sync" icon={<span data-testid="icon"/>} loading/>);
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    expect(document.querySelector('.ds-spinner')).toBeInTheDocument();
  });

  it('disables and sets aria-busy when loading', () => {
    renderWithIntl(<IconButton aria-label="Sync" icon={<span/>} loading/>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('forwards onClick when not loading', async () => {
    const handleClick = vi.fn();
    renderWithIntl(<IconButton aria-label="Close" icon={<span/>} onClick={handleClick}/>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not bounce when quiet is true', async () => {
    renderWithIntl(<IconButton aria-label="Q" icon={<span/>} quiet/>);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(button.className).not.toMatch(/bouncing/);
  });

  it('bounces when quiet is false', async () => {
    renderWithIntl(<IconButton aria-label="Loud" icon={<span/>}/>);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(button.className).toMatch(/bouncing/);
  });

  it('applies the shape modifier class', () => {
    renderWithIntl(<IconButton aria-label="Circ" icon={<span/>} shape="circle"/>);
    expect(screen.getByRole('button').className).toMatch(/ds-shape-circle/);
  });
});
