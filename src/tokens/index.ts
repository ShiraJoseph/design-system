/**
 * @file Public entry point for the design token module.
 *
 * Consumers should import the CSS once at app boot:
 *
 * ```ts
 * import 'design-system/tokens.css';
 * ```
 *
 * To reference tokens from JS/TS (e.g, inline styles), use the typed
 * `tokens` object, which exposes `var(--ds-...)` strings.
 *
 * ```ts
 * import { tokens } from 'design-system';
 * <div style={{ color: tokens.colorTextPrimary }} />
 * ```
 */

export { tokens } from './generated';
export type { TokenName } from './generated';
import './tokens.css';
