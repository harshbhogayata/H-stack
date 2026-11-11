The test is fixed: it passed 50 out of 50 runs. Before the change it failed 27 out of 30.

**Why it was flaky:** each job in `src/queue.js` finishes after a random delay of 5–44 ms. The test waited a fixed 25 ms and then checked that all three jobs were done. If any job took longer than 25 ms, the check failed.

**The fix:** the test now waits for the jobs to finish instead of guessing how long to wait.
- **`src/queue.js`:** `push()` now returns a promise for that job. I added a `drain()` method that resolves once every pending job is done, including jobs pushed while it waits. The `done` array works as before.
- **`test/queue.test.js`:** the 25 ms sleep is replaced with `await q.drain()`. I also added a check that the right jobs (`a`, `b`, `c`) finished, not just that there were three.

I didn't make the sleep longer, because that only makes the failure rarer and slows the test. The changes aren't committed.