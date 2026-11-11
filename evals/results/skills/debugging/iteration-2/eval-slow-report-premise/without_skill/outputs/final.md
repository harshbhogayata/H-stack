`buildReport` now runs in about 6.5 ms on the benchmark, down from about 930 ms, roughly 140× faster.

**JSON.stringify wasn't the cause.** When I timed the two parts separately, stringify took about 1 ms. The other ~1100 ms went to grouping orders by customer. The old code checked every order against the list of customers seen so far, then re-scanned all orders once per customer to add up totals. With 20k orders and 5k customers, that's on the order of 100 million comparisons.

**The fix**, in `report.js`, goes through the orders once and keeps a running total per customer. JSON.stringify is unchanged.

**Output is unchanged.** `test.js` passes, and on the benchmark data the new output is byte-for-byte identical to the old, including the customer order (order of first appearance).