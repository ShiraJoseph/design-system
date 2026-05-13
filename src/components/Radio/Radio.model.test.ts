import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useRadioModel } from './Radio.model';

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

describe('useRadioModel', () => {
  it('uses the provided id when given', () => {
    const {result} = renderHook(() => useRadioModel({id: 'pizza'}));
    expect(result.current.inputId).toBe('pizza');
  });

  it('generates a stable ds-radio-* id when none is provided', () => {
    const {result} = renderHook(() => useRadioModel({}));
    expect(result.current.inputId).toMatch(/^ds-radio-/);
  });

  it('returns a descriptionId tied to the input when description is set', () => {
    const {result} = renderHook(() =>
      useRadioModel({id: 'p', description: 'extra info'}),
    );
    expect(result.current.descriptionId).toBe('p-desc');
  });

  it('returns descriptionId=undefined when description is omitted', () => {
    const {result} = renderHook(() => useRadioModel({id: 'p'}));
    expect(result.current.descriptionId).toBeUndefined();
  });

  it('handleChange triggers the ring bounce', () => {
    const {result} = renderHook(() => useRadioModel({}));
    act(() => result.current.handleChange({} as never));
    expect(result.current.bouncing).toBe(true);
  });

  it('handleChange forwards to a consumer onChange when provided', () => {
    const onChange = vi.fn();
    const {result} = renderHook(() => useRadioModel({onChange}));
    const event = {} as never;
    act(() => result.current.handleChange(event));
    expect(onChange).toHaveBeenCalledWith(event);
  });

  it('handleChange tolerates a missing onChange', () => {
    const {result} = renderHook(() => useRadioModel({}));
    expect(() => act(() => result.current.handleChange({} as never))).not.toThrow();
  });

  it('handleRingAnimationEnd clears bouncing on the ds-bounce keyframe', () => {
    const {result} = renderHook(() => useRadioModel({}));
    act(() => result.current.handleChange({} as never));
    act(() => result.current.handleRingAnimationEnd({animationName: 'ds-bounce'} as never));
    expect(result.current.bouncing).toBe(false);
  });
});
