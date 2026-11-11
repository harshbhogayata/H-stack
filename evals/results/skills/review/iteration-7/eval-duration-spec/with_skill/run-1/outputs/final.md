I found one bug, and it should block the merge: any input that uses the `ms` unit throws a `TypeError` instead of returning a value. The existing tests (`npm test`) pass because none of them use `ms`.

### Finding 1: the `ms` unit never parses
- **Where:** `duration.js:2`, `const PART = /(\d+(?:\.\d+)?)(h|m|s|ms)/g;`
- **Failure:** in the pattern `(h|m|s|ms)`, the regex tries `m` before `ms` and stops at the first match. For `"500ms"` it matches `"500m"` and the trailing `s` is left over. The final check (`consumed !== input.replace(/\s+/g, '')`) then sees `"500m"` ≠ `"500ms"` and throws. Every input containing `ms` fails, alone or mixed with other units (`"1m1ms"`, `"10ms 5s"`). There's always a leftover `s`, so it never returns a wrong number; it just always throws.
- **Spec:** README lists `unit := … | "ms"` with `× 1`, so `"500ms"` should give 500.
- **Verdict:** confirmed (run against the current code).
- **Severity:** major. The README says this function reads timeouts from config files, and millisecond timeouts are common, so any config using `ms` would fail to load.
- **Fix:** put `ms` first, `(ms|h|m|s)`. I haven't changed `duration.js`, as you asked.

**Cases added to `cases.json`.** I checked that the current code fails all three: each throws `TypeError` instead of returning the number.
- `"500ms"` → 500
- `"1.5ms"` → 1.5
- `"1m30s250ms"` → 90250

### Checked and not a bug
- **The examples in the README:** `"1h30m"`, `"1.5s"`, `"2m 10s"` and `" 45s "` all return the right values.
- **Repeated or out-of-order units:** `"1s2s"` gives 3000, which is correct.
- **Whitespace between parts:** a non-breaking space works (`"1h\u00a030m"` gives 5400000). The spec allows any whitespace character, so this is correct.
- **Bad input throws `TypeError` as the spec requires:**
  - an empty string or only spaces
  - whitespace inside a part, like `"1 h"`
  - an uppercase unit, like `"1H"`
  - a number without a leading digit or without digits after the dot, like `".5s"` or `"5.s"`
  - an unknown unit, like `"10x"`
  - things that aren't strings: a number, `null`, `undefined`, an array
- **Could the "consumed" check let stray characters through?** No. Matches never contain whitespace, so the matched text can only equal the input with whitespace removed if every other character was part of a valid part.

### Not reviewed
- `test.js` and `package.json` beyond running them. `npm test` passes.