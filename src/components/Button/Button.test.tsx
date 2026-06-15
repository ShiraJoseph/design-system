import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { Button } from './Button';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Button', () => {
  it('survives a click when no onClick is provided', async () => {
    renderWithIntl(<Button>No handler</Button>);
    await expect(userEvent.click(screen.getByRole('button'))).resolves.toBeUndefined();
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
