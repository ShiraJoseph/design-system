export interface AskAIMessage {
  role: 'user' | 'assistant';
  content: string;
  /** Catalog component names referenced in the answer. */
  cites?: string[];
}

/** Lets consumers swap the catalog-only default for a real LLM without touching the UI. */
export interface AskAIProvider {
  label: string;

  /** Implementations must stream chunks progressively and honor `signal` for cancellation. */
  ask(
    question: string,
    history: AskAIMessage[],
    signal?: AbortSignal,
  ): AsyncIterable<{ chunk: string; cites?: string[] }>;
}
