I wrote the review to `REVIEW.md` and didn't change `pricing.js`. It has four findings, and I got every output it quotes by running the code in Node.

1. **High, `pricing.js:9-10`:** the bulk discount is applied twice. Each bulk line already gets 10% off in `lineTotal`, and then `orderTotal` takes another 10% off the whole order if any line is bulk. That gives bulk lines 19% off and also discounts lines that aren't bulk. For example, `orderTotal([{unit:10, qty:10}])` returns 97.2, but the spec gives 108.00. With a second, non-bulk line, `[{unit:10,qty:10},{unit:50,qty:1}]` returns 151.2 instead of 168.00.
2. **Low, `pricing.js:12`:** the spec says to round the tax to cents, but the code rounds the final total instead. The spec is ambiguous here. The two readings only differ when the discounted subtotal has fractions of a cent: `[{unit:0.01, qty:15}]` returns 0.16, while rounding the tax separately gives 0.165. I checked prices of 0.01 to 49.99 without discounts and found no floating-point rounding errors.
3. **Low, `pricing.js:11`:** coupon percentages aren't checked. `{percent:150}` produces a total of -6.
4. **Low, `pricing.js:3`:** quantities and prices aren't checked. `qty:-1` gives -12, and a missing `qty` gives `NaN`.

The review also notes that there are no tests, even though `package.json` has a `node --test` script set up.