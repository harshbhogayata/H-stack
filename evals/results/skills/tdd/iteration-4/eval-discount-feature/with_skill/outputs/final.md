I added `discount(totalCents, code)` to `src/pricing.js`, test-first. The full suite passes: 6 tests, including the existing `subtotal` test.

```js
export function discount(totalCents, code) {
  if (code === 'SAVE10') return Math.round(totalCents * 0.9);
  return totalCents;
}
```

**How it was built.** I tested only through the function's return value. Each slice started with a test that I watched fail, then just enough code to make it pass:
1. **SAVE10 takes 10% off:** 1000 → 900. It failed first because `discount` didn't exist yet.
2. **Unknown code leaves the total unchanged:** 'BOGUS', 1000 → 1000. It failed first because it returned 900.
3. **Rounds down to the nearest cent:** 999 → 899. It failed first because it returned 899.1, which led to `Math.round`.
4. **Edge cases for rounding up:** 1004 → 904, and 1005 → 905. These two passed as soon as I added them, because step 3 already covered them. I checked that they still mean something: with `Math.floor` instead of `Math.round` they would fail (903 and 904).

**Decisions to confirm:**
- **New test file.** The tests are in a new `test/discount.test.js`. The skill says existing test files can't be edited without `hs phase test`, which isn't installed here, so I left `test/pricing.test.js` alone.
- **Half cents round up.** The spec only says "nearest cent", so I chose to round exactly half a cent up (904.5 → 905). If you want banker's rounding (half to even) instead, only that one test changes.
- **Codes are case-sensitive.** 'save10' counts as an unknown code and gets no discount. Nothing in the spec says otherwise.

The changes are not committed.