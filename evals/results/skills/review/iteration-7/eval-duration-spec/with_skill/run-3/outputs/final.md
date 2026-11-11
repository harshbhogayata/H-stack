I found one bug: duration.js can't parse the `ms` unit at all, so it shouldn't merge as is. The existing `npm test` passes, but none of its tests use `ms`.

## Finding

**1. Every `ms` input is rejected with a TypeError.** Verdict: confirmed. Severity: major.

- **Where:** `duration.js:2` reads `const PART = /(\d+(?:\.\d+)?)(h|m|s|ms)/g;`
- **What goes wrong:** the regex tries the units left to right and takes the first one that fits. On `"500ms"` it matches `m` before it ever tries `ms`, so it reads `500m` and leaves a stray `s`. The final check (`consumed !== input.replace(...)`, line 14) then sees unparsed text and throws.
- **Effect:** the README lists `ms` as a valid unit, but `"500ms"`, `"1ms"`, `"1m500ms"` and `"2s 250ms"` all throw instead of returning 500, 1, 60 500 and 2 250. Millisecond timeouts are common in config files, so real users will hit this.
- **Fix:** put `ms` before `m` in the alternation, i.e. `(ms|h|m|s)`. Also add an `ms` case to `test.js`.

I added these four inputs to `cases.json` and ran them against the current code. All four throw TypeError instead of giving the expected result.

## Cleared
I checked these against the README's grammar and ran most of them:
- **Examples from the README:** `"1h30m"`, `"1.5s"`, `"2m 10s"` and `" 45s "` give the expected values.
- **Accepted correctly:**
  - Units repeated or in any order, e.g. `"1h 30m 1h"` gives 9 000 000.
  - Whitespace between parts, including newlines and non-breaking spaces. JS's `\s` and `trim()` cover the same characters, which fits "any whitespace character".
  - `"0s"` gives 0.
- **Rejected with TypeError, as the spec requires:**
  - `""`, whitespace only, `null`, `undefined`, a number, and a `String` object.
  - Whitespace inside a part, like `"1 0s"` and `"1.5 s"`. The rejection holds because the regex can't match across whitespace and every match is checked against the input with whitespace removed.
  - Malformed numbers: `".5s"`, `"1.s"`, `"1e3s"`.
  - Uppercase units like `"1H"`, and a number with no unit like `"1h1"`.
  - Non-ASCII digits. `\d` without the `u` flag only matches 0–9, which fits the grammar.
- **Not counted as a bug:** results from fractional values or very large numbers (which can come out as `Infinity`) are what the spec's formula gives.

## Not reviewed
- Performance on very long inputs. The regex can't backtrack catastrophically, so the risk is low.
- Places that call `parseDuration`; there are none in this repo.

I didn't change `duration.js`.