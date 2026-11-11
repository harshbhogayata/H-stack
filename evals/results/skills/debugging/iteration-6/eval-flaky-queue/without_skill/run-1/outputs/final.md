The test is fixed: it passed all 50 times I ran the suite in a row.

**Cause:** in `src/queue.js`, each job finishes after a random delay between 5 and 44 ms. The test slept a fixed 25 ms and then checked that all 3 jobs were done, so it failed whenever any job took longer than 25 ms. That works out to roughly 50% of runs, which matches what you saw. Raising the sleep would only make failures rarer, not stop them.

**Fix:** the test now waits for the jobs to actually finish.
- **`src/queue.js`:** `push()` now returns a promise that resolves when that job completes. I also added a `drain()` method that waits until every pending job has finished, including ones pushed while it's waiting. Existing callers that ignore what `push()` returns behave the same as before.
- **`test/queue.test.js`:** replaced the 25 ms sleep with `await q.drain()`. I also added a check that the finished jobs are exactly `a`, `b` and `c`, not just that there are three of them.

Nothing is committed.