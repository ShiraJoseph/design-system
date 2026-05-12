import type { Meta, StoryObj } from '@storybook/react-vite';
import { AskAI } from './AskAI';
import { staticProvider, type AskAIProvider } from './providers';

const meta = {
  title: 'Components/AskAI',
  component: AskAI,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Chat-style assistant that answers questions about the library. Provider-agnostic: the default `staticProvider` matches questions against the local component catalog and ships with the bundle. Swap in any object satisfying `AskAIProvider` (Anthropic, OpenAI, on-device) without touching the UI.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 'min(640px, 92vw)'}}><Story/></div>],
} satisfies Meta<typeof AskAI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomSuggestions: Story = {
  args: {
    suggestions: [
      'What size button should I use on a phone?',
      'How do I disable backdrop dismissal?',
      'Where do design tokens come from?',
    ],
  },
};

const echoProvider: AskAIProvider = {
  label: 'Echo · demo only',
  async* ask(question) {
    const text = `**Echo provider**, this is what the answer would look like for: _${question}_`;
    for (let i = 0; i < text.length; i += 4) {
      yield {chunk: text.slice(i, i + 4)};
      await new Promise((resolve) => setTimeout(resolve, 12));
    }
  },
};

export const WithCustomProvider: Story = {
  name: 'Custom provider (echo)',
  args: {provider: echoProvider},
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates provider swapping. The echo provider just streams the question back, replace with any AsyncIterable-yielding implementation.',
      },
    },
  },
};

export const StaticProviderProgrammatic: Story = {
  name: 'Static provider (default)',
  args: {provider: staticProvider},
};
