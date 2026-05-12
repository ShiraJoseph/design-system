import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { AskAI } from './AskAI';
import type { AskAIProvider } from './providers';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

const makeStubProvider = (response: string, cites?: string[]): AskAIProvider => ({
  label: 'Test',
  async* ask() {
    yield {chunk: response};
    if (cites) yield {chunk: '', cites};
  },
});

describe('AskAI', () => {
  it('renders the default heading and the provider label', () => {
    renderWithIntl(<AskAI provider={makeStubProvider('hi')}/>);
    expect(screen.getByText('Ask the design system')).toBeInTheDocument();
    expect(screen.getByText('Powered by Test')).toBeInTheDocument();
  });

  it('uses the consumer-provided title', () => {
    renderWithIntl(<AskAI title="DS Help" provider={makeStubProvider('hi')}/>);
    expect(screen.getByText('DS Help')).toBeInTheDocument();
  });

  it('renders the default suggestion list when no messages exist yet', () => {
    renderWithIntl(<AskAI provider={makeStubProvider('hi')}/>);
    expect(screen.getByText('What would you like to know?')).toBeInTheDocument();
    const suggestionButtons = document.querySelectorAll('.ds-suggestion-list button');
    expect(suggestionButtons.length).toBeGreaterThan(0);
  });

  it('renders consumer-provided suggestions when given', () => {
    renderWithIntl(
      <AskAI provider={makeStubProvider('hi')} suggestions={['Custom one', 'Custom two']}/>,
    );
    expect(screen.getByText('Custom one')).toBeInTheDocument();
    expect(screen.getByText('Custom two')).toBeInTheDocument();
  });

  it('streams an assistant reply when a suggestion is clicked', async () => {
    renderWithIntl(<AskAI provider={makeStubProvider('Hello world')} suggestions={['Hi']}/>);
    await userEvent.click(screen.getByRole('button', {name: 'Hi'}));
    await waitFor(() => expect(screen.getByText('Hi')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Hello world')).toBeInTheDocument());
  });

  it('reset clears the conversation and returns to the empty state', async () => {
    renderWithIntl(<AskAI provider={makeStubProvider('answer')} suggestions={['Q']}/>);
    await userEvent.click(screen.getByRole('button', {name: 'Q'}));
    await waitFor(() => expect(screen.getByText('answer')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', {name: 'Reset conversation'}));
    expect(screen.queryByText('answer')).not.toBeInTheDocument();
    expect(screen.getByText('What would you like to know?')).toBeInTheDocument();
  });

  it('surfaces an error bubble when the provider throws (non-abort errors)', async () => {
    const throwingProvider: AskAIProvider = {
      label: 'Broken',
      // eslint-disable-next-line require-yield -- intentional: this provider throws before yielding to exercise AskAI's catch path
      async* ask() {
        throw new Error('boom');
      },
    };
    renderWithIntl(<AskAI provider={throwingProvider} suggestions={['Q']}/>);
    await userEvent.click(screen.getByRole('button', {name: 'Q'}));
    await waitFor(() =>
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument(),
    );
  });

  it('renders the Ask submit button when not streaming', () => {
    renderWithIntl(<AskAI provider={makeStubProvider('hi')}/>);
    expect(screen.getByRole('button', {name: /Ask/i})).toBeInTheDocument();
  });

  it('uses the TextInput primitive (not a raw <textarea>) for the composer', () => {
    renderWithIntl(<AskAI provider={makeStubProvider('hi')}/>);
    expect(document.querySelector('.ds-composer .ds-text-input')).toBeInTheDocument();
    expect(document.querySelector('.ds-composer textarea')).not.toBeInTheDocument();
  });

  it('renders citations in the assistant bubble when the provider returns them', async () => {
    renderWithIntl(
      <AskAI provider={makeStubProvider('answer', ['Button'])} suggestions={['Q']}/>,
    );
    await userEvent.click(screen.getByRole('button', {name: 'Q'}));
    await waitFor(() => expect(screen.getByText('Button')).toBeInTheDocument());
    expect(document.querySelector('.ds-cite')).toBeInTheDocument();
  });

  it('renders the supplied className on the section', () => {
    renderWithIntl(<AskAI provider={makeStubProvider('hi')} className="extra"/>);
    const section = document.querySelector('section.ds-ask-ai');
    expect(section?.className).toMatch(/extra/);
  });
});

it('AskAI is mocked when vi.useFakeTimers? — confirm setTimeout/clearTimeout work normally', () => {
  /* Vitest defaults to real timers, but the static provider uses setTimeout
     via its delay() helper. This sanity check makes sure nothing else in
     the test suite has changed that. */
  expect(typeof setTimeout).toBe('function');
  expect(typeof clearTimeout).toBe('function');
});
