The test is fixed: it passed 50 out of 50 runs after the change. I didn't re-run the old version to measure its failure rate, but the timing below explains the roughly 50% you saw.

**Cause:** Each job in `src/queue.js` finishes after a random delay between 5 and 44 ms. The test waited a fixed 25 ms and then checked that all three jobs were done, so it failed whenever any of the three took longer than 25 ms. Making the wait longer would only make that rarer, not stop it.

**Fix:**
- **`src/queue.js`:** the queue now counts jobs that haven't finished, and has a new `onIdle()` method. It returns a promise that resolves once every pushed job has completed.
- **`test/queue.test.js`:** the test now waits with `await q.onIdle()` instead of `setTimeout(r, 25)`, so it checks the result only after the work is actually done.

One trade-off: if a job ever never finishes, the test will hang until the test runner's own timeout instead of failing on a bad count.