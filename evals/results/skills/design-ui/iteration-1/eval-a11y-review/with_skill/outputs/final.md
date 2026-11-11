I found 9 problems in `Toolbar.jsx`. I didn't edit the file. The repo contains only this file, so there are no design tokens, primitives or `.toolbar` CSS to compare against. Fixes use plain elements.

| # | Line | Problem | Why it matters | Fix |
|---|---|---|---|---|
| 1 | 3 | `height: '100vh'` on a toolbar | It makes a bottom toolbar cover the whole screen. `vh` also leaves the bottom cut off on mobile when the browser bar shows or hides. | Remove the height (let the content size it) or use a fixed size like `height: 48`. If it really must be full height, use `'100dvh'`. |
| 2 | 3 | `position: fixed; bottom: 0` ignores the safe area | On iPhones the home indicator covers the controls. | Add `paddingBottom: 'env(safe-area-inset-bottom)'`. This also needs `viewport-fit=cover` in the viewport meta tag. |
| 3 | 4 | Search is a `<div onClick>` | Keyboard users can't reach or use it: it has no focus, no Enter/Space handling and no role. | `<button type="button" onClick={onSearch} aria-label="Search">…</button>` |
| 4 | 4 | The search control has no accessible name; its only content is an SVG | Screen readers announce nothing useful. | Use `aria-label="Search"` (as in #3) and put `aria-hidden="true" focusable="false"` on the `<svg>`. |
| 5 | 5 | The delete button has an icon only and no accessible name | It gets announced as just "button", which is dangerous for a destructive action. | `<button type="button" aria-label="Delete" …>` and `aria-hidden="true"` on the `<svg>`. |
| 6 | 5 | Delete runs straight away with no confirmation | One mis-click or mis-tap destroys data. | Have `onClick` open an alert dialog ("Delete this item? This can't be undone." with Cancel / Delete). Call `onDelete` only on confirm. Or offer an undo toast instead. |
| 7 | 5 | The icon `<path>` has no `stroke` | A line path draws nothing with the default fill and no stroke, so the button may look empty unless CSS I couldn't see sets a stroke. | `<path d="M2 2l12 12" stroke="currentColor" strokeWidth="2" fill="none" />`. Also add `viewBox="0 0 16 16"` to both SVGs. |
| 8 | 6 | `onPaste={(e) => e.preventDefault()}` blocks paste | Users can't paste a filter term. It hurts password-manager, assistive-tech and mobile users. | Remove the `onPaste` handler. |
| 9 | 6 | The placeholder is the only label | The placeholder disappears once the user types, and some screen readers don't treat it as a name. | Add `aria-label="Filter"` or a visible `<label>`. Use `type="search"` too. |

**One more thing:** the filter `<input>` has no `value`, `onChange` or `onSearch` wiring, so typing in it changes nothing. If it's meant to drive filtering, connect it, for example `onChange={(e) => onFilter(e.target.value)}`.

**What I checked:** accessible names, keyboard access, destructive-action confirmation, paste blocking, labels, viewport units and safe areas. No animation, z-index, data or empty-state rules apply to this file.

**Not verified:**
- I didn't render the component.
- Focus visibility and colour contrast depend on the `.toolbar` CSS, which isn't in the repo. If that CSS turns off outlines, add a `:focus-visible` style.