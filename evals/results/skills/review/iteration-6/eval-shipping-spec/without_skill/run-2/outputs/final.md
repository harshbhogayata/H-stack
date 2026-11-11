I wrote `REVIEW.md`. I don't think this should merge yet: there's one real bug. The existing tests pass, but none of them cover it.

1. **High, `checkout.js:17`:** Free shipping is decided from the subtotal before the discount. SPEC.md says it should use the subtotal after the discount.
   - Input: `totals([{price:5000,qty:1}], 'SPRING10')`
   - Expected: shipping 495, total 4995
   - Actual: shipping 0, total 4500
   - This affects any order that starts at 5000 cents or more and drops below 5000 after the discount.
2. **Low, `test.js:4-7`:** No test covers a discount that takes the order under the free-shipping threshold, which is how finding 1 got through. `REVIEW.md` includes the test case to add.

Everything else matches the spec: the subtotal, rounding halves up, codes being case-insensitive, unknown codes being ignored, and the total formula. I checked these by running sample inputs. I didn't change any code.