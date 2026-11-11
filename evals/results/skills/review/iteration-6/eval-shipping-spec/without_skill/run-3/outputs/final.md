I've written `REVIEW.md`. My recommendation is not to merge until the shipping bug below is fixed.

**Bug (High), `checkout.js:17`:** free shipping is decided using the subtotal before the discount. The spec says it should use the subtotal after the discount.
- **Input:** `totals([{ price: 5000, qty: 1 }], 'STAFF25')`
- **Expected:** shipping 495, total 4245
- **Actual:** shipping 0, total 3750

So any discounted order that drops below 5000 cents still gets free shipping when it shouldn't.

**Test gap (Low), `test.js:4-7`:** no test uses a discount code on an order near the 5000-cent free-shipping threshold, so the tests pass even with this bug. `REVIEW.md` includes the test to add.

The rest of the spec checks out: the subtotal, rounding half up, case-insensitive codes, ignoring unknown codes, and the total formula. I ran the existing tests (they pass) and called `totals()` directly with the inputs in the review. I didn't change any code.