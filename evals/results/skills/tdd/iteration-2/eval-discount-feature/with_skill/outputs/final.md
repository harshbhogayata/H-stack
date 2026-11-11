I added `discount(totalCents, code)` to `src/pricing.js`, test-first, and the full suite passes (4/4, including the existing `subtotal` test).

```js
export function discount(totalCents, code) {
  if (code === 'SAVE10') return Math.round(totalCents * 0.9);
  return totalCents;
}
```

I built it in three small steps. Each new test failed for the expected reason before I wrote the code to make it pass:

| Step | Test | Failure first | Then |
|---|---|---|---|
| 1 | `SAVE10` takes 10% off (1000 → 900) | `discount` didn't exist yet | passed |
| 2 | Rounds to the nearest cent (999 → 899, 1004 → 904) | got `899.1` instead of `899` | passed |
| 3 | Unknown code leaves the total unchanged (`'BOGUS'`, `''`) | got `900` instead of `1000` | passed |

- **Tests:** they're in a new file, `test/discount.test.js`, so `test/pricing.test.js` is unchanged. The expected values were worked out by hand rather than with the same formula the code uses.
- **Skipped steps:** I skipped the skill's `hs` and receipts steps, as you said. I also skipped the separate clean-up step because the function is two lines.
- **Exact half cents aren't tested:** for totals like 1005 (904.5), JavaScript's decimal arithmetic can come out a hair off, so the result might round down instead of up. If those cases matter, `Math.round(totalCents * 9 / 10)` gives exact results, and I'd add a test for it first.