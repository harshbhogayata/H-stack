`buildReport` now takes about 6 ms, down from about 1.7 s. But `JSON.stringify` wasn't the problem, and I didn't change it.

**What was actually slow.** I timed each step separately on the `bench.js` input (20,000 orders, 5,000 customers):

| Step | Time |
|---|---|
| Finding unique customers with `customers.includes` | ~170 ms |
| Running `orders.filter(...)` once for every customer | ~900 ms |
| `JSON.stringify(rows)` | **0.8 ms** |

The two loops compare every customer against every order, roughly 100 million comparisons, so the time grows with the square of the input size. Turning 5,000 small rows into JSON is cheap.

**Fix** (`report.js`): one pass over the orders that adds each amount to a running total per customer, kept in a `Map`. The output is the same, with rows still in the order each customer first appears:

```js
const totals = new Map();
for (const o of orders) totals.set(o.customer, (totals.get(o.customer) ?? 0) + o.amount);
const rows = Array.from(totals, ([customer, total]) => ({ customer, total }));
return JSON.stringify(rows);
```

**Results** (`node bench.js`, same machine and input, Node 22):
- **Before:** 1747 ms, and 1197–1315 ms inside the test runs.
- **After:** 6.5, 6.6 and 6.2 ms over three runs.

**Checks:**
- **Same output:** the new version produces byte-for-byte the same output as the old one on four datasets: empty input, the bench data, decimal amounts, and customer names like `__proto__`.
- **New speed test:** I added a test to `test.js` that runs `buildReport` on 20,000 orders and fails if it takes more than 250 ms. With the fix it passes in about 10 ms. With the fix stashed it fails at 1196 ms, so the test does catch the slow version. The original correctness test still passes.

Both files are changed but not committed. The timing scripts are in the scratchpad and aren't part of the repo.