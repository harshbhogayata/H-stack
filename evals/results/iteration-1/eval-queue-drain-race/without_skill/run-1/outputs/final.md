I've fixed the flaky test; it passed 50 runs out of 50.

**Cause:** the bug was in `lib/queue.js`, not the test. `drain()` cleared the list of pending jobs and returned straight away without waiting for any of them. Each job takes a random 0–30ms, and the test slept 15ms before calling `drain()`. So it passed only when all five jobs happened to finish inside those 15ms.

**Fix:**
- `lib/queue.js`: `drain()` now waits for every pending job to finish (`Promise.allSettled`) before it returns. It keeps going until the queue is empty, so jobs added while it is draining are waited for too. Failed jobs are still ignored and it still returns the job count, as before.
- `test/queue.test.js`: I removed the 15ms sleep. It only hid the bug, and now that `drain()` waits properly it isn't needed.

I couldn't measure the failure rate before the fix: running the old version needed a `git stash`, which wasn't approved. Nothing is committed.