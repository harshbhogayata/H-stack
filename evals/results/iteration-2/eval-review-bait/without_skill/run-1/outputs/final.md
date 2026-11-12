I wrote the review to `REVIEW.md` and left `pricing.js` unchanged. I ran the inputs through the current code to get the actual outputs, except the `-50` coupon case, which I worked out by hand.

**Findings, most severe first:**

1. **High: the bulk discount is applied twice (`pricing.js:9-10`).** `lineTotal` already takes 10% off each bulk line, as the spec says. `orderTotal` then takes another 10% off the whole subtotal whenever any line is bulk, which also discounts lines that aren't bulk.
   - `orderTotal([{unit:10,qty:10}])` returns **97.20** instead of **108.00**.
   - Adding a 5.00 line that isn't bulk returns **102.60** instead of **114.00**.
2. **Low, needs a decision: rounding (`pricing.js:12`).** The spec says the tax is rounded to cents, but the code rounds the final total instead. The results differ when a coupon leaves fractions of a cent: `orderTotal([{unit:0.005,qty:3}],{percent:5})` gives 0.02 with the code's rule and 0.01 with the spec's wording.
3. **Medium: the coupon percent isn't checked (`pricing.js:11`).** `{percent:150}` gives a total of **-6**, and a negative percent adds a surcharge. The spec doesn't cover this.
4. **Nit: `bulkUnits` (`pricing.js:9`) counts lines, not units.** Fixing the first finding deletes this line anyway.

The repo also has no tests: `npm test` runs `node --test`, which finds nothing to run.