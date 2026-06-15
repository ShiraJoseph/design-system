/** Design token entry. Import the CSS once at boot; the typed `tokens` object exposes `var(--ds-...)` strings for JS/TS. */

export { tokens } from './generated';
export type { TokenName } from './generated';
import './tokens.css';
