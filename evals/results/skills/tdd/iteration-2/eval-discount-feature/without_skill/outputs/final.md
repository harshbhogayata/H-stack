I added `discount(totalCents, code)` to `src/pricing.js`, writing the tests first. All 4 tests pass.

1. **Tests first:** I added three tests to `test/pricing.test.js`:
   - `SAVE10` takes 10% off (1000 → 900).
   - `SAVE10` rounds to the nearest cent: 999 → 899, 995 → 896 and 1005 → 905. The last two land exactly on half a cent, which is where rounding mistakes show up.
   - Unknown codes return the total unchanged: `'BOGUS'`, `''` and `undefined`.

   Before any code existed, the test run failed because `discount` didn't exist yet.
2. **Implementation:** For `SAVE10` the function returns `Math.round(totalCents * 9 / 10)`; any other code returns the total as is. Multiplying before dividing keeps the numbers whole until the final rounding. Writing it as `total * 0.9` could round a half-cent case the wrong way because of how JavaScript stores decimals.

**Decision for you:** I rounded the final price, not the discount amount, and the two give different answers on half-cent cases. For 995, rounding the final price gives 896, while rounding the 99.5¢ discount up to 100¢ would give 895. If you want the discount amount rounded instead, it's a one-line change.

I haven't committed anything.