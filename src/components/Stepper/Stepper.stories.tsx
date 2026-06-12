import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
};

export const Vertical: Story = {
  args: {orientation: 'vertical', activeStep: 0, steps: sampleSteps},
  render: () => <StepperHarness orientation="vertical"/>,
};
