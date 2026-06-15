import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {layout: 'padded'},
  argTypes: {
    disabled: {control: 'boolean'},
  },
  args: {label: 'Email', onChange: fn()},
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({canvasElement, args}) => {
    const radio = within(canvasElement).getByRole('radio', {name: /Email/});
    await expect(radio).not.toBeChecked();
    await userEvent.click(radio);
    await expect(radio).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
};

export const WithDescription: Story = {
  args: {description: 'Pick this one if unsure'},
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('radio')).toHaveAccessibleDescription(
      'Pick this one if unsure',
    );
  },
};

export const Group: Story = {
  render: () => {
    const [value, setValue] = useState('email');

    return (
      <div className="story-col">
        <Radio
          name="contact"
          value="email"
          label="Email"
          description="Daily digest at 9am local."
          checked={value === 'email'}
          onChange={() => setValue('email')}
        />
        <Radio
          name="contact"
          value="sms"
          label="SMS"
          description="Same-day alerts, US/CA only."
          checked={value === 'sms'}
          onChange={() => setValue('sms')}
        />
        <Radio
          name="contact"
          value="none"
          label="No notifications"
          checked={value === 'none'}
          onChange={() => setValue('none')}
        />
      </div>
    );
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const email = canvas.getByRole('radio', {name: /Email/});
    const sms = canvas.getByRole('radio', {name: /SMS/});
    await expect(email).toBeChecked();
    await userEvent.click(sms);
    await expect(sms).toBeChecked();
    await expect(email).not.toBeChecked();
    await userEvent.keyboard('{ArrowDown}');
    const none = canvas.getByRole('radio', {name: /No notifications/});
    await expect(none).toBeChecked();
    await expect(sms).not.toBeChecked();
  },
};

export const Disabled: Story = {
  args: {disabled: true, label: 'Premium tier'},
  play: async ({canvasElement}) => {
    const radio = within(canvasElement).getByRole('radio');
    await expect(radio).toBeDisabled();
    await userEvent.click(radio);
    await expect(radio).not.toBeChecked();
  },
};
