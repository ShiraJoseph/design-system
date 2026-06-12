import './AskAI.css';
import { Button } from '../Button';
import { Card } from '../Card';
import { IconButton } from '../IconButton';
import { TextInput } from '../TextInput';
import { ArrowRight, Close } from '../../icons';
import { MiniMarkdown } from './miniMarkdown';
import { type AskAIProvider, staticProvider } from './providers';
import { useAskAIModel } from './AskAI.model';

export interface AskAIProps {
  /**
   * Provider that answers questions. Defaults to `staticProvider`,
   * which uses keyword matching against the local component catalog
   * and requires no API key.
   */
  provider?: AskAIProvider;
  /** Optional starter prompts shown above the input on first render. */
  suggestions?: string[];
  /** Heading shown at the top of the panel. Defaults to "Ask the design system". */
  title?: string;
  /** Maximum panel height. Defaults to "min(560px, 70vh)". */
  maxHeight?: string;
  /** Optional className applied to the outer container. */
  className?: string;
}

const DEFAULT_SUGGESTIONS = [
  'How do I make a destructive button?',
  'What does the TextInput error state look like?',
  'When should I use Toggle vs a checkbox?',
];

/**
 * Embedded chat-style assistant for answering questions about the
 * design system. The UI is provider-agnostic: swap `staticProvider` for
 * an Anthropic, OpenAI, or on-device implementation by passing a
 * different `provider` prop. The interface is designed to stream so the
 * answer feels live regardless of the backing model.
 *
 * Accessibility:
 * - Messages render in a live region so screen readers announce
 *   new content as it streams in.
 * - The input remains a single source of focus; submitting clears it
 *   and returns focus there.
 * - Cancel and reset are exposed both as buttons and as keyboard
 *   shortcuts (Esc cancels an in-flight answer).
 */
export const AskAI = ({
  provider = staticProvider,
  suggestions = DEFAULT_SUGGESTIONS,
  title,
  maxHeight,
  className,
}: AskAIProps) => {
  const {
    intl,
    draft,
    setDraft,
    messages,
    streaming,
    threadRef,
    inputRef,
    submit,
    cancel,
    reset,
    handleSubmit,
    handleKeyDown,
  } = useAskAIModel({provider});

  const heading = title ?? 'Ask the design system';

  return (
    <Card
      className={['ds-ask-ai', className].filter(Boolean).join(' ')}
      elevation="raised"
      padding="lg"
      role="region"
      aria-label={heading}
      style={maxHeight ? {maxHeight} : undefined}
    >
      <header className="ds-header">
        <div>
          <h2 className="ds-title">{heading}</h2>
          <p className="ds-subtitle">Powered by {provider.label}</p>
        </div>
        {messages.length > 0 && (
          <IconButton
            aria-label="Reset conversation"
            icon={<Close/>}
            variant="ghost"
            size="sm"
            onClick={reset}
          />
        )}
      </header>

      <div
        ref={threadRef}
        className="ds-thread"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.length === 0 ? (
          <div className="ds-empty">
            <p className="ds-empty-title">What would you like to know?</p>
            <ul className="ds-suggestion-list">
              {suggestions.map((prompt) => (
                <li key={prompt}>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    quiet
                    onClick={() => void submit(prompt)}
                    className="ds-suggestion"
                  >
                    {prompt}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={message.role === 'user' ? 'ds-user-bubble' : 'ds-assistant-bubble'}
              data-streaming={
                streaming && index === messages.length - 1 ? 'true' : undefined
              }
            >
              <span className="ds-visually-hidden">
                {message.role === 'user' ? 'You said:' : 'Assistant replied:'}
              </span>
              {message.role === 'assistant' ? (
                <>
                  <MiniMarkdown markdown={message.content || '​'}/>
                  {message.cites && message.cites.length > 0 && (
                    <div className="ds-cites" aria-label="References">
                      {message.cites.map((name) => (
                        <span key={name} className="ds-cite">{name}</span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                message.content
              )}
            </div>
          ))
        )}
      </div>

      <form className="ds-composer" onSubmit={handleSubmit}>
        <TextInput
          ref={inputRef}
          id="ds-askai-input"
          className="ds-composer-input"
          label={intl.formatMessage({id: 'askAI.input.label'})}
          visuallyHideLabel
          placeholder="Ask about a component..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={streaming}
        />
        {streaming ? (
          <Button variant="secondary" type="button" onClick={cancel}>
            Stop
          </Button>
        ) : (
          <Button
            variant="primary"
            type="submit"
            trailingIcon={<ArrowRight/>}
            disabled={!draft.trim()}
          >
            Ask
          </Button>
        )}
      </form>
    </Card>
  );
};
