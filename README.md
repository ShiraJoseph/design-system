# design-system

[**Live Storybook →**](https://main--6001c9de8087c400212eb48e.chromatic.com)
&nbsp;·&nbsp;
[Chromatic library](https://www.chromatic.com/library?appId=6001c9de8087c400212eb48e)

A small, deliberately-scoped React component library showcasing the design-system patterns I reach for in production
work: design tokens with multiple color themes, react-intl for translation, WCAG 2.1 AA accessibility throughout, JSDoc
on every public surface, and a focus on consistency in animation and spacing.

## What's in here

| Layer                            | What it gives you                                                                                                                                                                                                                                                              |
|----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Design tokens** (`src/tokens`) | Single JSON source of truth → generated CSS variables (light / dark) and typed TS references. Two-tier: primitives (color scales) plus semantic aliases (`text.primary`, `action.danger.bg-hover`).                                                                            |
| **i18n** (`src/i18n`)            | `react-intl` provider with bundled English + Spanish catalogs. Storybook ships a locale toolbar; flip it and every component re-renders with the active locale.                                                                                                                |
| **Accessibility**                | `@storybook/addon-a11y` runs axe on every story. Components lean on native semantics (native `<dialog>`, native checkbox with `role="switch"`, real `<label htmlFor>`), honor `prefers-reduced-motion`, and enforce 44 × 44 CSS pixel touch targets under `(pointer: coarse)`. |
| **Components**                   | Button, IconButton, FAB, TextInput, Toggle, Checkbox, Radio, Card (with subcomponents), Modal, Stepper, Tabs, Toolbar, plus an embeddable AskAI chat panel. Every component is JSDoc'd, tokenized, and accepts `ref` as a regular prop (React 19, no `forwardRef`).            |
| **AskAI**                        | Provider-pluggable assistant that answers questions about the library. Default `staticProvider` matches keywords against the in-repo catalog; pass any AsyncIterable-yielding provider (Anthropic, OpenAI, on-device) to swap the backend.                                     |
| **Documentation**                | Storybook autodocs for components (built off JSDoc + TS prop types). TypeDoc covers hooks, utilities, providers, and tokens. AGENTS.md teaches AI agents how to add new components consistently.                                                                               |

## Quickstart

```bash
npm install
npm run tokens:build   # regenerate tokens.css + generated.ts
npm run storybook      # http://localhost:6006
```

Other useful scripts:

```bash
npm run build-storybook   # static Storybook → storybook-static/
npm run docs:build        # TypeDoc → docs/
npm run lint
```

## Design decisions worth flagging

**Tokens live in JSON, not TypeScript.** Keeping the source of truth as JSON means tooling outside the React stack (
Figma plugins, design-tool importers, native iOS/Android pipelines) can read the same file without parsing TS. The build
script generates both CSS variables and a typed reference; the JSON stays the canonical layer.

**i18n at the component level.** Every component-internal string (modal close label, required-badge copy, error prefix)
flows through `react-intl`. Application-supplied content stays as React children. This mirrors the split most large
product orgs land on: the design system owns its own copy.

**Native semantics by default.** Modal uses `<dialog showModal()>`, Toggle uses a real checkbox with `role="switch"`,
Button is a real `<button>`. The platform handles focus trap, escape-to-close, scroll lock, form submission, and screen
reader announcement, significantly more reliable than rolling those by hand.

**AskAI is provider-agnostic.** The UI doesn't know whether it's talking to a static catalog or Claude. A small
`AskAIProvider` interface lets consumers swap implementations without touching the chat surface. The default static
provider ships with the bundle and works offline.

**AGENTS.md is a real file.** AI agents are now contributors to many design systems. The file documents file structure, JSDoc
requirements, accessibility checklist, and the catalog-update workflow for future agents to draw context from.

## Repo layout

```
src/
├── components/
│   ├── Button/
│   ├── IconButton/
│   ├── FAB/
│   ├── TextInput/
│   ├── Toggle/
│   ├── Checkbox/
│   ├── Radio/
│   ├── Card/
│   ├── Modal/
│   ├── Stepper/
│   ├── Tabs/
│   ├── Toolbar/
│   └── AskAI/           ← chat UI + providers + catalog
├── foundations/         ← stories demonstrating JSON tokens
├── tokens/              ← JSON source + generated CSS / TS
├── i18n/                ← provider + en.json + es.json
├── icons/               ← createIcon factory + custom SVG icons
└── styles/              ← global reset, focus ring, sr-only utility
.storybook/
└── preview.tsx          ← theme + locale toolbars, a11y enforcement
AGENTS.md                ← conventions for AI agents adding components
typedoc.json             ← TypeDoc config
```
