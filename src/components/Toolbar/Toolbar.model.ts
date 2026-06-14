import { type KeyboardEvent, type Ref, useLayoutEffect, useRef, useState } from 'react';
import { assignRefs } from '../../utils/assignRefs';

export type ToolbarOrientation = 'horizontal' | 'vertical';

interface UseToolbarModelArgs {
  orientation: ToolbarOrientation;
  className?: string;
  ref?: Ref<HTMLDivElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

interface UseToolbarModelResult {
  classes: string;
  /** Attach to the toolbar container; merges the internal ref with any external ref so the hook can observe and drive focus. */
  setMergedRef: (node: HTMLDivElement | null) => void;
  /** Composes the consumer's `onKeyDown` with the roving-tabindex navigation. */
  onContainerKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * Roving-tabindex for a toolbar of `<button>` children; a MutationObserver keeps the tabindex
 * correct when items are added, removed, or toggled disabled at runtime. Also derives the
 * container class list and merges the consumer ref.
 */
export const useToolbarModel = ({
  orientation,
  className,
  ref,
  onKeyDown,
}: UseToolbarModelArgs): UseToolbarModelResult => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  const getEnabledItems = (): HTMLButtonElement[] => {
    const node = containerRef.current;
    if (!node) return [];

    return Array.from(node.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
  };

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const sync = () => {
      const items = getEnabledItems();
      if (items.length === 0) return;
      if (focusIndex > items.length - 1) {
        setFocusIndex(items.length - 1);

        return;
      }

      items.forEach((item, index) => {
        item.tabIndex = index === focusIndex ? 0 : -1;
      });
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(node, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled'],
    });

    return () => observer.disconnect();
  }, [focusIndex]);

  const setMergedRef = (node: HTMLDivElement | null) => assignRefs(node, containerRef, ref);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = getEnabledItems();
    if (items.length === 0) return;
    const currentIndex = Math.min(focusIndex, items.length - 1);
    const isHorizontal = orientation === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    let target: number;

    if (event.key === nextKey) {
      target = (currentIndex + 1) % items.length;
    } else if (event.key === prevKey) {
      target = (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      target = 0;
    } else if (event.key === 'End') {
      target = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setFocusIndex(target);
    items[target]?.focus();
  };

  const onContainerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    handleKeyDown(event);
  };

  const classes = ['ds-toolbar', `ds-orientation-${orientation}`, className]
    .filter(Boolean)
    .join(' ');

  return {classes, setMergedRef, onContainerKeyDown};
};
