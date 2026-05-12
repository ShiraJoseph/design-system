/** The tightly-drawn check used both on completed step indicators and on
 *  the completion mark to the right of the last step. Custom 16x16 viewBox
 *  with a thicker stroke than the global Check icon so it reads at the
 *  small indicator size. */
export const StepperCheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="20" height="20">
    <path
      d="m3.5 8.5 3 3 6-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
