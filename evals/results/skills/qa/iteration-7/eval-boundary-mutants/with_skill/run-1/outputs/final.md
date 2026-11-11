No, the old tests would have missed most regressions in `discountRate()`. I've added tests to `test/pricing.test.js` and now they catch all 15 deliberate bugs I tried. `pricing.js` is unchanged.

**What was wrong:** the tests only checked quantities 5, 20 and 100, all well inside a discount tier. I made 15 small deliberate bugs in a scratch copy of `pricing.js`, one at a time, and ran the tests against each. 10 of the 15 still passed:
- **Tier cut-offs:** changing `qty >= 10` or `qty >= 50` to `>`, or moving either cut-off up or down by one, went unnoticed.
- **Lower bound:** changing `qty < 1` to `< 0`, `<= 1` or `< 2`, or removing the check entirely, went unnoticed. Nothing tested 0 or negative quantities, so `discountRate(0)` could have quietly returned 0.

The 5 that were caught were wrong discount percentages, removing the whole-number check, and throwing the wrong error type.

**Tests added:**
- **Tier cut-offs:** quantities 1, 9, 10, 11, 49, 50 and 51, which pins 10 and 50 as the first quantity in each tier.
- **Bad quantities:** 0, -1, `NaN` and the string `'10'` must each throw `RangeError`.
- **`lineTotal` at the cut-offs:** 9 → 900, 10 → 900 and 50 → 4000, so the discount is checked through the public total as well.

All 9 tests pass, and all 15 bugs are now caught.

The skill's mutation script, `mutate.mjs`, wouldn't run because a file it imports, `lib/tests.mjs`, is missing from the skill folder. I wrote a small replacement that does the same check, at `/tmp/claude-0/-tmp-hs-bench-IWRK6a/2aa80a43-500a-4913-8c23-3453006ba00d/scratchpad/mut.mjs`. The change is not committed.