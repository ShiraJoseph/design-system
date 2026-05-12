import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n/IntlProvider';
import { FAB } from './FAB';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('FAB', () => {
  it('exposes the aria-label as the accessible name', () => {
    renderWithIntl(<FAB aria-label="Compose" icon={<span/>}/>);
    expect(screen.getByRole('button', {name: 'Compose'})).toBeInTheDocument();
  });

  it('renders the icon', () => {
    renderWithIntl(<FAB aria-label="Compose" icon={<span data-testid="icon"/>}/>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders an extended label and adds ds-extended class when label is provided', () => {
    renderWithIntl(<FAB aria-label="Compose" icon={<span/>} label="Compose"/>);
    expect(screen.getByText('Compose')).toBeInTheDocument();
    expect(screen.getByRole('button').className).toMatch(/ds-extended/);
  });

  it('omits the ds-extended class when no label is provided', () => {
    renderWithIntl(<FAB aria-label="Compose" icon={<span/>}/>);
    expect(screen.getByRole('button').className).not.toMatch(/ds-extended/);
  });

  it('forwards onClick', async () => {
    const handleClick = vi.fn();
    renderWithIntl(<FAB aria-label="Compose" icon={<span/>} onClick={handleClick}/>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('bounces on click', async () => {
    renderWithIntl(<FAB aria-label="Compose" icon={<span/>}/>);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(button.className).toMatch(/bouncing/);
  });

  it('does not bounce when quiet is true', async () => {
    renderWithIntl(<FAB aria-label="Compose" icon={<span/>} quiet/>);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(button.className).not.toMatch(/bouncing/);
  });

  it('reflects disabled prop', () => {
    renderWithIntl(<FAB aria-label="Compose" icon={<span/>} disabled/>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
