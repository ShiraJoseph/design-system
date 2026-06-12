import type { Meta, StoryObj } from '@storybook/react-vite';
import { GridLayout } from './GridLayout';
import { Card, CardHeader, CardBody } from '../Card';

const DEMO_CARDS = [
  {title: 'Daily summary', body: 'Yesterday you closed 14 tasks and merged 2 PRs. Streak: 12 days.'},
  {title: 'Reading queue', body: 'Three articles you saved this week. Estimated total: 22 minutes.'},
  {title: 'Inbox health', body: 'Inbox at 7 unread, all routed. Two items waiting on responses.'},
  {title: 'Calendar', body: '3 meetings today: standup, design crit, 1:1 with Pat at 4pm.'},
  {title: 'Open questions', body: '5 threads where you owe a reply. Oldest is 36 hours old.'},
  {title: 'Health check', body: 'All services nominal. Last incident: 11 days ago.'},
];

const DemoCard = ({title, body}: { title: string; body: string }) => (
  <Card>
    <CardHeader><h4>{title}</h4></CardHeader>
    <CardBody>{body}</CardBody>
  </Card>
);

const demoCards = DEMO_CARDS.map((card) => <DemoCard key={card.title} {...card} />);

const meta = {
  title: 'Components/GridLayout',
  component: GridLayout,
  parameters: {
    docs: {
      description: {
        component:
          'General-purpose responsive grid built on `repeat(auto-fit, minmax(min(grid-min, 100%), 1fr))`. Put any items in it — cards, tiles, or a row’s worth of fields — and the columns reflow by available width with no media queries; the `min(…, 100%)` lets a lone item shrink below its floor so the grid stays usable down to a phone-narrow canvas. One `size` sets the column floor (`sm` 8rem dense, `md` 16rem content, `lg` 24rem wide). The gap is fixed for every size so grids of different `size` align on a shared page.',
      },
    },
  },
  argTypes: {
    size: {control: 'inline-radio', options: ['sm', 'md', 'lg']},
  },
  args: {size: 'md', children: demoCards},
} satisfies Meta<typeof GridLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controllable grid. Switch `size`, then resize the canvas to watch columns reflow. */
export const Playground: Story = {};

/** The three standard column floors, sharing one gap so they line up. */
export const Sizes: Story = {
  render: () => (
    <div className="story-col">
      <h4>size=&quot;sm&quot; — dense (8rem floor)</h4>
      <GridLayout size="sm">{demoCards}</GridLayout>

      <h4>size=&quot;md&quot; — content items (16rem floor, default)</h4>
      <GridLayout size="md">{demoCards}</GridLayout>

      <h4>size=&quot;lg&quot; — wide content (24rem floor)</h4>
      <GridLayout size="lg">{demoCards}</GridLayout>
    </div>
  ),
};

/**
 * The children are not required to be cards. Here the grid lays out plain
 * swatches; it works the same with any content, including a single row of
 * fields tucked inside a Card.
 */
export const AnyChildren: Story = {
  render: () => (
    <GridLayout size="sm">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
        <span
          key={day}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--ds-space-2)',
            background: 'var(--ds-color-bg-surface-sunk)',
            borderRadius: 'var(--ds-radius-md)',
            fontFamily: 'var(--ds-font-family-mono), monospace',
            fontSize: 'var(--ds-font-size-sm)',
          }}
        >
          {day}
        </span>
      ))}
    </GridLayout>
  ),
};
