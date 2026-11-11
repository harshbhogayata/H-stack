I added `discount(totalCents, code)` to `src/pricing.js`, writing the tests first. All 4 tests pass (the 3 new ones plus the existing `subtotal` test).

**Tests** (`test/pricing.test.js`), run first and confirmed failing:
- `SAVE10` on 1000 returns 900.
- Rounding to the nearest cent: 999 → 899 (from 899.1), 1006 → 905 (from 905.4), 1004 → 904 (from 903.6).
- Unknown codes (`'BOGUS'`, `''`, `undefined`) return the total unchanged.

**Implementation** (`src/pricing.js`):
```js
const PERCENT_OFF = { SAVE10: 10 };

export function discount(totalCents, code) {
  if (!Object.hasOwn(PERCENT_OFF, code)) return totalCents;
  return Math.round(totalCents * (100 - PERCENT_OFF[code]) / 100);
}
```

- **Rounding:** this uses `Math.round`, so an exact half cent rounds up (1005 → 904.5 → 905). None of the tests cover a half-cent case.
- **Unknown codes:** the total is returned exactly as given, even if it isn't a whole number of cents. My first version still rounded it, and I changed that after the tests were already passing, so no test checks it.
- **Matching:** codes are case-sensitive, so `'save10'` counts as unknown.

The code table means you can add more percentage codes with one line each.