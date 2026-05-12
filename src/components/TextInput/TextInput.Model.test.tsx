import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { IntlProvider } from '../../i18n';
import { useTextInputModel } from './TextInput.Model';

const wrapper = ({children}: { children: React.ReactNode }) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);

describe('useTextInputModel', () => {
  it('uses the provided id when given', () => {
    const {result} = renderHook(() => useTextInputModel({id: 'email'}), {wrapper});
    expect(result.current.inputId).toBe('email');
  });

  it('generates a stable ds-input-* id when none is provided', () => {
    const {result} = renderHook(() => useTextInputModel({}), {wrapper});
    expect(result.current.inputId).toMatch(/^ds-input-/);
  });

  it('builds a helperId tied to the input when helperText is set', () => {
    const {result} = renderHook(
      () => useTextInputModel({id: 'e', helperText: 'we never share'}),
      {wrapper},
    );
    expect(result.current.helperId).toBe('e-helper');
  });

  it('omits helperId when helperText is empty', () => {
    const {result} = renderHook(() => useTextInputModel({id: 'e'}), {wrapper});
    expect(result.current.helperId).toBeUndefined();
  });

  it('builds an errorId tied to the input when error is set', () => {
    const {result} = renderHook(
      () => useTextInputModel({id: 'e', error: 'required'}),
      {wrapper},
    );
    expect(result.current.errorId).toBe('e-error');
  });

  it('omits errorId when error is empty', () => {
    const {result} = renderHook(() => useTextInputModel({id: 'e'}), {wrapper});
    expect(result.current.errorId).toBeUndefined();
  });

  it('merges helperId, errorId, and an external aria-describedby into describedBy', () => {
    const {result} = renderHook(
      () =>
        useTextInputModel({
          id: 'e',
          helperText: 'h',
          error: 'err',
          ariaDescribedBy: 'consumer-id',
        }),
      {wrapper},
    );
    expect(result.current.describedBy).toBe('e-helper e-error consumer-id');
  });

  it('returns describedBy=undefined when there are no parts', () => {
    const {result} = renderHook(() => useTextInputModel({id: 'e'}), {wrapper});
    expect(result.current.describedBy).toBeUndefined();
  });

  it('exposes the intl shape so the component can render localized strings', () => {
    const {result} = renderHook(() => useTextInputModel({id: 'e'}), {wrapper});
    expect(typeof result.current.intl.formatMessage).toBe('function');
  });
});
