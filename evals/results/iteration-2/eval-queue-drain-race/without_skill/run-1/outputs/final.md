I fixed it, and the test passed 30 out of 30 runs.

**Cause:** the bug was in the queue code, not the test. `drain()` in `lib/queue.js` emptied the list of running jobs and returned right away without waiting for any of them. Each job takes a random 0–30ms. The test slept for 15ms before calling `drain()`, so it only passed when all five jobs happened to finish inside that window.

**Changes:**
- **`lib/queue.js`:** `drain()` now waits for every job with `await Promise.allSettled(p)` before returning the count. A job that fails still won't make `drain()` throw, same as before.
- **`test/queue.test.js`:** I removed the 15ms sleep. It was hiding the bug, and without it the test now really checks that `drain()` waits for the jobs.

Nothing is committed.