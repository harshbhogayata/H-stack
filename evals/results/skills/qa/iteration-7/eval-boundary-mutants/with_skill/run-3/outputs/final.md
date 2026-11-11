**No, the original tests would have missed most regressions in `discountRate()`.** I changed 14 small things in it, one at a time, and ran the tests after each. 9 of the 14 changes still passed. The tests only tried quantities of 5, 20 and 100, which sit well inside each pricing tier, plus 2.5 for the error case. Nothing checked the edges:

- **Tier boundaries:** changing `>= 50` to `> 50`, `>= 49` or `>= 51`, or doing the same to the `>= 10` check, still passed. A one-off error at 10 or 50, the most likely regression here, would have gone unnoticed.
- **Lower bound:** changing `qty < 1` to `<= 1` (which wrongly rejects 1), changing it to `< 0` (which accepts 0), or deleting the check entirely still passed.

The tests did catch wrong rates and removal of the integer check.

**What I added** to `test/pricing.test.js` (`pricing.js` is unchanged):
- **Tier boundaries:** checks the rate for 1, 9, 10, 11, 49, 50 and 51.
- **Zero and negatives:** 0, -1 and -10 must throw `RangeError`.
- **Non-numbers:** `NaN`, `Infinity`, `'10'`, `null` and `undefined` must throw `RangeError`.
- **`lineTotal` at the boundaries:** 9, 10, 49 and 50, so the discount is also checked inside the total.

**Result:** all 9 tests pass against the current code, and all 14 changed versions now fail at least one test.

The skill's own mutation script wouldn't run here: it's missing a file it imports. It also only changes lines edited since the last commit, and `pricing.js` hasn't been edited. So I wrote a small replacement that applies the 14 changes listed above. It's at `/tmp/claude-0/-tmp-hs-bench-vfHow5/5cc67e4d-934d-4223-89c1-14f8cf85c9fa/scratchpad/mut.mjs`; run it with `node <that path> /tmp/hs-bench-vfHow5`. I haven't committed anything.