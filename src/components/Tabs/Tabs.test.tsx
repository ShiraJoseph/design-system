import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { Tabs } from './Tabs';

const tabs = [
  {id: 'a', label: 'First', content: <p>First panel</p>},
  {id: 'b', label: 'Second', content: <p>Second panel</p>},
  {id: 'c', label: 'Third', content: <p>Third panel</p>},
];

const renderTabs = (initial = 'a', orientation: 'horizontal' | 'vertical' = 'horizontal') => {
  const onChange = vi.fn();
  const utils = render(
    <IntlProvider locale="en">
      <Tabs tabs={tabs} value={initial} onChange={onChange} orientation={orientation} aria-label="Sections"/>
    </IntlProvider>,
  );

  return {...utils, onChange};
};

describe('Tabs', () => {
  it('renders triggers with role="tab" and the active panel', () => {
    renderTabs('b');
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second panel');
  });

  it('calls onChange when a different trigger is clicked', async () => {
    const {onChange} = renderTabs('a');
    await userEvent.click(screen.getByRole('tab', {name: 'Third'}));
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('cycles focus with arrow keys (horizontal)', async () => {
    renderTabs('a', 'horizontal');
    const first = screen.getByRole('tab', {name: 'First'});
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', {name: 'Second'})).toHaveFocus();
  });
});
