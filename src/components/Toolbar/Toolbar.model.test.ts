import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useToolbarModel, type ToolbarOrientation } from './Toolbar.model';

const makeToolbar = () => {
  const container = document.createElement('div');
  ['Bold', 'Italic', 'Underline'].forEach((label, index) => {
    const button = document.createElement('button');
    button.textContent = label;
    if (index === 1) button.disabled = true;
    container.appendChild(button);
  });
  document.body.appendChild(container);

  return container;
};

const mountWith = (
  container: HTMLDivElement,
  args: Partial<Parameters<typeof useToolbarModel>[0]> = {},
) => {
  const orientation: ToolbarOrientation = args.orientation ?? 'horizontal';
  const view = renderHook(() => useToolbarModel({...args, orientation}));
  act(() => {
    view.result.current.setMergedRef(container);
  });

  return view;
};

const press = (result: {current: ReturnType<typeof useToolbarModel>}, key: string) => {
  const preventDefault = vi.fn();
  act(() => result.current.onContainerKeyDown({key, preventDefault} as never));

  return preventDefault;
};

afterEach(() => {
  document.body.replaceChildren();
});

describe('useToolbarModel', () => {
  it('builds the class list from orientation', () => {
    const {result} = renderHook(() => useToolbarModel({orientation: 'vertical'}));
    expect(result.current.classes).toContain('ds-toolbar');
    expect(result.current.classes).toContain('ds-orientation-vertical');
  });

  it('appends a passed className', () => {
    const {result} = renderHook(() => useToolbarModel({orientation: 'horizontal', className: 'extra'}));
    expect(result.current.classes).toContain('extra');
  });

  it('ArrowRight skips a disabled item and focuses the next enabled one', () => {
    const {result} = mountWith(makeToolbar());
    const preventDefault = press(result, 'ArrowRight');
    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement?.textContent).toBe('Underline');
  });

  it('ArrowLeft wraps from the first enabled item to the last enabled one', () => {
    const {result} = mountWith(makeToolbar());
    press(result, 'ArrowLeft');
    expect(document.activeElement?.textContent).toBe('Underline');
  });

  it('Home focuses the first and End focuses the last enabled item', () => {
    const {result} = mountWith(makeToolbar());
    press(result, 'End');
    expect(document.activeElement?.textContent).toBe('Underline');
    press(result, 'Home');
    expect(document.activeElement?.textContent).toBe('Bold');
  });

  it('uses ArrowDown / ArrowUp when oriented vertically', () => {
    const {result} = mountWith(makeToolbar(), {orientation: 'vertical'});
    press(result, 'ArrowDown');
    expect(document.activeElement?.textContent).toBe('Underline');
  });

  it('ignores non-navigation keys', () => {
    const {result} = mountWith(makeToolbar());
    const preventDefault = press(result, 'x');
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('is a no-op when the toolbar has no enabled items', () => {
    const empty = document.createElement('div');
    document.body.appendChild(empty);
    const {result} = mountWith(empty);
    expect(() => press(result, 'ArrowRight')).not.toThrow();
  });

  it('onContainerKeyDown forwards to the consumer onKeyDown before navigating', () => {
    const onKeyDown = vi.fn();
    const {result} = mountWith(makeToolbar(), {onKeyDown});
    press(result, 'ArrowRight');
    expect(onKeyDown).toHaveBeenCalled();
    expect(document.activeElement?.textContent).toBe('Underline');
  });

  it('setMergedRef forwards the node to a function ref', () => {
    const externalRef = vi.fn();
    const container = makeToolbar();
    renderHook(() => useToolbarModel({orientation: 'horizontal', ref: externalRef}))
      .result.current.setMergedRef(container);
    expect(externalRef).toHaveBeenCalledWith(container);
  });

  it('setMergedRef writes the node to an object ref', () => {
    const externalRef = {current: null as HTMLDivElement | null};
    const container = makeToolbar();
    renderHook(() => useToolbarModel({orientation: 'horizontal', ref: externalRef}))
      .result.current.setMergedRef(container);
    expect(externalRef.current).toBe(container);
  });
});
