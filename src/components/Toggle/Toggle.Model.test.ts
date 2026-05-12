import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useToggleModel } from './Toggle.Model';

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

describe('useToggleModel', () => {
  it('uses the provided id when given', () => {
    const {result} = renderHook(() => useToggleModel({id: 'wifi'}));
    expect(result.current.inputId).toBe('wifi');
  });

  it('generates a stable ds-toggle-* id when none is provided', () => {
    const {result} = renderHook(() => useToggleModel({}));
    expect(result.current.inputId).toMatch(/^ds-toggle-/);
  });

  it('returns a descriptionId tied to the input when description is set', () => {
    const {result} = renderHook(() =>
      useToggleModel({id: 'wifi', description: 'auto-connect'}),
    );
    expect(result.current.descriptionId).toBe('wifi-desc');
  });

  it('returns descriptionId=undefined when description is omitted', () => {
    const {result} = renderHook(() => useToggleModel({id: 'wifi'}));
    expect(result.current.descriptionId).toBeUndefined();
  });

  it('handleChange triggers the slide-bounce and forwards to onChange', () => {
    const onChange = vi.fn();
    const {result} = renderHook(() => useToggleModel({onChange}));
    const event = {} as never;
    act(() => result.current.handleChange(event));
    expect(result.current.bouncing).toBe(true);
    expect(onChange).toHaveBeenCalledWith(event);
  });

  it('handleChange tolerates a missing onChange', () => {
    const {result} = renderHook(() => useToggleModel({}));
    expect(() => act(() => result.current.handleChange({} as never))).not.toThrow();
  });

  it('handleThumbAnimationEnd clears bouncing on ds-slide-bounce (not ds-bounce)', () => {
    const {result} = renderHook(() => useToggleModel({}));
    act(() => result.current.handleChange({} as never));
    act(() =>
      result.current.handleThumbAnimationEnd({animationName: 'ds-bounce'} as never),
    );
    expect(result.current.bouncing).toBe(true);
    act(() =>
      result.current.handleThumbAnimationEnd({animationName: 'ds-slide-bounce'} as never),
    );
    expect(result.current.bouncing).toBe(false);
  });
});
