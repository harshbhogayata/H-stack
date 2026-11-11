This isn't ready to merge: any input that uses the `ms` unit fails to parse.

## The bug: `ms` never parses

At `duration.js:2`, the pattern lists the units as `(h|m|s|ms)`. JavaScript tries those options from left to right, so in `"500ms"` it matches `m` first and stops there. That leaves `500m` read and the trailing `s` unread. The check on line 14 then sees that the input wasn't fully read and throws a `TypeError`. So **any input containing `ms` throws**, even though the README lists `ms` as a valid unit.

| input | expected | current code |
|---|---|---|
| `"500ms"` | 500 | TypeError |
| `"1.5ms"` | 1.5 | TypeError |
| `"1s 250ms"` | 1250 | TypeError |
| `"1h30m15s500ms"` | 5415500 | TypeError |

I added these four cases to `cases.json`, which is a new file. I ran them against the current code and all four fail as shown. The fix is a one-line change: put `ms` before `m` in the pattern, e.g. `(ms|h|m|s)`. I haven't touched `duration.js`.

## Nothing else is wrong

I checked these against the spec and they behave correctly:
- **Leading, trailing and between-part whitespace** is accepted: `" 45s "`, `"2m 10s"`, and a tab between parts all work.
- **Whitespace inside a part** is rejected: `"1 h"`, `"1.5 s"` and `"1m s"` all throw. Line 14 compares against the input with whitespace removed, which could have let these through, but they still fail.
- **Badly formed numbers** such as `"1.s"` and `"1.5.5s"` throw, as do a unit with no number (`"s"`), extra text (`"1h x"`), an empty or whitespace-only string, and non-strings, including `null` and `new String("1h")`.
- **Repeated units** add up: `"1h1h"` gives 7,200,000.
- **Uppercase units** are rejected, and only the digits 0–9 count as digits.

## Gaps

- **Tests:** `test.js` has no case using `ms`, which is how this got through. `npm test` still passes. The four cases in `cases.json` would be worth adding to it.
- **Fractional results:** decimal inputs can give fractional or slightly inexact millisecond values, because the code multiplies them directly. For example, `"1.5ms"` gives 1.5. That follows the spec as written. If callers pass the result to something like `setTimeout`, you may want the spec to say whether results should be rounded.