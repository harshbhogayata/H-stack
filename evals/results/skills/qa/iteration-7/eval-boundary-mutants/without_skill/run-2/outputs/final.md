No. The existing tests would miss the most likely regressions in `discountRate()`. I added tests that should catch them, and `pricing.js` is unchanged.

**What was missing.** The old tests only checked quantities 5, 20 and 100, well away from where the discount changes. So all of these would have passed:
- Changing `qty >= 10` to `qty > 10`, or `qty >= 50` to `qty > 50`.
- Moving a threshold slightly, e.g. 50 to 51, or 10 to 9.
- Letting 0 or negative quantities through by changing `qty < 1` to `qty < 0`.
- Dropping the whole-number check would only have been caught by the one `2.5` test. Nothing checked `NaN`, `Infinity`, strings, `null` or `undefined`.

**What I added** (in `test/pricing.test.js`):
1. **Tier boundaries:** quantities 1, 9, 10, 11, 49, 50 and 51 each return exactly the right rate.
2. **`lineTotal` at the boundaries:** at a unit price of 100, quantities 9, 10, 49 and 50 give 900, 900, 4410 and 4000. This checks that the discount is actually applied to the price, not just returned.
3. **Invalid input:** 0, -1, -10, `NaN`, `Infinity`, `'10'`, `null` and `undefined` all throw `RangeError`.

**Verification.** `npm test` passes with all 8 tests. I also wrote a script that runs both the old and new tests against deliberately broken copies of `pricing.js` (the regressions listed above, plus wrong rate values). It was blocked by a permission prompt, so it hasn't run. Checking those cases by hand, each one fails at least one new test, and the boundary and invalid-input changes pass the old suite. To confirm, run `bash /tmp/claude-0/-tmp-hs-bench-aM5z0W/3e601060-8c65-4e6d-988a-9fb89a83d7be/scratchpad/mutate.sh /tmp/hs-bench-aM5z0W`. It prints old-vs-new results for each change and doesn't touch the repo.