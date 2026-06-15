import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { IntlProvider } from '../../i18n';
import { useTextInputModel } from './TextInput.model';

const wrapper = ({children}: { children: React.ReactNode }) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);

const baseArgs: Parameters<typeof useTextInputModel>[0] = {
  size: 'md',
  required: false,
  visuallyHideLabel: false,
};

const renderModel = (overrides: Partial<Parameters<typeof useTextInputModel>[0]> = {}) =>
  renderHook(() => useTextInputModel({...baseArgs, ...overrides}), {wrapper});

describe('useTextInputModel', () => {
  it('uses the provided id when given', () => {
    expect(renderModel({id: 'email'}).result.current.inputId).toBe('email');
  });

  it('generates a stable ds-input-* id when none is provided', () => {
    expect(renderModel().result.current.inputId).toMatch(/^ds-input-/);
  });

  it('builds a helperId tied to the input when helperText is set', () => {
    expect(
      renderModel({id: 'e', helperText: 'we never share'}).result.current.helperId,
    ).toBe('e-helper');
  });

  it('omits helperId when helperText is empty', () => {
    expect(renderModel({id: 'e'}).result.current.helperId).toBeUndefined();
  });

  it('builds an errorId tied to the input when error is set', () => {
    expect(renderModel({id: 'e', error: 'required'}).result.current.errorId).toBe('e-error');
  });

  it('omits errorId when error is empty', () => {
    expect(renderModel({id: 'e'}).result.current.errorId).toBeUndefined();
  });

  it('merges helperId, errorId, and an external aria-describedby into describedBy', () => {
    const {result} = renderModel({
      id: 'e',
      helperText: 'h',
      error: 'err',
      ariaDescribedBy: 'consumer-id',
    });
    expect(result.current.describedBy).toBe('e-helper e-error consumer-id');
  });

  it('returns describedBy=undefined when there are no parts', () => {
    expect(renderModel({id: 'e'}).result.current.describedBy).toBeUndefined();
  });

  it('exposes the intl shape so the component can render localized strings', () => {
    expect(typeof renderModel({id: 'e'}).result.current.intl.formatMessage).toBe('function');
  });

  it('builds the wrapper class list from size, error, disabled, and className', () => {
    const {result} = renderModel({
      size: 'lg',
      error: 'oops',
      disabled: true,
      className: 'extra',
    });
    expect(result.current.wrapperClasses).toContain('ds-text-input');
    expect(result.current.wrapperClasses).toContain('ds-size-lg');
    expect(result.current.wrapperClasses).toContain('ds-errored');
    expect(result.current.wrapperClasses).toContain('ds-disabled');
    expect(result.current.wrapperClasses).toContain('extra');
  });

  it('omits ds-errored and ds-disabled when neither error nor disabled is set', () => {
    const {result} = renderModel();
    expect(result.current.wrapperClasses).not.toContain('ds-errored');
    expect(result.current.wrapperClasses).not.toContain('ds-disabled');
  });

  it('labelClass hides the label visually only when visuallyHideLabel is true', () => {
    expect(renderModel({visuallyHideLabel: true}).result.current.labelClass).toBe(
      'ds-visually-hidden',
    );
    expect(renderModel().result.current.labelClass).toBe('ds-label');
  });

  it('hasError and ariaInvalid track whether an error is present', () => {
    const errored = renderModel({error: 'bad'}).result.current;
    expect(errored.hasError).toBe(true);
    expect(errored.ariaInvalid).toBe(true);
    const clean = renderModel().result.current;
    expect(clean.hasError).toBe(false);
    expect(clean.ariaInvalid).toBeUndefined();
  });

  it('ariaRequired is true only when required is set', () => {
    expect(renderModel({required: true}).result.current.ariaRequired).toBe(true);
    expect(renderModel().result.current.ariaRequired).toBeUndefined();
  });

  it('showHelperText is true only when helperText is set and there is no error', () => {
    expect(renderModel({helperText: 'h'}).result.current.showHelperText).toBe(true);
    expect(renderModel({helperText: 'h', error: 'e'}).result.current.showHelperText).toBe(false);
    expect(renderModel().result.current.showHelperText).toBe(false);
  });
});
