import type { Meta, StoryObj } from '@storybook/react-vite';
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
  },
} satisfies Meta<typeof FAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = {args: {size: 'lg'}};
export const Secondary: Story = {args: {variant: 'secondary'}};
export const Extended: Story = {args: {label: 'Compose'}};
export const ExtendedLarge: Story = {args: {label: 'Compose', size: 'lg'}};
