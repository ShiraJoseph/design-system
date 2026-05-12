import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
};

export const Vertical: Story = {
  args: {tabs: sampleTabs, value: 'overview', onChange: () => {}, orientation: 'vertical'},
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return <Tabs {...args} value={value} onChange={setValue} aria-label="Workspace settings"/>;
  },
};
