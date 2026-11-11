`buildReport` now runs in about 9 ms instead of about 1,230 ms, roughly 130× faster. But JSON.stringify wasn't the cause.

**What was actually slow.** I timed each step of `buildReport` separately on the `bench.js` input (20,000 orders, 5,000 customers), three runs each:

| Step | Time |
|---|---|
| Dedupe with `customers.includes` | 180–320 ms |
| `orders.filter` once per customer | 1,380–1,670 ms |
| `JSON.stringify` | about 1 ms |

Both loops get slower with the square of the input size: the second one scans all 20,000 orders for each of the 5,000 customers, about 100 million checks. Speeding up `JSON.stringify` wouldn't have helped.

**The fix** (`report.js`): one pass over the orders, adding each amount to a running total per customer in a `Map`. A `Map` keeps keys in the order they were first added, so rows still come out in the order each customer first appears.

**Before and after** (`node bench.js`, Node, same machine):
- Before: 1,226.7 ms
- After: 8.3, 9.1 and 9.7 ms over three runs

**Checks:**
- `node test.js` passes.
- On the bench input, the old and new versions produce exactly the same output string.
- I wrote a timing test with a 100 ms limit. It failed on the original code (1,342 ms) and passes on the fix (13.4 ms), which shows the fix is what made the difference.

The change is uncommitted. The timing test is in `/tmp/claude-0/-tmp-hs-bench-xDDBOu/045fcb0e-bbe3-4009-b4f0-c75e765a183b/scratchpad/perf-test.js` and isn't in the repo. I can add it to `test.js` so a slowdown would get caught later; the time limit might need loosening for slower CI machines.