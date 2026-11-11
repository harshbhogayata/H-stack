I added `SettingsPage.jsx` and a matching `settings.css`. I haven't run or rendered it, because the repo has no `package.json` or build setup to do that with.

**What the form has:**
- A "Display name" text field, which is required. Leading and trailing spaces are removed when you save.
- An "Email notifications" checkbox, which starts ticked.
- A Save button, which reuses the existing `Button` from `Button.jsx`.

**How it's used:** you can pass `initialSettings` (`{ displayName, emailNotifications }`) to pre-fill the form. Clicking Save calls `onSave({ displayName, emailNotifications })`. Nothing is saved anywhere yet, so you'll need to supply that `onSave` function to store the settings.

**Styling:** `settings.css` uses the colour, corner-radius and font variables from `theme.css`, the same way `button.css` does.