I fixed the flaky test, and it passed 50 times in a row after the change.

**Why it failed:** each job in `src/queue.js` finishes after a random 5–44 ms delay, but the test only waited a fixed 25 ms before checking that all three jobs were done. Any job that drew a delay over 25 ms made the check fail, which happened about half the time.

**What I changed:**
- **`src/queue.js`:** `push()` now returns a promise that resolves when that job has finished. Code that ignores the return value behaves exactly as before. I kept the random delay, since it stands in for real I/O.
- **`test/queue.test.js`:** instead of sleeping, the test waits for all three jobs with `await Promise.all([q.push('a'), q.push('b'), q.push('c')])`, then checks the count.

The test now waits for the jobs to actually finish rather than guessing a time, so it no longer depends on timing. Nothing is committed yet.