import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
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
  decorators: [(Story) => <div className="story-frame-lg"><Story/></div>],
} satisfies Meta<typeof AskAI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Ask the design system')).toBeInTheDocument();
    await expect(canvas.getByText(/Powered by/)).toBeInTheDocument();
    await expect(canvas.getByText('What would you like to know?')).toBeInTheDocument();
    await expect(canvasElement.querySelector('.ds-ask-ai.ds-card')).not.toBeNull();
    await expect(canvasElement.querySelector('.ds-composer .ds-text-input')).not.toBeNull();
  },
};

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

const instantProvider: AskAIProvider = {
  label: 'Test',
  async* ask() {
    yield {chunk: 'Use the Button component for primary actions.'};
    yield {chunk: '', cites: ['Button']};
  },
};

export const StreamsReply: Story = {
  name: 'Streams a reply (interaction test)',
  args: {provider: instantProvider, suggestions: ['How do I use Button?']},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {name: 'How do I use Button?'}));
    await canvas.findByText(/Use the Button component/);
    await expect(canvas.getByText('Button')).toBeInTheDocument();
    const reset = canvas.getByRole('button', {name: 'Reset conversation'});
    await userEvent.click(reset);
    await expect(canvas.getByText('What would you like to know?')).toBeInTheDocument();
  },
};
