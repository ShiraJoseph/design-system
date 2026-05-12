import type { Meta, StoryObj } from '@storybook/react-vite';
import { useIntl } from 'react-intl';
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
  },
  decorators: [
    (Story) => <div style={{maxWidth: 360}}><Story/></div>,
  ],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {required: true, helperText: 'Used for receipts and security alerts.'},
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
};

export const Disabled: Story = {
  args: {disabled: true, defaultValue: 'name@company.com'},
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
