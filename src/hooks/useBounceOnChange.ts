import { useRef, useState, type AnimationEvent } from 'react';

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
 * One-shot bounce coordination for controls that pop on activation.
 * Gates on `prefers-reduced-motion` (CSS sets `animation: none` there, so
 * `animationend` never fires and the flag would otherwise stick), and runs a
 * timer-based safety net for interruptions that fire `animationcancel` instead
 * of `animationend` (e.g. a Modal closing the parent) — an event React 19
 * doesn't synthesize via JSX props.
 */
export const useBounceOnChange = ({
  animationName = 'ds-bounce',
}: {
  /** Defaults to `'ds-bounce'`. Pass a composing animation's own name so unrelated nested animationend events don't clear the flag. */
  animationName?: string;
} = {}) => {
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

  return {
    bouncing,
    /** No-op when the user prefers reduced motion. */
    triggerBounce,
    handleBounceAnimationEnd,
  };
};
