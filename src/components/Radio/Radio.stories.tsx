import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {layout: 'padded'},
  argTypes: {
    disabled: {control: 'boolean'},
  },
  args: {label: 'Email'},
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  render: () => {
    const [value, setValue] = useState('email');

    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
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
};

export const Disabled: Story = {args: {disabled: true, label: 'Premium tier'}};
