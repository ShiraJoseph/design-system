import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toolbar } from './Toolbar';
import { ToolbarItem } from './ToolbarItem/ToolbarItem';
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
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const toolbar = canvas.getByRole('toolbar', {name: 'Page actions'});
    await expect(toolbar).toBeInTheDocument();
    await expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(toolbar.className).toMatch(/ds-orientation-horizontal/);

    const buttons = canvas.getAllByRole('button');
    await expect(buttons[0].tabIndex).toBe(0);
    await expect(buttons[1].tabIndex).toBe(-1);
    await expect(buttons[2].tabIndex).toBe(-1);

    buttons[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(buttons[1]).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(buttons[3]).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(buttons[0]).toHaveFocus();
  },
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
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const toolbar = canvas.getByRole('toolbar');
    await expect(toolbar).toHaveAttribute('aria-orientation', 'vertical');

    const buttons = canvas.getAllByRole('button');
    buttons[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(buttons[1]).toHaveFocus();
  },
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
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const toolbar = canvas.getByRole('toolbar', {name: 'Time range'});
    await expect(toolbar).toHaveAttribute('data-selected-item', 'day');

    const week = canvas.getByRole('button', {name: 'Week'});
    await expect(week).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(week);
    await expect(week).toHaveAttribute('aria-pressed', 'true');
    await expect(toolbar).toHaveAttribute('data-selected-item', 'week');
  },
};

const itemHandlers = {onSelect: fn(), onClick: fn()};

export const SelectsOnClick: Story = {
  args: {'aria-label': 'Format', selectedItemId: 'bold'},
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarItem id="bold" onSelect={itemHandlers.onSelect} onClick={itemHandlers.onClick}>
        Bold
      </ToolbarItem>
      <ToolbarItem id="italic" disabled>
        Italic
      </ToolbarItem>
    </Toolbar>
  ),
  play: async ({canvasElement}) => {
    itemHandlers.onSelect.mockClear();
    itemHandlers.onClick.mockClear();
    const canvas = within(canvasElement);
    const toolbar = canvas.getByRole('toolbar', {name: 'Format'});
    await expect(toolbar).toHaveAttribute('data-selected-item', 'bold');

    const bold = canvas.getByRole('button', {name: 'Bold'});
    await expect(canvas.getByText('Bold')).toBeInTheDocument();
    await userEvent.click(bold);
    await expect(itemHandlers.onSelect).toHaveBeenCalled();
    await expect(itemHandlers.onClick).toHaveBeenCalled();

    const italic = canvas.getByRole('button', {name: 'Italic'});
    await expect(italic).toBeDisabled();
  },
};

export const ForwardsKeyDown: Story = {
  args: {'aria-label': 'Format', onKeyDown: fn()},
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarItem id="a">A</ToolbarItem>
      <ToolbarItem id="b">B</ToolbarItem>
    </Toolbar>
  ),
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);
    canvas.getAllByRole('button')[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onKeyDown).toHaveBeenCalled();
  },
};

export const RefForwarding: Story = {
  render: (args) => {
    const objectRef = useRef<HTMLDivElement>(null);

    return (
      <div className="story-column">
        <Toolbar {...args} aria-label="Object ref" ref={objectRef}>
          <IconButton aria-label="New" icon={<Plus/>}/>
        </Toolbar>
        <Toolbar
          {...args}
          aria-label="Callback ref"
          ref={(node) => node?.setAttribute('data-ref-attached', 'true')}
        >
          <IconButton aria-label="Search" icon={<Search/>}/>
        </Toolbar>
      </div>
    );
  },
  play: async ({canvasElement}) => {
    const toolbars = within(canvasElement).getAllByRole('toolbar');
    await expect(toolbars).toHaveLength(2);
    await expect(within(canvasElement).getByRole('toolbar', {name: 'Callback ref'})).toHaveAttribute(
      'data-ref-attached',
      'true',
    );
  },
};
