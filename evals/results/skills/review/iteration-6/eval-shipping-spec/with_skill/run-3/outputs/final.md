I found one bug: don't merge `checkout.js` until it's fixed. The review is in `REVIEW.md`; I didn't change the code.

**The bug (major, `checkout.js:17`):** the free-shipping check uses the subtotal before the discount. `SPEC.md` rule 3 says shipping is free only when the subtotal *after* the discount is at least 5000 cents. So when a discount code takes a cart from 5000 or more down below 5000, the customer still gets free shipping and is undercharged 495 cents. I ran these inputs against the current code:

| Input | Expected | Actual |
|---|---|---|
| `totals([{price:5200,qty:1}], 'STAFF25')` | shipping 495, total 4395 | shipping 0, total 3900 |
| `totals([{price:5000,qty:1}], 'spring10')` | shipping 495, total 4995 | shipping 0, total 4500 |

The tests pass because none of them uses a discount code on a cart near the 5000-cent threshold. The fix is to work out the discount first and compare `subtotal - discount` against 5000, and to add a test for one of the inputs above.

**Everything else matches the spec.** I checked the subtotal sum, rounding halves up (1005 cents with 10% off gives a 101-cent discount), codes in any case, unknown or missing codes, and the total formula.

**Not reviewed:** what happens with negative, fractional or missing prices and quantities, because the spec doesn't say.