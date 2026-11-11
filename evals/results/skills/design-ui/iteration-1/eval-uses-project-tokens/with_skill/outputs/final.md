I added `SettingsPage.jsx`, which has a display name field, an email notifications switch and a **Save changes** button. I haven't run or rendered it: the repo has no `package.json`, build setup or browser, so I couldn't take a screenshot or run it in a browser. The checks below come from reading the code.

**How it fits the project**
- **Existing pieces:** it uses your `Button` component and the tokens in `theme.css`. The form is a card on `--color-surface`, set in IBM Plex, with the sky-blue `--color-accent` for the switch's "on" state and for focus outlines.
- **Display name:** the input has a visible label and a hint underneath. If the name is empty or longer than 50 characters, an error appears right below the field, and screen readers read it out with the field.
- **Email notifications:** the switch is a standard checkbox styled to look like a switch, so keyboard use, form submission and screen-reader announcements work as they normally do.
- **Save:** pass the page an `onSave({ displayName, emailNotifications })` function, which can be async. While it runs, the button reads "Saving…" and is disabled. Afterwards, "Changes saved." or a "Couldn't save" message appears next to the button and is read out to screen-reader users.
- **Starting values:** `initialDisplayName` and `initialEmailNotifications` set what the form shows when it opens.

**New styles and why**
- **`settings.css`:** page and form layout, built only from the existing tokens.
- **`theme.css`:** added `--color-danger: #fca5a5` for error text and borders, because the theme had no error colour. It reads clearly on both the background and the card colours.
- **`button.css`:** added a visible keyboard focus outline to `.btn`, which had none, and a dimmed style for when it's disabled. These changes affect every button in the app, not just this page.

**Accessibility checks:** every field has a visible label. Errors appear next to the field, and the save result next to the button. Every control has a visible keyboard focus outline. Text should be easy to read against the dark colours. The switch animation moves the knob without changing layout, takes 150ms, and turns off when the user has asked for reduced motion. Pasting isn't blocked, and nothing on the page is destructive, so there's no confirmation step.

**Not verified:** how it looks on screen and how it behaves at runtime.