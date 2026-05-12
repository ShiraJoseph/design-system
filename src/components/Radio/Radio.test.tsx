import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { Radio } from './Radio';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Radio', () => {
  it('renders as a radio input', () => {
    renderWithIntl(<Radio name="g" value="a" label="Option A"/>);
    expect(screen.getByRole('radio', {name: /Option A/})).toBeInTheDocument();
  });

  it('selects on click', async () => {
    renderWithIntl(<Radio name="g" value="a" label="Option A"/>);
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(radio).toBeChecked();
  });

  it('exposes the description via aria-describedby', () => {
    renderWithIntl(
      <Radio name="g" value="a" label="A" description="Pick this one if unsure"/>,
    );
    expect(screen.getByRole('radio')).toHaveAccessibleDescription('Pick this one if unsure');
  });

  it('disables interaction when disabled prop set', async () => {
    renderWithIntl(<Radio name="g" value="a" label="A" disabled/>);
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
    await userEvent.click(radio);
    expect(radio).not.toBeChecked();
  });
});
