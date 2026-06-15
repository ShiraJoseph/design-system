import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { regionClasses, useCardModel } from './Card.model';

const baseArgs: Parameters<typeof useCardModel>[0] = {
  elevation: 'raised',
  padding: 'lg',
  interactive: false,
};

const renderModel = (overrides: Partial<Parameters<typeof useCardModel>[0]> = {}) =>
  renderHook(() => useCardModel({...baseArgs, ...overrides}));

describe('useCardModel', () => {
  it('builds the class list from elevation and padding', () => {
    const {classes} = renderModel().result.current;
    expect(classes).toContain('ds-card');
    expect(classes).toContain('ds-elevation-raised');
    expect(classes).toContain('ds-padding-lg');
  });

  it('reflects the chosen elevation', () => {
    expect(renderModel({elevation: 'flat'}).result.current.classes).toContain('ds-elevation-flat');
  });

  it('reflects the chosen padding', () => {
    expect(renderModel({padding: 'sm'}).result.current.classes).toContain('ds-padding-sm');
  });

  it('adds ds-interactive only when interactive is true', () => {
    expect(renderModel({interactive: true}).result.current.classes).toContain('ds-interactive');
    expect(renderModel().result.current.classes).not.toContain('ds-interactive');
  });

  it('tabIndex is 0 when interactive and undefined otherwise', () => {
    expect(renderModel({interactive: true}).result.current.tabIndex).toBe(0);
    expect(renderModel().result.current.tabIndex).toBeUndefined();
  });

  it('appends a passed className', () => {
    expect(renderModel({className: 'extra'}).result.current.classes).toContain('extra');
  });
});

describe('regionClasses', () => {
  it('returns the base class when no className is passed', () => {
    expect(regionClasses('ds-card-header')).toBe('ds-card-header');
  });

  it('merges the base class with a passed className', () => {
    expect(regionClasses('ds-card-body', 'extra')).toBe('ds-card-body extra');
  });
});
