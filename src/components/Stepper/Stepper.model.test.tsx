import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { IntlProvider } from '../../i18n';
import { type StepDescriptor, useStepperModel } from './Stepper.model';

const wrapper = ({children}: { children: React.ReactNode }) => (
  <IntlProvider locale={'en'}>{children}</IntlProvider>
);

const steps: StepDescriptor[] = [
  {label: 'One', content: 'Panel 1'},
  {label: 'Two', content: 'Panel 2'},
  {label: 'Three', content: 'Panel 3'},
];

const render = (args: Partial<Parameters<typeof useStepperModel>[0]> = {}) =>
  renderHook(
    () =>
      useStepperModel({
        steps,
        activeStep: 0,
        orientation: 'horizontal',
        ariaLabelProp: 'x',
        ...args,
      }),
    {wrapper},
  );

describe('useStepperModel', () => {
  it('falls back to the localized stepper.progress label when ariaLabelProp is undefined', () => {
    const {result} = render({ariaLabelProp: undefined});
    expect(result.current.ariaLabel.length).toBeGreaterThan(0);
  });

  it('uses the provided ariaLabelProp when one is given', () => {
    const {result} = render({ariaLabelProp: 'Checkout'});
    expect(result.current.ariaLabel).toBe('Checkout');
  });

  it('generates a baseId prefixed with ds-stepper-', () => {
    const {result} = render();
    expect(result.current.baseId).toMatch(/^ds-stepper-/);
  });

  it('builds container classes from the orientation', () => {
    const {result} = render({orientation: 'vertical'});
    expect(result.current.classes).toBe('ds-stepper ds-orientation-vertical');
  });

  it('appends a consumer-passed className to the container classes', () => {
    const {result} = render({className: 'extra'});
    expect(result.current.classes).toBe('ds-stepper ds-orientation-horizontal extra');
  });

  it('sets isInteractive=true when an onStepChange handler is supplied', () => {
    const {result} = render({onStepChange: vi.fn()});
    expect(result.current.isInteractive).toBe(true);
  });

  it('sets isInteractive=false when onStepChange is omitted', () => {
    const {result} = render();
    expect(result.current.isInteractive).toBe(false);
  });

  it('reports isOnLastStep correctly for middle vs last index', () => {
    expect(render({activeStep: 1}).result.current.isOnLastStep).toBe(false);
    expect(render({activeStep: 2}).result.current.isOnLastStep).toBe(true);
  });

  it('treats isComplete returning true as completed', () => {
    const {result} = render({activeStep: 2, isComplete: () => true});
    expect(result.current.completed).toBe(true);
  });

  it('treats a missing or false isComplete as not completed', () => {
    expect(render({activeStep: 2}).result.current.completed).toBe(false);
    expect(render({activeStep: 2, isComplete: () => false}).result.current.completed).toBe(false);
  });

  it('exposes the active step content', () => {
    const {result} = render({activeStep: 1});
    expect(result.current.activeContent).toBe('Panel 2');
  });

  it('returns activeContent=undefined when steps[activeStep] has no content', () => {
    const sparseSteps: StepDescriptor[] = [{label: 'no panel'}];
    const {result} = render({steps: sparseSteps, activeStep: 0});
    expect(result.current.activeContent).toBeUndefined();
  });

  it('marks earlier steps complete, the active step current, and later steps upcoming', () => {
    const {result} = render({activeStep: 1});
    expect(result.current.stepViews.map((view) => view.status)).toEqual([
      'complete',
      'current',
      'upcoming',
    ]);
  });

  it('sets ariaCurrent="step" only on the active step', () => {
    const {result} = render({activeStep: 1});
    expect(result.current.stepViews.map((view) => view.ariaCurrent)).toEqual([
      undefined,
      'step',
      undefined,
    ]);
  });

  it('builds an indicatorLabel from the 1-based index and the string label', () => {
    const {result} = render();
    expect(result.current.stepViews[1].indicatorLabel).toBe('Step 2: Two');
  });

  it('omits the label text in indicatorLabel when the label is not a string', () => {
    const nodeLabelSteps: StepDescriptor[] = [{label: <em>One</em>}];
    const {result} = render({steps: nodeLabelSteps});
    expect(result.current.stepViews[0].indicatorLabel).toBe('Step 1: ');
  });

  it('flags hasConnector for every step except the last', () => {
    const {result} = render({activeStep: 1});
    expect(result.current.stepViews.map((view) => view.hasConnector)).toEqual([true, true, false]);
  });

  it('marks the connector after a completed step as complete', () => {
    const {result} = render({activeStep: 2});
    expect(result.current.stepViews.map((view) => view.connectorComplete)).toEqual([
      true,
      true,
      false,
    ]);
  });

  it('expands only the connector immediately after the active step', () => {
    const {result} = render({activeStep: 1});
    expect(result.current.stepViews.map((view) => view.connectorExpanded)).toEqual([
      false,
      true,
      false,
    ]);
  });
});
