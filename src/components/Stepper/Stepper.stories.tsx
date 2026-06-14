import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Stepper } from './Stepper';
import { Button } from '../Button';

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {layout: 'padded'},
  argTypes: {
    orientation: {control: 'inline-radio', options: ['horizontal', 'vertical']},
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleSteps = [
  {
    label: 'Account',
    description: 'Email and password',
    content: <p>Provide your work email and a strong password to create your account.</p>,
  },
  {
    label: 'Profile',
    description: 'Tell us about yourself',
    content: <p>Add a display name and team to help collaborators recognize you.</p>,
  },
  {
    label: 'Confirm',
    description: 'Review and submit',
    content: <p>Double-check the details and confirm to finish setup.</p>,
  },
];

const StepperHarness = ({orientation}: { orientation: 'horizontal' | 'vertical' }) => {
  const [step, setStep] = useState(0);

  return (
    <div
      className={
        orientation === 'vertical'
          ? 'story-stepper-frame story-stepper-frame--vertical'
          : 'story-stepper-frame'
      }
    >
      <Stepper
        orientation={orientation}
        activeStep={step}
        steps={sampleSteps}
        onStepChange={setStep}
      />
      <div className="story-actions">
        <Button variant="secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={() => setStep(Math.min(sampleSteps.length - 1, step + 1))}
                disabled={step === sampleSteps.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
};

export const Horizontal: Story = {
  args: {orientation: 'horizontal', activeStep: 0, steps: sampleSteps},
  render: () => <StepperHarness orientation="horizontal"/>,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Account')).toBeInTheDocument();
    await expect(canvas.getByText('Profile')).toBeInTheDocument();
    await expect(canvas.getByText('Confirm')).toBeInTheDocument();
    const nav = canvasElement.querySelector('nav') as HTMLElement;
    await expect(nav).toHaveAttribute('aria-label');
    await expect(canvas.getByText(/Provide your work email/)).toBeInTheDocument();
    const indicators = within(nav).getAllByRole('button');
    await userEvent.click(indicators[2]);
    await expect(canvas.getByText(/Double-check the details/)).toBeInTheDocument();
    await expect(canvasElement.querySelector('.ds-completion-mark')).toHaveAttribute('data-visible', 'true');
  },
};

export const Vertical: Story = {
  args: {orientation: 'vertical', activeStep: 0, steps: sampleSteps},
  render: () => <StepperHarness orientation="vertical"/>,
};

export const NonInteractive: Story = {
  args: {activeStep: 1, steps: sampleSteps},
  render: (args) => <Stepper {...args} aria-label="Read-only progress"/>,
  play: async ({canvasElement}) => {
    const nav = canvasElement.querySelector('nav') as HTMLElement;
    await expect(within(nav).queryAllByRole('button')).toHaveLength(0);
    await expect(within(nav).getByText('Profile').closest('li')).toHaveAttribute('aria-current', 'step');
  },
};
