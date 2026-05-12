import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { TextInput } from './TextInput';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('TextInput', () => {
  it('associates label with input via htmlFor', () => {
    renderWithIntl(<TextInput label="Email address"/>);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    renderWithIntl(<TextInput label="Email"/>);
    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'hello@example.com');
    expect(input).toHaveValue('hello@example.com');
  });

  it('renders the helper and links it via aria-describedby', () => {
    renderWithIntl(<TextInput label="Email" helperText="We never share."/>);
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('We never share.');
  });

  it('puts the input in error state and announces the error', () => {
    renderWithIntl(<TextInput label="Email" error="Required field"/>);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent(/Required field/);
  });

  it('marks required inputs with aria-required', () => {
    renderWithIntl(<TextInput label="Email" required/>);
    expect(screen.getByLabelText(/Email/)).toHaveAttribute('aria-required', 'true');
  });
});
