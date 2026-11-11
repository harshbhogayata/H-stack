I added `SettingsPage.jsx` with a display name field, an email notifications switch and a "Save changes" button, plus a stylesheet, `settings.css`. I couldn't build or run it: my attempts to syntax-check the file were blocked by the permission prompts, and there's no app in the repo to render it in.

**What it does**
- **Display name:** labelled text field with a short hint. It's checked when you leave the field and when you save: it can't be empty and can be at most 50 characters. If it fails, the error appears under the field, is announced by screen readers, and the cursor moves back to the field.
- **Email notifications:** an on/off switch. It's a real checkbox underneath, so the keyboard and screen readers handle it normally.
- **Save changes:** greyed out until something changes and while a save is in progress. It calls `onSave(values)`, which can be async. "Changes saved." or an error ending in "Try again." appears next to the button and is announced.
- **Props:** `SettingsPage({ initialValues, onSave })`. It's exported both by name and as the default.

**How it fits the project**
- It uses your existing `Button` and the colours, corner radius and font from `theme.css`.
- I added two things the project didn't have:
  - **An error red, `#f87171`:** there was no error colour.
  - **A focus outline in your accent colour:** `.btn` has no visible focus style. I scoped it to the settings page rather than changing the shared button.

  If you'd rather make the error red a shared colour in `theme.css`, or add the focus outline to every button, say so and I'll move them.

**Accessibility checks applied:** labels and hints linked to every input, a visible keyboard focus outline, errors next to where they happen, colour contrast that meets the WCAG AA standard on the dark surface (by calculation, not measured), animations kept under 200 ms and turned off when the user asks for reduced motion, and paste not blocked.

Not verified: no build, no render in a browser, no screenshot.