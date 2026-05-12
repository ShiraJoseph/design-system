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
  /* For vertical: reserve a fixed minimum height so the Back/Next buttons
     stay put when the trailing connector expands on the last step. */
  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: 720,
    ...(orientation === 'vertical' ? {minHeight: '24rem', justifyContent: 'space-between'} : {}),
  };

  return (
    <div style={wrapperStyle}>
      <Stepper
        orientation={orientation}
        activeStep={step}
        steps={sampleSteps}
        onStepChange={setStep}
      />
      <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
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
