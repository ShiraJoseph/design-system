import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {layout: 'padded'},
  argTypes: {
    orientation: {control: 'inline-radio', options: ['horizontal', 'vertical']},
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTabs = [
  {id: 'overview', label: 'Overview', content: <p>Project overview, dashboards, and recent activity.</p>},
  {id: 'team', label: 'Team', content: <p>Members, roles, and invitations.</p>},
  {id: 'billing', label: 'Billing', content: <p>Subscription plan, invoices, and payment method.</p>},
  {id: 'audit', label: 'Audit log', content: <p>Every action taken by every member, ever.</p>, disabled: true},
];

export const Horizontal: Story = {
  args: {tabs: sampleTabs, value: 'overview', onChange: () => {}, orientation: 'horizontal'},
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return <Tabs {...args} value={value} onChange={setValue} aria-label="Workspace settings"/>;
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole('tab')).toHaveLength(4);
    await userEvent.click(canvas.getByRole('tab', {name: 'Team'}));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Members, roles');
    canvas.getByRole('tab', {name: 'Team'}).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Subscription plan');
  },
};

export const Vertical: Story = {
  args: {tabs: sampleTabs, value: 'overview', onChange: () => {}, orientation: 'vertical'},
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return <Tabs {...args} value={value} onChange={setValue} aria-label="Workspace settings"/>;
  },
};
