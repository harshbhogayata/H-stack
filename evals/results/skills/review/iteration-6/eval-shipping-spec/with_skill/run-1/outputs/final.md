I found one real bug in `checkout.js`, and it should be fixed before merging. The review is in `REVIEW.md`; I didn't change any code.

**Major: free shipping ignores the discount** (`checkout.js:17`). The spec says shipping is free when the subtotal *after the discount* is at least 5000 cents. The code checks the subtotal *before* the discount, so a discounted cart can get free shipping it shouldn't. I ran it to confirm:
- **Input:** `totals([{ price: 5000, qty: 1 }], 'SPRING10')`
- **Expected:** shipping 495, total 4995 (the discounted subtotal is 4500, below the threshold)
- **Actual:** shipping 0, total 4500

The tests still pass because none of them uses a discount code on a cart of 5000 or more.

I also checked the rest of the spec and found no problems: the subtotal sum, the discount rounding (half up), case-insensitive codes, unknown codes being ignored, and the total formula. `REVIEW.md` lists these as cleared, along with a few suspicions I checked and ruled out.

Two limits on this review:
- Inputs the spec doesn't cover weren't assessed, such as a number passed as the code (it throws) or negative prices.
- The skill calls for extra independent reviewers on payment code, but that setup isn't installed here. So this is a single review and shouldn't be the only check before merge.