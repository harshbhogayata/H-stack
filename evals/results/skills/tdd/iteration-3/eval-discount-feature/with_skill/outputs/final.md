I added `discount(totalCents, code)` to `src/pricing.js`, working test-first. The full suite passes: 4 passing, 0 failing.

```js
export function discount(totalCents, code) {
  if (code !== 'SAVE10') return totalCents;
  return Math.round(totalCents * 0.9);
}
```

The new tests are in `test/discount.test.js`. I put them in a new file rather than changing `test/pricing.test.js`, because the skill treats existing test files as read-only.

1. **SAVE10 takes 10% off** (2000 → 1800): I ran it first and it failed because `discount` wasn't exported yet. Then I added the code and it passed.
2. **An unknown code leaves the total unchanged** (2000 → 2000): it failed first (it got 1800, expected 2000). Adding the `SAVE10` check made it pass.
3. **SAVE10 rounds to the nearest cent** (1995 → 1796, which includes a half-cent case, and 1994 → 1795): this one passed as soon as I wrote it, because `Math.round` was already in from step 1. So it guards the rounding but was never seen failing.

Per your instructions, I skipped the `hs` and `receipts` steps.