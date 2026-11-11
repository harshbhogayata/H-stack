I've added the Toast component. It slides in at the bottom-right when a shipment's status changes, shows the message with a close button, and closes itself after 5 seconds. Nothing was run or rendered: the repo has no build setup or installed packages.

**Files**
- **`src/components/Toast.jsx`** has three exports:
  - `Toast` is a single notification with a message and a close button.
  - `ToastRegion` is the fixed bottom-right stack. Keep it mounted all the time; screen readers can miss messages if the region only appears when a toast does.
  - `useShipmentStatusToasts(shipments)` compares each shipment's status with its last value and adds a toast when one changes, e.g. "MSCU1234567 is now Delayed." It doesn't fire on the first render. To hook it up:
    ```jsx
    const { toasts, dismiss } = useShipmentStatusToasts(shipments);
    <ToastRegion toasts={toasts} onDismiss={dismiss} />
    ```
- **`src/components/Toast.css`** holds the styles.
- **`ShipmentRow.jsx`** now exports `STATUS_LABEL`, so the toasts use the same status names as the table.

**Design choices**
- It uses only the existing tokens; I didn't need to add any. The layer, slide-in timing and easing, shadow, spacing, corner radius and colours all come from the theme.
- The left edge takes the status colour the table already uses: orange for Delayed, green for Delivered, and the accent colour otherwise.
- The close button reuses `IconButton` and `CloseIcon`, so it has a 44px target (good for warehouse tablets), a label for screen readers ("Dismiss notification"), and the project's focus outline.
- **One addition you didn't ask for:** the 5-second countdown pauses while the pointer is over the toast or keyboard focus is inside it, so people can finish reading or reach the close button.

**Accessibility checks:**
- The slide-in only moves and fades the toast, which is cheap for the browser.
- It turns off when the user has asked for reduced motion, through the existing motion tokens.
- It stays clear of phone notches and rounded corners, and narrows to fit small screens.
- Long container IDs wrap instead of overflowing.
- The empty toast area doesn't block clicks on what's underneath.

**Not verified:** I couldn't render, parse or test the component in a browser, so the slide-in, the 5-second close, the pause on hover/focus and the screen-reader announcements are all untested. I didn't add an exit animation; a toast disappears straight away when it closes.