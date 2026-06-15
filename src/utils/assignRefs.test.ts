import { describe, expect, it, vi } from 'vitest';
import { assignRefs } from './assignRefs';

describe('assignRefs', () => {
  it('calls a function ref with the node', () => {
    const fnRef = vi.fn();
    const node = document.createElement('div');
    assignRefs(node, fnRef);
    expect(fnRef).toHaveBeenCalledWith(node);
  });

  it('writes the node to an object ref', () => {
    const objectRef = {current: null as HTMLDivElement | null};
    const node = document.createElement('div');
    assignRefs(node, objectRef);
    expect(objectRef.current).toBe(node);
  });

  it('points several refs at one node at once', () => {
    const fnRef = vi.fn();
    const objectRef = {current: null as HTMLDivElement | null};
    const node = document.createElement('div');
    assignRefs(node, fnRef, objectRef);
    expect(fnRef).toHaveBeenCalledWith(node);
    expect(objectRef.current).toBe(node);
  });

  it('skips null and undefined refs without throwing', () => {
    const objectRef = {current: null as HTMLDivElement | null};
    const node = document.createElement('div');
    expect(() => assignRefs(node, null, undefined, objectRef)).not.toThrow();
    expect(objectRef.current).toBe(node);
  });
});
