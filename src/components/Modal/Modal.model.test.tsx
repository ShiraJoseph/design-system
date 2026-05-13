import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { IntlProvider } from '../../i18n/IntlProvider';
import { useModalModel } from './Modal.model';

const wrapper = ({children}: { children: React.ReactNode }) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);

const attachDialog = (dialogRef: { current: HTMLDialogElement | null }) => {
  const dialog = document.createElement('dialog');
  document.body.appendChild(dialog);
  dialog.showModal = vi.fn().mockImplementation(function (this: HTMLDialogElement) {
    Object.defineProperty(this, 'open', {configurable: true, value: true});
  });
  dialog.close = vi.fn().mockImplementation(function (this: HTMLDialogElement) {
    Object.defineProperty(this, 'open', {configurable: true, value: false});
  });
  dialogRef.current = dialog;

  return dialog;
};

describe('useModalModel', () => {
  it('generates ids and resolves the close label from intl by default', () => {
    const {result} = renderHook(
      () => useModalModel({open: false, onClose: vi.fn(), dismissOnBackdropClick: true}),
      {wrapper},
    );
    expect(result.current.titleId).toMatch(/^ds-modal-title-/);
    expect(typeof result.current.resolvedCloseLabel).toBe('string');
    expect(result.current.resolvedCloseLabel.length).toBeGreaterThan(0);
  });

  it('uses the consumer-supplied closeLabel when provided', () => {
    const {result} = renderHook(
      () =>
        useModalModel({
          open: false,
          onClose: vi.fn(),
          dismissOnBackdropClick: true,
          closeLabel: 'Dismiss',
        }),
      {wrapper},
    );
    expect(result.current.resolvedCloseLabel).toBe('Dismiss');
  });

  it('returns a descId tied to the modal when description is provided', () => {
    const {result} = renderHook(
      () =>
        useModalModel({
          open: false,
          onClose: vi.fn(),
          dismissOnBackdropClick: true,
          description: 'a sub-line',
        }),
      {wrapper},
    );
    expect(result.current.descId).toMatch(/^ds-modal-desc-/);
  });

  it('returns descId=undefined when no description is provided', () => {
    const {result} = renderHook(
      () => useModalModel({open: false, onClose: vi.fn(), dismissOnBackdropClick: true}),
      {wrapper},
    );
    expect(result.current.descId).toBeUndefined();
  });

  it('calls dialog.showModal when open transitions to true', () => {
    const {result, rerender} = renderHook(
      ({open}) => useModalModel({open, onClose: vi.fn(), dismissOnBackdropClick: true}),
      {wrapper, initialProps: {open: false}},
    );
    const dialog = attachDialog(result.current.dialogRef);
    rerender({open: true});
    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('calls dialog.close when open transitions back to false', () => {
    const {result, rerender} = renderHook(
      ({open}) => useModalModel({open, onClose: vi.fn(), dismissOnBackdropClick: true}),
      {wrapper, initialProps: {open: false}},
    );
    const dialog = attachDialog(result.current.dialogRef);
    rerender({open: true});
    rerender({open: false});
    expect(dialog.close).toHaveBeenCalled();
  });

  it('handleBackdropClick calls onClose when the click target IS the dialog itself', () => {
    const onClose = vi.fn();
    const {result} = renderHook(
      () => useModalModel({open: true, onClose, dismissOnBackdropClick: true}),
      {wrapper},
    );
    const dialog = attachDialog(result.current.dialogRef);
    act(() => result.current.handleBackdropClick({target: dialog} as never));
    expect(onClose).toHaveBeenCalled();
  });

  it('handleBackdropClick is a no-op when the click is inside the card', () => {
    const onClose = vi.fn();
    const {result} = renderHook(
      () => useModalModel({open: true, onClose, dismissOnBackdropClick: true}),
      {wrapper},
    );
    attachDialog(result.current.dialogRef);
    const child = document.createElement('div');
    act(() => result.current.handleBackdropClick({target: child} as never));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('handleBackdropClick is a no-op when dismissOnBackdropClick is false', () => {
    const onClose = vi.fn();
    const {result} = renderHook(
      () => useModalModel({open: true, onClose, dismissOnBackdropClick: false}),
      {wrapper},
    );
    const dialog = attachDialog(result.current.dialogRef);
    act(() => result.current.handleBackdropClick({target: dialog} as never));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('intercepts the dialog cancel event so the parent onClose is the source of truth', () => {
    const firstClose = vi.fn();
    const finalClose = vi.fn();
    const {result, rerender} = renderHook(
      ({onClose}) => useModalModel({open: true, onClose, dismissOnBackdropClick: true}),
      {wrapper, initialProps: {onClose: firstClose}},
    );
    const dialog = attachDialog(result.current.dialogRef);
    /* rerender with a fresh onClose so the cancel-listener effect re-runs
       after the test wired up the dialog ref. */
    rerender({onClose: finalClose});
    dialog.dispatchEvent(new Event('cancel', {cancelable: true}));
    expect(finalClose).toHaveBeenCalled();
  });
});
