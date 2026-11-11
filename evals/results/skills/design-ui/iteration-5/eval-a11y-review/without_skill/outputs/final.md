I found 9 UI problems in the 9-line `Toolbar.jsx`. I didn't render it; these come from reading the code.

### Line 3: the toolbar covers the whole screen
`position: 'fixed', bottom: 0, height: '100vh'` makes a toolbar as tall as the screen, sitting on top of the page. It blocks every click below it. It also has no `left`, `right` or `width`, so its width just fits its contents.
**Fix:** Give it a toolbar-sized height and stretch it across the screen, for example `{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 48 }`. Or use `position: 'sticky'` and add bottom padding to the page so the bar doesn't hide content.

### Line 4: search is a clickable `<div>`, not a button
- A keyboard can't reach it, screen readers don't announce it as a button, and Enter or Space don't activate it.
- The icon has no accessible name.

**Fix:** `<button type="button" aria-label="Search" onClick={onSearch}>…</button>`.

### Line 4: the search icon shows as a solid dot
SVG shapes are filled black and have no outline by default, so `<circle>` draws a filled disc rather than a magnifier ring.
**Fix:** `<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />`, and add `aria-hidden="true"` to the `<svg>`.

### Line 5: the delete icon draws nothing
A `<path>` that is just a straight line has no area to fill and no stroke set, so the button looks empty.
**Fix:** `<path d="M2 2l12 12" stroke="currentColor" strokeWidth="2" fill="none" />`, and add `aria-hidden="true"` to the `<svg>`.

### Line 5: the delete button has no name and no `type`
- Screen readers announce it only as "button", with no label.
- Without `type`, a button defaults to `type="submit"`. If the toolbar is ever inside a `<form>`, clicking Delete will also submit the form.

**Fix:** `<button type="button" aria-label="Delete" onClick={onDelete}>`.

### Line 5: Delete runs with no confirmation or undo
One click goes straight to `onDelete`, and it sits next to Search, so it's easy to hit by mistake.
**Fix:** Ask for confirmation, or offer an undo, before calling `onDelete`. You could also add some space or a danger style to separate it from Search.

### Line 6: pasting is blocked
`onPaste={(e) => e.preventDefault()}` stops users from pasting a filter term. That hurts usability and accessibility, and it protects nothing.
**Fix:** Remove the `onPaste` handler.

### Line 6: the input has no label
A placeholder isn't a label. It disappears as soon as the user types, and screen readers don't treat it as one.
**Fix:** Add `aria-label="Filter"` or a visible `<label>`, and use `type="search"`.

### Line 6: typing in the filter does nothing
The input has no `value` or `onChange`, and none of the component's props receive what's typed. So the filter changes nothing.
**Fix:** Add an `onFilterChange` prop (or send the text to `onSearch`) and wire it up, e.g. `onChange={(e) => onFilterChange(e.target.value)}`. Make the input controlled if the parent needs to set or clear it.

### Line 3 (optional): mark it as a toolbar
**Fix:** Add `role="toolbar"` and `aria-label="…"` to the outer `<div>` so assistive technology announces it as one group.