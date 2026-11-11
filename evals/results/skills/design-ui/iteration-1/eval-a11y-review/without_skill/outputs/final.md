I found 9 UI correctness problems in `Toolbar.jsx`, listed in file order. I haven't edited anything.

**1. `Toolbar.jsx:3`: the toolbar covers the whole screen.**
`position: fixed; bottom: 0; height: '100vh'` turns the toolbar into a full-height layer over the page, so it hides content and catches clicks meant for the page. It also has no `left`, `right` or `width`, so its width just fits its contents. On mobile, `100vh` also counts the area behind the browser's address bar.
*Fix:* give it a real toolbar size, for example `{ position: 'fixed', left: 0, right: 0, bottom: 0, height: 48, paddingBottom: 'env(safe-area-inset-bottom)' }`, or move this into the `.toolbar` CSS class. Also add bottom padding to the page so the last content isn't hidden behind the bar.

**2. `Toolbar.jsx:4`: search is a clickable `<div>`.**
It can't be reached with Tab, doesn't respond to Enter or Space, and screen readers don't announce it as a button.
*Fix:* `<button type="button" onClick={onSearch} aria-label="Search">…</button>`.

**3. `Toolbar.jsx:4`: the search icon is a solid black disc.**
The `<circle>` uses the default `fill="black"` with no stroke. That looks like a dot, not a magnifier, and it disappears on dark themes.
*Fix:* `<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />`, and add the magnifier handle if that's the intended icon.

**4. `Toolbar.jsx:5`: the delete icon draws nothing.**
A `<path>` that is just a line has nothing to fill, and the default `stroke` is `none`, so the button renders empty.
*Fix:* `<path d="M2 2l12 12" stroke="currentColor" strokeWidth="2" />`. If it's meant to be an "×", add the second stroke `M14 2L2 14`.

**5. `Toolbar.jsx:5`: the delete button has no accessible name.**
It contains only an icon, so screen readers announce it as just "button".
*Fix:* add `aria-label="Delete"`, and a `title` if you want a tooltip.

**6. `Toolbar.jsx:5`: the delete button has no `type`.**
The default is `type="submit"`, so if the toolbar is ever placed inside a `<form>`, clicking delete also submits the form.
*Fix:* add `type="button"`.

**7. `Toolbar.jsx:4–5`: the SVG icons aren't hidden from assistive tech.**
Screen readers may announce empty graphics, and older Edge/IE can give the SVGs their own focus stop.
*Fix:* add `aria-hidden="true" focusable="false"` to each `<svg>`.

**8. `Toolbar.jsx:6`: pasting into the filter is blocked.**
`onPaste={e => e.preventDefault()}` stops users from pasting text into a search field, which breaks a normal action and hurts users who rely on paste, such as people using assistive tech or password managers.
*Fix:* remove the `onPaste` handler. If the pasted input needs cleaning, clean the value in `onChange` instead.

**9. `Toolbar.jsx:6`: the filter has no label and isn't connected to anything.**
The placeholder is its only label, and placeholder text disappears as you type and isn't a reliable accessible name. There's also no `value`/`onChange` and no prop to pass the text out, so typing in it does nothing.
*Fix:* `<input type="search" aria-label="Filter" value={filter} onChange={e => onFilterChange(e.target.value)} placeholder="Filter" />`, and add `filter` and `onFilterChange` props.

**Optional (UX):** delete fires immediately with no confirmation or undo. If the action can't be reversed, consider showing a confirmation or offering undo.