I added `SettingsPage.jsx` and `settings.css`. The page has a display name field, an email notifications switch, and a "Save changes" button. It uses your existing `Button` and the colours and font from `theme.css`. I didn't render it or run it: there's no app, bundler or `package.json` in the repo to run it in.

**How it behaves**
- **Display name:** it can't be empty and is capped at 50 characters. The error shows under the field once you've left it or tried to save.
- **Email notifications:** this is a standard checkbox styled as an on/off switch, so the keyboard and screen readers handle it normally.
- **Saving:** the button stays disabled until something has changed, and reads "Saving…" while a save is in progress. "Changes saved." or the error message appears next to the button and is announced to screen readers.
- **Your save function:** you pass it in as `onSave` and it receives the display name and the switch value. If it throws, the user sees the error's message, or a fallback "Your changes weren't saved…" message if it has none.

**Changes to shared files**
- **`theme.css`:** added colours for secondary text, borders, errors and success, plus a spacing scale. The theme had none of these, and this keeps raw colour and size values out of the component.
- **`button.css`:** added a visible keyboard focus outline and a disabled style. These now apply to every `Button`, not just this page.

**Accessibility checks:** these were done by reading the code, not in a browser.
- Every field has a label and a hint linked to it.
- Errors appear next to where they happen.
- Keyboard focus is visible.
- The switch animation is short and turns off when the user prefers reduced motion.
- The layout fits mobile screens properly, including phones with a notch or home bar.
- I estimated the text contrast against the dark background by hand and it meets the WCAG AA standard.

Not verified: the page hasn't been rendered in a browser. Also, `SettingsPage.jsx` imports `settings.css` directly, so whatever bundler you use needs to support CSS imports.