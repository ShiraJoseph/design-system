/**
 * Shape of a single message in an AskAI conversation.
 */
export interface AskAIMessage {
  role: 'user' | 'assistant';
  /** Plain-text or lightly-marked-up content. */
  content: string;
  /** Optional list of catalog component names referenced in the answer. */
  cites?: string[];
}

/**
 * Provider abstraction. Lets consumers swap the static, catalog-only
 * default for a real LLM (Anthropic, OpenAI, on-device, etc.) without
 * touching the UI. Implementations should:
 *
 * - Stream chunks via the async iterable so the UI can render
 *   progressively (the static provider streams character-by-character
 *   to match the LLM cadence).
 * - Honor `signal` for cancellation when the user types a new question.
 */
export interface AskAIProvider {
  /** Short label shown in the UI ("Static · catalog match", "Claude Sonnet"). */
  label: string;

  /**
   * Stream an answer to the user's question.
   *
   * @param question  The latest user question.
   * @param history   Prior turns in the conversation.
   * @param signal    Abort signal for cancellation.
   * @returns An async iterable that yields content chunks. The final
   *          message can additionally return a `cites` array via the
   *          last yielded value.
   */
  ask(
    question: string,
    history: AskAIMessage[],
    signal?: AbortSignal,
  ): AsyncIterable<{ chunk: string; cites?: string[] }>;
}
