import { catalog, type CatalogComponent } from '../catalog';
import type { AskAIMessage, AskAIProvider } from './types';

/**
 * Score a catalog entry against question terms by keyword matching.
 * @internal
 */
const scoreEntry = (entry: CatalogComponent, terms: string[]): number => {
  const haystack = `${entry.name} ${entry.keywords} ${entry.description}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (!term) continue;
    if (haystack.includes(term)) {
      score += term.length;
    }

    if (entry.name.toLowerCase() === term) {
      score += 5;
    }
  }

  return score;
};

/** Render one catalog entry as a Markdown answer. */
const renderAnswer = (entry: CatalogComponent): string => {
  const lines: string[] = [];
  lines.push(`**${entry.name}**. ${entry.description}`);
  lines.push('');

  if (entry.examples.length) {
    const example = entry.examples[0];
    lines.push(`_${example.title}_`);
    lines.push('```tsx');
    lines.push(example.code);
    lines.push('```');
  }

  if (entry.props.length) {
    lines.push('');
    lines.push('Key props:');
    for (const prop of entry.props.slice(0, 4)) {
      const required = prop.required ? ' *(required)*' : '';
      lines.push(`- \`${prop.name}\`: ${prop.type}${required}. ${prop.description}`);
    }
  }

  if (entry.accessibility.length) {
    lines.push('');
    lines.push('Accessibility:');
    for (const line of entry.accessibility.slice(0, 3)) {
      lines.push(`- ${line}`);
    }
  }

  return lines.join('\n');
};

const fallbackAnswer = (): string => {
  const names = catalog.map((entry) => entry.name).join(', ');

  return [
    `I am the local catalog assistant. I can answer questions about any component in this library: **${names}**.`,
    '',
    'Try: "How do I make a destructive button?" or "What does the TextInput error state look like?"',
  ].join('\n');
};

/**
 * Sleep, respecting an abort signal.
 * @internal
 */
const delay = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      reject(signal.reason);
    });
  });

/** Stream `text` in fixed-size chunks with a small delay so the UI matches a real LLM's cadence. */
async function* streamChunks(
  text: string,
  cites: string[] | undefined,
  signal?: AbortSignal,
): AsyncIterable<{ chunk: string; cites?: string[] }> {
  const chunkSize = 8;
  for (let i = 0; i < text.length; i += chunkSize) {
    if (signal?.aborted) throw signal.reason;
    yield {chunk: text.slice(i, i + chunkSize)};
    await delay(18, signal);
  }
  if (cites && cites.length) {
    yield {chunk: '', cites};
  }
}

/** Default `AskAI` provider: keyword-matches the in-repo catalog with zero external calls (works offline). */
export const staticProvider: AskAIProvider = {
  label: 'Static · catalog match',
  async* ask(question: string, _history: AskAIMessage[], signal?: AbortSignal) {
    const terms = question
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    const ranked = catalog
      .map((entry) => ({entry, score: scoreEntry(entry, terms)}))
      .filter((row) => row.score > 0)
      .sort((left, right) => right.score - left.score);

    if (ranked.length === 0) {
      yield* streamChunks(fallbackAnswer(), undefined, signal);

      return;
    }

    const top = ranked[0].entry;
    const text = renderAnswer(top);
    yield* streamChunks(text, [top.name], signal);
  },
};
