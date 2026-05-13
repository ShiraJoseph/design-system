import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useButtonModel } from './Button.model';

const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe('useButtonModel', () => {
  it('returns bouncing=false initially', () => {
    const {result} = renderHook(() => useButtonModel({quiet: false}));
    expect(result.current.bouncing).toBe(false);
  });

  it('handleClick triggers the bounce when quiet is false', () => {
    const {result} = renderHook(() => useButtonModel({quiet: false}));
    act(() => result.current.handleClick({} as never));
    expect(result.current.bouncing).toBe(true);
  });

  it('handleClick skips the bounce when quiet is true', () => {
    const {result} = renderHook(() => useButtonModel({quiet: true}));
    act(() => result.current.handleClick({} as never));
    expect(result.current.bouncing).toBe(false);
  });

  it('handleClick forwards to the consumer onClick when provided', () => {
    const onClick = vi.fn();
    const {result} = renderHook(() => useButtonModel({quiet: false, onClick}));
    const event = {currentTarget: {}} as never;
    act(() => result.current.handleClick(event));
    expect(onClick).toHaveBeenCalledWith(event);
  });

  it('handleClick is a no-op for the consumer when onClick is omitted', () => {
    const {result} = renderHook(() => useButtonModel({quiet: false}));
    expect(() => act(() => result.current.handleClick({} as never))).not.toThrow();
  });

  it('handleAnimationEnd clears the bouncing flag on ds-bounce', () => {
    const {result} = renderHook(() => useButtonModel({quiet: false}));
    act(() => result.current.handleClick({} as never));
    act(() => result.current.handleAnimationEnd({animationName: 'ds-bounce'} as never));
    expect(result.current.bouncing).toBe(false);
  });
});
