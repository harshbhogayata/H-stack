`buildReport` now takes **8.9 ms instead of 1,500 ms** on the benchmark, about 170× faster, and `test.js` still passes.

`JSON.stringify` wasn't the slow part. It only runs once, on the small output (5,000 short rows), and takes about a millisecond. The real cost was in `report.js`, which did two full scans for each order:
- `customers.includes(...)` searched the customer list for every order.
- `orders.filter(...)` went through all orders again for every customer.

On the benchmark (20,000 orders, 5,000 customers) that is roughly 100 million comparisons.

The fix adds up each customer's total in a single pass using a `Map`, then builds the rows from it. The output is the same as before:
- **Row order:** customers still appear in the order they're first seen.
- **Totals:** amounts are still added in the original order, so even decimal totals come out exactly the same.
- **Return value:** it still returns a JSON string.