import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useToolbarItemModel } from './ToolbarItem.Model';

describe('useToolbarItemModel', () => {
  it('composes onSelect and onClick when both are provided', () => {
    const onSelect = vi.fn();
    const onClick = vi.fn();
    const {result} = renderHook(() => useToolbarItemModel({onSelect, onClick}));
    const event = {} as never;
    act(() => result.current.handleClick(event));
    expect(onSelect).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledWith(event);
  });

  it('calls onSelect alone when onClick is omitted', () => {
    const onSelect = vi.fn();
    const {result} = renderHook(() => useToolbarItemModel({onSelect}));
    act(() => result.current.handleClick({} as never));
    expect(onSelect).toHaveBeenCalled();
  });

  it('calls onClick alone when onSelect is omitted', () => {
    const onClick = vi.fn();
    const {result} = renderHook(() => useToolbarItemModel({onClick}));
    const event = {} as never;
    act(() => result.current.handleClick(event));
    expect(onClick).toHaveBeenCalledWith(event);
  });

  it('is a no-op when both callbacks are omitted', () => {
    const {result} = renderHook(() => useToolbarItemModel({}));
    expect(() => act(() => result.current.handleClick({} as never))).not.toThrow();
  });
});
