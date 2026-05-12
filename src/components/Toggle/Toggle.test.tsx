import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { Toggle } from './Toggle';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Toggle', () => {
  it('renders with role="switch"', () => {
    renderWithIntl(<Toggle label="Email notifications"/>);
    expect(screen.getByRole('switch', {name: /Email notifications/})).toBeInTheDocument();
  });

  it('toggles checked on click', async () => {
    const handleChange = vi.fn();
    renderWithIntl(<Toggle label="Setting" onChange={handleChange}/>);
    const sw = screen.getByRole('switch');
    expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    expect(sw).toBeChecked();
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('exposes the description via aria-describedby', () => {
    renderWithIntl(<Toggle label="Setting" description="Adds a daily digest"/>);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAccessibleDescription('Adds a daily digest');
  });

  it('disables when disabled prop is set', () => {
    renderWithIntl(<Toggle label="Setting" disabled/>);
    expect(screen.getByRole('switch')).toBeDisabled();
  });
});
