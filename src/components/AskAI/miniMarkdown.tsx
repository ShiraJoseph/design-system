import { Fragment, type ReactNode } from 'react';

const renderInline = (text: string): ReactNode => {
  const parts: ReactNode[] = [];
  let cursor = 0;
  const pattern = /(\*\*([^*]+)\*\*|_([^_]+)_|`([^`]+)`)/g;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    if (match[2] !== undefined) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      parts.push(<em key={key++}>{match[3]}</em>);
    } else if (match[4] !== undefined) {
      parts.push(<code key={key++}>{match[4]}</code>);
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <>{parts}</>;
};

const renderBlock = (block: string): ReactNode => {
  const codeMatch = /^```([a-zA-Z0-9]*)\n([\s\S]*?)```$/.exec(block);

  if (codeMatch) {
    const [, language, body] = codeMatch;

    return (
      <pre data-language={language}>
        <code>{body}</code>
      </pre>
    );
  }

  if (block.startsWith('- ')) {
    const items = block.split('\n').map((line) => line.replace(/^- /, ''));

    return (
      <ul>
        {items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
      </ul>
    );
  }
  if (!block) return null;

  return <p>{renderInline(block)}</p>;
};

/**
 * Tiny markdown renderer for AskAI answers. Supports the subset the
 * static provider emits: fenced code blocks, bullet lists, bold, and
 * italic. Pulled inline so the library doesn't depend on a heavy
 * markdown library, the input set is fixed and small.
 *
 * @param markdown   The markdown string to render.
 * @returns          A React tree of elements.
 */
export const MiniMarkdown = ({markdown}: { markdown: string }): ReactNode => {
  const blocks = markdown.split(/\n(?=```|\n)/);

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={index}>{renderBlock(block.trim())}</Fragment>
      ))}
    </>
  );
};
