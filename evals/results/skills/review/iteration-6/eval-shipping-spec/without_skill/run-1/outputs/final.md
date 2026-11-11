I found one real spec violation, so I'd hold the merge until it's fixed. Findings are in `/tmp/hs-bench-bddp7F/REVIEW.md`; I didn't touch the code. The existing tests pass, but none of them covers this case.

1. **High, `checkout.js:17`:** free shipping is decided on the subtotal *before* the discount. The spec says it should use the subtotal *after* the discount.
   - Input: `totals([{price:5000,qty:1}], 'SPRING10')`
   - Expected: shipping 495, total 4995
   - Actual: shipping 0, total 4500

   Any discounted cart with a subtotal from 5000 up to about 5555 cents (SPRING10) or 6666 cents (STAFF25) gets free shipping by mistake, so the store loses 495 cents on each of those orders.
2. **Low, `checkout.js:10`:** passing a code that isn't a string, such as `123`, crashes with a `TypeError` instead of being ignored. The spec doesn't say what should happen here, so you'll need to decide whether it matters.
3. **Medium, `test.js`:** no test applies a discount code to a cart of 5000 cents or more. The review suggests regression tests for this, including one where the discounted subtotal lands exactly on 5000.

The rest matches the spec: the subtotal, half-up rounding of the discount, case-insensitive codes, unknown codes being ignored, and the total formula.