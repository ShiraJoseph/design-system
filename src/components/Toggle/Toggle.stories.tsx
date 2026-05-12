import type { Meta, StoryObj } from '@storybook/react-vite';
import { useIntl } from 'react-intl';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Binary on/off switch built on a native checkbox with `role="switch"`. Keyboard, focus, and form semantics come from the platform.',
      },
    },
  },
  argTypes: {
    size: {control: 'inline-radio', options: ['sm', 'md']},
    disabled: {control: 'boolean'},
    visuallyHideLabel: {control: 'boolean'},
  },
  args: {label: 'Email notifications'},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {args: {defaultChecked: true}};

export const WithDescription: Story = {
  args: {
    label: 'Email notifications',
    description: 'Get a digest at 9am local time. Never spam, you can change this any time.',
    defaultChecked: true,
  },
};

export const Small: Story = {
  args: {size: 'sm', label: 'Auto-save changes', defaultChecked: true},
};

export const Disabled: Story = {
  args: {disabled: true, label: 'Premium feature', description: 'Upgrade to enable.'},
};

export const Localized: Story = {
  name: 'Localized (uses active locale)',
  render: (args) => {
    const intl = useIntl();

    return (
      <Toggle
        {...args}
        defaultChecked
        label={intl.formatMessage({id: 'demo.toggle.notifications'})}
      />
    );
  },
};
