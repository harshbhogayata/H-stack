`buildReport` now runs in about 12 ms on the benchmark, down from about 1,620 ms (roughly 130× faster). The test passes, and the output is byte-for-byte the same as the old version on the benchmark data.

JSON.stringify wasn't the slow part. I timed each step separately:

| Step | Time |
|---|---|
| Building the customer list (`customers.includes` inside the loop) | ~118 ms |
| Totalling each customer (`orders.filter` over every order, once per customer) | ~945 ms |
| `JSON.stringify` | **~0.8 ms** |

The first two steps get much slower as the data grows: 5,000 customers × 20,000 orders is about 100 million comparisons.

**Fix** (in `report.js`): one pass over the orders adds each amount to its customer's running total in a `Map`. A Map keeps keys in the order they were first added, so the rows still come out in first-seen customer order. The `JSON.stringify` call is unchanged.

I haven't committed the change.