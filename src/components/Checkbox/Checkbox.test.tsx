import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { Checkbox } from './Checkbox';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Checkbox', () => {
  it('toggles on click', async () => {
    renderWithIntl(<Checkbox label="Email me"/>);
    const box = screen.getByRole('checkbox');
    expect(box).not.toBeChecked();
    await userEvent.click(box);
    expect(box).toBeChecked();
  });

  it('renders indeterminate state on the underlying input', () => {
    renderWithIntl(<Checkbox label="Select all" indeterminate/>);
    const box = screen.getByRole('checkbox') as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
  });

  it('exposes the description via aria-describedby', () => {
    renderWithIntl(<Checkbox label="Subscribe" description="Weekly digest only"/>);
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Weekly digest only');
  });
});
