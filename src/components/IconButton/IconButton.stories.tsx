import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { Close, Search, Settings, Trash } from '../../icons';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A button whose only content is an icon. `aria-label` is a required prop so the control always has an accessible name.',
      },
    },
  },
  argTypes: {
    variant: {control: 'inline-radio', options: ['primary', 'secondary', 'danger', 'ghost']},
    size: {control: 'inline-radio', options: ['sm', 'md', 'lg']},
    shape: {control: 'inline-radio', options: ['square', 'circle']},
    loading: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
  args: {
    'aria-label': 'Close dialog',
    icon: <Close/>,
    variant: 'secondary',
    size: 'md',
    shape: 'square',
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="story-row">
      <IconButton aria-label="Settings" icon={<Settings/>} variant="primary"/>
      <IconButton aria-label="Settings" icon={<Settings/>} variant="secondary"/>
      <IconButton aria-label="Delete" icon={<Trash/>} variant="danger"/>
      <IconButton aria-label="Search" icon={<Search/>} variant="ghost"/>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="story-row">
      <IconButton aria-label="Close" icon={<Close/>} size="sm"/>
      <IconButton aria-label="Close" icon={<Close/>} size="md"/>
      <IconButton aria-label="Close" icon={<Close/>} size="lg"/>
    </div>
  ),
};

export const Circles: Story = {
  render: () => (
    <div className="story-row">
      <IconButton aria-label="Settings" icon={<Settings/>} shape="circle" variant="primary"/>
      <IconButton aria-label="Settings" icon={<Settings/>} shape="circle" variant="secondary"/>
      <IconButton aria-label="Delete" icon={<Trash/>} shape="circle" variant="danger"/>
    </div>
  ),
};

export const Loading: Story = {args: {loading: true}};
export const Disabled: Story = {args: {disabled: true}};
