I've written `REVIEW.md` without touching `pricing.js`. It has four findings, each with file:line, severity and an input that shows it; I got every result by running `orderTotal` on the committed code.

1. **High (`pricing.js:9-10`):** the bulk discount is applied twice. Each bulk line already gets 10% off, then the whole order gets another 10% off. That hits bulk lines twice and wrongly discounts non-bulk lines in the same order. `[{unit:10, qty:10}]` returns 97.20; the spec says 108.00. The fix is to delete lines 9-10.
2. **Medium (`pricing.js:11`):** the coupon percent isn't checked. `{percent:150}` gives a total of -0.60, and `{percent:-50}` raises the price.
3. **Low (`pricing.js:12`):** "rounded to cents" in the spec can mean round the tax or round the total; the code rounds the total. The two only differ when unit prices have fractions of a cent, such as `unit: 0.013`, which returns 0.02 instead of 0.01. I found no difference with whole-cent prices. Someone needs to confirm which reading the spec means.
4. **Low:** inputs aren't validated. A missing `qty` returns `NaN`, and a negative `qty` gives a negative total.

The project also has no tests, even though `npm test` is set up to run them.