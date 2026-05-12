import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCheckboxModel } from './Checkbox.Model';

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

describe('useCheckboxModel', () => {
  it('uses the provided id when given', () => {
    const {result} = renderHook(() => useCheckboxModel({id: 'agree', indeterminate: false}));
    expect(result.current.inputId).toBe('agree');
  });

  it('generates a stable ds-checkbox-* id when none is provided', () => {
    const {result} = renderHook(() => useCheckboxModel({indeterminate: false}));
    expect(result.current.inputId).toMatch(/^ds-checkbox-/);
  });

  it('returns a descriptionId tied to the input when description is set', () => {
    const {result} = renderHook(() =>
      useCheckboxModel({id: 'a', description: 'more', indeterminate: false}),
    );
    expect(result.current.descriptionId).toBe('a-desc');
  });

  it('returns descriptionId=undefined when description is omitted', () => {
    const {result} = renderHook(() => useCheckboxModel({id: 'a', indeterminate: false}));
    expect(result.current.descriptionId).toBeUndefined();
  });

  it('pushes indeterminate to the underlying input via the internal ref', () => {
    const {result, rerender} = renderHook(
      ({indeterminate}) => useCheckboxModel({indeterminate}),
      {initialProps: {indeterminate: false}},
    );
    const fakeInput = document.createElement('input');
    fakeInput.type = 'checkbox';
    act(() => {
      result.current.internalRef.current = fakeInput;
    });
    rerender({indeterminate: true});
    expect(fakeInput.indeterminate).toBe(true);
    rerender({indeterminate: false});
    expect(fakeInput.indeterminate).toBe(false);
  });

  it('handleChange triggers the bounce and forwards to onChange', () => {
    const onChange = vi.fn();
    const {result} = renderHook(() => useCheckboxModel({indeterminate: false, onChange}));
    const event = {} as never;
    act(() => result.current.handleChange(event));
    expect(result.current.bouncing).toBe(true);
    expect(onChange).toHaveBeenCalledWith(event);
  });

  it('handleChange tolerates a missing onChange', () => {
    const {result} = renderHook(() => useCheckboxModel({indeterminate: false}));
    expect(() => act(() => result.current.handleChange({} as never))).not.toThrow();
  });

  it('handleBoxAnimationEnd clears bouncing on ds-bounce', () => {
    const {result} = renderHook(() => useCheckboxModel({indeterminate: false}));
    act(() => result.current.handleChange({} as never));
    act(() => result.current.handleBoxAnimationEnd({animationName: 'ds-bounce'} as never));
    expect(result.current.bouncing).toBe(false);
  });
});
