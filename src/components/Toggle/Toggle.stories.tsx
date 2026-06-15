import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
  args: {label: 'Email notifications', onChange: fn()},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({canvasElement, args}) => {
    const toggle = within(canvasElement).getByRole('switch', {name: /Email notifications/});
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
};

export const Checked: Story = {args: {defaultChecked: true}};

export const WithDescription: Story = {
  args: {
    label: 'Email notifications',
    description: 'Get a digest at 9am local time. Never spam, you can change this any time.',
    defaultChecked: true,
  },
  play: async ({canvasElement}) => {
    const toggle = within(canvasElement).getByRole('switch');
    await expect(toggle).toHaveAccessibleDescription(/Get a digest/);
  },
};

export const Small: Story = {
  args: {size: 'sm', label: 'Auto-save changes', defaultChecked: true},
};

export const Disabled: Story = {
  args: {disabled: true, label: 'Premium feature', description: 'Upgrade to enable.'},
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('switch')).toBeDisabled();
  },
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
