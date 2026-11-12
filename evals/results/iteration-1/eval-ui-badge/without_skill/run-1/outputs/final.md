I added a `StatusBadge` component in `components/StatusBadge.jsx` with its styles in `components/StatusBadge.css`, following the same setup as `Button`. I haven't rendered it: the repo has no `package.json`, build or test setup to run it with.

```jsx
<StatusBadge status="ok" />                 // shows "OK"
<StatusBadge status="warn" />               // shows "Warning"
<StatusBadge status="error">Failed</StatusBadge>  // your own text replaces the default
```

- **Colours:** each status uses the matching colour pair from `styles/tokens.css`, so dark mode works automatically. The `error` status uses the `--c-err-*` colours.
- **Shape:** it's a rounded pill using the same padding and font size as `Button`.
- **Unknown status:** any value other than `ok`, `warn` or `error` shows as `ok`.

The changes aren't committed.