I found one behaviour bug in `duration.js`: any duration that uses `ms` is rejected. Please don't merge until it's fixed. The existing `npm test` passes because none of its cases use `ms`.

## Bug: the `ms` unit always throws a `TypeError`

The regex at `duration.js:2` is `/(\d+(?:\.\d+)?)(h|m|s|ms)/g`. JavaScript tries alternatives left to right, so on `"500ms"` the `m` option matches before `ms` gets a chance. The match becomes `"500m"` and the trailing `s` is left over. The final check that every non-whitespace character was matched then fails, so the function throws.

| Input | Spec says | Code returns |
|---|---|---|
| `"500ms"` | 500 | TypeError |
| `"1.5ms"` | 1.5 | TypeError |
| `"1m5ms"` | 60005 | TypeError |
| `"2s 250ms"` | 2250 | TypeError |

These are the four cases I wrote to `cases.json`, and I ran each one against the current code to confirm it fails. The bug makes the code throw rather than return a wrong number, so a config timeout like `"250ms"` will crash when the config is read. The fix is to put `ms` first in the alternation (`(ms|h|m|s)`), and `test.js` should get an `ms` case. I left `duration.js` unchanged as you asked.

## Other spec rules, checked and correct
- **Not a string** (for example `30`): throws `TypeError`.
- **Empty or whitespace-only input:** throws.
- **Unknown or uppercase units** (`10x`, `1d`, `1H`): throw.
- **Malformed numbers** (`.5s`, `1.s`): throw.
- **Whitespace inside a part** (`1 h`): throws, as the grammar requires.
- **Whitespace between parts** (`1h\n2m`), **repeated units** and **any unit order:** all handled.
- **The README examples:** all four give the stated results.

## Not a bug, but worth knowing
Fractional values can produce non-integer results from floating-point rounding: `"1.1h"` gives `3960000.0000000005`. That is exactly what the spec's `number × 3 600 000` formula gives in JavaScript, so I didn't add a case for it. If callers expect whole milliseconds, the spec should say whether to round.