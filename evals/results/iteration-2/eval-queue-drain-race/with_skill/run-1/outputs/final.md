The flaky test was exposing a real bug in the queue code, so I fixed it in `lib/queue.js:5`. The test now passed 50 out of 50 runs.

**Cause:** `drain()` emptied the pending list but returned without waiting for the jobs to finish. The test only passed when all five jobs (each taking a random 0–30ms) happened to finish during the test's 15ms sleep, which is about 1 run in 32.

**Fix:** a one-line change so `drain()` waits for every job. Failed jobs still don't make it throw, same as before:
```js
async drain() { const p = pending.splice(0); await Promise.allSettled(p); return p.length; },
```

**Evidence:**
- **Before:** `node --test test/queue.test.js` failed 30 out of 30 runs with `expected: 5, actual: 4`. My first batch of 20 runs used a wrong path, so I didn't count those.
- **Fix confirmed:** the verify-fix script showed the test fails without the change and passes with it.
- **After:** `node --test` passed 50 out of 50 runs.

The test still has its 15ms `setTimeout` sleep. I tried to remove it, but a guard that stops edits to existing test files without your approval blocked the change, so the test file is untouched. The sleep only hid the bug, and without it the test fails every time if `drain()` breaks again. Want me to remove it?