import type { Meta, StoryObj } from '@storybook/react-vite';
import { useIntl } from 'react-intl';
import { Card } from './Card';
import { CardHeader } from './CardHeader';
import { CardBody } from './CardBody';
import { CardFooter } from './CardFooter';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Settings } from '../../icons';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Generic surface for grouping content. Compose with `CardHeader` / `CardBody` / `CardFooter` for consistent internal layout.',
      },
    },
  },
  argTypes: {
    elevation: {control: 'inline-radio', options: ['flat', 'raised', 'overlay']},
    padding: {control: 'inline-radio', options: ['none', 'sm', 'md', 'lg']},
    interactive: {control: 'boolean'},
  },
  args: {elevation: 'raised', padding: 'md', children: 'Card body'},
  decorators: [(Story) => <div style={{width: 360}}><Story/></div>],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <h3>Quarterly report</h3>
        <IconButton aria-label="Open settings" icon={<Settings/>} variant="ghost" size="sm"/>
      </CardHeader>
      <CardBody>
        Revenue is up 12 percent year over year, driven primarily by international expansion.
      </CardBody>
      <CardFooter>
        <Button variant="ghost">Dismiss</Button>
        <Button variant="primary">View report</Button>
      </CardFooter>
    </Card>
  ),
};

export const Elevations: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        width: '100%',
        maxWidth: 720,
      }}
    >
      <Card elevation="flat"><CardBody>Flat</CardBody></Card>
      <Card elevation="raised"><CardBody>Raised</CardBody></Card>
      <Card elevation="overlay"><CardBody>Overlay</CardBody></Card>
    </div>
  ),
};

export const Interactive: Story = {
  args: {interactive: true, children: 'Workspace settings'},
  render: (args) => (
    <Card {...args} onClick={() => alert('Card clicked')}>
      <CardHeader><h3>Workspace settings</h3></CardHeader>
      <CardBody>Manage members, plan, and billing for your workspace.</CardBody>
    </Card>
  ),
};

export const Localized: Story = {
  name: 'Localized (uses active locale)',
  render: (args) => {
    const intl = useIntl();

    return (
      <Card {...args}>
        <CardHeader>
          <h3>{intl.formatMessage({id: 'demo.card.title'})}</h3>
        </CardHeader>
        <CardBody>{intl.formatMessage({id: 'demo.card.body'})}</CardBody>
      </Card>
    );
  },
};
