# Code Style

A short reference for code-style rules in this repo: universal style, React, CSS, JSON. Component-specific conventions (file structure, JSDoc, accessibility checklist) live in [AGENTS.md](./AGENTS.md).

**These rules apply to all code at all times** — not just new code or the current PR. A pre-existing violation is still a violation; fix it the moment you find it, even if it predates your change. A style review covers the whole repo, never just the diff.

## Universal

- **DRY.** When two components express the same concept (a bounce curve, a duration, a primitive), they share one definition. Shared things live in shared files.
- **Single responsibility.** Each function, file, and module does one thing. If you can describe it with "and", split it.
- **JSDoc on every function** unless the JSDoc would only restate the name. `getUserName` does not need one. `resolveBounceMagnitudeForSize` does.
- **Inline comments are near-zero.** Save them for non-obvious WHYs: a workaround, a subtle invariant, an external constraint. Never describe WHAT the code does and never reference the current PR or task.
- **No unused variables.** Prefix genuine unused-by-design parameters with `_`.
- **Blank line before AND after every `if` chain.** Treat `if` / `else if` / `else` as one block. `else` shares a line with the preceding closing brace.
- **Combine sequential `if`s with the same outcome.** Two consecutive guards returning `void` collapse into one `if` with `||` between conditions.
- **Blank line before every `return`** (except when the return is the only statement in the function).
- **No abbreviated or single-letter names.** Allowed: `prev`, `curr`, and `i` in a classic `for (let i = 0; i < n; i += 1)` loop. Not allowed: `e`, `el`, `arr`, `obj`, `idx`, `evt`, `cb`, `ctx`, `caps`, `pc`, `kf`, etc.
- **Every logic branch is covered by a test.** Every `if`/`else`, ternary alternative, switch case, early return, and optional render path is exercised by at least one Vitest test. Story files and the token build script are exempt.

## React

- **One component per `.tsx` file.** Each component gets its own camelCase folder; sub-components nest as sibling folders inside the parent (`Card/CardHeader/CardHeader.tsx`), never flat in the parent folder or in top-level `components/`.
- **Inline trivially-small components.** A one- or two-line wrapper used in a single place is inlined at its call site, not given a file/import/export. A file is for something substantial, publicly exported, or genuinely reused.
- **`ref` is a regular prop.** React 19, no `forwardRef`. Add `ref?: Ref<HTMLElementName>` to the props and pass it through.
- **No `useMemo` or `useCallback`** unless there's no alternative. The React Compiler handles memoization.
- **The `.tsx` is the hook call + JSX, nothing else.** No state/effects/refs, no helper functions, no named `Props` interface; only inline ternaries in the JSX. Logic, multi-flag className strings, and non-Props types live in `<Name>.model.ts` (lowercase), exposed as `use<Name>Model`. **Exception:** if the only derivation is a SINGLE `const` (typically one className), leave it inline in the `.tsx` — don't create a model file just to hold one value. Two+ derived consts, or any state/effect/handler/ref → extract the model. A trivial merge shared by sibling sub-components belongs in one shared helper, not N one-const models.
- **Model hooks: inline args type, inferred return.** `use<Name>Model`'s args are an inline anonymous object type (like component props) — no named `UseXxxModelArgs`. Don't annotate the return type either — no `UseXxxModelResult`; let it infer from the returned object.
- **Refs and the model.** Pass the consumer `ref` into the model only when the model needs the DOM node (measurement, `indeterminate`, focus). Then merge the internal + consumer refs with the shared `assignRefs(node, ...refs)` helper (`src/utils/`), called from inside the ref callback: `const setMergedRef = (node) => assignRefs(node, internalRef, ref);`. No eslint-disable needed (it's a plain helper run from the callback, not during render). If the model doesn't need the node, put `ref` straight on the JSX element instead.
- **Props are an inline destructured type, not a named interface.** Put per-prop JSDoc on the inline type's members — Storybook's react-docgen reads member JSDoc for the autodocs description column (it does NOT read `@param`). Don't export a `XxxProps` type; consumers use `React.ComponentProps<typeof Component>`.
- **JSX attribute values always use braces:** `type={'button'}`, `role={'switch'}`, `tabIndex={0}` — never `type="button"`.
- **Arrow functions everywhere.** No `function ComponentName() {}`, no `function helper() {}`.
- **Curly braces on `if`/`else`**, except a lone `if` with no `else` and an early-exit body (`if (!value) return;`).
- **Break up long files; inline too-small ones.** Split a file that's grown long; inline a file too trivial to justify itself.

## CSS

- **Every value comes from a token** under `--ds-*` (generated from `src/tokens/tokens.json`). Hard-coded pixels, hex colors, magic numbers, and inline `ms` durations are violations. Narrow exceptions: component-local custom properties (the literal still has a name), CSS keywords (`0`, `100%`, `auto`), and calibrated `calc()` with `1/2`-style halves.
- **`ds-` prefix on every class selector.** State and modifier classes too (`ds-bouncing`, `ds-variant-primary`).
- **No CSS Modules.** Plain `.css` files imported at the top of the component module. No `*.module.css`.
- **No `!important`** without an inline `/* WHY */` comment explaining what it's overriding.
- **Motion stays in the shared vocabulary.** Three keyframes exist: `ds-bounce`, `ds-slide-bounce`, `ds-spin`. Components do not declare their own `@keyframes`. They set CSS variables on the target element and the shared rules animate them. Only timing functions allowed are `linear` and `var(--ds-motion-bounce)`. State changes (border, background, opacity, color) snap instantly.
- **Reduced-motion override on every animating component.** A `@media (prefers-reduced-motion: reduce)` block disables the transition or animation on that element.
- **Blank line between rule blocks.** Multi-line comments stay attached to the rule they describe.

## JSON

- 2-space indentation, single trailing newline, no trailing whitespace.
- `tokens.json` validates against `tokens.schema.json` and round-trips through `npm run tokens:build` without errors.
- Color values in `tokens.json` are hex — `#rrggbb`, or 8-digit `#rrggbbaa` for alpha — never `rgb()` / `rgba()`. One format throughout.
- Every locale file in `src/i18n/messages/` has the same key set.
- `package.json` dependencies and devDependencies are sorted alphabetically.
- No data duplication across config files. Versions, paths, and constants have one canonical home.
