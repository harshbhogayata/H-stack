I added `discount(totalCents, code)` to `src/pricing.js`, tests first. The new tests fail against the original file and all 4 tests pass with the change.

**One problem you should know about:** `npm test` fails on this machine whatever the code says. The script runs `node --test test/`, and Node 22 doesn't accept a bare directory there; it tries to load `test` as a module. My first red-then-green check went through `npm test`, so it showed nothing. I redid both checks by running `node --test test/pricing.test.js` directly. Changing the script to `node --test` (no argument; it finds `*.test.js` files itself) or `node --test test/*.test.js` should fix it. I left it alone because it wasn't part of the request — I can change it if you want.

**What it does:**
- **`SAVE10`** takes 10% off and rounds to the nearest cent, with halves rounding up (995 → 896).
- **Any other code** returns the total unchanged. That includes `'save10'` (codes are case-sensitive), an empty string and `undefined`.
- **Rounding:** it calculates `total × 90 / 100` in whole numbers instead of `total × 0.9`, which avoids floating-point rounding errors.
- **Adding codes:** codes live in a small `{ SAVE10: 10 }` lookup table, so a new code is one line.

**Tests added** in `test/pricing.test.js`: the basic 10% case, three rounding cases (899.1 → 899, 895.5 → 896, 0.9 → 1), and the unknown-code cases above.