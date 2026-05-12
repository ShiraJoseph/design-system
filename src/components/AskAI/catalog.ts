/**
 * @file Structured metadata for every public component in the library.
 *
 * Used by the default `staticProvider` to answer questions, and by the
 * skill files in `/agents` to teach external AI agents the conventions
 * for adding new components. Keep entries terse and high-signal.
 */

export interface CatalogExample {
  /** Short heading for the example. */
  title: string;
  /** Code snippet, JSX. Will render as a fenced `tsx` block in answers. */
  code: string;
}

export interface CatalogProp {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}

export interface CatalogComponent {
  /** Component name, matches the import. */
  name: string;
  /** One-paragraph summary of when to reach for this component. */
  description: string;
  /** Bullet list of accessibility guarantees baked into the component. */
  accessibility: string[];
  /** Public props, ordered by relevance. */
  props: CatalogProp[];
  /** Worked examples, used in answers and Storybook docs. */
  examples: CatalogExample[];
  /** Anti-patterns or footguns, what NOT to do. */
  pitfalls?: string[];
  /** Search keywords; lowercase, comma-separated. */
  keywords: string;
}

export const catalog: CatalogComponent[] = [
  {
    name: 'Button',
    description:
      'Primary control for triggering an action. Renders a native button. Use for any interaction that submits, confirms, or starts a flow.',
    accessibility: [
      'Native <button> for keyboard, focus, and form-submission semantics.',
      'aria-busy is set when loading.',
      'Visible focus ring meets WCAG 2.1 SC 1.4.11 (3:1 non-text contrast).',
      'Decorative leading/trailing icons are aria-hidden.',
      'Min control height meets touch-target sizing on coarse pointers.',
    ],
    props: [
      {
        name: 'variant',
        type: '"primary" | "secondary" | "danger" | "ghost"',
        description: 'Visual treatment. Defaults to primary.'
      },
      {name: 'size', type: '"sm" | "md" | "lg"', description: 'Control height. Defaults to md.'},
      {name: 'loading', type: 'boolean', description: 'Disables interaction and shows a spinner.'},
      {name: 'leadingIcon', type: 'ReactNode', description: 'Decorative icon before the label.'},
      {name: 'trailingIcon', type: 'ReactNode', description: 'Decorative icon after the label.'},
      {name: 'fullWidth', type: 'boolean', description: 'Stretch to fill the inline space.'},
    ],
    examples: [
      {
        title: 'Primary action',
        code: `<Button onClick={save}>Save changes</Button>`,
      },
      {
        title: 'Destructive with confirmation',
        code: `<Button variant="danger" onClick={openConfirm}>Delete account</Button>`,
      },
      {
        title: 'Loading',
        code: `<Button loading={isSubmitting}>Save changes</Button>`,
      },
    ],
    pitfalls: [
      'Do not use a Button for navigation between pages, use an anchor.',
      'Do not render an empty Button with only an icon, use IconButton instead.',
    ],
    keywords: 'button, click, action, submit, primary, secondary, danger, ghost, cta, loading',
  },
  {
    name: 'IconButton',
    description:
      'Square or circular button whose only content is an icon. Always exposes an accessible name via the required `aria-label` prop.',
    accessibility: [
      'aria-label is required by the type, the control can never be unlabeled.',
      'Same focus and contrast rules as Button.',
      'Coarse-pointer media query enforces 44x44 minimum on the sm size.',
    ],
    props: [
      {
        name: 'aria-label',
        type: 'string',
        required: true,
        description: 'Required. Phrase as the action ("Close dialog").'
      },
      {name: 'icon', type: 'ReactNode', required: true, description: 'Icon node, must accept currentColor.'},
      {name: 'shape', type: '"square" | "circle"', description: 'Defaults to square.'},
      {name: 'variant', type: '"primary" | "secondary" | "danger" | "ghost"', description: 'Defaults to secondary.'},
    ],
    examples: [
      {title: 'Close', code: `<IconButton aria-label="Close dialog" icon={<Close />} />`},
      {title: 'Toolbar destructive', code: `<IconButton aria-label="Delete row" icon={<Trash />} variant="danger" />`},
    ],
    keywords: 'icon, icon button, close, x, action, toolbar',
  },
  {
    name: 'TextInput',
    description:
      'Single-line text input with built-in label, helper, and error states. Wires up label-for, aria-describedby, and aria-invalid automatically.',
    accessibility: [
      'Label is always present. Use visuallyHideLabel for sr-only labels.',
      'Helper text and error text are linked via aria-describedby.',
      'Error sets aria-invalid and renders message in role="alert".',
      'Required and optional badges are localized through react-intl.',
    ],
    props: [
      {name: 'label', type: 'string', required: true, description: 'Visible label text.'},
      {name: 'helperText', type: 'string', description: 'Description below the input.'},
      {name: 'error', type: 'string', description: 'Error message; presence triggers the error state.'},
      {name: 'required', type: 'boolean', description: 'Marks the field required and shows a localized badge.'},
      {name: 'leadingIcon', type: 'ReactNode', description: 'Decorative icon inside the input.'},
    ],
    examples: [
      {
        title: 'With validation',
        code: `<TextInput
  label="Email address"
  type="email"
  required
  error={!isValid ? "Enter a valid email" : undefined}
/>`,
      },
    ],
    pitfalls: [
      'Do not use placeholder as the only label, placeholders disappear on input.',
      'Do not nest TextInput inside another label element.',
    ],
    keywords: 'input, text field, form, label, error, validation, email',
  },
  {
    name: 'Toggle',
    description:
      'Binary on/off switch built on a native checkbox with role="switch". Use for settings that take effect immediately, not for form fields whose value is committed on submit.',
    accessibility: [
      'role="switch" so screen readers announce "switch" not "checkbox".',
      'Native checkbox underneath. Space toggles, Enter submits the enclosing form.',
      'Helper description linked via aria-describedby.',
    ],
    props: [
      {name: 'label', type: 'ReactNode', required: true, description: 'Visible label.'},
      {name: 'description', type: 'ReactNode', description: 'Helper sub-line.'},
      {name: 'size', type: '"sm" | "md"', description: 'Defaults to md.'},
    ],
    examples: [
      {title: 'Settings row', code: `<Toggle label="Email notifications" defaultChecked />`},
    ],
    pitfalls: [
      'Do not use Toggle for form values that are committed on submit, use a Checkbox.',
    ],
    keywords: 'toggle, switch, on off, settings, checkbox',
  },
  {
    name: 'Card',
    description:
      'Generic surface for grouping related content. Compose with CardHeader / CardBody / CardFooter for consistent layout.',
    accessibility: [
      'Card itself adds no semantics, wrap in <section aria-labelledby> if it represents a region.',
      'Interactive prop adds keyboard focus, but for navigation, prefer wrapping in an <a>.',
    ],
    props: [
      {name: 'elevation', type: '"flat" | "raised" | "overlay"', description: 'Surface elevation. Defaults to raised.'},
      {name: 'padding', type: '"none" | "sm" | "md" | "lg"', description: 'Internal padding. Defaults to md.'},
      {name: 'interactive', type: 'boolean', description: 'Adds focusable affordance.'},
    ],
    examples: [
      {
        title: 'Composed',
        code: `<Card>
  <CardHeader><h3>Quarterly report</h3></CardHeader>
  <CardBody>Revenue is up 12% YoY...</CardBody>
  <CardFooter><Button>View report</Button></CardFooter>
</Card>`,
      },
    ],
    keywords: 'card, surface, container, panel, section',
  },
  {
    name: 'Modal',
    description:
      'Dialog built on the native <dialog> element. The browser handles focus trap, ESC-to-close, scroll lock, and the backdrop.',
    accessibility: [
      'Native <dialog> with showModal(), focus trap, ESC, scroll lock are platform-handled.',
      'aria-labelledby points at the title; aria-describedby points at the description if present.',
      'Honors prefers-reduced-motion; no animation when reduced.',
    ],
    props: [
      {name: 'open', type: 'boolean', required: true, description: 'Controls visibility.'},
      {name: 'onClose', type: '() => void', required: true, description: 'Called when the user requests close.'},
      {name: 'title', type: 'ReactNode', required: true, description: 'Accessible heading.'},
      {name: 'description', type: 'ReactNode', description: 'Sub-line linked via aria-describedby.'},
      {
        name: 'dismissOnBackdropClick',
        type: 'boolean',
        description: 'Defaults to true. Set false for destructive confirmations.'
      },
    ],
    examples: [
      {
        title: 'Confirmation',
        code: `const [open, setOpen] = useState(false);
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete this account?"
  dismissOnBackdropClick={false}
  footer={<>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={confirm}>Delete</Button>
  </>}
/>`,
      },
    ],
    pitfalls: [
      'Do not auto-focus a destructive action, the platform focuses the first focusable element, and that should be the safe path (e.g. Cancel).',
    ],
    keywords: 'modal, dialog, popup, confirmation, alert',
  },
];
