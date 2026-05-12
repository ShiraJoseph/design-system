import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {layout: 'padded'},
  argTypes: {
    size: {control: 'inline-radio', options: ['sm', 'md']},
    indeterminate: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
  args: {label: 'Email me weekly summaries'},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = {args: {defaultChecked: true}};
export const WithDescription: Story = {
  args: {
    description: 'You can unsubscribe in account settings any time.',
    defaultChecked: true,
  },
};
export const Indeterminate: Story = {args: {indeterminate: true, label: 'Select all'}};
export const Small: Story = {args: {size: 'sm'}};
export const Disabled: Story = {args: {disabled: true}};
