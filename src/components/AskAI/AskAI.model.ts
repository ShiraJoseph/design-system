import { type FormEvent, type KeyboardEvent, type RefObject, useEffect, useRef, useState, } from 'react';
import { type IntlShape, useIntl } from 'react-intl';
import type { AskAIMessage, AskAIProvider } from './providers';

interface UseAskAIModelArgs {
  provider: AskAIProvider;
  title?: string;
  className?: string;
}

interface UseAskAIModelResult {
  intl: IntlShape;
  heading: string;
  classes: string;
  draft: string;
  setDraft: (value: string) => void;
  messages: AskAIMessage[];
  streaming: boolean;
  isStreamingMessage: (index: number) => boolean;
  threadRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  submit: (question: string) => Promise<void>;
  cancel: () => void;
  reset: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const ERROR_FALLBACK_CONTENT = 'Something went wrong while answering. Try again?';
const DEFAULT_HEADING = 'Ask the design system';

/** Drives the AskAI chat panel: Q&A state, the provider streaming loop, abort wiring, auto-scroll, and heading/class derivation. */
export const useAskAIModel = ({provider, title, className}: UseAskAIModelArgs): UseAskAIModelResult => {
  const intl = useIntl();
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<AskAIMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  };

  const reset = () => {
    cancel();
    setMessages([]);
    setDraft('');
    inputRef.current?.focus();
  };

  const submit = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || streaming) return;
    cancel();

    const userMessage: AskAIMessage = {role: 'user', content: trimmed};
    const placeholder: AskAIMessage = {role: 'assistant', content: ''};

    setMessages((prev) => [...prev, userMessage, placeholder]);
    setDraft('');
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = [...messages, userMessage];
      let buffer = '';
      let cites: string[] | undefined;
      for await (const part of provider.ask(trimmed, history, controller.signal)) {
        if (part.cites) {
          cites = part.cites;
        }

        buffer += part.chunk;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: 'assistant',
            content: buffer,
            cites,
          };

          return next;
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: 'assistant',
            content: ERROR_FALLBACK_CONTENT,
          };

          return next;
        });
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }

      setStreaming(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit(draft);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && streaming) {
      event.preventDefault();
      cancel();
    }
  };

  const isStreamingMessage = (index: number) => streaming && index === messages.length - 1;

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  return {
    intl,
    heading: title ?? DEFAULT_HEADING,
    classes: ['ds-ask-ai', className].filter(Boolean).join(' '),
    draft,
    setDraft,
    messages,
    streaming,
    isStreamingMessage,
    threadRef,
    inputRef,
    submit,
    cancel,
    reset,
    handleSubmit,
    handleKeyDown,
  };
};
