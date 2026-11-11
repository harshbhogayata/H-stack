I've added a Toast at `src/components/Toast.jsx` with styles in `src/components/Toast.css`. I haven't run or rendered it: the repo has no build setup or installed packages, and nothing in it tracks shipment status changes yet. So you still need to show the toast from wherever status updates arrive (example below).

**What's in it**
- **`Toast`**: shows the message and a close button. It slides in from the right and slides back out when dismissed. It closes itself after 5 seconds, or sooner if someone clicks close. You can change the time with the `duration` prop. `onClose` runs once the slide-out has finished, so remove the toast then.
- **`ToastRegion`**: a fixed container at the bottom-right that stacks toasts. Keep it on the page at all times. Screen readers often won't announce a message if the container appears at the same moment as the message.

**Things I added that you didn't ask for**
- The 5-second timer pauses while the mouse is over the toast or focus is inside it, and picks up where it left off afterwards. That way it won't vanish while someone is reading it or reaching for the close button.
- The close button reuses the existing `IconButton` and `CloseIcon`, so it's a 44px target, which suits the warehouse tablets.
- It uses the existing design tokens (`--hb-z-toast`, `--hb-motion-base`, and so on). That means the slide turns off automatically for people who've set their system to reduce motion.
- On narrow screens the toast shrinks to fit, and it stays clear of the screen edges and notches on tablets.

**Example usage**
```jsx
import { useEffect, useRef, useState } from 'react';
import { Toast, ToastRegion } from './components/Toast';

const STATUS_LABEL = { booked: 'Booked', in_transit: 'In transit', delayed: 'Delayed', delivered: 'Delivered' };

function ShipmentStatusToasts({ shipments }) {
  const [toasts, setToasts] = useState([]);
  const prev = useRef(new Map());

  useEffect(() => {
    for (const s of shipments) {
      const old = prev.current.get(s.container);
      if (old && old !== s.status) {
        setToasts((t) => [...t, { id: crypto.randomUUID(), message: `${s.container} is now ${STATUS_LABEL[s.status]}` }]);
      }
      prev.current.set(s.container, s.status);
    }
  }, [shipments]);

  return (
    <ToastRegion>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} onClose={() => setToasts((all) => all.filter((x) => x.id !== t.id))} />
      ))}
    </ToastRegion>
  );
}
```

`STATUS_LABEL` is copied from `ShipmentRow.jsx`. If you want the toast to use the same labels everywhere, export it from there instead.