No, the original tests would have missed many likely regressions in `discountRate()`. I've added tests that catch them, and `pricing.js` is unchanged.

**What was wrong:** the tests only checked quantities 5, 20 and 100, which sit well inside each discount tier. None of them tested the edges of the tiers or the input check. I made 14 small deliberate breaks to copies of `pricing.js` (kept outside the repo) and ran the original tests against each. 8 of the 14 breaks still passed, including:
- changing `qty >= 10` to `> 10`, `>= 9` or `>= 11`
- changing `qty >= 50` to `> 50`, `>= 49` or `>= 51`
- changing the `qty < 1` check to `< 0` (so 0 would be accepted) or `< 2` (so 1 would be rejected)

The breaks that were caught changed a discount rate itself or removed the integer check.

**What I added** to `test/pricing.test.js` (the 5 original tests are kept):
- **Tier edges:** quantities 1, 9, 10, 11, 49, 50 and 51, so each threshold is tested on both sides.
- **Zero and negatives:** 0, -1 and -50 must throw `RangeError`.
- **Invalid inputs:** `NaN`, `±Infinity`, the string `'10'`, `null` and `undefined` must throw `RangeError`.
- **`lineTotal` at the edges:** quantities 9, 10, 49 and 50, to check that `lineTotal` uses the right discount at each threshold.

**Result:** all 9 tests pass against the current `pricing.js`, and all 14 breaks now fail the suite. The script that ran this check is `/tmp/claude-0/-tmp-hs-bench-svy6aj/a096d9e7-7838-41a8-849c-142fe171a453/scratchpad/mut.js` if you want to rerun it.