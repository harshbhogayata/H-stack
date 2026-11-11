Toolbar.jsx has eight UI correctness problems, checked against the design-ui baseline. The repo has no theme, tokens or other components, so these are checks that apply to any React app rather than to a house style.

| # | Line | Problem | Why it matters | Fix |
|---|---|---|---|---|
| 1 | 3 | `height: '100vh'` on a toolbar | `100vh` is wrong on mobile because the browser bars change the visible height, so the bar will be cut off or jump. A toolbar pinned with `bottom: 0` probably shouldn't be full-height anyway: it covers the whole screen. | Drop the height and let the content size it: `style={{ position: 'fixed', insetInline: 0, bottom: 0 }}`. If it really must be full-height, use `height: '100dvh'`. |
| 2 | 3 | Fixed to the bottom with no safe-area padding | On notched or home-indicator devices, the controls sit under the system gesture area. | Add `paddingBottom: 'env(safe-area-inset-bottom)'`, plus `viewport-fit=cover` in the viewport meta tag. |
| 3 | 4 | Search is a clickable `<div>` | It can't be reached with Tab or triggered with Enter/Space, and screen readers don't announce it as a control. | `<button type="button" onClick={onSearch} aria-label="Search">…</button>` |
| 4 | 4–5 | Icon-only controls have no accessible name, and the SVGs are exposed | Screen readers announce "button" with no name, and the bare SVGs add noise. | Add `aria-label="Search"` and `aria-label="Delete"` on the buttons, and `aria-hidden="true" focusable="false"` on each `<svg>`. |
| 5 | 5 | Delete runs `onDelete` straight away | A destructive action fires on a single click or a misclick, with no confirmation. | Open an alert-style confirm dialog (`role="alertdialog"`, using the project's dialog primitive if it has one) that says what will be deleted and has "Delete" and "Cancel" buttons. Call `onDelete` only on confirm, or offer undo instead. |
| 6 | 5 | `<button>` with no `type` | If the toolbar is ever placed inside a `<form>`, this defaults to `submit` and will submit the form. | `type="button"` |
| 7 | 5 | The `<path>` has no `stroke` | An open line path with the default `fill` and no stroke draws nothing, so the Delete button shows no icon. | `<path d="M2 2l12 12" stroke="currentColor" strokeWidth="2" fill="none" />` (the same applies if the circle should be an outline: `fill="none" stroke="currentColor"`). |
| 8 | 6 | `onPaste={(e) => e.preventDefault()}` | Blocking paste breaks a basic expectation and hurts users of password managers, dictation and other assistive input. | Remove the `onPaste` handler. |
| 9 | 6 | The input's only label is its placeholder | The placeholder disappears once the user types and isn't a reliable accessible name. | `<input type="search" aria-label="Filter items" placeholder="Filter" />`, or use a visible `<label>`. |

**Not verified:**
- I couldn't render the toolbar.
- There's no CSS for `.toolbar` in the repo, so I couldn't check focus visibility or contrast. Once Search is a `<button>`, make sure it keeps a visible `:focus-visible` outline.
- I also couldn't check the z-index, since none is set and there's no scale in the repo to compare against.