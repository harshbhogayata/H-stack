I'd hold the merge: `duration.js` throws on every input that uses the `ms` unit, and the spec allows `ms`. The existing `test.js` still passes because none of its tests use `ms`. I added two cases for this to `cases.json` and ran both against the current code; both throw `TypeError`. I didn't change `duration.js`.

## Bug: inputs with `ms` are rejected

`duration.js:2` writes the unit pattern as `(h|m|s|ms)`. The regex tries those options in order and takes the first one that matches, so in `"500ms"` it matches `m` and never gets to `ms`. That leaves a lone `"s"`, which isn't a valid part. The check at line 14 then sees part of the input wasn't used and throws `TypeError`.

| input | expected (spec) | current result |
|---|---|---|
| `"500ms"` | 500 | `TypeError` |
| `"1h500ms"` | 3 600 500 | `TypeError` |

**Fix:** put `ms` first: `/(\d+(?:\.\d+)?)(ms|h|m|s)/g`. It would also be worth adding a `ms` assertion to `test.js`.

## Other things to know (not bugs, no cases added)
- **Decimal rounding:** `"1.1h"` returns `3960000.0000000005` and `"1.005s"` returns `1004.9999999999999`. This is ordinary floating-point arithmetic, and it is literally what the spec's `number × factor` gives. But callers using these values as timeouts may expect whole milliseconds. You could decide to round the result and say so in the spec.
- **Byte-order mark counted as whitespace:** JavaScript treats U+FEFF as whitespace, so `"\ufeff1s"` returns 1000. Unicode doesn't class it as whitespace, so strictly the grammar should reject it. It's harmless, and arguably useful for config files, but the spec should say which way it goes.

Everything else I tried behaves as the spec says:
- **Valid inputs:** all four README examples, repeated units (`"1h 1h"`) and Unicode or newline whitespace between parts.
- **Inputs it correctly rejects with `TypeError`:**
  - malformed numbers: `".5s"`, `"1.s"`, `"1e3s"`
  - spaces or junk inside or after a part: `"1 h"`, `"10s5"`, `"1hh"`, `"1h,2m"`
  - uppercase units: `"1H"`
  - empty or blank strings
  - non-strings

The check at line 14 can't be fooled by skipped characters: a skipped non-space character always makes the two strings it compares different lengths.