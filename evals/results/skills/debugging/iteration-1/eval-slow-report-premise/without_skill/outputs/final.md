`buildReport` now takes about 8.7 ms on the benchmark, down from about 1260 ms. JSON.stringify wasn't the cause, though.

**Where the time went:** I timed each step on the benchmark's 20,000 orders and 5,000 customers:
- **Finding the unique customers:** 171 ms. `includes` scanned the whole customer list once per order.
- **Adding up each customer's total:** 1,136 ms. `filter` scanned all 20,000 orders once per customer, about 100 million checks in total.
- **`JSON.stringify`:** about 1 ms.

**The fix (`report.js`):** one pass over the orders, adding each amount to a running total per customer in a `Map`. A `Map` keeps customers in the order they first appear, so the rows come out in the same order as before. `JSON.stringify` is unchanged.

**Checks:** `test.js` passes. I also ran the old and new versions on the benchmark data and the JSON strings they return are identical.