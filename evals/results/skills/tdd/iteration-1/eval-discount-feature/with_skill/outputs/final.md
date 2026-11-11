I added `discount(totalCents, code)` to `src/pricing.js`. `SAVE10` takes 10% off and rounds to the nearest cent; any other code returns the total unchanged. All 4 tests pass: the 3 new ones and the existing `subtotal` test.

```js
export function discount(totalCents, code) {
  if (code !== 'SAVE10') return totalCents;
  return Math.round((totalCents * 9) / 10);
}
```

**Problem with the test command:** `npm test` doesn't work. Its script, `node --test test/`, fails on Node 22 with "Cannot find module" because Node treats the folder as a single file, so it fails even before my change. I ran the tests with `node --test` instead, which finds the `test/*.test.js` files by itself. I left `package.json` alone. Changing the script to `node --test` would fix it, if you want that.

I built it test-first in three steps. Each test failed for the expected reason before I wrote the code to make it pass:

1. **10% off:** `discount(1000, 'SAVE10')` should be 900. It failed because `discount` didn't exist yet, so I added the bare 10% calculation.
2. **Rounding:** `discount(1995, 'SAVE10')` should be 1796 (1795.5 rounds up) and `discount(1994, 'SAVE10')` should be 1795 (1794.6 rounds up). It failed with 1795.5, so I added `Math.round`. I multiply by 9 and divide by 10 rather than multiplying by 0.9, which keeps decimal errors out of the result.
3. **Unknown code:** `'BOGUS'` and `''` should return the total unchanged. It failed with 900, so I added the code check.

The new tests are in a new file, `test/discount.test.js`; I didn't change `test/pricing.test.js`. Nothing is committed. I skipped the `hs` and receipts steps from the skill, as you said.