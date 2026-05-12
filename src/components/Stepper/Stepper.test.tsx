import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../i18n';
import { type StepDescriptor, Stepper } from './Stepper';

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

const steps: StepDescriptor[] = [
  {label: 'Account', content: <p>Account panel</p>},
  {label: 'Profile', content: <p>Profile panel</p>},
  {label: 'Confirm', content: <p>Confirm panel</p>},
];

describe('Stepper', () => {
  it('renders all step labels', () => {
    renderWithIntl(<Stepper steps={steps} activeStep={0} aria-label="Setup"/>);
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('marks the active step with aria-current', () => {
    renderWithIntl(<Stepper steps={steps} activeStep={1} aria-label="Setup"/>);
    const active = screen.getByText('Profile').closest('li');
    expect(active).toHaveAttribute('aria-current', 'step');
  });

  it('renders only the active step panel', () => {
    renderWithIntl(<Stepper steps={steps} activeStep={2} aria-label="Setup"/>);
    expect(screen.getByText('Confirm panel')).toBeInTheDocument();
    expect(screen.queryByText('Account panel')).not.toBeInTheDocument();
  });

  it('uses the localized default aria-label when one is not provided', () => {
    const {container} = renderWithIntl(<Stepper steps={steps} activeStep={0}/>);
    const nav = container.querySelector('nav');
    expect(nav?.getAttribute('aria-label')?.length ?? 0).toBeGreaterThan(0);
  });

  it('uses the provided aria-label when given', () => {
    const {container} = renderWithIntl(
      <Stepper steps={steps} activeStep={0} aria-label="Checkout"/>,
    );
    expect(container.querySelector('nav')).toHaveAttribute('aria-label', 'Checkout');
  });

  it('marks step status via data-status (complete / current / upcoming)', () => {
    const {container} = renderWithIntl(<Stepper steps={steps} activeStep={1}/>);
    const stepNodes = container.querySelectorAll('.ds-step');
    expect(stepNodes[0]).toHaveAttribute('data-status', 'complete');
    expect(stepNodes[1]).toHaveAttribute('data-status', 'current');
    expect(stepNodes[2]).toHaveAttribute('data-status', 'upcoming');
  });

  it('makes step indicators clickable when onStepChange is provided', async () => {
    const onStepChange = vi.fn();
    renderWithIntl(
      <Stepper steps={steps} activeStep={0} onStepChange={onStepChange} aria-label="Setup"/>,
    );
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[2]);
    expect(onStepChange).toHaveBeenCalledWith(2);
  });

  it('renders indicators as non-button elements when not interactive', () => {
    renderWithIntl(<Stepper steps={steps} activeStep={0}/>);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('shows the completion mark only when on the last step', () => {
    const {container, rerender} = renderWithIntl(<Stepper steps={steps} activeStep={0}/>);
    expect(container.querySelector('.ds-completion-mark')).toHaveAttribute(
      'data-visible',
      'false',
    );
    rerender(
      <IntlProvider locale="en">
        <Stepper steps={steps} activeStep={2}/>
      </IntlProvider>,
    );
    expect(container.querySelector('.ds-completion-mark')).toHaveAttribute(
      'data-visible',
      'true',
    );
  });

  it('fills the trailing connector only when isComplete returns true', () => {
    const {container, rerender} = renderWithIntl(<Stepper steps={steps} activeStep={2}/>);
    expect(container.querySelector('.ds-trailing-connector')).toHaveAttribute(
      'data-status',
      'upcoming',
    );
    rerender(
      <IntlProvider locale="en">
        <Stepper steps={steps} activeStep={2} isComplete={() => true}/>
      </IntlProvider>,
    );
    expect(container.querySelector('.ds-trailing-connector')).toHaveAttribute(
      'data-status',
      'complete',
    );
  });
});
