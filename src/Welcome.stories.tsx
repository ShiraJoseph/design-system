import type { Meta, StoryObj } from '@storybook/react-vite';

function Welcome() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 640 }}>
      <h1 style={{ marginTop: 0 }}>SOS</h1>
      <p>A small React component library. Components and tokens land in the next PR.</p>
    </div>
  );
}

const meta = {
  title: 'Welcome',
  component: Welcome,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Welcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
