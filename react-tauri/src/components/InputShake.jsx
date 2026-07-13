// Transitions.dev — Error state shake (React, self-contained)
// Drop into any React project — no extra CSS file needed.

import { useEffect, useRef, useState } from "react";

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --shake-distance: 6px;
  --shake-overshoot: 4px;
  --shake-dur-a: 80ms;
  --shake-dur-b: 60ms;
  --shake-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --revert-hold: 3000ms;
  --revert-dur: 280ms;
}

/* Border-color tween. Define your input's default / focused
   / error border-color in your own component CSS — this rule
   only owns the interpolation. Use a constant border-width
   across states so the tween never shifts inner content. */
.t-input {
  transition: border-color 150ms ease-out;
  will-change: transform;
}
.t-input.is-error {
  /* Error border auto-reverts on the hold timer, so the
     fade-out uses the slower revert duration (matches the
     message fade). */
  transition: border-color var(--revert-dur, 280ms) ease-out;
}

/* Error message reveal. Visibility is delayed by --revert-dur
   on hide so the message stays painted for the full opacity
   fade-out. Entering .is-error drops the delay to 0 so the
   message becomes visible immediately. */
.t-error-msg {
  opacity: 0;
  visibility: hidden;
  transition:
    opacity    var(--revert-dur, 280ms) ease-out,
    visibility 0s linear var(--revert-dur, 280ms);
}
.t-input-wrap.is-error .t-error-msg {
  opacity: 1;
  visibility: visible;
  transition:
    opacity    var(--revert-dur, 280ms) ease-out,
    visibility 0s linear 0s;
}

/* Multi-segment keyframe with per-stop easing so each leg
   of the shake follows its own cubic-bezier independently.
   %-stops are cumulative durations as a fraction of the
   total (80, 60, 80, 60 = 280ms): 28.57%, 57.14%, 78.57%,
   100%. Recompute if any segment duration changes. */
.t-input.is-shaking {
  animation: t-input-shake calc(
      var(--shake-dur-a) * 2 + var(--shake-dur-b) * 2
    ) linear;
}
@keyframes t-input-shake {
  0%      { transform: translateX(0);                                 animation-timing-function: var(--shake-ease); }
  28.57%  { transform: translateX(var(--shake-distance));             animation-timing-function: var(--shake-ease); }
  57.14%  { transform: translateX(calc(var(--shake-distance) * -1)); animation-timing-function: var(--shake-ease); }
  78.57%  { transform: translateX(var(--shake-overshoot));            animation-timing-function: var(--shake-ease); }
  100%    { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .t-input { animation: none !important; transform: none !important; }
}
`;
if (typeof document !== "undefined" && !document.getElementById("transitions-p12")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p12";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab.
// This hook owns ONLY the shake + error-state wiring; the input
// markup, message text, sizing, and border colors are yours.
//
// Wire it in as:
//   <InputShake message="Please enter a valid email.">
//     <input type="text" onInput={onUserEdit} />
//   </InputShake>
//
// `Animate` always triggers the error state — this is a demo, not
// real validation. The shake replay pattern is the same as the rest
// of the gallery: drop the class, force a reflow, re-add it. We
// then auto-revert after --revert-hold so the demo self-resets.
// Pass an `onCancel` if you want to clear the error early when the
// user starts editing (e.g. on the input's `onInput` event).
export function InputShake({ children, message, onCancel, triggerError}) {
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const [error, setError] = useState(false);

  const trigger = () => {
    if (!inputRef.current) return;
    setError(true);
    inputRef.current.classList.remove("is-shaking");
    void inputRef.current.offsetWidth;
    inputRef.current.classList.add("is-shaking");

    if (timerRef.current) window.clearTimeout(timerRef.current);
    const shakeMs =
      readMs("--shake-dur-a", 80) * 2 +
      readMs("--shake-dur-b", 60) * 2;
    const hold = readMs("--revert-hold", 3000);
    timerRef.current = window.setTimeout(() => {
      setError(false);
      timerRef.current = null;
    }, shakeMs + hold);
  };

  // Call this from your input's onInput / onChange handler if you
  // want typing to cancel the auto-revert and clear the error.
  const cancel = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setError(false);
    onCancel?.();
  };

  useEffect(() => {
    console.log("Called within InputShake")
    console.log("trigger Error: " + triggerError)
    if (triggerError > 0) {
      console.log("trigger Error: " + triggerError)
      trigger();
    }
  }, [triggerError]);

  return (
    <>
      <div className={"t-input-wrap" + (error ? " is-error" : "")}>
        <div
          ref={inputRef}
          className={"t-input" + (error ? " is-error" : "")}
          onInput={cancel}
        >
          {children}
        </div>
        <p className="t-error-msg">{message}</p>
      </div>
    </>
  );
}

function readMs(name, fallback) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name).trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}
