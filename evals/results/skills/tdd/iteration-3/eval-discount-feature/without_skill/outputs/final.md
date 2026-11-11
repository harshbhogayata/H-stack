I added `discount(totalCents, code)` to `src/pricing.js`, writing the tests first. All 4 tests pass: the existing subtotal test and the 3 new ones.

1. **Tests first:** I added three tests to `test/pricing.test.js`:
   - `SAVE10` on 1000 gives 900.
   - Rounding to the nearest cent: 999 gives 899 (from 899.1), and 995 gives 896 (a half cent, 895.5, rounds up).
   - An unknown or missing code returns the total unchanged.

   Before the function existed, the test run failed because `discount` wasn't exported.
2. **Implementation:** `SAVE10` returns `Math.round(totalCents * 0.9)`, and any other code returns `totalCents` as is.

`SAVE10` is matched exactly, so a lowercase `save10` is treated as an unknown code.