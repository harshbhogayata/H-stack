I added the Toast in `src/components/Toast.jsx` with its styles in `src/components/Toast.css`. I haven't run it: the repo has no build setup, app entry point or tests. Nothing calls it yet either, because there's no page that holds the shipment list and changes statuses.

**How it works**
- The parent keeps it on the page all the time and controls it with a `message` prop. When `message` is null nothing shows. When it gets a value, a card slides in from the right at the bottom-right corner.
- It closes itself after 5 seconds, or when the close button is pressed. Either way it calls `onClose`. You can change the time with the `duration` prop.
- The wrapper around the card stays on the page even when it's empty. That makes screen readers reliably read out each new message, which they often miss if the whole thing appears from scratch.

```jsx
const [toast, setToast] = useState(null);
// when a shipment's status changes:
setToast(`${shipment.container} is now ${STATUS_LABEL[shipment.status]}`);
// in the layout:
<Toast message={toast} onClose={() => setToast(null)} />
```

**Choices that go beyond the request**
- **The 5-second timer pauses** while the mouse is over the toast or the keyboard focus is inside it. Without this, the toast could disappear while someone is reading it or reaching for the close button. When they move away, it restarts from a full 5 seconds.
- **It reuses existing pieces:** the close button is the existing `IconButton` (44px touch target, which suits the warehouse tablets) with `CloseIcon`. Colours, spacing, shadow, stacking order (`--hb-z-toast`) and animation timing all come from the existing design tokens. Since those tokens set animation time to zero when "reduce motion" is on, the slide-in is skipped automatically for those users.
- **On narrow screens (480px or less)** it stretches across the bottom with equal side margins and stays clear of device notches and edges.

**Limits**
- It shows one toast at a time. A new message replaces the current one and restarts the timer. If several shipments change status at nearly the same moment, only the last one stays visible. If you need them to stack, that's a separate change.
- It slides in but doesn't slide out; it just disappears when closed.