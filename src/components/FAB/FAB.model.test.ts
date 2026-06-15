import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFABModel } from './FAB.model';

const originalMatchMedia = window.matchMedia;

const baseArgs: Parameters<typeof useFABModel>[0] = {
  variant: 'primary',
  size: 'md',
  quiet: false,
};

const renderModel = (overrides: Partial<Parameters<typeof useFABModel>[0]> = {}) =>
  renderHook(() => useFABModel({...baseArgs, ...overrides}));

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

describe('useFABModel', () => {
  it('builds the class list from variant and size', () => {
    const {result} = renderModel();
    expect(result.current.classes).toContain('ds-fab');
    expect(result.current.classes).toContain('ds-variant-primary');
    expect(result.current.classes).toContain('ds-size-md');
  });

  it('adds ds-extended only when a label is present', () => {
    expect(renderModel({label: 'New'}).result.current.classes).toContain('ds-extended');
    expect(renderModel().result.current.classes).not.toContain('ds-extended');
  });

  it('appends a passed className', () => {
    expect(renderModel({className: 'extra'}).result.current.classes).toContain('extra');
  });

  it('handleClick adds ds-bouncing when quiet is false', () => {
    const {result} = renderModel({quiet: false});
    act(() => result.current.handleClick({} as never));
    expect(result.current.classes).toContain('ds-bouncing');
  });

  it('handleClick skips the bounce when quiet is true', () => {
    const {result} = renderModel({quiet: true});
    act(() => result.current.handleClick({} as never));
    expect(result.current.classes).not.toContain('ds-bouncing');
  });

  it('handleClick forwards to the consumer onClick when provided', () => {
    const onClick = vi.fn();
    const {result} = renderModel({onClick});
    const event = {currentTarget: {}} as never;
    act(() => result.current.handleClick(event));
    expect(onClick).toHaveBeenCalledWith(event);
  });

  it('handleClick is a no-op for the consumer when onClick is omitted', () => {
    const {result} = renderModel();
    expect(() => act(() => result.current.handleClick({} as never))).not.toThrow();
  });

  it('handleAnimationEnd clears the bounce on ds-bounce', () => {
    const {result} = renderModel({quiet: false});
    act(() => result.current.handleClick({} as never));
    act(() => result.current.handleAnimationEnd({animationName: 'ds-bounce'} as never));
    expect(result.current.classes).not.toContain('ds-bouncing');
  });
});
