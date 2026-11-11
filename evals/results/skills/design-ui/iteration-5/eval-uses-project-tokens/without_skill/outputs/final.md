I added `SettingsPage.jsx` and a matching `settings.css`. I haven't run it: the repo has no `package.json` or build setup, so nothing compiled or rendered it.

- **Form:** it has a "Display name" text field, an "Email notifications" checkbox (marked as a switch for screen readers), and a Save button.
- **Save:** clicking Save calls `onSave({ displayName, emailNotifications })`. The name has leading and trailing spaces trimmed first. The page doesn't store anything itself; whatever uses it decides what happens on save.
- **Starting values:** you can pass `initialSettings` to fill the form in. Without it, the name starts empty and notifications start on.
- **Reuse:** the Save button is your existing `Button`, and the styles use the colour, corner-radius and font variables from `theme.css`, so it matches the rest of the UI. I put the styles in their own CSS file, the same way `Button.jsx` has `button.css`.

Example usage:
```jsx
<SettingsPage
  initialSettings={{ displayName: "Ada", emailNotifications: false }}
  onSave={(settings) => api.updateSettings(settings)}
/>
```

The component imports `settings.css` directly, so your bundler needs to support CSS imports. `theme.css` has to be loaded somewhere higher up in the app for the variables to work.