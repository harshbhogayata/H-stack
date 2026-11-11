I added a Toast component in `src/components/Toast.jsx` with styles in `src/components/Toast.css`. I couldn't run or render it: the repo has no build setup or tests. It also has no screen where shipment statuses change, so nothing uses the Toast yet. You'll need to render it wherever the status updates happen.

**What it does**
- It slides in from the bottom-right, using the existing `--hb-motion-base` and `--hb-ease-out` timing, and sits above modals using `--hb-z-toast`. Because the timing tokens drop to 0ms when the user prefers reduced motion, it just appears without sliding in that case.
- It shows the message and a close button built from the existing `IconButton` and `CloseIcon`, labelled "Dismiss notification".
- It calls `onClose` after 5 seconds; you can change this with the `duration` prop.

**Two extra behaviours I added**
- **The 5-second countdown pauses while the toast is hovered or focused**, so someone who is reading it or tabbing to the close button doesn't lose it. If you want a strict 5 seconds, remove the four mouse and focus handlers.
- **Screen readers announce each message.** The announcement area stays on the page even when no toast is showing, which makes announcements reliable.

**Wiring it up**

The Toast is controlled by its parent. The parent holds the current message and clears it in `onClose`:

```jsx
const [toast, setToast] = useState(null);

// wherever a shipment's status updates:
setToast({ id: Date.now(), text: `${shipment.container} is now ${STATUS_LABEL[next]}` });

<Toast message={toast?.text} messageKey={toast?.id} onClose={() => setToast(null)} />
```

`messageKey` restarts the timer and the slide-in when the same text arrives twice in a row. `STATUS_LABEL` is currently private to `ShipmentRow.jsx`, so you'd need to export it to build messages like this.

It shows one toast at a time; a new status change replaces the current toast. If several shipments can change at once and each should get its own toast, that would need a small queue in the parent.