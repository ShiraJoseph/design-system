import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({canvasElement, args}) => {
    const button = within(canvasElement).getByRole('button', {name: /Save changes/});
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    await expect(button.className).toMatch(/bouncing/);
  },
};

export const Secondary: Story = {
  args: {variant: 'secondary', children: 'Cancel'},
};

export const Danger: Story = {
  args: {variant: 'danger', children: 'Delete account'},
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('button')).toHaveAttribute('data-variant', 'danger');
  },
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
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('button', {name: 'Large'})).toHaveAttribute('data-size', 'lg');
  },
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
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', {name: 'Confirm'}).querySelector('.ds-icon')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {name: 'Continue'}).querySelector('.ds-icon')).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {loading: true, children: 'Saving', leadingIcon: <Check/>},
  play: async ({canvasElement}) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button.querySelector('.ds-spinner')).toBeInTheDocument();
    await expect(button.querySelector('.ds-icon')).not.toBeInTheDocument();
  },
};

export const Disabled: Story = {
  args: {disabled: true, children: 'Unavailable'},
  play: async ({canvasElement, args}) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Quiet: Story = {
  args: {quiet: true, children: 'Quiet'},
  play: async ({canvasElement, args}) => {
    const button = within(canvasElement).getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    await expect(button.className).not.toMatch(/bouncing/);
  },
};

export const FullWidth: Story = {
  args: {fullWidth: true, children: 'Sign in to continue'},
  parameters: {layout: 'padded'},
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('button').className).toMatch(/ds-full-width/);
  },
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
