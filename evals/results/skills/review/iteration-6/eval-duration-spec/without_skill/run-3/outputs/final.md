Not ready to merge. There's one behaviour bug: any duration that uses the `ms` unit is rejected. I added three cases for it to `cases.json`, and the current code fails all three. `npm test` still passes because `test.js` never uses `ms`. I didn't touch `duration.js`.

## The bug: `ms` always throws a `TypeError`

`duration.js:2` builds the pattern as `(h|m|s|ms)`. The regex tries the alternatives in order, so for `"500ms"` it matches `m` and stops, leaving a stray `s`. The check at line 13 then sees that the matched text doesn't cover the whole input and throws. So `ms` never parses, even though the spec lists it as a valid unit.

| input | expected | current result |
|---|---|---|
| `"500ms"` | 500 | TypeError |
| `"1m5ms"` | 60005 | TypeError |
| `"1.5ms 2s"` | 2001.5 | TypeError |

**Fix:** put the longer unit first, `(ms|h|m|s)`. Note that `test.js` has no `ms` test at all, which is how this got through.

## Checked and correct
- All four README examples give the right answers.
- These inputs throw a `TypeError` as the spec requires: empty or whitespace-only strings, non-strings, uppercase units (`1H`), a space between number and unit (`1 h`), numbers without a leading digit (`.5s`), digits split by a space (`1h 3 0m`), and unknown units (`10x`).
- Garbage can't slip through: the line-13 check compares the matched pieces against the input with whitespace removed. Any skipped character that isn't whitespace makes the two differ, so the input is rejected.

## A spec question, not counted as a bug
`\s` and `trim()` in JavaScript treat the byte-order mark (U+FEFF) as whitespace, so `"\uFEFF1h"` returns 3600000. Unicode doesn't classify U+FEFF as whitespace, so whether the spec's "any whitespace character" should accept it is unclear. Accepting it is probably what you want for config files, so I didn't add a case for it. If the spec means strict Unicode whitespace, it should say so.