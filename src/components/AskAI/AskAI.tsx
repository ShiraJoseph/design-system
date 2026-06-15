import './AskAI.css';
import { Button } from '../Button';
import { Card } from '../Card';
import { IconButton } from '../IconButton';
import { TextInput } from '../TextInput';
import { ArrowRight, Close } from '../../icons';
import { MiniMarkdown } from './miniMarkdown/miniMarkdown';
import { type AskAIProvider, staticProvider } from './providers';
import { useAskAIModel } from './AskAI.model';

const DEFAULT_SUGGESTIONS = [
  'How do I make a destructive button?',
  'What does the TextInput error state look like?',
  'When should I use Toggle vs a checkbox?',
];

/**
 * Embedded chat-style assistant for design-system questions; the UI is
 * provider-agnostic so swapping `provider` switches the backing model.
 */
export const AskAI = ({
  provider = staticProvider,
  suggestions = DEFAULT_SUGGESTIONS,
  title,
  maxHeight,
  className,
}: {
  /** Defaults to `staticProvider`, which keyword-matches the local catalog and needs no API key. */
  provider?: AskAIProvider;
  suggestions?: string[];
  title?: string;
  maxHeight?: string;
  className?: string;
}) => {
  const {
    intl,
    heading,
    classes,
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
  } = useAskAIModel({provider, title, className});

  return (
    <Card
      className={classes}
      elevation={'raised'}
      padding={'lg'}
      role={'region'}
      aria-label={heading}
      style={maxHeight ? {maxHeight} : undefined}
    >
      <header className={'ds-header'}>
        <div>
          <h2 className={'ds-title'}>{heading}</h2>
          <p className={'ds-subtitle'}>Powered by {provider.label}</p>
        </div>
        {messages.length > 0 && (
          <IconButton
            aria-label={'Reset conversation'}
            icon={<Close/>}
            variant={'ghost'}
            size={'sm'}
            onClick={reset}
          />
        )}
      </header>

      <div
        ref={threadRef}
        className={'ds-thread'}
        role={'log'}
        aria-live={'polite'}
        aria-relevant={'additions text'}
      >
        {messages.length === 0 ? (
          <div className={'ds-empty'}>
            <p className={'ds-empty-title'}>What would you like to know?</p>
            <ul className={'ds-suggestion-list'}>
              {suggestions.map((prompt) => (
                <li key={prompt}>
                  <Button
                    variant={'secondary'}
                    size={'sm'}
                    fullWidth
                    quiet
                    onClick={() => void submit(prompt)}
                    className={'ds-suggestion'}
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
              data-streaming={isStreamingMessage(index) ? 'true' : undefined}
            >
              <span className={'ds-visually-hidden'}>
                {message.role === 'user' ? 'You said:' : 'Assistant replied:'}
              </span>
              {message.role === 'assistant' ? (
                <>
                  <MiniMarkdown markdown={message.content || '​'}/>
                  {message.cites && message.cites.length > 0 && (
                    <div className={'ds-cites'} aria-label={'References'}>
                      {message.cites.map((name) => (
                        <span key={name} className={'ds-cite'}>{name}</span>
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

      <form className={'ds-composer'} onSubmit={handleSubmit}>
        <TextInput
          ref={inputRef}
          id={'ds-askai-input'}
          className={'ds-composer-input'}
          label={intl.formatMessage({id: 'askAI.input.label'})}
          visuallyHideLabel
          placeholder={'Ask about a component...'}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={streaming}
        />
        {streaming ? (
          <Button variant={'secondary'} type={'button'} onClick={cancel}>
            Stop
          </Button>
        ) : (
          <Button
            variant={'primary'}
            type={'submit'}
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
