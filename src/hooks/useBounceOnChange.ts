import { useRef, useState, type AnimationEvent } from 'react';

interface UseBounceOnChangeOptions {
  /**
   * The `animation-name` to listen for in `onAnimationEnd`. Defaults to
   * `'ds-bounce'`, the shared scale/translate bounce. Components that
   * compose a different animation (e.g., Toggle's `ds-slide-bounce`)
   * pass their own name so unrelated nested animationend events don't
   * clear the flag.
   */
  animationName?: string;
}

interface UseBounceOnChangeResult {
  /** True while the animation is running; apply `ds-bouncing` when set. */
  bouncing: boolean;
  /** Set bouncing to true, unless the user prefers reduced motion. */
  triggerBounce: () => void;
  /** Attach to the bouncing element's `onAnimationEnd`. Clears the flag when the configured animation ends. */
  handleBounceAnimationEnd: <E extends Element>(event: AnimationEvent<E>) => void;
}

const FALLBACK_DURATION_MS = 260;
const SAFETY_MARGIN_MS = 340;

const readDurationMs = (): number => {
  if (typeof document === 'undefined') return FALLBACK_DURATION_MS;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--ds-motion-duration-medium')
    .trim();
  const parsed = parseFloat(raw);

  return Number.isFinite(parsed) ? parsed : FALLBACK_DURATION_MS;
};

/**
 * One-shot bounce coordination for controls that pop on activation
 * (Button family, Radio, Checkbox, Toggle, segmented Toolbar item).
 * Tracks `bouncing` state, gates triggering on
 * `prefers-reduced-motion` (CSS sets `animation: none` there, so
 * `animationend` would never fire and the flag would stick), and
 * exposes an animation-end handler that listens specifically for the
 * configured animation name.
 *
 * Includes a timer-based safety net: if the animation is interrupted
 * before `animationend` fires (e.g., the bouncing element's parent
 * goes `display: none` when a Modal closes, which fires
 * `animationcancel` — an event React 19 does not synthesize via JSX
 * props), the timer clears the flag at the animation's duration so
 * the class doesn't stick around and re-fire when the parent becomes
 * visible again.
 */
export const useBounceOnChange = ({
  animationName = 'ds-bounce',
}: UseBounceOnChangeOptions = {}): UseBounceOnChangeResult => {
  const [bouncing, setBouncing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const triggerBounce = () => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;
    clearTimer();
    setBouncing(true);
    timeoutRef.current = setTimeout(() => {
      setBouncing(false);
      timeoutRef.current = null;
    }, readDurationMs() + SAFETY_MARGIN_MS);
  };

  const handleBounceAnimationEnd = <E extends Element>(event: AnimationEvent<E>) => {
    if (event.animationName === animationName) {
      clearTimer();
      setBouncing(false);
    }
  };

  return { bouncing, triggerBounce, handleBounceAnimationEnd };
};
