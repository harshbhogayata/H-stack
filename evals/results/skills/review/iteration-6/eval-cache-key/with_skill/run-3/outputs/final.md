I wrote the review to `REVIEW.md` and didn't change any code. My recommendation is not to merge until the first finding is fixed. The existing tests pass (3 of 3), but none of them catch it. I ran each example below against the current code to confirm it.

1. **Blocker: prices come out in the wrong currency** (`src/pricing.js:6` together with `src/memoize.js:4`). The price cache remembers each product by its SKU only, not by currency. Once a product has been quoted in one currency, every later quote for it uses that first price.
   - Example: `quote([{sku:'MUG-02'}],'USD')` and then `quote([{sku:'MUG-02'}],'GBP')` gives a GBP total of 1440. It should be 1140.
   - The tests miss it because they never quote the same product in two currencies. The EUR test passes only because of the order the tests run in.

2. **Major (if the cart comes from customers): quantity is never checked** (`src/pricing.js:12`).
   - `qty: -3` gives a total of -3600.
   - `qty: 1.5` charges for half a mug.
   - `qty: 'abc'` gives NaN.
   - How serious this is depends on whether callers validate quantities first. No callers are in this repo, so I couldn't check.

3. **Minor: the currency check accepts built-in object property names** (`src/pricing.js:9`). `quote(cart, 'toString')` gets past the "unsupported currency" check and returns a quote that is NaN throughout, instead of an error.

`REVIEW.md` also covers:
- the suspicions I checked and ruled out (tax rounding, cached errors, cache size);
- what I verified;
- what I couldn't review (how callers validate input, and whether the tax rates are right for the business).

Because this is pricing code, it calls for more than one independent review. The helper tools for that aren't installed in this run, so this was a single review and shouldn't be the only check before merging.