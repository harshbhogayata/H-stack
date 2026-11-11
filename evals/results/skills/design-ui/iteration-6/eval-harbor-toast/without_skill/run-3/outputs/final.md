I added the Toast component in `src/components/Toast.jsx` and its styles in `src/components/Toast.css`. I haven't run or rendered it: the repo has no build setup, tests or app entry point, so it's untested.

**How to use it:** keep it mounted and pass the message in. Showing a new message restarts the 5-second timer, and it calls `onClose` when time runs out or the close button is pressed.

```jsx
const [toast, setToast] = useState(null);
// when a shipment's status changes:
setToast(`Container ${s.container} is now ${STATUS_LABEL[s.status]}`);
<Toast message={toast} onClose={() => setToast(null)} />
```

**How it works:**
- **Slide-in:** it slides in from the right and fades in at the bottom-right corner. It's capped at 400px wide and sits above other layers using the existing toast layer setting. On screens narrower than 480px, like phones or tablets in portrait, it stretches across the bottom with 16px margins, and it stays clear of notches and rounded screen corners.
- **Close button:** it reuses the existing `IconButton` and `CloseIcon`, so the tap target is 44px for tablets, and screen readers announce it as "Dismiss notification".
- **Screen readers:** the area the toast appears in is always on the page, even when empty. That means each new message gets read out reliably, which isn't guaranteed if the area appears together with its text.
- **Reduced motion:** the slide uses the existing animation timing settings. Those already drop to 0ms when someone has asked their system for reduced motion, so the toast just appears instead of sliding.
- **One addition you didn't ask for:** the timer pauses while the pointer is over the toast or it has keyboard focus, and starts again from the full 5 seconds when either leaves. That gives people time to finish reading or reach the close button. If you want a strict 5 seconds, remove the four mouse/focus handlers.

**Limitations:**
- It shows one message at a time. A new status change replaces the current toast rather than stacking.
- Because a replacement is detected by the text changing, sending the exact same message twice in a row won't restart the toast. Messages that include the container number and new status will normally be different.

I haven't connected it to anything that changes shipment status, since no such code exists in the repo yet.