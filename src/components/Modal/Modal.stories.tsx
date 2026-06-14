import { useState } from 'react';
import { useIntl } from 'react-intl';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dialog built on the native `<dialog>` element. The platform handles focus trap, ESC-to-close, scroll lock, and backdrop. ARIA attributes are wired automatically: `aria-labelledby` to the title, `aria-describedby` to the description.',
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {
  args: {open: false, onClose: () => {}, title: ''},
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="danger" quiet onClick={() => setOpen(true)}>
          Delete account
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Delete this account?"
          description="This action cannot be undone. All associated data will be permanently removed."
          dismissOnBackdropClick={false}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        />
      </>
    );
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {name: 'Delete account'}));
    const dialog = canvasElement.querySelector('.ds-modal') as HTMLDialogElement;
    await expect(dialog.open).toBe(true);
    const heading = canvas.getByText('Delete this account?');
    await expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
    const description = canvas.getByText(/cannot be undone/);
    await expect(dialog).toHaveAttribute('aria-describedby', description.id);
    await expect(canvas.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
  },
};

export const Minimal: Story = {
  args: {open: false, onClose: () => {}, title: ''},
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button quiet onClick={() => setOpen(true)}>Open</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Heads up"
          closeLabel="Dismiss"
        >
          body content
        </Modal>
      </>
    );
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {name: 'Open'}));
    const dialog = canvasElement.querySelector('.ds-modal') as HTMLDialogElement;
    await expect(dialog.open).toBe(true);
    await expect(dialog).not.toHaveAttribute('aria-describedby');
    await expect(canvasElement.querySelector('.ds-modal-footer')).toBeNull();
    await expect(canvas.getByText('body content')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {name: 'Dismiss'}));
    await expect(dialog.open).toBe(false);
  },
};

export const WithBody: Story = {
  args: {open: false, onClose: () => {}, title: ''},
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button quiet onClick={() => setOpen(true)}>Show terms</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Terms of service"
          description="Please review the updated terms before continuing."
          footer={<Button onClick={() => setOpen(false)}>I understand</Button>}
        >
          <p>
            By continuing, you agree to the storage and processing of the data
            described above. You can revoke consent at any time from your
            account settings.
          </p>
          <p>
            We never sell personal data to third parties. Anonymized usage
            metrics may be shared with our analytics processor under a strict
            data-handling agreement.
          </p>
        </Modal>
      </>
    );
  },
};

export const Localized: Story = {
  name: 'Localized (uses active locale)',
  args: {open: false, onClose: () => {}, title: ''},
  render: () => {
    const [open, setOpen] = useState(false);
    const intl = useIntl();

    return (
      <>
        <Button variant="danger" quiet onClick={() => setOpen(true)}>
          {intl.formatMessage({id: 'demo.button.danger'})}
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={intl.formatMessage({id: 'demo.modal.title'})}
          description={intl.formatMessage({id: 'demo.modal.body'})}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                {intl.formatMessage({id: 'demo.modal.cancel'})}
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                {intl.formatMessage({id: 'demo.modal.confirm'})}
              </Button>
            </>
          }
        />
      </>
    );
  },
};
