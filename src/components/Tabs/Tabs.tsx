import type { HTMLAttributes, Ref } from 'react';
import { type TabDescriptor, type TabsOrientation, useTabsModel } from './Tabs.Model';
import './Tabs.css';

export type { TabDescriptor, TabsOrientation } from './Tabs.Model';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Optional ref to the root element. */
  ref?: Ref<HTMLDivElement>;
  /** Active tab id. Controlled. */
  value: string;
  /** Called when the user activates a different tab. */
  onChange: (id: string) => void;
  /** Tab definitions. */
  tabs: TabDescriptor[];
  /** Layout direction. Defaults to `'horizontal'`. */
  orientation?: TabsOrientation;
  /** Optional accessible label for the tab list (`role="tablist"`). */
  'aria-label'?: string;
}

/**
 * Tabbed content navigation. A single ink bar slides between
 * triggers using the shared `--ds-motion-bounce` multi-stop linear()
 * timing function (slide, then bounce back toward start, then settle).
 * Panel content does not animate; new content just appears.
 *
 * Tab triggers stay the SAME font-weight in active and inactive
 * states so the trigger widths don't shift when selection changes.
 * Active state is conveyed by color (and the moving ink bar).
 *
 * Accessibility:
 * - Tab triggers have `role="tab"`, the list has `role="tablist"`,
 *   panels have `role="tabpanel"` with matching `aria-labelledby`.
 * - Arrow keys cycle focus through triggers; Home/End jump to first/
 *   last; Enter or Space activates the focused trigger.
 */
export const Tabs = ({
  ref,
  value,
  onChange,
  tabs,
  orientation = 'horizontal',
  'aria-label': ariaLabel,
  className,
  ...rest
}: TabsProps) => {
  const {baseId, setTriggerRef, inkBarStyle, handleKeyDown} = useTabsModel({
    value,
    onChange,
    tabs,
    orientation,
  });

  const containerClasses = ['ds-tabs', `ds-orientation-${orientation}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      <div role="tablist" aria-label={ariaLabel} aria-orientation={orientation} className="ds-list">
        {tabs.map((tab, index) => {
          const isActive = tab.id === value;

          return (
            <button
              key={tab.id}
              ref={setTriggerRef(tab.id)}
              id={`${baseId}-trigger-${tab.id}`}
              role="tab"
              type="button"
              className={['ds-trigger', isActive && 'ds-trigger-active'].filter(Boolean).join(' ')}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
        <span className="ds-ink-bar" style={inkBarStyle} aria-hidden="true"/>
      </div>
      {tabs.map((tab) => {
        const isActive = tab.id === value;
        if (!isActive) return null;

        return (
          <div
            key={tab.id}
            id={`${baseId}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-trigger-${tab.id}`}
            tabIndex={0}
            className="ds-panel"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};
