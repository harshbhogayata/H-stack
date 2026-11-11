I added `SettingsPage.jsx` and `settings.css`. I haven't run or rendered it: the repo has no `package.json` or build setup, so there was nothing to test it with.

**`SettingsPage.jsx`**
- It's a form with a "Display name" text input (required) and an "Email notifications" checkbox.
- The Save button is your existing `Button` component, so it keeps the `.btn` styling.
- When you save, it calls `onSave({ displayName, emailNotifications })`. The display name has leading and trailing spaces removed, and nothing is sent to a server; whoever uses the page decides what happens with the values.
- You can set the starting values with `initialDisplayName` (default empty) and `initialEmailNotifications` (default on).

**`settings.css`** uses only the colours, corner radius and font already defined in `theme.css`, so the page matches the current dark theme.

Usage:
```jsx
<SettingsPage initialDisplayName="Ada" onSave={(s) => api.saveSettings(s)} />
```