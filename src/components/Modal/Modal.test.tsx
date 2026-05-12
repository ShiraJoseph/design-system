import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { Modal } from './Modal';

beforeEach(() => {
  /* jsdom doesn't implement the <dialog> element's modal lifecycle.
     Stub showModal/close so the open prop transitions don't throw. */
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      Object.defineProperty(this, 'open', {configurable: true, value: true});
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      Object.defineProperty(this, 'open', {configurable: true, value: false});
    };
  }
});

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Modal', () => {
  it('renders the title and labels the dialog via aria-labelledby', () => {
    renderWithIntl(<Modal open onClose={vi.fn()} title="Confirm"/>);
    const heading = screen.getByText('Confirm');
    const dialog = document.querySelector('.ds-modal');
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('renders the description and labels via aria-describedby when provided', () => {
    renderWithIntl(<Modal open onClose={vi.fn()} title="t" description="details here"/>);
    const description = screen.getByText('details here');
    const dialog = document.querySelector('.ds-modal');
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
  });

  it('does not set aria-describedby when description is omitted', () => {
    renderWithIntl(<Modal open onClose={vi.fn()} title="t"/>);
    expect(document.querySelector('.ds-modal')).not.toHaveAttribute('aria-describedby');
  });

  it('renders body children when provided', () => {
    renderWithIntl(
      <Modal open onClose={vi.fn()} title="t">
        body content
      </Modal>,
    );
    expect(screen.getByText('body content')).toBeInTheDocument();
  });

  it('renders the footer slot when provided', () => {
    renderWithIntl(
      <Modal open onClose={vi.fn()} title="t" footer={<span>footer slot</span>}/>,
    );
    expect(screen.getByText('footer slot')).toBeInTheDocument();
  });

  it('omits the footer DOM when no footer prop is given', () => {
    renderWithIntl(<Modal open onClose={vi.fn()} title="t"/>);
    expect(document.querySelector('.ds-modal-footer')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    renderWithIntl(<Modal open onClose={onClose} title="t"/>);
    /* jsdom keeps <dialog> queries gated behind the open flag; bypass the
       accessibility tree check via { hidden: true }. */
    const closeBtn = screen.getByRole('button', {hidden: true});
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('uses a custom closeLabel when supplied', () => {
    renderWithIntl(<Modal open onClose={vi.fn()} title="t" closeLabel="Dismiss"/>);
    expect(
      screen.getByRole('button', {name: 'Dismiss', hidden: true}),
    ).toBeInTheDocument();
  });
});
