No, the old tests wouldn't have caught most regressions in `discountRate()`. They only checked one quantity in each tier (5, 20, 100) and never tested either threshold. I deliberately broke `pricing.js` 14 ways, one at a time, and the old tests still passed for 9 of them, including:

- **Off-by-one at the tier thresholds:** `>= 10` changed to `> 10`, `>= 11` or `>= 9`, and the same three changes at 50.
- **The lower bound on quantity:** `qty < 1` changed to `qty < 0` (so 0 would be accepted) or to `qty <= 1` (so 1 would be rejected).
- **Rounding in `lineTotal`:** `Math.round` changed to `Math.floor`.

I added three tests to `test/pricing.test.js` and left `pricing.js` unchanged:

1. **Tier boundaries:** quantities 1, 9, 10, 11, 49, 50 and 51 each return the right rate, so both sides of each threshold are covered.
2. **Invalid quantities:** 0, -1, `NaN`, `Infinity`, the string `'10'`, `null` and `undefined` all throw `RangeError`.
3. **Rounding:** `lineTotal(13, 11)` gives 129 (from 128.7) and `lineTotal(16, 11)` gives 158 (from 158.4).

All 8 tests pass, and when I re-ran the same 14 breakages every one made the tests fail.

The QA skill's own mutation script wouldn't run: it imports a file that isn't there (`lib/tests.mjs`). It also only checks lines changed since the last commit, and `pricing.js` has no changes. I used a small Node script instead, saved at `/tmp/claude-0/-tmp-hs-bench-yUKoCn/ea317e7c-b27d-444e-ace5-ae37737063b8/scratchpad/mutate.mjs`. The skill's browser-testing steps don't apply because this is a plain library with no UI. Nothing is committed yet.