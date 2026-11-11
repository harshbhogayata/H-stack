I found one behaviour bug: any input that uses the `ms` unit throws a `TypeError` instead of returning a number. Don't merge until that's fixed.

### Finding 1: the `ms` unit never parses
- **Where:** `duration.js:2`, `const PART = /(\d+(?:\.\d+)?)(h|m|s|ms)/g;`
- **What goes wrong:** the regex tries `m` before `ms`, and `m` is a valid unit on its own. So for `"500ms"` it matches `500m` and leaves the `s` unmatched. The final check (`duration.js:14`) then sees the leftover `s`, and the call throws `TypeError: invalid duration`. The README says `ms` is a valid unit, so `"500ms"` should give 500 and `"1h500ms"` should give 3 600 500. Both throw now. Any config value written in milliseconds will fail.
- **Verdict:** confirmed. I ran both inputs against the current code and both threw `TypeError`.
- **Severity:** major. `ms` is one of the four units in the spec, and millisecond values are common for timeouts.
- **Fix (not applied, since you said not to change `duration.js`):** put `ms` first, `(ms|h|m|s)`, or use `(h|ms|m|s)`.
- **Cases added to `cases.json`:** `"500ms"` → 500 and `"1h500ms"` → 3600500. Both fail on the current code. The existing `npm test` still passes, because none of its tests uses `ms`.

### Cleared (checked and correct)
- **Grammar enforcement:** the check at `duration.js:14` compares the matched parts with the input after removing whitespace. Any character that isn't whitespace and isn't part of a match makes the lengths differ, so it throws. I confirmed that `"1 h"`, `"1.5.5s"`, `".5s"`, `"1.s"`, `"1H"`, `"10x"` and `"1h\tx"` all throw `TypeError`.
- **Whitespace:** leading, trailing and between parts is accepted (`" 45s "`, `"2m 10s"`, `"1h\n30m"`). Whitespace inside a part is rejected (`"1 h"`).
- **Input that isn't a string, or has no parts:** `null`, `30`, `""` and `"   "` all throw `TypeError`.
- **Arithmetic:** the README examples all give the right totals, units can repeat or come in any order (`"1m5s"` → 65000), and decimals work (`"0.1h"` → 360000).
- **Regex state:** `matchAll` works on a copy of the regex, so reusing the global `PART` between calls doesn't carry anything over.
- **Digits:** `\d` without the `u` flag only matches ASCII 0–9, which is what the spec's `digit` rule asks for.

### Rejected suspicions
- **Floating-point results** (for example from `"0.1h"`): the spec defines the result as number × multiplier, so whatever that formula produces is correct behaviour.

### Not reviewed
- **Extremely long digit strings:** a long enough number becomes `Infinity` and that is what's returned. The spec doesn't say what should happen, so I didn't count it as a bug.
- **Blind review lanes:** I didn't run separate reviewers on this. It's a small utility, not a high-risk change.