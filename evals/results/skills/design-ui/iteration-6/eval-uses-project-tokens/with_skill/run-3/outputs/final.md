I added `SettingsPage.jsx`, a settings form with a display name field, an email notifications switch and a "Save changes" button. I didn't render or run it: the repo has no `package.json` or build setup, so there was nothing to run it with.

**Files**
- **`SettingsPage.jsx`**: the component. It takes `initialValues` (`{ displayName, emailNotifications }`) and `onSave(values)`. `onSave` can return a promise. While it runs, the button reads "Saving…" and is disabled. When it finishes, "Changes saved." appears; if it fails, an error appears next to the button. The Save button is your existing `Button` component.
- **`settings.css`**: the styles. Every colour, the radius and the font come from your theme variables.
- **`theme.css`**: your theme had nothing for these, so I added new values there rather than writing raw values into the component:
  - `--color-text-muted` (#94a3b8), for hint text
  - `--color-border` (#334155), for the input and the switch's off state
  - `--color-danger` (#f87171), for errors
  - a spacing scale, `--space-1` to `--space-6`

  The theme only has one (dark) colour set, so there was no light version to add.

**Accessibility checks applied**
- **Labels:** every control has a visible label and a hint linked to it, so screen readers read both.
- **Switch:** it's a real checkbox marked as a switch, so the keyboard and screen readers handle it without custom code.
- **Errors:** saving with an empty name shows "Enter a display name…" under the field, marks the field invalid and moves focus to it. A failed save shows its error beside the button. Both messages are announced to screen readers.
- **Focus:** the input, switch and button show a visible accent-coloured outline when reached by keyboard.
- **Motion:** the switch slides in 150 ms and doesn't animate at all when the user's system asks for reduced motion.
- **Contrast:** I picked the muted and error colours to stay readable against the surface colour (about 5.5:1 or better, above the WCAG AA minimum of 4.5:1).
- **Paste** isn't blocked anywhere.