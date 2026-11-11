Don't merge yet: the `ms` unit doesn't work. Every input with milliseconds throws a `TypeError`, so a config value like `timeout: "500ms"` would fail. The other spec rules behave correctly, and the existing `npm test` passes.

## The bug: `ms` is never matched

`duration.js:2`: `const PART = /(\d+(?:\.\d+)?)(h|m|s|ms)/g;`

The regex tries the units in the order listed and takes the first one that fits. So in `"500ms"` it reads `500` as minutes and leaves the `s` with no number in front of it. The final check sees text that wasn't matched and throws.

| Input | Spec | Current code |
|---|---|---|
| `"500ms"` | 500 | TypeError |
| `"1ms"` | 1 | TypeError |
| `"1h 250ms"` | 3 600 250 | TypeError |
| `"2s500ms"` | 2 500 | TypeError |
| `"1.5ms"` | 1.5 | TypeError |

These five are now in `cases.json`, and I ran each one against the current code: all five fail as shown. The fix is to put `ms` before `m` in the regex, e.g. `(ms|h|m|s)`. I left `duration.js` unchanged as you asked.

`test.js` didn't catch this because it never uses `ms`. It would be worth adding at least `"500ms"` and a mixed case like `"1h 250ms"`.

## The rest of the spec checks out
- **Whitespace:** it's allowed before, between and after parts (`" 45s "`, `"\t1h\n30m"`) and rejected inside a part (`"1 h"`). The check strips whitespace and compares it with the matched text, so every non-space character has to belong to a matched part.
- **Invalid input throws:** non-strings, `""`, whitespace-only, uppercase units (`"1H"`), a missing unit (`"5"`), a missing number (`"h"`), a bad decimal (`"1.h"`) and trailing garbage (`"1h30"`).
- **Valid input:** the README examples, repeated units and any unit order all give the right sums.

## Minor note (not a bug against the spec)
The spec doesn't say what happens with extremely long digit strings. They can add up to `Infinity` instead of throwing. That's worth deciding on, since the values come from config files.