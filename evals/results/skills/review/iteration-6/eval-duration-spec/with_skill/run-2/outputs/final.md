I found one serious bug in `duration.js` (any duration using `ms` fails) and one minor one, so I'd fix it before merging. I added a case to `cases.json` for each, and the current code gets all three wrong. I didn't change `duration.js`, and the existing `npm test` still passes.

## Findings

**1. Durations in `ms` always throw (confirmed, major)**
`duration.js:2` reads `const PART = /(\d+(?:\.\d+)?)(h|m|s|ms)/g;`
The regex tries the units in order, so it matches `m` before it gets to `ms`. In `"500ms"` it takes `500m` and leaves the `s` over. The leftover check at line 13 then fails, so `parseDuration("500ms")` throws a `TypeError` instead of returning 500, and `"1m500ms"` throws instead of returning 60500. The spec lists `ms` as a unit, and this module reads timeouts, where `ms` is common. The fix is to put `ms` before `m`: `(ms|h|m|s)`. No current test uses `ms`, which is why the tests pass.
Cases added: `"500ms"` → 500, `"1m500ms"` → 60500.

**2. Some decimals come back slightly off (confirmed, minor)**
`duration.js:11` reads `total += Number(number) * UNIT_MS[unit];`
`parseDuration("1.1h")` returns `3960000.0000000005` instead of 3,960,000, because the decimal is converted to binary before it's multiplied. It's harmless when the value goes to a timer, but an exact comparison will fail. A fix is to work out the result from the digit string, or round to the precision the input supports.
Case added: `"1.1h"` → 3960000.

## Rejected (checked, and they behave correctly)
- **Whitespace inside a part** (`"1 h"`, `"1 0s"`, `"1. 5s"`): all whitespace is removed before the comparison, but no match can span a space. The characters before the space are never matched, so the comparison fails and these throw, as the spec requires.
- **Malformed numbers** (`".5s"`, `"1.s"`, `"10s5"`): all throw.
- **Uppercase units** (`"1H"`): throws, because the regex is case-sensitive.
- **Non-ASCII digits:** `\d` without the `u` flag only matches 0–9.

## Cleared
- The grammar, unit values, summing and repeated units: `"1h30m"`, `"2m 10s"`, `" 45s "` and `"1h 1h"` give the right answers.
- Non-string and empty or whitespace-only input throws a `TypeError` (line 5).
- Space, tab and newline between parts work.

## Not reviewed
- **Other Unicode whitespace** (for example a non-breaking space): the sandbox blocked the command that would test it. Reading the code, it should be handled the same way as an ordinary space, but I haven't confirmed that.
- **String objects** (`new String("1h")`): these throw. The spec doesn't say whether that's right, and `cases.json` can't represent one anyway.