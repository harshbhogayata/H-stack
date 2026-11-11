I found two behaviour bugs, so I don't think `duration.js` is ready to merge. I added 4 cases to `cases.json` and ran them: the current code gets all 4 wrong. The existing `npm test` still passes because it doesn't cover either bug. I didn't change `duration.js`.

## Findings

**1. Any input using the `ms` unit throws (`duration.js:2`).**
The pattern lists the units as `(h|m|s|ms)`, and a regex takes the first alternative that matches. So in `"500ms"` it matches `500m` and leaves the `s` over. The leftover `s` doesn't match anything, the check on line 14 fails, and the function throws `TypeError`. This means `ms` can never be parsed, so a config value like `timeout: "250ms"` fails even though the spec allows it.
- Cases: `"500ms"` → 500, `"1m500ms"` → 60500 (both currently throw `TypeError`)
- Fix: put `ms` before `m` in the list, e.g. `(ms|h|m|s)`.

**2. Some decimal inputs return slightly wrong numbers (`duration.js:11`).**
`Number(number) * UNIT_MS[unit]` uses floating-point maths, so some decimals come out just under the right answer:
- `"2.3h"` → `8279999.999999999` (spec: 8 280 000)
- `"1.005s"` → `1004.9999999999999` (spec: 1005)

The spec defines the result as an exact `number × factor`, and a non-whole number of milliseconds as a timeout is likely to cause trouble later. Both values are in `cases.json`. To fix it, either do the sum in whole numbers (split each number into whole and fraction digits and scale by the unit) or round the total. Rounding is only correct if the spec says the result is a whole number of milliseconds; it doesn't say so now. This one is less serious than #1, but it is a real gap between the code and the spec.

## Checked and correct
- Empty or whitespace-only input and non-strings throw `TypeError`.
- Spaces inside a part (`"1 h"`, `"1. 5s"`) throw, as the grammar requires.
- `".5s"`, `"1.s"`, uppercase units and unknown units all throw.
- Whitespace between parts works, including newlines and non-ASCII whitespace like `\u00a0`.
- Units can repeat and appear in any order.
- `\d` only matches ASCII digits here, which matches the grammar.

## Minor, no case added
- Very long digit strings (hundreds of digits) return `Infinity` without an error. The spec says nothing about limits, but you might want to reject it for config timeouts.
- The test suite has no `ms` case, which is how bug #1 got through.

The cases file is `/tmp/hs-bench-1F1nrv/cases.json`.