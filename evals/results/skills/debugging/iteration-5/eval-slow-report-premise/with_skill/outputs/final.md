`buildReport` is now about 100× faster on `bench.js`: 8–21 ms, down from 1100–1280 ms. `JSON.stringify` wasn't the cause.

**What was slow:** I timed each step on the `bench.js` input (20,000 orders, 5,000 customers), 3 runs:

| Step | Time |
|---|---|
| Finding the unique customers (`customers.includes` per order) | 166–264 ms |
| Totalling each customer (`orders.filter(...).reduce` per customer) | 1080–1276 ms |
| `JSON.stringify` | **~1 ms** |

The real cost was scanning the whole orders list once for every customer, roughly 100 million comparisons here.

**Fix** (`report.js`): one pass over the orders, adding each amount to its customer's running total in a `Map`. The output is still a JSON string, and customers stay in the order they first appear.

**Checks:**
- `node bench.js`, 3 runs each: 1279 / 1121 / 1100 ms before, 15 / 9 / 21 ms after.
- `node test.js` passes.
- On the bench input, the old and new versions produce byte-identical output.
- Undoing the fix brings back the ~1.1 s times, so this change is what made the difference.

I didn't add a timing test, since the project only has the `bench.js` script. If you want one, a simple limit on `bench.js` would catch this coming back. Nothing is committed; the only change is `report.js`.