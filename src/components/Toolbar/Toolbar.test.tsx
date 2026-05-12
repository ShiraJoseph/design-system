import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from './Toolbar';
import { ToolbarItem } from './ToolbarItem';

describe('Toolbar', () => {
  it('renders with role="toolbar" and the required aria-label', () => {
    render(
      <Toolbar aria-label="Format">
        <ToolbarItem id="b">B</ToolbarItem>
      </Toolbar>,
    );
    expect(screen.getByRole('toolbar', {name: 'Format'})).toBeInTheDocument();
  });

  it('applies the orientation modifier class and aria-orientation', () => {
    const {container, rerender} = render(
      <Toolbar aria-label="t">
        <ToolbarItem id="a">A</ToolbarItem>
      </Toolbar>,
    );
    expect(container.querySelector('.ds-toolbar')?.className).toMatch(/ds-orientation-horizontal/);
    rerender(
      <Toolbar aria-label="t" orientation="vertical">
        <ToolbarItem id="a">A</ToolbarItem>
      </Toolbar>,
    );
    expect(container.querySelector('.ds-toolbar')?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('exposes the selectedItemId via data-selected-item', () => {
    const {container} = render(
      <Toolbar aria-label="t" selectedItemId="b">
        <ToolbarItem id="a">A</ToolbarItem>
        <ToolbarItem id="b">B</ToolbarItem>
      </Toolbar>,
    );
    expect(container.querySelector('.ds-toolbar')).toHaveAttribute('data-selected-item', 'b');
  });

  it('puts exactly one enabled item in the tab order via roving tabindex', () => {
    render(
      <Toolbar aria-label="t">
        <ToolbarItem id="a">A</ToolbarItem>
        <ToolbarItem id="b">B</ToolbarItem>
        <ToolbarItem id="c">C</ToolbarItem>
      </Toolbar>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].tabIndex).toBe(0);
    expect(buttons[1].tabIndex).toBe(-1);
    expect(buttons[2].tabIndex).toBe(-1);
  });

  it('ArrowRight cycles focus to the next enabled item (horizontal)', async () => {
    render(
      <Toolbar aria-label="t">
        <ToolbarItem id="a">A</ToolbarItem>
        <ToolbarItem id="b">B</ToolbarItem>
        <ToolbarItem id="c">C</ToolbarItem>
      </Toolbar>,
    );
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(buttons[1]).toHaveFocus();
  });

  it('ArrowDown cycles focus when the toolbar is vertical', async () => {
    render(
      <Toolbar aria-label="t" orientation="vertical">
        <ToolbarItem id="a">A</ToolbarItem>
        <ToolbarItem id="b">B</ToolbarItem>
      </Toolbar>,
    );
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(buttons[1]).toHaveFocus();
  });

  it('Home and End jump focus to the first / last enabled items', async () => {
    render(
      <Toolbar aria-label="t">
        <ToolbarItem id="a">A</ToolbarItem>
        <ToolbarItem id="b">B</ToolbarItem>
        <ToolbarItem id="c">C</ToolbarItem>
      </Toolbar>,
    );
    const buttons = screen.getAllByRole('button');
    buttons[1].focus();
    await userEvent.keyboard('{End}');
    expect(buttons[2]).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(buttons[0]).toHaveFocus();
  });

  it('forwards a consumer onKeyDown alongside the roving-tabindex handling', async () => {
    const onKeyDown = vi.fn();
    render(
      <Toolbar aria-label="t" onKeyDown={onKeyDown}>
        <ToolbarItem id="a">A</ToolbarItem>
        <ToolbarItem id="b">B</ToolbarItem>
      </Toolbar>,
    );
    screen.getAllByRole('button')[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onKeyDown).toHaveBeenCalled();
  });
});

describe('ToolbarItem', () => {
  it('invokes onSelect and onClick when clicked', async () => {
    const onSelect = vi.fn();
    const onClick = vi.fn();
    render(
      <Toolbar aria-label="t">
        <ToolbarItem id="a" onSelect={onSelect} onClick={onClick}>
          A
        </ToolbarItem>
      </Toolbar>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalled();
  });

  it('reflects disabled prop on the underlying button', () => {
    render(
      <Toolbar aria-label="t">
        <ToolbarItem id="a" disabled>
          A
        </ToolbarItem>
      </Toolbar>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders its children as the item label', () => {
    render(
      <Toolbar aria-label="t">
        <ToolbarItem id="a">label text</ToolbarItem>
      </Toolbar>,
    );
    expect(screen.getByText('label text')).toBeInTheDocument();
  });
});
