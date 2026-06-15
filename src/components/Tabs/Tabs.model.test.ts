import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { type TabDescriptor, useTabsModel } from './Tabs.model';

const tabs: TabDescriptor[] = [
  {id: 'a', label: 'First', content: 'A'},
  {id: 'b', label: 'Second', content: 'B', disabled: true},
  {id: 'c', label: 'Third', content: 'C'},
];

const keyEvent = (key: string) => {
  const preventDefault = vi.fn();
  return {event: {key, preventDefault} as never, preventDefault};
};

const renderModel = (
  value = 'a',
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  onChange = vi.fn(),
  className?: string,
) =>
  renderHook(
    (props: {value: string; orientation: 'horizontal' | 'vertical'}) =>
      useTabsModel({value: props.value, onChange, tabs, orientation: props.orientation, className}),
    {initialProps: {value, orientation}},
  );

describe('useTabsModel', () => {
  it('ArrowRight skips a disabled tab and activates the next enabled one', () => {
    const onChange = vi.fn();
    const {result} = renderModel('a', 'horizontal', onChange);
    const {event, preventDefault} = keyEvent('ArrowRight');
    act(() => result.current.handleKeyDown(event, 0));
    expect(onChange).toHaveBeenCalledWith('c');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('ArrowLeft wraps from the first enabled tab to the last enabled tab', () => {
    const onChange = vi.fn();
    const {result} = renderModel('a', 'horizontal', onChange);
    act(() => result.current.handleKeyDown(keyEvent('ArrowLeft').event, 0));
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('Home activates the first tab and End activates the last enabled tab', () => {
    const onChange = vi.fn();
    const {result} = renderModel('c', 'horizontal', onChange);
    act(() => result.current.handleKeyDown(keyEvent('Home').event, 2));
    expect(onChange).toHaveBeenCalledWith('a');
    act(() => result.current.handleKeyDown(keyEvent('End').event, 0));
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('uses ArrowDown / ArrowUp when oriented vertically', () => {
    const onChange = vi.fn();
    const {result} = renderModel('a', 'vertical', onChange);
    act(() => result.current.handleKeyDown(keyEvent('ArrowDown').event, 0));
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('ignores non-navigation keys', () => {
    const onChange = vi.fn();
    const {result} = renderModel('a', 'horizontal', onChange);
    const {event, preventDefault} = keyEvent('Enter');
    act(() => result.current.handleKeyDown(event, 0));
    expect(onChange).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('registering and unregistering a trigger ref does not throw', () => {
    const {result} = renderModel();
    const node = document.createElement('button');
    act(() => result.current.setTriggerRef('a')(node));
    act(() => result.current.setTriggerRef('a')(null));
    expect(result.current.baseId).toMatch(/^ds-tabs-/);
  });

  it('builds the container classes from orientation and a passed className', () => {
    const {result} = renderModel('a', 'vertical', vi.fn(), 'extra');
    expect(result.current.classes).toContain('ds-tabs');
    expect(result.current.classes).toContain('ds-orientation-vertical');
    expect(result.current.classes).toContain('extra');
  });

  it('triggerClasses marks only the active trigger', () => {
    const {result} = renderModel();
    expect(result.current.triggerClasses(true)).toBe('ds-trigger ds-trigger-active');
    expect(result.current.triggerClasses(false)).toBe('ds-trigger');
  });

  it('positions the ink bar over the active trigger in both orientations', () => {
    const {result, rerender} = renderModel('a', 'horizontal');
    act(() => result.current.setTriggerRef('c')(document.createElement('button')));

    rerender({value: 'c', orientation: 'horizontal'});
    expect(result.current.inkBarStyle.opacity).toBe(1);
    expect(result.current.inkBarStyle).toHaveProperty('width');

    rerender({value: 'c', orientation: 'vertical'});
    expect(result.current.inkBarStyle).toHaveProperty('height');
  });
});
