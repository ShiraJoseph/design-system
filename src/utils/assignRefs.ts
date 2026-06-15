import { type Ref } from 'react';

/** Point several refs at one node — a component's own internal ref plus the consumer's forwarded `ref`. Call it from inside a ref callback, not during render. */
export const assignRefs = <T>(node: T | null, ...refs: Array<Ref<T> | undefined>): void => {
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  });
};
