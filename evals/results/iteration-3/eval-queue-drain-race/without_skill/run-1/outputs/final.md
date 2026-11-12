The flakiness came from a bug in the queue itself, not the test. I fixed it, and the test passed 50 runs in a row.

**Cause:** `drain()` in `lib/queue.js` never waited for the jobs. It took the pending list, attached empty error handlers and returned immediately. Each job takes a random 0–30 ms, and the test slept 15 ms before draining, so it only passed when every job happened to finish within those 15 ms.

**Fix:**
- **`lib/queue.js`:** `drain()` now waits for every pending job to finish. It also picks up jobs pushed while it's draining, keeps going until the queue is empty, and returns the number of jobs drained. Job errors are still swallowed, as before.
- **`test/queue.test.js`:** I removed the 15 ms sleep. It was hiding the bug, and the test now relies on `drain()` alone.

I couldn't run the old code repeatedly to measure how often it failed, because the shell loop needed an approval it didn't get. Nothing is committed yet.