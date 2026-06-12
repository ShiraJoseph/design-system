import type { Meta, StoryObj } from '@storybook/react-vite';
import { useIntl } from 'react-intl';
import { Button } from './Button';
import { ArrowRight, Check } from '../../icons';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Primary control for triggering an action. Renders a native `<button>` element with WCAG 2.1 AA contrast, visible focus, and reduced-motion-aware transitions.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {control: 'inline-radio', options: ['sm', 'md', 'lg']},
    fullWidth: {control: 'boolean'},
    loading: {control: 'boolean'},
    disabled: {control: 'boolean'},
    children: {control: 'text'},
  },
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Save changes',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {variant: 'secondary', children: 'Cancel'},
};

export const Danger: Story = {
  args: {variant: 'danger', children: 'Delete account'},
};

export const Ghost: Story = {
  args: {variant: 'ghost', children: 'Learn more'},
};

export const Sizes: Story = {
  render: (args) => (
    <div className="story-row">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="story-row">
      <Button {...args} leadingIcon={<Check/>}>Confirm</Button>
      <Button {...args} variant="secondary" trailingIcon={<ArrowRight/>}>
        Continue
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {loading: true, children: 'Saving'},
};

export const Disabled: Story = {
  args: {disabled: true, children: 'Unavailable'},
};

export const FullWidth: Story = {
  args: {fullWidth: true, children: 'Sign in to continue'},
  parameters: {layout: 'padded'},
};

export const Localized: Story = {
  name: 'Localized (uses active locale)',
  render: (args) => {
    const intl = useIntl();

    return (
      <div className="story-row">
        <Button {...args} variant="primary">
          {intl.formatMessage({id: 'demo.button.primary'})}
        </Button>
        <Button {...args} variant="secondary">
          {intl.formatMessage({id: 'demo.button.secondary'})}
        </Button>
        <Button {...args} variant="danger">
          {intl.formatMessage({id: 'demo.button.danger'})}
        </Button>
      </div>
    );
  },
};
