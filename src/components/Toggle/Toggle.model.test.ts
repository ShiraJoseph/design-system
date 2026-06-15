import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useToggleModel } from './Toggle.model';

const originalMatchMedia = window.matchMedia;

const baseArgs: Parameters<typeof useToggleModel>[0] = {
  size: 'md',
  visuallyHideLabel: false,
};

const renderModel = (overrides: Partial<Parameters<typeof useToggleModel>[0]> = {}) =>
  renderHook(() => useToggleModel({...baseArgs, ...overrides}));

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
    expect(renderModel({id: 'wifi'}).result.current.inputId).toBe('wifi');
  });

  it('generates a stable ds-toggle-* id when none is provided', () => {
    expect(renderModel().result.current.inputId).toMatch(/^ds-toggle-/);
  });

  it('returns a descriptionId tied to the input when description is set', () => {
    expect(
      renderModel({id: 'wifi', description: 'auto-connect'}).result.current.descriptionId,
    ).toBe('wifi-desc');
  });

  it('returns descriptionId=undefined when description is omitted', () => {
    expect(renderModel({id: 'wifi'}).result.current.descriptionId).toBeUndefined();
  });

  it('builds the wrapper class list from size and flags', () => {
    const {result} = renderModel({size: 'sm', disabled: true});
    expect(result.current.wrapperClasses).toContain('ds-toggle');
    expect(result.current.wrapperClasses).toContain('ds-size-sm');
    expect(result.current.wrapperClasses).toContain('ds-disabled');
  });

  it('appends a passed className to the wrapper', () => {
    expect(renderModel({className: 'extra'}).result.current.wrapperClasses).toContain('extra');
  });

  it('omits ds-disabled when not disabled', () => {
    expect(renderModel().result.current.wrapperClasses).not.toContain('ds-disabled');
  });

  it('labelClass switches to ds-visually-hidden when visuallyHideLabel is set', () => {
    expect(renderModel().result.current.labelClass).toBe('ds-label');
    expect(renderModel({visuallyHideLabel: true}).result.current.labelClass).toBe(
      'ds-visually-hidden',
    );
  });

  it('thumbClasses gains ds-bouncing after a change', () => {
    const {result} = renderModel();
    expect(result.current.thumbClasses).not.toContain('ds-bouncing');
    act(() => result.current.handleChange({} as never));
    expect(result.current.thumbClasses).toContain('ds-bouncing');
  });

  it('handleChange triggers the slide-bounce and forwards to onChange', () => {
    const onChange = vi.fn();
    const {result} = renderModel({onChange});
    const event = {} as never;
    act(() => result.current.handleChange(event));
    expect(result.current.thumbClasses).toContain('ds-bouncing');
    expect(onChange).toHaveBeenCalledWith(event);
  });

  it('handleChange tolerates a missing onChange', () => {
    const {result} = renderModel();
    expect(() => act(() => result.current.handleChange({} as never))).not.toThrow();
  });

  it('handleThumbAnimationEnd clears bouncing on ds-slide-bounce (not ds-bounce)', () => {
    const {result} = renderModel();
    act(() => result.current.handleChange({} as never));
    act(() => result.current.handleThumbAnimationEnd({animationName: 'ds-bounce'} as never));
    expect(result.current.thumbClasses).toContain('ds-bouncing');
    act(() =>
      result.current.handleThumbAnimationEnd({animationName: 'ds-slide-bounce'} as never),
    );
    expect(result.current.thumbClasses).not.toContain('ds-bouncing');
  });
});
