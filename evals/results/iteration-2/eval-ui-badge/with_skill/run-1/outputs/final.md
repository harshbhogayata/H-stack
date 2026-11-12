I added `StatusBadge` for the `ok`, `warn` and `error` statuses. The repo has no `package.json`, build or test setup, so nothing has been run or rendered.

- **`components/StatusBadge.jsx`**: `<StatusBadge status="ok" | "warn" | "error">`. By default it shows "OK", "Warning" or "Error"; any children you pass replace that text. Screen readers skip the small icon in front (✓, !, ✕).
- **`components/StatusBadge.css`**: built only from the existing tokens in `styles/tokens.css`, with the same pill shape and padding as `Button`. Dark mode works through the tokens' existing dark values, and I didn't add any new tokens.

The status is shown by both text and an icon, not only by colour. The badge is a plain `<span>`; if it changes while someone is on the page and should be announced, wrap it in an element with `aria-live`. An unrecognised `status` value gets no colours and no default text.

Not verified: the JSX hasn't been compiled, the badge hasn't been seen in a browser in light or dark mode, and colour contrast hasn't been measured.