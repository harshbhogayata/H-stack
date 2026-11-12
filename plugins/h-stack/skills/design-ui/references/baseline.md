# UI correctness baseline (check-only)

Adapted from ibelick/ui-skills `baseline-ui` (MIT). Kept: correctness checks that apply to any product. Removed: the mandated stack (Tailwind defaults, motion/react, tw-animate-css, the cn utility, Base UI preference) and aesthetic bans (no gradients, no purple, shadow scale, one accent): those are house style and conflict with deriving from the project. All-caps rules rewritten as plain checks. Where the project's own design system or the user decides otherwise, they win.

When reviewing a file against these checks, report each violation with the exact line, one sentence on why it matters, and a code-level fix.

## Components
- Anything with keyboard or focus behaviour uses an accessible primitive; prefer the project's existing primitives, and don't mix primitive systems in one interaction surface.
- Icon-only buttons have an accessible name (`aria-label` or equivalent).
- Keyboard and focus behaviour isn't rebuilt by hand unless asked.

## Interaction
- Destructive or irreversible actions ask for confirmation in an alert-style dialog.
- Loading states keep the layout's structure (skeletons over spinners where layout shifts).
- Full-height layouts use dynamic viewport units (`dvh`) rather than `vh` on mobile.
- Fixed elements respect `safe-area-inset`.
- Errors appear next to where the action happened.
- Paste is never blocked in inputs or text areas.

- Every interactive part has hover, focus, pressed, loading, empty and error states that exist and agree with each other; controls respond at once.

## Phone
- The phone layout is designed for the phone: its first screen carries the product's object (demo, diagram, data) together with the headline and main action.

## Motion
- Animation is added only when it helps the user follow a change, or when asked; transitions are short and have a reason.
- Animate compositor properties (`transform`, `opacity`); avoid animating layout (`width`, `height`, `top`, `left`, `margin`, `padding`) and large blur or backdrop-filter surfaces.
- Interaction feedback stays under about 200 ms; looping animations pause off-screen.
- `prefers-reduced-motion` is respected.
- `will-change` only during an active animation.

## Typography and data
- Numbers in tables and data views use tabular figures.
- Dense UI truncates or clamps text instead of overflowing.
- Line length for reading text stays under about 80 characters.

## Layout and states
- z-index values come from one scale, not arbitrary numbers.
- Empty states offer one clear next action.
- Visible keyboard focus everywhere; contrast meets WCAG AA for text.

## Words
- Names are the user's, verbs say what happens, one name per action through the flow; errors say what went wrong and how to fix it.

## React specifics (when the project uses React)
- Don't use `useEffect` for what can be derived during render.
