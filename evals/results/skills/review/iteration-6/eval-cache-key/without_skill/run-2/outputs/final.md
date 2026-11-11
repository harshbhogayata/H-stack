I wrote the review to `REVIEW.md`. **Don't merge yet:** the first finding below gives customers wrong prices in normal use. I ran every example in a script against the current code, which I didn't change. The existing tests all pass (3 of 3) because none of them quotes the same product in two currencies.

1. **Critical: prices come out in the wrong currency** (`src/pricing.js:6`, caused by `src/memoize.js:4`). The price cache is keyed on the product code only, so whichever currency is quoted first for a product is reused for every currency after it. For example, `quote([{sku:'CAP-03'}],'USD')` followed by `quote([{sku:'CAP-03'}],'EUR')` gives a EUR subtotal of 1500 instead of 1400. Which wrong price a customer sees depends on the order of earlier requests, and that lasts as long as the server process runs.
2. **Medium: some invalid currencies get past the check** (`src/pricing.js:9`, and the same pattern at `src/catalogue.js:10`). The check uses `in`, which also accepts built-in property names like `'toString'` or `'constructor'`. `quote([{sku:'MUG-02'}],'toString')` returns a quote whose amounts are all `NaN` instead of throwing "unsupported currency".
3. **High if the cart comes from the client, Low if it's always built on the server: `qty` isn't validated** (`src/pricing.js:12-13`). Negative, fractional and non-numeric quantities are all priced. Adding a line with `qty: -1` cuts a 2000 cart to 900, and `qty: 'abc'` gives `NaN` totals.
4. **Low:**
   - A cart that isn't an array fails with unclear error messages.
   - `var` is used where `let` should be.
   - Tax is rounded once on the whole subtotal; worth checking that this matches your VAT rules.
   - The tests don't cover any of the cases above.

The review gives a concrete input and a suggested fix for each finding.