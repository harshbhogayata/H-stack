I added `SettingsPage.jsx`, a settings form with a display name field, an email notifications switch and a **Save changes** button. It hasn't been run or rendered: the repo has no `package.json`, bundler or test setup, so I haven't seen it on screen or checked contrast with a tool.

**How it works**
- It takes optional `initialValues` (`{ displayName, emailNotifications }`) and an `onSave(values)` callback. `onSave` can be synchronous or return a promise; if it throws or rejects, the form shows a save error.
- The display name is trimmed on save. An empty name or one over 50 characters shows a message under the field saying what to fix.
- While saving, the button reads "Saving…" and is disabled. Afterwards a polite "Changes saved." message appears, and it clears as soon as you edit again. A failed save shows a retry message next to the button.

**Styling:** it uses the project's existing `Button` component and the colour, radius and font values from `theme.css`. The rest is in a new `settings.css`. The theme had nothing for borders, secondary text, errors, focus or spacing, so I added these to `theme.css` rather than putting raw values in the component: `--color-text-muted`, `--color-border`, `--color-danger`, `--focus-ring` and `--space-1` to `--space-4`. The theme only has a dark palette, so there are no light-mode versions. I also gave `.btn` in `button.css` a visible keyboard focus outline and a disabled style, since it had neither.

**Accessibility, checked by reading the code:**
- Every input has a `<label>`, and hint and error text is linked to its field so screen readers announce it.
- The switch is a native checkbox marked as a switch, so it works with the keyboard without custom code.
- The fields, switch and button all have a visible focus outline.
- Errors appear next to the field or button they relate to, and paste isn't blocked.
- There's no animation, so reduced-motion settings don't come into play.
- Contrast is calculated, not measured: about 5.7:1 for the grey hint text and about 5:1 for the red error text against the panel background, both above the AA minimum.

The `.btn` padding was already a fixed pixel value; I left it as it was.