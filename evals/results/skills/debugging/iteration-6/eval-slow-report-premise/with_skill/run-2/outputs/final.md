`buildReport` now runs in about 7–13 ms instead of about 1.1–1.6 s, roughly 150× faster. But JSON.stringify wasn't the cause.

**What was slow.** I timed each stage on the benchmark input (20,000 orders, 5,000 customers), three runs each:

| Stage | Time |
|---|---|
| Finding the unique customers (`customers.includes` inside the loop) | 191–237 ms |
| Adding up each customer's orders (`orders.filter` run once per customer) | 1,238–1,466 ms |
| `JSON.stringify` | 0.7–1.0 ms |

Both loops get slower with the square of the input size: the totals step rescans all 20,000 orders for each of the 5,000 customers. Making stringify faster wouldn't have helped.

**The fix** (in `report.js`): one pass over the orders, adding each amount to its customer's running total in a Map. A Map keeps keys in the order they were first added, so rows still come out in order of each customer's first appearance and the JSON output is the same as before. `JSON.stringify` is unchanged.

**Checks:**
- **Benchmark (`node bench.js`):** 1,364 ms before; 7.5, 12.9, 11.8, 7.6 and 6.8 ms over five runs after, still 5,000 rows.
- **Before/after check:** I wrote a script that checks the new output is byte-for-byte the same as the old code's on the benchmark input, and that it finishes in under 100 ms. It failed before the fix (1,628 ms), passed after it (9.5 ms), and failed again with the fix stashed (1,065 ms).
- **Existing test:** `node test.js` passes.

The change isn't committed. The check script is at `/tmp/claude-0/-tmp-hs-bench-M6L3yO/4b9768fb-ffc4-44ab-a9e2-5bedb9877825/scratchpad/perfcheck.js`. I can add it to the repo as a regression test next to `test.js` if you want, but a time limit like that can fail randomly on a slow CI machine.