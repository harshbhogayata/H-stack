I added `discount(totalCents, code)` to `src/pricing.js`, test-first, and the full suite passes (4 tests: the 3 new ones plus the existing `subtotal` test).

```js
export function discount(totalCents, code) {
  if (code === 'SAVE10') return Math.round((totalCents * 90) / 100);
  return totalCents;
}
```

The new tests are in a new file, `test/discount.test.js`; I didn't change any existing tests. I built it one rule at a time, and each test failed for the expected reason before I wrote the code to pass it:

1. **An unknown code returns the total unchanged:** `discount(1234, 'BOGUS')` gives 1234. It first failed because `discount` didn't exist yet.
2. **`SAVE10` takes 10% off:** `discount(1000, 'SAVE10')` gives 900. It first failed with 1000 against an expected 900.
3. **`SAVE10` rounds to the nearest cent:** 1234 gives 1111 (from 1110.6), 1006 gives 905 (from 905.4) and 1005 gives 905 (from 904.5). It first failed with `1110.6000000000001`, a floating-point error from multiplying by 0.9. Multiplying by 90 and then dividing by 100 avoids that error.

**Decision for you:** your spec doesn't say what happens at exactly half a cent, so I rounded up (`Math.round`). If you'd rather use banker's rounding (round half to even) or always round down, the 1005 case in the tests is the one that would change.

I haven't committed the changes. As you said, I skipped the `hs` and `receipts` steps from the skill.