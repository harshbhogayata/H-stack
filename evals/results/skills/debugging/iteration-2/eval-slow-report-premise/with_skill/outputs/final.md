`buildReport` now runs in about 8 ms on the benchmark, down from about 1,100 ms. JSON.stringify wasn't the cause.

**Where the time went.** I timed each step of `buildReport` on the `bench.js` data (20,000 orders, 5,000 customers), three runs each:

| Step | Time |
|---|---|
| Building the customer list with `customers.includes` | ~150–160 ms |
| `orders.filter(...)` once per customer | ~1,080–1,260 ms |
| `JSON.stringify(rows)` | **~1 ms** |

The slow part was looping over every order once for each customer, which is 5,000 × 20,000 checks. JSON.stringify on 5,000 small rows (about 164 KB of output) is trivial.

**Fix** (`report.js`): one pass over the orders, adding each amount to a running total per customer in a `Map`. The Map keeps customers in the order they first appear. I left JSON.stringify as it was.

**Results:**
- **Before:** `node bench.js` gave 1,117 ms; the new `perf.test.js` failed at 1,276 ms against its 200 ms budget.
- **After:** `node bench.js` gave 15.2, 8.2 and 8.3 ms; `perf.test.js` passes at 8.2 ms.
- **Fix is the cause:** with only `report.js` put back to the original, `perf.test.js` fails again (1,067 ms); with the fix restored it passes (9.6 ms).
- **Same output:** on 20,000 shuffled orders with negative and decimal amounts, the old and new versions return exactly the same JSON string. Order and totals match, and an empty input still gives `[]`.
- **Existing test:** `node test.js` still passes.

I added `perf.test.js` to the repo as a regression check, with a 200 ms budget. Delete it if you'd rather not keep a timing test. Nothing is committed yet.