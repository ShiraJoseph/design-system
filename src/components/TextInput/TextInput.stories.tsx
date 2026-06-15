import type { Meta, StoryObj } from '@storybook/react-vite';
import { useIntl } from 'react-intl';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TextInput } from './TextInput';
import { AlertCircle, Search } from '../../icons';

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Single-line text input. Wires `label` / `aria-describedby` / `aria-invalid` automatically and exposes `required` and `error` states with localized indicators.',
      },
    },
  },
  argTypes: {
    size: {control: 'inline-radio', options: ['sm', 'md', 'lg']},
    visuallyHideLabel: {control: 'boolean'},
    required: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    helperText: 'We will never share your email.',
    size: 'md',
    onChange: fn(),
  },
  decorators: [
    (Story) => <div className="story-frame-sm"><Story/></div>,
  ],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({canvasElement, args}) => {
    const input = within(canvasElement).getByRole('textbox', {name: /Email address/});
    await expect(input).toHaveAccessibleDescription(/We will never share your email\./);
    await userEvent.type(input, 'hello@example.com');
    await expect(input).toHaveValue('hello@example.com');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Required: Story = {
  args: {required: true, helperText: 'Used for receipts and security alerts.'},
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('textbox', {name: /Email address/});
    await expect(input).toHaveAttribute('aria-required', 'true');
    await expect(input).toBeRequired();
  },
};

export const RequiredErrored: Story = {
  name: 'Required + error (asterisk turns red)',
  args: {
    required: true,
    error: 'This field is required.',
    helperText: 'Used for receipts and security alerts.',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search components',
    leadingIcon: <Search/>,
    helperText: undefined,
  },
};

export const Errored: Story = {
  args: {
    error: 'Enter a valid email address.',
    defaultValue: 'not-an-email',
    trailingIcon: <AlertCircle/>,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {name: /Email address/});
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription(/Enter a valid email address\./);
    await expect(canvas.getByRole('alert')).toHaveTextContent(/Enter a valid email address\./);
  },
};

export const Disabled: Story = {
  args: {disabled: true, defaultValue: 'name@company.com'},
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('textbox', {name: /Email address/});
    await expect(input).toBeDisabled();
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="story-col">
      <TextInput {...args} size="sm" label="Small"/>
      <TextInput {...args} size="md" label="Medium"/>
      <TextInput {...args} size="lg" label="Large"/>
    </div>
  ),
};

export const Localized: Story = {
  name: 'Localized (uses active locale)',
  render: (args) => {
    const intl = useIntl();

    return (
      <TextInput
        {...args}
        required
        label={intl.formatMessage({id: 'demo.input.email.label'})}
        placeholder={intl.formatMessage({id: 'demo.input.email.placeholder'})}
        helperText={intl.formatMessage({id: 'demo.input.email.helper'})}
      />
    );
  },
};
