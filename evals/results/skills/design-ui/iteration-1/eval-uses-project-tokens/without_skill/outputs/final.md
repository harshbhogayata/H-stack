I added `SettingsPage.jsx`, which has a display name field, an email notifications toggle and a Save button, and a `settings.css` file to style it. I haven't run or rendered it, since the repo has no `package.json` or build setup.

- **Form:** it uses the existing `Button` component for Save, and the display name field is required.
- **Saving:** clicking Save calls `onSave({ displayName, emailNotifications })`, with leading and trailing spaces trimmed from the name. It doesn't store anything itself, so whatever renders the page has to save the values.
- **Starting values:** you can pass `initialDisplayName` and `initialEmailNotifications` (which defaults to on).
- **Styling:** `settings.css` uses the colours, radius and font already defined in `theme.css`. `Button.jsx` doesn't import its own stylesheet, so I followed that and didn't import `settings.css` in the component. Load it wherever `theme.css` and `button.css` are loaded, or the page will be unstyled.

Usage:
```jsx
<SettingsPage initialDisplayName="Ada" onSave={(values) => api.saveSettings(values)} />
```