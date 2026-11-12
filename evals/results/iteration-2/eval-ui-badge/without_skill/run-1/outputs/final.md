I added a `StatusBadge` component. It's built the same way as `Button`: a `.jsx` file and a `.css` file, styled only with tokens from `styles/tokens.css`. I haven't run or rendered it, since the repo has no build or test setup, and I haven't committed it.

- **`components/StatusBadge.jsx`**: `<StatusBadge status="ok|warn|error">` shows the text "OK", "Warning" or "Error". Anything you pass as children replaces that text, e.g. `<StatusBadge status="warn">Degraded</StatusBadge>`.
- **`components/StatusBadge.css`**: a pill shape with the same padding, corner radius and font size as `Button`. Each status uses its matching colour tokens (`--c-ok-*`, `--c-warn-*` and `--c-err-*`), so dark mode works automatically through the existing media query.

**Decision for you:** if a status other than the three is passed, the badge shows as an error, so a bad value stands out instead of quietly looking fine. If you'd rather it fail loudly or render nothing, that's a one-line change.