I added `SettingsPage.jsx` and a `settings.css` file to go with it. I haven't run or rendered it, because the repo has no `package.json` or build setup to do that with.

- **The form:** it has a required display name field, an email notifications checkbox (on by default), and a Save button. The button uses the existing `Button` component.
- **Saving:** pressing Save calls `onSave({ displayName, emailNotifications })`. Leading and trailing spaces are trimmed from the name. It doesn't send anything anywhere itself, so you need to pass in a function that does the actual saving.
- **Starting values:** you can pre-fill the form with an `initialSettings` prop.
- **Styling:** `settings.css` only uses the existing tokens from `theme.css` (colours, corner radius, font). That file still needs to be loaded somewhere in your app.

Example:

```jsx
<SettingsPage
  initialSettings={{ displayName: "Ada", emailNotifications: false }}
  onSave={(settings) => api.updateSettings(settings)}
/>
```