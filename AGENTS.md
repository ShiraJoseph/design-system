# AGENTS.md

This file teaches AI agents (Claude, Copilot, Cursor, etc.) the conventions for
adding new components to **design-system**. Follow it strictly so the library
stays internally consistent.

## Repo orientation

```
src/
├── components/<Name>/
│   ├── <Name>.tsx           # Component implementation (TS, forwarded ref, JSDoc)
│   ├── <Name>.module.css    # CSS Modules, uses tokens, never raw values
│   ├── <Name>.stories.tsx   # Storybook stories with i18n + a11y tags
│   └── index.ts             # Re-exports the component + types
├── tokens/                  # Single source of truth for tokens
│   ├── tokens.json          # Edit this; run `npm run tokens:build`
│   ├── tokens.css           # GENERATED, do not edit
│   └── generated.ts         # GENERATED, do not edit
├── icons/                   # Custom SVG icons via createIcon factory
├── i18n/                    # react-intl setup + message catalogs
└── components/AskAI/catalog.ts  # Component metadata; UPDATE when adding components
```

## Hard rules, every component must follow

1. **Forwarded refs.** Always wrap with `forwardRef`. Consumers compose; refs
   should not break that.
2. **JSDoc on the component and on every public prop.** Storybook autodocs
   reads these. Missing JSDoc means the docs page is missing a column.
3. **No raw colors, sizes, shadows, or fonts in CSS.** Use `var(--ds-*)` tokens
   exclusively. If a needed value isn't in `tokens.json`, add it there first.
4. **CSS Modules only.** No styled-components, no inline styles for visuals
   (one-off layout in stories is fine).
5. **Native semantics over ARIA.** Prefer `<button>`, `<dialog>`, `<input>`.
   Add ARIA only when no native equivalent exists.
6. **Accessible name on every interactive element.** Either a visible label, a
   `<label htmlFor>`, an `aria-label`, or `aria-labelledby`. No exceptions.
7. **Honor `prefers-reduced-motion`.** Wrap any animation longer than 100ms in
   the global rule, or scope it inside `@media (prefers-reduced-motion: ...)`.
8. **Touch targets.** Controls must be ≥ 44 × 44 CSS pixels under
   `@media (pointer: coarse)`. Use the `--ds-size-tap-target-min` token.
9. **i18n any internal strings.** Component-internal copy (e.g, modal close
   label, "Required" badge) goes through `react-intl`. Add keys to
   `src/i18n/messages/en.json` AND `es.json` together.
10. **Update the catalog.** After adding a component, append a `CatalogComponent`
    entry to `src/components/AskAI/catalog.ts` so `AskAI` can answer questions
    about it.

## Component scaffold (copy/paste starting point)

```tsx
// src/components/<Name>/<Name>.tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './<Name>.module.css';

export interface

<Name>Props extends HTMLAttributes<HTMLDivElement> {
  /** One-line JSDoc per prop. Be specific about defaults. */
  variant ? : 'default' | 'subtle';
  children: ReactNode;
}

  /**
  * One paragraph: when does a consumer reach for this component?
  *
  * Accessibility:
  * - List the guarantees this component bakes in.
  */
  export const <Name> = forwardRef<HTMLDivElement, <Name>Props>(function <Name>(
    {variant = 'default', className, children, ...rest},
    ref,
    ) {
      const classes = [styles.root, styles[`variant-${variant}`], className]
      .filter(Boolean)
      .join(' ');
      return (
      <div ref={ref} className={classes} {...rest}>
    {children}
  </div>
    );
    });
```

```css
/* src/components/<Name>/<Name>.module.css */
.root {
  font-family: var(--ds-font-family-sans);
  color: var(--ds-color-text-primary);
}

.variant-default {
  /* tokens only */
}
```

```tsx
// src/components/<Name>/<Name>.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import {

<Name> } from './<Name>';

  const meta = {
    title: 'Components/<Name>',
    component: <Name>,
    parameters: {layout: 'padded'},
  tags: ['autodocs'],
  } satisfies Meta
  <typeof<Name>>;

    export default meta;
    type Story = StoryObj
    <typeof meta>;

      export const Default: Story = {};
```

```ts
// src/components/<Name>/index.ts
export {
<Name>, type < Name > Props
}
from
'./<Name>';
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
