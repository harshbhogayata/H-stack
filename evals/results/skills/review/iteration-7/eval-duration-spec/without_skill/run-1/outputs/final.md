I don't think this should merge yet. `duration.js` has two bugs against the spec in `README.md`, and the first one means any input using the `ms` unit fails. I added 4 cases to `cases.json`, and I ran them against the current code to confirm it gets all 4 wrong. `duration.js` is unchanged, and the existing `npm test` still passes.

## Bugs

### 1. Every input using the `ms` unit throws a TypeError (high severity)
`duration.js:2`: in `/(\d+(?:\.\d+)?)(h|m|s|ms)/g`, the unit alternatives are tried left to right, so in `"500ms"` the `m` matches first. The leftover `s` doesn't count as a part, so the check on line 14 fails and the function throws. Every valid input that uses `ms` is rejected, for example `"500ms"`, `"10ms"`, `"1m30ms"` and `"1m1s1ms"`. For a function that reads config timeouts, a perfectly valid setting would crash at startup.
- **Fix:** put `ms` before `m`, as in `(ms|h|m|s)`, or write it as `(h|ms?|s)`.
- **Cases added:** `"500ms"` → 500 and `"1m30ms"` → 60030. The code currently throws on both.

### 2. Decimal inputs give slightly wrong numbers (medium severity)
`duration.js:11`: `Number(number) * UNIT_MS[unit]` uses floating-point maths, so some decimals come out a tiny bit off instead of the whole number the spec defines:
- `"1.1h"` → `3960000.0000000005` (spec: 3,960,000)
- `"1.005s"` → `1004.9999999999999` (spec: 1,005)

This breaks exact comparisons, and anything that rounds down (`Math.floor`, `| 0`) will be off by 1 ms.
- **Fix:** split the number at the decimal point and do the arithmetic on whole numbers, multiplying the fractional digits by `unit / 10^len`. Rounding the total isn't enough, because the spec allows results that aren't whole numbers, such as `"0.5ms"` → 0.5.
- **Cases added:** `"1.1h"` → 3960000 and `"1.005s"` → 1005.

## Checked and correct
- Non-string input and empty or whitespace-only strings throw a TypeError.
- Uppercase units (`1H`), `.5s`, `1.s` and whitespace inside a part (`1 h`, `1h3 0m`) are all rejected.
- Whitespace between parts works for tabs, newlines and Unicode spaces (non-breaking space, ideographic space, `\uFEFF`), matching "any whitespace character".
- Repeated units and units in any order work (`1h1h`), as do leading zeros (`007s`).
- Parts are only joined back together after whitespace is stripped, but any stray characters still make the check fail, so nothing invalid gets through.

## Test gaps
`test.js` never uses the `ms` unit, which is how bug 1 got past it. It also has no fractional-hour or fractional-minute cases. The entries in `cases.json` would close both gaps.