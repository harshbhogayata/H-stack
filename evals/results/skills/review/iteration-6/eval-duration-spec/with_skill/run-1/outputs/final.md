I found one bug, and it should block the merge: `parseDuration` rejects every input that uses the `ms` unit. Nothing else I checked breaks the spec. I added four cases for the bug to `cases.json`, and the current code gets all four wrong. `duration.js` is unchanged, and the existing `node test.js` still passes.

## Finding

**`ms` unit can never be parsed** — confirmed, severity **major**
- Where: `duration.js:2`, `const PART = /(\d+(?:\.\d+)?)(h|m|s|ms)/g;`
- What goes wrong: the regex tries the units in order, so `m` matches before `ms` is ever tried. In `"500ms"` it matches `500m` and leaves a lone `s` that doesn't match anything. The check at line 13 then sees that not all of the input was used and throws `TypeError: invalid duration: "500ms"`.
- Effect: all four `ms` cases below throw a `TypeError`. The spec lists `ms` as a valid unit (`× 1`), and this module reads timeouts from config, where values like `500ms` are common. The current tests miss it because none of them uses `ms`.
- Fix (for whoever patches it): list `ms` before `m`, i.e. `(ms|h|m|s)`.

Cases added to `cases.json`:

| input | expected | current result |
|---|---|---|
| `"500ms"` | 500 | TypeError |
| `"1m500ms"` | 60500 | TypeError |
| `"1.5ms"` | 1.5 | TypeError |
| `"1s 250ms"` | 1250 | TypeError |

## Checked and rejected
- **Removing all whitespace before the final check (line 13):** this looks like it would wrongly accept `"1 h"` or `"1 0s"`, but it doesn't. A matched part can't contain whitespace, and every non-whitespace character has to be inside a match. Together those enforce `ws* part (ws* part)* ws*`. `"1 h"`, `"1.5 s"`, `"1 0s"` and `"1h 3 0m"` all correctly throw.
- **Floating-point drift:** `"1.1s"`, `"0.1h"` and `"2.3m"` return exactly 1100, 360000 and 138000.

## Cleared
- All four README examples return the right values.
- Units in any order and repeated: `"1h1h"` gives 7200000.
- Tabs and newlines count as whitespace.
- Correctly rejected with `TypeError`: uppercase units (`"1H"`), malformed numbers (`"1.s"`, `".5s"`), empty or whitespace-only strings, and non-strings (`null`, `5`).

## Not reviewed
- Unicode whitespace beyond tabs and newlines (for example a non-breaking space): a local hook blocked the probe. JS `\s` and `trim()` should treat these the same way, but I didn't confirm it by running anything.
- Very large inputs: precision past `Number.MAX_SAFE_INTEGER` isn't covered by the spec.