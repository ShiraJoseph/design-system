import { type CSSProperties, type KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState, } from 'react';

export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabDescriptor {
  /** Used as React key, controlled value, and panel id. */
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface UseTabsModelArgs {
  value: string;
  onChange: (id: string) => void;
  tabs: TabDescriptor[];
  orientation: TabsOrientation;
  className?: string;
}

interface UseTabsModelResult {
  baseId: string;
  classes: string;
  triggerClasses: (isActive: boolean) => string;
  setTriggerRef: (id: string) => (node: HTMLButtonElement | null) => void;
  inkBarStyle: CSSProperties;
  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
}

const computeInkBarStyle = (node: HTMLButtonElement, orientation: TabsOrientation): CSSProperties => {
  if (orientation === 'horizontal') {
    return {
      opacity: 1,
      transform: `translateX(${node.offsetLeft}px)`,
      width: `${node.offsetWidth}px`,
    };
  }

  return {
    opacity: 1,
    transform: `translateY(${node.offsetTop}px)`,
    height: `${node.offsetHeight}px`,
  };
};

/** Drives the Tabs UI: ink-bar position tracking, keyboard navigation, and stable per-tab DOM ids. */
export const useTabsModel = ({
  value,
  onChange,
  tabs,
  orientation,
  className,
}: UseTabsModelArgs): UseTabsModelResult => {
  const reactId = useId();
  const baseId = `ds-tabs-${reactId}`;
  const classes = ['ds-tabs', `ds-orientation-${orientation}`, className].filter(Boolean).join(' ');
  const triggerClasses = (isActive: boolean) =>
    ['ds-trigger', isActive && 'ds-trigger-active'].filter(Boolean).join(' ');
  const triggerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const [inkBarStyle, setInkBarStyle] = useState<CSSProperties>({opacity: 0});

  const setTriggerRef = (id: string) => (node: HTMLButtonElement | null) => {
    if (node) {
      triggerRefs.current.set(id, node);
    } else {
      triggerRefs.current.delete(id);
    }
  };

  useLayoutEffect(() => {
    const node = triggerRefs.current.get(value);
    if (!node) return;
    setInkBarStyle(computeInkBarStyle(node, orientation));
  }, [value, orientation, tabs]);

  useEffect(() => {
    const remeasure = () => {
      const node = triggerRefs.current.get(value);
      if (!node) return;
      setInkBarStyle(computeInkBarStyle(node, orientation));
    };
    /* The initial useLayoutEffect can measure before web fonts load, sizing the ink bar to the
       fallback font; remeasure once document.fonts.ready resolves so it tracks final layout. */
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      void document.fonts.ready.then(remeasure);
    }
    window.addEventListener('resize', remeasure);

    return () => window.removeEventListener('resize', remeasure);
  }, [value, orientation]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    const currentEnabledIndex = enabledTabs.findIndex((tab) => tab.id === tabs[index].id);
    const isHorizontal = orientation === 'horizontal';
    const next = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prev = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const navKeys = [next, prev, 'Home', 'End'];

    if (!navKeys.includes(event.key)) return;
    event.preventDefault();

    let targetIndex = currentEnabledIndex;

    if (event.key === next) {
      targetIndex = (currentEnabledIndex + 1) % enabledTabs.length;
    } else if (event.key === prev) {
      targetIndex = (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (event.key === 'Home') {
      targetIndex = 0;
    } else if (event.key === 'End') {
      targetIndex = enabledTabs.length - 1;
    }

    const targetTab = enabledTabs[targetIndex];
    if (!targetTab) return;
    onChange(targetTab.id);
    triggerRefs.current.get(targetTab.id)?.focus();
  };

  return {baseId, classes, triggerClasses, setTriggerRef, inkBarStyle, handleKeyDown};
};
