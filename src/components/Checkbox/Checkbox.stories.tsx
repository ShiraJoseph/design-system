import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
  args: {label: 'Email me weekly summaries', onChange: fn()},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({canvasElement, args}) => {
    const box = within(canvasElement).getByRole('checkbox', {name: /Email me weekly summaries/});
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
};
export const Checked: Story = {args: {defaultChecked: true}};
export const WithDescription: Story = {
  args: {
    description: 'You can unsubscribe in account settings any time.',
    defaultChecked: true,
  },
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('checkbox')).toHaveAccessibleDescription(
      'You can unsubscribe in account settings any time.',
    );
  },
};
export const Indeterminate: Story = {
  args: {indeterminate: true, label: 'Select all'},
  play: async ({canvasElement}) => {
    const box = within(canvasElement).getByRole('checkbox');
    await expect((box as HTMLInputElement).indeterminate).toBe(true);
  },
};
export const Small: Story = {args: {size: 'sm'}};

export const Disabled: Story = {
  args: {disabled: true},
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('checkbox')).toBeDisabled();
  },
};
