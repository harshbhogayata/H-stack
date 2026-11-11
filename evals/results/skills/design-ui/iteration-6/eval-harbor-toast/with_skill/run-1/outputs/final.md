I've added the toast component in `src/components/Toast.jsx` and its styles in `src/components/Toast.css`. A toast slides in at the bottom-right when a shipment's status changes, shows the message with a close button, and slides out after 5 seconds. I couldn't compile or run any of it here (details at the end).

**How to use it** — the file exports three pieces:
- **`Toast`** shows a single notification and closes itself after 5 seconds. The 5-second timer pauses while the pointer is over the toast or keyboard focus is on its close button, so nobody loses a message mid-read. When the pause ends, the timer starts the full 5 seconds again.
- **`ToastRegion`** is the fixed bottom-right stack the toasts appear in.
- **`useShipmentStatusToasts(shipments)`** compares the shipment list with its previous version and adds a toast for each shipment whose status changed. Shipments that are new to the list don't trigger one. A toast reads like **MSCU1234567** / "Now Delayed (was In transit)".

```jsx
const { toasts, dismiss } = useShipmentStatusToasts(shipments);
<ToastRegion toasts={toasts} onDismiss={dismiss} />
```

**Matching the existing styles:**
- The close button reuses the existing `IconButton` and `CloseIcon`, and the toast shows the same truck icon as `ShipmentRow`.
- Everything else uses your existing variables in `tokens.css`: the reserved toast layer (`--hb-z-toast`), raised shadow, spacing, radius, and animation timing.
- The coloured stripe on the left edge follows the status colours already in the table: amber for delayed, green for delivered, the accent colour for anything else.

**Other files changed:**
- `tokens.css`: two new variables, `--hb-toast-width` (22rem) and `--hb-toast-stripe` (4px). The theme had nothing for either.
- `ShipmentRow.jsx`: `STATUS_LABEL` is now exported, so toasts use the same status wording as the table instead of a copy.

**Accessibility checks:**
- The close button has a screen-reader label, "Dismiss notification", is 44px square, and shows the existing focus outline.
- `ToastRegion` is a labelled, polite announcement area that stays in the page even when empty, so screen readers announce new toasts reliably.
- Only position and opacity animate. With reduced motion turned on, the timing variables drop to 0ms, so toasts appear and disappear without sliding.
- It stays clear of phone and tablet screen edges (notches, home bar) and shrinks to fit narrow screens.
- The empty region doesn't block clicks on the page beneath it. Long container IDs wrap instead of overflowing, and IDs use evenly spaced digits.
- Dark grey text on white passes WCAG AA contrast.

**Known limitations:**
- If focus is on a toast's close button when the toast disappears, focus falls back to the top of the page.
- Toasts are keyed by `shipment.id`, falling back to `container`.

**Not verified:** the project has no dependencies installed and there's no browser available, so I couldn't build it, render it, or watch the animation. Installing esbuild to at least check that the code compiles needed approval, so I skipped it.