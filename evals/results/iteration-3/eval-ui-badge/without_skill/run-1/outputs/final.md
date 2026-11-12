I added `StatusBadge` as `components/StatusBadge.jsx` plus `components/StatusBadge.css`, following the README's rule of one .jsx and one .css per component, styled only with tokens. I haven't run it, because the repo has no package.json, build setup or tests.

```jsx
<StatusBadge status="ok" />                 // "OK"
<StatusBadge status="warn" />               // "Warning"
<StatusBadge status="error">Failed</StatusBadge>  // your own text
```

- **Look:** it uses the same pill shape, padding and font size as `Button`. Each status takes its text and background colours from the matching tokens (`--c-ok-*`, `--c-warn-*`, `--c-err-*`), so dark mode works through the existing `prefers-color-scheme` overrides in `styles/tokens.css`.
- **Text:** with no children it shows OK, Warning or Error. Anything you pass as children replaces that.
- **Unknown status:** a missing or unrecognised `status` shows as `ok`. That means a typo looks like a healthy status instead of failing visibly. If you'd rather it flag the mistake, I can make it fall back to `error` or throw.