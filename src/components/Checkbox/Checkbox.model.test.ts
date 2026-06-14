import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCheckboxModel } from './Checkbox.model';

const originalMatchMedia = window.matchMedia;

const baseArgs: Parameters<typeof useCheckboxModel>[0] = {
  indeterminate: false,
  size: 'md',
};

const renderModel = (overrides: Partial<Parameters<typeof useCheckboxModel>[0]> = {}) =>
  renderHook(() => useCheckboxModel({...baseArgs, ...overrides}));

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
    expect(renderModel({id: 'agree'}).result.current.inputId).toBe('agree');
  });

  it('generates a stable ds-checkbox-* id when none is provided', () => {
    expect(renderModel().result.current.inputId).toMatch(/^ds-checkbox-/);
  });

  it('returns a descriptionId tied to the input when description is set', () => {
    expect(renderModel({id: 'a', description: 'more'}).result.current.descriptionId).toBe('a-desc');
  });

  it('returns descriptionId=undefined when description is omitted', () => {
    expect(renderModel({id: 'a'}).result.current.descriptionId).toBeUndefined();
  });

  it('builds the wrapper class list from size and flags', () => {
    const {result} = renderModel({size: 'sm', indeterminate: true, disabled: true});
    expect(result.current.wrapperClasses).toContain('ds-checkbox');
    expect(result.current.wrapperClasses).toContain('ds-size-sm');
    expect(result.current.wrapperClasses).toContain('ds-indeterminate');
    expect(result.current.wrapperClasses).toContain('ds-disabled');
  });

  it('omits the indeterminate and disabled classes when those flags are off', () => {
    const {result} = renderModel();
    expect(result.current.wrapperClasses).not.toContain('ds-indeterminate');
    expect(result.current.wrapperClasses).not.toContain('ds-disabled');
  });

  it('appends a passed className to the wrapper', () => {
    expect(renderModel({className: 'extra'}).result.current.wrapperClasses).toContain('extra');
  });

  it('boxClasses is ds-box until the bounce is triggered', () => {
    const {result} = renderModel();
    expect(result.current.boxClasses).toBe('ds-box');
    act(() => result.current.handleChange({} as never));
    expect(result.current.boxClasses).toContain('ds-bouncing');
  });

  it('pushes indeterminate to the node when the ref attaches', () => {
    const fakeInput = document.createElement('input');
    fakeInput.type = 'checkbox';

    const marked = renderModel({indeterminate: true});
    act(() => marked.result.current.setMergedRef(fakeInput));
    expect(fakeInput.indeterminate).toBe(true);

    const cleared = renderModel({indeterminate: false});
    act(() => cleared.result.current.setMergedRef(fakeInput));
    expect(fakeInput.indeterminate).toBe(false);
  });

  it('setMergedRef forwards the node to a function ref', () => {
    const externalRef = vi.fn();
    const fakeInput = document.createElement('input');
    const {result} = renderModel({ref: externalRef});
    act(() => result.current.setMergedRef(fakeInput));
    expect(externalRef).toHaveBeenCalledWith(fakeInput);
  });

  it('setMergedRef assigns the node to an object ref', () => {
    const externalRef = {current: null as HTMLInputElement | null};
    const fakeInput = document.createElement('input');
    const {result} = renderModel({ref: externalRef});
    act(() => result.current.setMergedRef(fakeInput));
    expect(externalRef.current).toBe(fakeInput);
  });

  it('setMergedRef tolerates a missing external ref', () => {
    const fakeInput = document.createElement('input');
    const {result} = renderModel();
    expect(() => act(() => result.current.setMergedRef(fakeInput))).not.toThrow();
  });

  it('handleChange triggers the bounce and forwards to onChange', () => {
    const onChange = vi.fn();
    const {result} = renderModel({onChange});
    const event = {} as never;
    act(() => result.current.handleChange(event));
    expect(result.current.boxClasses).toContain('ds-bouncing');
    expect(onChange).toHaveBeenCalledWith(event);
  });

  it('handleChange tolerates a missing onChange', () => {
    const {result} = renderModel();
    expect(() => act(() => result.current.handleChange({} as never))).not.toThrow();
  });

  it('handleBoxAnimationEnd clears bouncing on ds-bounce', () => {
    const {result} = renderModel();
    act(() => result.current.handleChange({} as never));
    act(() => result.current.handleBoxAnimationEnd({animationName: 'ds-bounce'} as never));
    expect(result.current.boxClasses).not.toContain('ds-bouncing');
  });
});
