I added the Toast component in `src/components/Toast.jsx` and its styles in `src/components/Toast.css`. I couldn't build or render it: the project has no dependencies installed, and the syntax check I tried (`npx esbuild`) was blocked at the permission prompt. So it hasn't been run or looked at in a browser yet.

**What's in `Toast.jsx`**
- **`Toast`** shows the message and a close button, slides in from the right and dismisses itself after 5 seconds. The 5-second timer pauses while the mouse is over it or focus is inside it, so someone reading it or reaching for the button doesn't lose it. It slides out the same way when it closes.
- **`ToastRegion`** is the stack fixed to the bottom-right of the screen. It's meant to stay on the page all the time so screen readers announce each new toast as it appears. The empty area doesn't block clicks on what's behind it.
- **`useShipmentStatusToasts(shipments)`** compares the shipment list with its previous version and creates one toast per status change, e.g. "MSCU1234567 is now Delayed". It doesn't create toasts on the first load. The left edge is coloured by status: amber for delayed, green for delivered, teal otherwise.

To use it:
```jsx
const { toasts, closeToast } = useShipmentStatusToasts(shipments);
<ToastRegion toasts={toasts} onClose={closeToast} />
```

The hook isn't connected to any screen yet: the repo has no app or page component to put it in.

**Design system:** the styles use only the existing `--hb-*` values for colour, spacing, radius, shadow, the toast layer (`--hb-z-toast`) and animation timing. I added no new ones. The close button reuses the existing `IconButton` and `CloseIcon`. The only other change is that `STATUS_LABEL` in `ShipmentRow.jsx` is now exported, so the toast messages use the same status names as the table.

**Accessibility checks applied:**
- The close button has a label ("Dismiss notification") and a 44px touch target.
- Keyboard focus is visible, using the existing global style.
- Only position and opacity are animated, and the animation is skipped when the user has turned on reduced motion.
- The stack sits clear of notches and rounded corners on tablets, and the toast width fits narrow screens.
- Text colours are the project's existing ones.

Not verified: rendering, the slide animation, screen-reader announcements and the close-after-reduced-motion behaviour in a real browser.