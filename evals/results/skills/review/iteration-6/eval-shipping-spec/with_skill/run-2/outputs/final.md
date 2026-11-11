I wrote `REVIEW.md` and found one real bug, so I don't think `checkout.js` should merge yet. I didn't change any code.

**The bug (`checkout.js:17`, major, reproduced by running the code):** free shipping is decided from the subtotal *before* the discount. The spec says it should use the subtotal *after* the discount.
- `totals([{price:5000, qty:1}], 'SPRING10')` should give shipping 495 and a total of 4995. It gives shipping 0 and a total of 4500.
- `totals([{price:5500, qty:1}], 'STAFF25')` should total 4620. It totals 4125.

So any discounted order that starts at 5000 cents or more but drops below 5000 after the discount wrongly gets free shipping and loses 495 cents. The four existing tests pass because none of them covers this case. The review includes a suggested fix and a regression test to add.

**Checked and correct:** subtotal, half-up rounding of the discount (for example 100.5 becomes 101), case-insensitive codes, unknown codes being ignored, and the total formula. Odd codes like `__proto__` don't cause problems.

**Minor, not covered by the spec:** a code that isn't a string (say the number 10) makes the function throw an error. A code with spaces around it, like `' spring10'`, is treated as unknown, which matches the spec as written.

**Not reviewed:**
- The code that calls `totals` and any input checking it does isn't in this repo.
- The skill's independent review passes weren't available here, so this is one reviewer's check of payment code. It shouldn't be the only check before merging.