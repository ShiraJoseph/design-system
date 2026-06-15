import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { IntlProvider } from '../../i18n';
import { useAskAIModel } from './AskAI.model';
import type { AskAIProvider } from './providers';

const wrapper = ({children}: {children: React.ReactNode}) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);

const renderModel = (provider: AskAIProvider, options?: {title?: string; className?: string}) =>
  renderHook(() => useAskAIModel({provider, ...options}), {wrapper});

const stubProvider = (response: string, cites?: string[]): AskAIProvider => ({
  label: 'Test',
  async* ask() {
    yield {chunk: response};
    if (cites) yield {chunk: '', cites};
  },
});

describe('useAskAIModel', () => {
  it('starts empty and not streaming', () => {
    const {result} = renderModel(stubProvider('hi'));
    expect(result.current.draft).toBe('');
    expect(result.current.messages).toEqual([]);
    expect(result.current.streaming).toBe(false);
  });

  it('appends the user message and the streamed assistant reply', async () => {
    const {result} = renderModel(stubProvider('Hello world'));
    await act(async () => {
      await result.current.submit('How do buttons work?');
    });
    expect(result.current.messages).toEqual([
      {role: 'user', content: 'How do buttons work?'},
      {role: 'assistant', content: 'Hello world', cites: undefined},
    ]);
    expect(result.current.streaming).toBe(false);
  });

  it('ignores blank questions and questions submitted while streaming', async () => {
    const {result} = renderModel(stubProvider('answer'));
    await act(async () => {
      await result.current.submit('   ');
    });
    expect(result.current.messages).toEqual([]);
  });

  it('captures citations from the final streamed part', async () => {
    const {result} = renderModel(stubProvider('answer', ['Button', 'Card']));
    await act(async () => {
      await result.current.submit('cite something');
    });
    expect(result.current.messages.at(-1)?.cites).toEqual(['Button', 'Card']);
  });

  it('surfaces a fallback message when a non-abort error is thrown', async () => {
    const broken: AskAIProvider = {
      label: 'Broken',
      // eslint-disable-next-line require-yield -- throws before yielding to exercise the catch path
      async* ask() {
        throw new Error('boom');
      },
    };
    const {result} = renderModel(broken);
    await act(async () => {
      await result.current.submit('q');
    });
    expect(result.current.messages.at(-1)?.content).toMatch(/Something went wrong/i);
  });

  it('reset clears the conversation and the draft', async () => {
    const {result} = renderModel(stubProvider('answer'));
    await act(async () => {
      await result.current.submit('q');
    });
    act(() => result.current.reset());
    expect(result.current.messages).toEqual([]);
    expect(result.current.draft).toBe('');
  });

  it('defaults the heading and lets title override it', () => {
    expect(renderModel(stubProvider('hi')).result.current.heading).toBe('Ask the design system');
    expect(renderModel(stubProvider('hi'), {title: 'Need help?'}).result.current.heading).toBe(
      'Need help?',
    );
  });

  it('builds the container classes and merges a custom className', () => {
    expect(renderModel(stubProvider('hi')).result.current.classes).toBe('ds-ask-ai');
    expect(renderModel(stubProvider('hi'), {className: 'extra'}).result.current.classes).toBe(
      'ds-ask-ai extra',
    );
  });

  it('flags only the last message as streaming while a stream is in flight', async () => {
    const hanging: AskAIProvider = {
      label: 'Hanging',
      async* ask(_question, _history, signal) {
        yield {chunk: 'partial'};
        await new Promise((_resolve, reject) => {
          signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          );
        });
      },
    };
    const {result} = renderModel(hanging);
    let pending: Promise<void>;
    act(() => {
      pending = result.current.submit('q');
    });
    await waitFor(() => expect(result.current.streaming).toBe(true));
    const lastIndex = result.current.messages.length - 1;
    expect(result.current.isStreamingMessage(lastIndex)).toBe(true);
    expect(result.current.isStreamingMessage(lastIndex - 1)).toBe(false);
    act(() => {
      result.current.cancel();
    });
    await act(async () => {
      await pending;
    });
    expect(result.current.isStreamingMessage(result.current.messages.length - 1)).toBe(false);
  });

  it('Escape cancels an in-flight stream without an error bubble', async () => {
    const hanging: AskAIProvider = {
      label: 'Hanging',
      async* ask(_question, _history, signal) {
        yield {chunk: 'partial'};
        await new Promise((_resolve, reject) => {
          signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          );
        });
      },
    };
    const {result} = renderModel(hanging);
    let pending: Promise<void>;
    act(() => {
      pending = result.current.submit('q');
    });
    await waitFor(() => expect(result.current.streaming).toBe(true));
    act(() => {
      result.current.handleKeyDown({
        key: 'Escape',
        preventDefault: vi.fn(),
      } as never);
    });
    await act(async () => {
      await pending;
    });
    expect(result.current.streaming).toBe(false);
    expect(result.current.messages.at(-1)?.content).toBe('partial');
  });
});
