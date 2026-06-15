import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useIconButtonModel } from './IconButton.model';

const originalMatchMedia = window.matchMedia;

const baseArgs: Parameters<typeof useIconButtonModel>[0] = {
  variant: 'secondary',
  size: 'md',
  shape: 'square',
  loading: false,
  quiet: false,
};

const renderModel = (overrides: Partial<Parameters<typeof useIconButtonModel>[0]> = {}) =>
  renderHook(() => useIconButtonModel({...baseArgs, ...overrides}));

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

describe('useIconButtonModel', () => {
  it('builds the class list from variant, size, and shape', () => {
    const {result} = renderModel();
    expect(result.current.classes).toContain('ds-icon-button');
    expect(result.current.classes).toContain('ds-variant-secondary');
    expect(result.current.classes).toContain('ds-size-md');
    expect(result.current.classes).toContain('ds-shape-square');
  });

  it('appends a passed className', () => {
    expect(renderModel({className: 'extra'}).result.current.classes).toContain('extra');
  });

  it('isDisabled is true when either disabled or loading is set', () => {
    expect(renderModel({disabled: true}).result.current.isDisabled).toBe(true);
    expect(renderModel({loading: true}).result.current.isDisabled).toBe(true);
    expect(renderModel().result.current.isDisabled).toBe(false);
  });

  it('ariaBusy is true only while loading', () => {
    expect(renderModel({loading: true}).result.current.ariaBusy).toBe(true);
    expect(renderModel().result.current.ariaBusy).toBeUndefined();
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
