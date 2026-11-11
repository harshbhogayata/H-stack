I found one real bug: `duration.js` cannot parse the `ms` unit at all. Any input containing milliseconds throws a `TypeError`. I'd hold the merge until it's fixed. I didn't change `duration.js`. The existing `test.js` passes, but none of its tests uses `ms`.

## Findings

**1. The `ms` unit always throws: confirmed, high severity**
- **Where:** `duration.js:2`, in `const PART = /(\d+(?:\.\d+)?)(h|m|s|ms)/g;`
- **Cause:** JavaScript regex alternation takes the first option that matches, not the longest. In `"500ms"`, `m` matches before `ms` gets a chance, so the part read is `"500m"`. The leftover `s` has no number in front of it, so it isn't read as a part. The final check at `duration.js:13` then sees that what was read (`"500m"`) doesn't equal the input (`"500ms"`) and throws.
- **Failure:** `parseDuration("500ms")` throws `TypeError` when the spec says 500. The same happens with `"1m500ms"`, `"1s 250ms"` and `"1.5ms"`. The spec lists `ms` as a valid unit, and this function reads timeouts from config files, where values like `"250ms"` are likely.
- **Fix:** put `ms` before `m` in the regex, i.e. `(ms|h|m|s)`.
- **Cases added:** I created `cases.json` with 4 cases, and the current code fails all of them:
  - `"500ms"` → 500
  - `"1m500ms"` → 60500
  - `"1s 250ms"` → 1250
  - `"1.5ms"` → 1.5

**2. Small rounding errors in some results: confirmed, minor, optional**
- **Where:** `duration.js:10`, in `total += Number(number) * UNIT_MS[unit];`
- `"1.005s"` gives 1004.9999999999999 instead of 1005. This is still `number × 1000` as the spec states, so it isn't a spec violation. Round the result only if you want whole milliseconds.

## Checked and fine
These all behave as the spec says, so nobody needs to re-check them:
- **The spec examples** give the right results: `1h30m`, `1.5s`, `2m 10s`, ` 45s `.
- **Units repeated or in any order:** `"1s1s"` gives 2000.
- **Whitespace:** leading, trailing and between parts is accepted, including newlines and non-ASCII spaces. Whitespace inside a part is rejected: `"1 h"`, `"1. 5s"`.
- **Malformed numbers are rejected:** `".5s"`, `"1.s"`, `"1.5.5s"`.
- **Uppercase units are rejected:** `"1H"`.
- **Only ASCII digits are accepted:** full-width and Arabic-Indic digits are rejected.
- **Empty and non-string inputs are rejected:** `""`, `null`, `30`.
- **The final check is sound.** It compares the parts read against the input with whitespace removed. Any leftover character that isn't whitespace makes them differ, so invalid text can't slip through.

**Not reviewed:** nothing. The change is only `duration.js`, about 20 lines, and I read all of it.