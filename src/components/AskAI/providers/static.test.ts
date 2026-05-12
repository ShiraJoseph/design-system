import { describe, expect, it } from 'vitest';
import { staticProvider } from './static';

const collect = async (
  iter: AsyncIterable<{ chunk: string; cites?: string[] }>,
): Promise<{ text: string; cites?: string[] }> => {
  let text = '';
  let cites: string[] | undefined;
  for await (const part of iter) {
    text += part.chunk;
    if (part.cites) cites = part.cites;
  }

  return {text, cites};
};

describe('staticProvider', () => {
  it('streams a fallback answer when no catalog entry matches', async () => {
    const result = await collect(staticProvider.ask('zzz qqq xyz', []));
    expect(result.text).toMatch(/local catalog assistant/i);
    expect(result.cites).toBeUndefined();
  });

  it('streams the top-ranked catalog entry as a Markdown answer when a match exists', async () => {
    const result = await collect(staticProvider.ask('destructive button', []));
    expect(result.text).toMatch(/\*\*Button\*\*/);
    expect(result.cites).toEqual(['Button']);
  });

  it('honors an abort signal so the consumer can cancel a stream mid-flight', async () => {
    const controller = new AbortController();
    controller.abort();
    const iterator = staticProvider.ask('button', [], controller.signal)[Symbol.asyncIterator]();
    await expect(iterator.next()).rejects.toBeDefined();
  });

  it('strips non-alphanumeric characters from the question before scoring', async () => {
    const result = await collect(staticProvider.ask('!!button???', []));
    expect(result.text).toMatch(/\*\*Button\*\*/);
  });
});
