`buildReport` now takes about 10 ms instead of about 1.2 s on `bench.js`, roughly 100× faster. JSON.stringify wasn't the cause, so I didn't touch it.

**What was actually slow.** I timed each step in `buildReport` on the benchmark input (20,000 orders, 5,000 customers), three runs each:

| Step | Time |
|---|---|
| Building the customer list with `customers.includes` | 150–175 ms |
| Totals: `orders.filter` run once per customer | 920–955 ms |
| `JSON.stringify` | 0.7–1.3 ms |

Both slow steps rescan the whole list for every item, so the cost grows with orders × customers.

**The fix** (`report.js`): one pass over the orders, adding each amount to a running total per customer in a `Map`. A `Map` keeps the order customers were first seen in, so the rows come out in the same order as before.
```js
const totals = new Map();
for (const o of orders) totals.set(o.customer, (totals.get(o.customer) ?? 0) + o.amount);
const rows = Array.from(totals, ([customer, total]) => ({ customer, total }));
return JSON.stringify(rows);
```

**Results**
- `node bench.js`: 1191.7 ms before; 12.6, 12.6 and 8.4 ms after.
- On the benchmark input the new output is exactly the same string as the old version's, and an empty input still gives `[]`.
- I added a speed check to `test.js`: the 20,000-order case must finish in under 200 ms. It failed before the fix (1296 ms), fails again with the fix stashed (1088 ms), and passes with the fix restored. `node test.js` is the whole test suite, and it passes.

The 200 ms limit leaves plenty of room, but it's still a timing test, so it could fail on a very slow CI machine. Remove that part if you'd rather not have timing checks in tests. The changes in `report.js` and `test.js` aren't committed.