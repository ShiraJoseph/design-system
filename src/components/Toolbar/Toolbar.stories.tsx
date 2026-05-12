import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toolbar } from './Toolbar';
import { ToolbarItem } from './ToolbarItem';
import { IconButton } from '../IconButton';
import { Plus, Search, Settings, Trash } from '../../icons';

const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  parameters: {layout: 'padded'},
  args: {'aria-label': 'Page actions', children: null},
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActionsHorizontal: Story = {
  render: (args) => (
    <Toolbar {...args} orientation="horizontal">
      <IconButton aria-label="New" icon={<Plus/>}/>
      <IconButton aria-label="Search" icon={<Search/>}/>
      <IconButton aria-label="Settings" icon={<Settings/>}/>
      <IconButton aria-label="Delete" icon={<Trash/>} variant="danger"/>
    </Toolbar>
  ),
};

export const ActionsVertical: Story = {
  render: (args) => (
    <Toolbar {...args} orientation="vertical">
      <IconButton aria-label="New" icon={<Plus/>}/>
      <IconButton aria-label="Search" icon={<Search/>}/>
      <IconButton aria-label="Settings" icon={<Settings/>}/>
      <IconButton aria-label="Delete" icon={<Trash/>} variant="danger"/>
    </Toolbar>
  ),
};

export const Segmented: Story = {
  render: (args) => {
    const [selected, setSelected] = useState('day');
    const items: Array<{ id: string; label: string }> = [
      {id: 'day', label: 'Day'},
      {id: 'week', label: 'Week'},
      {id: 'month', label: 'Month'},
    ];

    return (
      <Toolbar {...args} aria-label="Time range" selectedItemId={selected}>
        {items.map((item) => (
          <ToolbarItem
            key={item.id}
            id={item.id}
            aria-pressed={selected === item.id}
            onSelect={() => setSelected(item.id)}
          >
            {item.label}
          </ToolbarItem>
        ))}
      </Toolbar>
    );
  },
};
