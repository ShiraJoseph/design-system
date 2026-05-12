import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MiniMarkdown } from './miniMarkdown';

describe('MiniMarkdown', () => {
  it('renders a plain paragraph for plain text', () => {
    render(<MiniMarkdown markdown="hello there"/>);
    expect(screen.getByText('hello there').tagName).toBe('P');
  });

  it('renders **bold** as <strong>', () => {
    render(<MiniMarkdown markdown="this is **bold** text"/>);
    expect(screen.getByText('bold').tagName).toBe('STRONG');
  });

  it('renders _italic_ as <em>', () => {
    render(<MiniMarkdown markdown="this is _italic_ text"/>);
    expect(screen.getByText('italic').tagName).toBe('EM');
  });

  it('renders `code` as inline <code>', () => {
    render(<MiniMarkdown markdown="run `npm test` to verify"/>);
    expect(screen.getByText('npm test').tagName).toBe('CODE');
  });

  it('renders a bullet list when the block starts with "- "', () => {
    render(<MiniMarkdown markdown={'- one\n- two\n- three'}/>);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('one');
  });

  it('renders fenced code blocks as <pre><code data-language>', () => {
    const fence = '```';
    /* No newline between body and closing fence: the block-split regex
       splits on `\n(?=\`\`\`...)` so a newline directly before the
       closing fence would incorrectly start a new block. The catalog
       provider produces this same shape. */
    render(<MiniMarkdown markdown={`${fence}tsx\nconst x = 1;${fence}`}/>);
    const pre = document.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveAttribute('data-language', 'tsx');
    expect(pre?.querySelector('code')).toHaveTextContent('const x = 1;');
  });

  it('skips empty blocks', () => {
    const {container} = render(<MiniMarkdown markdown=""/>);
    expect(container.querySelectorAll('p, ul, pre')).toHaveLength(0);
  });
});
