I don't think this should merge yet: every input that uses the `ms` unit throws. I found one major bug and one minor one. The existing `test.js` passes but never tries `ms`. I added three cases to `cases.json` and ran them against the current code; all three fail. `duration.js` is unchanged.

## Findings

**1. The `ms` unit never parses** (confirmed, **major**)
`duration.js:2`: `const PART = /(\d+(?:\.\d+)?)(h|m|s|ms)/g;`
- JavaScript tries the alternatives in order, so `m` matches before `ms` gets a chance.
- In `"500ms"` the regex takes `500m`, and the leftover `s` has no number in front of it.
- The check at `duration.js:13` then sees that the matched text doesn't cover the whole input and throws.
- The spec lists `ms` as a unit, but `"500ms"`, `"1ms"` and `"1m500ms"` all throw `TypeError` where they should return 500, 1 and 60 500.
- Millisecond timeouts in config files are common, so real inputs will hit this.
- **Fix:** put `ms` first, as in `(ms|h|m|s)`.
- **Cases added:** `"500ms"` → 500 and `"1m500ms"` → 60500.

**2. Decimal values can give results with a tiny floating-point error** (confirmed, **minor**)
`duration.js:10`: `total += Number(number) * UNIT_MS[unit];`
- The spec says the result is number × unit factor, so `"1.1h"` should be exactly 3 960 000. The code returns `3960000.0000000005`.
- I tried a range of decimals and found 1,451 that should give a whole number but don't, for example `"2.3h"` → `8279999.999999999` and `"0.009h"` → `32399.999999999996`.
- **Impact is low:** `setTimeout` copes with fractions, but checks like `=== 3960000` or integer validation will fail.
- **Fix:** round the result (`Math.round(total)`), or do the maths in integers before scaling.
- **Case added:** `"1.1h"` → 3960000.

## Rejected suspicions
These were checked, hold up, and don't need re-checking:
- **Spaces inside a part** (`"1 h"`, `"1 0s"`, `"1 ms"`) correctly throw. The check at line 13 requires every non-whitespace character to be matched, and a match can't span a space.
- **Malformed numbers** (`".5s"`, `"1.s"`, `"1.5.5s"`) correctly throw.

## Cleared
- **Grammar parsing:** the four README examples, units in any order and repeated, leading, trailing and in-between whitespace (including tabs, newlines and non-breaking spaces), and uppercase units correctly rejected.
- **Error handling:** a `TypeError` for non-strings (`42`, `null`), for `""` and for whitespace-only input.
- **Existing tests:** `node test.js` passes.

## Not reviewed
- Very large numbers that lose precision (e.g. 20-digit values). The spec says nothing about a limit.
- Unicode digits. JavaScript's `\d` only matches 0–9, which matches the spec.