I've written the review to `REVIEW.md`. I don't think this should merge yet: there's one blocker that charges wrong prices on ordinary use. The existing tests pass (3 of 3) but don't catch it. I reproduced every finding by running the code, and I didn't touch any code.

1. **Blocker: prices are cached by product only, not by currency** (`src/pricing.js:6`, caused by `src/memoize.js:4`, `key = args[0]`). The cache is keyed on the product code (SKU) alone. Once a SKU has been priced in one currency, every later quote for it gets that same price.
   - Example: quote `MUG-02` in USD, then in EUR. The EUR quote comes back 1200/240/1440 instead of 1100/220/1320.
   - If EUR is quoted first, the later USD quote undercharges.
   - The tests miss this because no test prices the same SKU twice.
2. **Major (if carts come from the client): quantity is never checked** (`src/pricing.js:12`).
   - `[{MUG-02, qty 5}, {CAP-03, qty -5}]` gives a total of −1500.
   - `qty: 'two'` gives `NaN` totals, and `qty: 0.5` gives half a mug.
3. **Minor, or major if the currency comes from the user: inherited names like `toString` pass the currency check** (`src/pricing.js:9`, and the same check in `src/catalogue.js:10`).
   - `quote(..., 'toString')` returns `NaN` totals.
   - Because of finding 1, it also stores a function as that product's price. Every later quote for that product, in any currency, is then `NaN` until the process restarts.

`REVIEW.md` also lists what I checked and ruled out (tax rounding, cached errors, `qty: 0`) and what I didn't review: nothing in the repo calls `quote()` yet, so I couldn't tell where carts and currency come from. That decides how serious findings 2 and 3 are.

The review instructions call for independent second-reviewer passes on payment code. That tool wasn't available here, so this is a single reviewer's pass.