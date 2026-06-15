# AGENTS.md

This file teaches AI agents (Claude, Copilot, Cursor, etc.) the conventions for
adding new components to **design-system**. Follow it strictly so the library
stays internally consistent.

**Every rule here applies to all code at all times** — not just the component
you're adding and not just the current PR. If you touch or even pass through a
file that breaks a rule, fix it on sight; a pre-existing violation is still a
violation. Drift is how a consistent library stops being one.

## Repo orientation

```
src/
├── components/<Name>/
│   ├── <Name>.tsx           # Hook call + JSX only. Inline props type with per-member JSDoc.
│   ├── <Name>.model.ts      # State, effects, helpers, className-building, non-Props types.
│   ├── <Name>.css           # Plain CSS, uses tokens via var(--ds-*), never raw values.
│   ├── <Name>.stories.tsx   # Storybook stories (play functions are the behavior tests) + a11y tags.
│   ├── <Name>.model.test.ts # Model-level tests (one test per logic branch).
│   ├── <SubName>/           # Each sub-component nests in its own folder here, never flat.
│   └── index.ts             # Re-exports the component (and any public semantic-union types).
├── tokens/                  # Single source of truth for tokens
│   ├── tokens.json          # Edit this; run `npm run tokens:build`
│   ├── tokens.css           # GENERATED, do not edit
│   └── generated.ts         # GENERATED, do not edit
├── icons/                   # Custom SVG icons via createIcon factory
├── utils/                   # Project-wide pure helpers shared by 2+ components (e.g. mergeRefs)
├── i18n/                    # react-intl setup + message catalogs
└── components/AskAI/catalog.ts  # Component metadata; UPDATE when adding components
```

## Hard rules, every component must follow

1. **`ref` is a regular prop.** React 19 dropped the need for `forwardRef`.
   Add `ref?: Ref<HTMLElementName>` to the props interface and pass it through
   to the underlying DOM element. Do not wrap components in `forwardRef`.
2. **The `.tsx` is the hook call + JSX, nothing else.** No state/effects/refs, no
   helper functions, no multi-flag className-building. State, effects, handlers,
   and non-Props types live in `<Name>.model.ts` (lowercase, or `.model.tsx` if it
   holds JSX), exposed as a single `use<Name>Model` hook. The only conditionals in
   the `.tsx` are inline ternaries in the JSX. The hook's args are an inline
   anonymous object type (like component props) — no named `UseXxxModelArgs` — and
   its return type is inferred, not annotated (no `UseXxxModelResult`).
   - **Single-const exception:** don't create a `.model.ts` just to hold ONE
     derived value. If the only derivation is a single `const` (typically one
     className), leave it inline in the `.tsx`. Two+ derived consts, or any
     state/effect/handler/ref → extract the model. A trivial merge shared by
     sibling sub-components goes in one shared helper, not N one-const models.
   - **Refs:** pass the consumer `ref` into the model ONLY when the model needs
     the DOM node (measurement, `indeterminate`, focus). Then merge the internal +
     consumer refs with the shared `assignRefs(node, ...refs)` helper
     (`src/utils/`), called from inside the ref callback:
     `const setMergedRef = (node) => assignRefs(node, internalRef, ref);`. No
     eslint-disable needed. Otherwise put `ref` straight on the JSX element.
3. **Props are an inline destructured type with per-member JSDoc — no named
   `Props` interface.** Storybook's react-docgen reads the JSDoc on the inline
   type's members to fill the autodocs description column, so every documented
   prop gets a `/** ... */` directly above it. It does NOT read `@param` tags.
   Don't export a `<Name>Props` type; consumers use
   `React.ComponentProps<typeof <Name>>`. Keep a JSDoc on the component itself.
4. **No raw colors, sizes, shadows, or fonts in CSS.** Use `var(--ds-*)` tokens
   exclusively. If a needed value isn't in `tokens.json`, add it there first.
5. **Plain CSS with `ds-*` class names.** No CSS Modules, no styled-components,
   no inline styles for visuals (one-off layout in stories is fine).
6. **Native semantics over ARIA.** Prefer `<button>`, `<dialog>`, `<input>`.
   Add ARIA only when no native equivalent exists.
7. **Accessible name on every interactive element.** Either a visible label, a
   `<label htmlFor>`, an `aria-label`, or `aria-labelledby`. No exceptions.
8. **Honor `prefers-reduced-motion`.** Wrap any animation longer than 100ms in
   the global rule, or scope it inside `@media (prefers-reduced-motion: ...)`.
9. **Touch targets.** Controls must be ≥ 44 × 44 CSS pixels under
   `@media (pointer: coarse)`. Use the `--ds-size-tap-target-min` token.
10. **i18n any internal strings.** Component-internal copy (e.g. modal close
    label, "Required" badge) goes through `react-intl`. Add keys to
    `src/i18n/messages/en.json` AND `es.json` together.
11. **Update the catalog.** After adding a component, append a `CatalogComponent`
    entry to `src/components/AskAI/catalog.ts` so `AskAI` can answer questions
    about it.
12. **Each component gets its own camelCase folder; sub-components nest inside
    it.** A sub-component lives in its own folder under the parent
    (`Card/CardHeader/CardHeader.tsx`), never flat in the parent folder and never
    in top-level `components/`.
13. **Inline trivially-small components.** A one- or two-line wrapper used in a
    single place is inlined at its call site, not given a file/import/export. A
    file is for something substantial, publicly exported, or genuinely reused.
14. **JSX attribute values always use braces:** `type={'button'}`,
    `role={'switch'}`, `tabIndex={0}` — never `type="button"`.
15. **Stories are meaningful demos; tests ride on them.** Put interaction
    assertions (play functions) ON real demo stories, or in unit/model tests —
    never create a scaffold-only story that exists just to assert (no
    `RefForwarding` / `ForwardsKeyDown` two-element nonsense stories). A play
    function must leave the component in a clean resting state: if it opens
    something (a Modal), it also closes it. A story that renders open/active on
    load must say so in its NAME (`Open`, `Expanded`), never silently.

## Component scaffold (copy/paste starting point)

```tsx
// src/components/<Name>/<Name>.tsx
import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { type <Name>Variant, use<Name>Model } from './<Name>.model';
import './<Name>.css';

/** One sentence: when does a consumer reach for this component? */
export const <Name> = ({
  variant = 'default',
  className,
  children,
  ref,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  /** Visual treatment. Defaults to `'default'`. */
  variant?: <Name>Variant;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) => {
  const {classes} = use<Name>Model({variant, className});

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  );
};
```

```ts
// src/components/<Name>/<Name>.model.ts
export type <Name>Variant = 'default' | 'subtle';

/**
 * State, effects, helpers, and className-building for <Name>. The component file
 * consumes this hook and stays focused on JSX. One test per logic branch lives
 * in <Name>.model.test.ts.
 */
export const use<Name>Model = ({
  variant,
  className,
}: {
  variant: <Name>Variant;
  className?: string;
}) => {
  const classes = ['ds-<name>', `ds-variant-${variant}`, className].filter(Boolean).join(' ');

  return {classes};
};
```

```css
/* src/components/<Name>/<Name>.css */
.ds-<name> {
  font-family: var(--ds-font-family-sans);
  color: var(--ds-color-text-primary);
}

.ds-<name>.ds-variant-default {
  /* tokens only */
}
```

```tsx
// src/components/<Name>/<Name>.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { <Name> } from './<Name>';

const meta = {
  title: 'Components/<Name>',
  component: <Name>,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof <Name>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

```ts
// src/components/<Name>/index.ts
export { <Name> } from './<Name>';
export type { <Name>Variant } from './<Name>.model';
```

After scaffolding, also:

1. Add the export to `src/index.ts`.
2. Add the catalog entry to `src/components/AskAI/catalog.ts`.
3. Run `npm run storybook` and verify the new story renders, the a11y addon is
   green, and the locale switcher swaps any internal strings.

## Pre-flight checklist (before opening a PR)

- [ ] Component has JSDoc; every prop has JSDoc.
- [ ] No raw color / size / shadow / font values in CSS, only tokens.
- [ ] Stories cover: default, every variant, sizes (if applicable), error /
  loading / disabled (if applicable), localized.
- [ ] `@storybook/addon-a11y` is green (no violations) on every story.
- [ ] Catalog entry added in `AskAI/catalog.ts`.
- [ ] If new internal strings: keys exist in BOTH `en.json` and `es.json`.
- [ ] `npm run build-storybook` succeeds.
- [ ] `npm run docs:build` succeeds (TypeDoc parses your JSDoc).

## Don'ts

- **Don't add a runtime dependency** without checking `package.json` first; the
  library aims to stay slim. New deps need explicit justification.
- **Don't introduce a context provider** for component-internal state when a
  prop will do.
- **Don't suppress `eslint-plugin-react-hooks` warnings.** Fix the dependency
  array instead.
- **Don't break the `@storybook/addon-a11y` rule "color-contrast"**. If you
  need a disabled color, use the existing `disabled` token treatment.
- **Don't override the global `:focus-visible` style per-component.** Focus
  rings are universal across the library.

## When in doubt

Read an existing component (`Button` is the canonical example) and mirror its
conventions exactly. Consistency across the library is more valuable than
individual cleverness in any one file.
