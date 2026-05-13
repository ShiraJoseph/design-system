import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { IntlProvider } from '../../i18n';
import { useStepperModel } from './Stepper.model';
import type { StepDescriptor } from './Stepper';

const wrapper = ({children}: { children: React.ReactNode }) => (
  <IntlProvider locale="en">{children}</IntlProvider>
);

const steps: StepDescriptor[] = [
  {label: 'One', content: 'Panel 1'},
  {label: 'Two', content: 'Panel 2'},
  {label: 'Three', content: 'Panel 3'},
];

describe('useStepperModel', () => {
  it('falls back to the localized stepper.progress label when ariaLabelProp is undefined', () => {
    const {result} = renderHook(
      () => useStepperModel({steps, activeStep: 0, ariaLabelProp: undefined}),
      {wrapper},
    );
    expect(result.current.ariaLabel.length).toBeGreaterThan(0);
  });

  it('uses the provided ariaLabelProp when one is given', () => {
    const {result} = renderHook(
      () => useStepperModel({steps, activeStep: 0, ariaLabelProp: 'Checkout'}),
      {wrapper},
    );
    expect(result.current.ariaLabel).toBe('Checkout');
  });

  it('generates a baseId prefixed with ds-stepper-', () => {
    const {result} = renderHook(
      () => useStepperModel({steps, activeStep: 0, ariaLabelProp: 'x'}),
      {wrapper},
    );
    expect(result.current.baseId).toMatch(/^ds-stepper-/);
  });

  it('sets isInteractive=true when an onStepChange handler is supplied', () => {
    const {result} = renderHook(
      () =>
        useStepperModel({
          steps,
          activeStep: 0,
          ariaLabelProp: 'x',
          onStepChange: vi.fn(),
        }),
      {wrapper},
    );
    expect(result.current.isInteractive).toBe(true);
  });

  it('sets isInteractive=false when onStepChange is omitted', () => {
    const {result} = renderHook(
      () => useStepperModel({steps, activeStep: 0, ariaLabelProp: 'x'}),
      {wrapper},
    );
    expect(result.current.isInteractive).toBe(false);
  });

  it('reports isOnLastStep correctly for middle vs last index', () => {
    const middle = renderHook(
      () => useStepperModel({steps, activeStep: 1, ariaLabelProp: 'x'}),
      {wrapper},
    );
    expect(middle.result.current.isOnLastStep).toBe(false);

    const last = renderHook(
      () => useStepperModel({steps, activeStep: 2, ariaLabelProp: 'x'}),
      {wrapper},
    );
    expect(last.result.current.isOnLastStep).toBe(true);
  });

  it('treats isComplete returning true as completed', () => {
    const {result} = renderHook(
      () =>
        useStepperModel({
          steps,
          activeStep: 2,
          ariaLabelProp: 'x',
          isComplete: () => true,
        }),
      {wrapper},
    );
    expect(result.current.completed).toBe(true);
  });

  it('treats a missing or false isComplete as not completed', () => {
    const missing = renderHook(
      () => useStepperModel({steps, activeStep: 2, ariaLabelProp: 'x'}),
      {wrapper},
    );
    expect(missing.result.current.completed).toBe(false);

    const falseReturn = renderHook(
      () =>
        useStepperModel({
          steps,
          activeStep: 2,
          ariaLabelProp: 'x',
          isComplete: () => false,
        }),
      {wrapper},
    );
    expect(falseReturn.result.current.completed).toBe(false);
  });

  it('exposes the active step content', () => {
    const {result} = renderHook(
      () => useStepperModel({steps, activeStep: 1, ariaLabelProp: 'x'}),
      {wrapper},
    );
    expect(result.current.activeContent).toBe('Panel 2');
  });

  it('returns activeContent=undefined when steps[activeStep] has no content', () => {
    const sparseSteps: StepDescriptor[] = [{label: 'no panel'}];
    const {result} = renderHook(
      () => useStepperModel({steps: sparseSteps, activeStep: 0, ariaLabelProp: 'x'}),
      {wrapper},
    );
    expect(result.current.activeContent).toBeUndefined();
  });

  it('marks earlier steps complete, the active step current, and later steps upcoming', () => {
    const {result} = renderHook(
      () => useStepperModel({steps, activeStep: 1, ariaLabelProp: 'x'}),
      {wrapper},
    );
    expect(result.current.stepStatuses).toEqual(['complete', 'current', 'upcoming']);
  });
});
