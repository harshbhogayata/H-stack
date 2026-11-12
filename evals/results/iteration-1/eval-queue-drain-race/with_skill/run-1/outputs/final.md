I fixed the flakiness. The bug was in the queue code, not the test. The test now passes 50 out of 50 runs; before the fix it failed 28 of 30.

**Cause:** `drain()` in `lib/queue.js` didn't actually wait for the queued jobs to finish. It returned straight away, so the test only passed when all 5 jobs (each with a random 0–30 ms delay) happened to finish during the test's 15 ms sleep. That happens about 1 run in 32, which is why the test failed most of the time but not always.

**Fix:** in `lib/queue.js:5`, `drain()` now waits for every job with `await Promise.allSettled(p)`. A job that fails still doesn't make `drain()` fail, as before.

**Checks:**
- **Before:** 28 of 30 runs failed with `expected: 5, actual: 3`.
- **Fix confirmed:** I set the fix aside and reran the test. It failed without the fix and passed with it.
- **After:** 50 of 50 runs passed, and `npm test` passes.

**One more change needs your approval:** I also wanted to delete the 15 ms sleep in `test/queue.test.js`. It now does nothing except hide this kind of bug; without it, the test would fail every time if `drain()` broke again. A project rule blocks edits to existing test files, so that file is unchanged. Say if you want it removed.