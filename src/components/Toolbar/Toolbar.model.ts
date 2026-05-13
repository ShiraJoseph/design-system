import { type KeyboardEvent, type RefObject, useEffect, useRef, useState } from 'react';

export type ToolbarOrientation = 'horizontal' | 'vertical';

interface UseToolbarModelArgs {
  orientation: ToolbarOrientation;
}

interface UseToolbarModelResult {
  /** Internal ref the consumer must attach to the toolbar container. */
  containerRef: RefObject<HTMLDivElement | null>;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * Implements the roving-tabindex pattern for a toolbar of `<button>`
 * children. Exactly one enabled item is tabbable at a time; Arrow
 * keys cycle, Home/End jump to ends, disabled items are skipped, and
 * a MutationObserver keeps the tabindex correct when items get added,
 * removed, or toggled disabled at runtime. The consumer mounts the
 * returned `containerRef` on the toolbar's root element so the hook
 * can observe and drive focus.
 */
export const useToolbarModel = ({orientation}: UseToolbarModelArgs): UseToolbarModelResult => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  const getEnabledItems = (): HTMLButtonElement[] => {
    const node = containerRef.current;
    if (!node) return [];

    return Array.from(node.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
  };

  useEffect(() => {
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

  return {containerRef, handleKeyDown};
};
