import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FAB } from './FAB';
import { Plus } from '../../icons/Plus';

const meta = {
  title: 'Components/FAB',
  component: FAB,
  parameters: {layout: 'centered'},
  argTypes: {
    variant: {control: 'inline-radio', options: ['primary', 'secondary']},
    size: {control: 'inline-radio', options: ['md', 'lg']},
  },
  args: {
    'aria-label': 'New item',
    icon: <Plus/>,
    variant: 'primary',
    size: 'md',
    onClick: fn(),
  },
} satisfies Meta<typeof FAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({canvasElement, args}) => {
    const fab = within(canvasElement).getByRole('button', {name: /New item/});
    await expect(fab).toBeInTheDocument();
    await expect(within(canvasElement).getByRole('button').className).not.toMatch(/ds-extended/);
    await userEvent.click(fab);
    await expect(args.onClick).toHaveBeenCalledOnce();
    await expect(fab.className).toMatch(/ds-bouncing/);
  },
};

export const Large: Story = {args: {size: 'lg'}};
export const Secondary: Story = {args: {variant: 'secondary'}};

export const Extended: Story = {
  args: {label: 'Compose'},
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Compose')).toBeInTheDocument();
    await expect(within(canvasElement).getByRole('button').className).toMatch(/ds-extended/);
  },
};

export const ExtendedLarge: Story = {args: {label: 'Compose', size: 'lg'}};

export const Quiet: Story = {
  args: {quiet: true},
  play: async ({canvasElement}) => {
    const fab = within(canvasElement).getByRole('button', {name: /New item/});
    await userEvent.click(fab);
    await expect(fab.className).not.toMatch(/ds-bouncing/);
  },
};

export const Disabled: Story = {
  args: {disabled: true},
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('button')).toBeDisabled();
  },
};
