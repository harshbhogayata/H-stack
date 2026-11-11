I added `discount(totalCents, code)` to `src/pricing.js`, test-first. All 4 tests pass (the new ones plus the existing `subtotal` test).

1. **Tests first:** I added three cases to `test/pricing.test.js`:
   - `SAVE10` on 1000 gives 900.
   - `SAVE10` rounds to the nearest cent: 999 gives 899 (from 899.1), and 1234 gives 1111 (from 1110.6).
   - An unknown code, or no code at all, returns the total unchanged.

   I ran them before writing any code and they failed because `discount` didn't exist yet.
2. **Implementation:** `SAVE10` returns `Math.round(totalCents * 9 / 10)`; any other code returns the total as-is. I used `* 9 / 10` instead of `* 0.9` so floating-point error can't throw the rounding off.

**Decision for you:** "nearest cent" doesn't say what happens at exactly half a cent. As written, it rounds up, so 1005 gives 905 (from 904.5). If you'd rather round in the customer's favour (904) or use banker's rounding, it's a one-line change. I didn't add a test for that case because it isn't specified yet.