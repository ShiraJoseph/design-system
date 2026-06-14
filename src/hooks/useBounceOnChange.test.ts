import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useBounceOnChange } from './useBounceOnChange';

const originalMatchMedia = window.matchMedia;

const setReducedMotion = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion') && matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
};

beforeEach(() => {
  setReducedMotion(false);
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe('useBounceOnChange', () => {
  it('starts with bouncing=false', () => {
    const {result} = renderHook(() => useBounceOnChange());
    expect(result.current.bouncing).toBe(false);
  });

  it('triggerBounce sets bouncing=true when reduced-motion is not preferred', () => {
    const {result} = renderHook(() => useBounceOnChange());
    act(() => result.current.triggerBounce());
    expect(result.current.bouncing).toBe(true);
  });

  it('triggerBounce is a no-op when reduced-motion is preferred', () => {
    setReducedMotion(true);
    const {result} = renderHook(() => useBounceOnChange());
    act(() => result.current.triggerBounce());
    expect(result.current.bouncing).toBe(false);
  });

  it('handleBounceAnimationEnd clears bouncing when the configured animation ends', () => {
    const {result} = renderHook(() => useBounceOnChange());
    act(() => result.current.triggerBounce());
    expect(result.current.bouncing).toBe(true);
    act(() => result.current.handleBounceAnimationEnd({animationName: 'ds-bounce'} as never));
    expect(result.current.bouncing).toBe(false);
  });

  it('handleBounceAnimationEnd ignores events whose animationName does not match', () => {
    const {result} = renderHook(() => useBounceOnChange());
    act(() => result.current.triggerBounce());
    act(() => result.current.handleBounceAnimationEnd({animationName: 'other'} as never));
    expect(result.current.bouncing).toBe(true);
  });

  it('matches a custom animationName when provided', () => {
    const {result} = renderHook(() => useBounceOnChange({animationName: 'ds-slide-bounce'}));
    act(() => result.current.triggerBounce());
    act(() => result.current.handleBounceAnimationEnd({animationName: 'ds-bounce'} as never));
    expect(result.current.bouncing).toBe(true);
    act(() => result.current.handleBounceAnimationEnd({animationName: 'ds-slide-bounce'} as never));
    expect(result.current.bouncing).toBe(false);
  });

  it('safety timer clears bouncing when animationend never fires', () => {
    vi.useFakeTimers();
    const {result} = renderHook(() => useBounceOnChange());
    act(() => result.current.triggerBounce());
    expect(result.current.bouncing).toBe(true);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.bouncing).toBe(false);
    vi.useRealTimers();
  });

  it('handleBounceAnimationEnd cancels the safety timer when fired first', () => {
    vi.useFakeTimers();
    const {result} = renderHook(() => useBounceOnChange());
    act(() => result.current.triggerBounce());
    act(() => result.current.handleBounceAnimationEnd({animationName: 'ds-bounce'} as never));
    expect(result.current.bouncing).toBe(false);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.bouncing).toBe(false);
    vi.useRealTimers();
  });
});
