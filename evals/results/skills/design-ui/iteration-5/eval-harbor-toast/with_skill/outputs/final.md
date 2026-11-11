I added the Toast in `src/components/Toast.jsx` and `src/components/Toast.css`. I haven't run or seen it: the repo has no app entry, build setup or installed packages, so I couldn't render it or take a screenshot.

**What's in it**
- **`Toast`**: shows the message with a close button and slides in from the right. It calls `onClose` when the button is pressed or after 5 seconds (`duration` prop, default 5000).
- **The 5-second timer stops while the pointer is over the toast or keyboard focus is inside it.** This gives dispatchers time to read it or tab to the close button. When they move away, the timer starts again from 5 seconds rather than picking up where it stopped.
- **`ToastRegion`**: a fixed box at the bottom-right that holds the toast. It's a polite live region, which is what lets screen readers announce the message. Screen readers only announce changes inside a region that already exists, so the region needs to stay mounted and the toast goes inside it.

**What you need to wire up:** nothing in the repo decides when a status has changed. Wherever shipment updates arrive, set the toast state, for example:
```jsx
<ToastRegion>
  {toast && <Toast key={toast.id} message={toast.message} onClose={() => setToast(null)} />}
</ToastRegion>
```
with something like `setToast({ id, message: \`${s.container} is now ${STATUS_LABEL[s.status]}\` })`. Give each toast a new `key` so that a second status change restarts the timer instead of carrying on with the old one.

**Reuse:** it's built from the existing `IconButton` (44px tap target, labelled "Dismiss notification") and `CloseIcon`. All styling uses existing tokens, including `--hb-z-toast`, `--hb-motion-base`, `--hb-ease-out` and `--hb-shadow-raised`, so I added no new tokens.

**Accessibility checks, done by reading the code:**
- The close button has a label.
- Keyboard focus is visible, through the global `:focus-visible` style.
- The slide-in only moves and fades the toast, and it turns off when the device asks for reduced motion.
- The toast stays clear of phone and tablet screen edges and notches.
- Text contrast passes AA (dark ink on white).
- Long container IDs wrap instead of overflowing.
- The empty region doesn't block clicks on the page underneath.

I left out a slide-out animation on close to keep it simple.

Not verified: rendering, the animation, and timer behaviour in a browser.