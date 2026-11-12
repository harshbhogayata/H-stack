I fixed the flaky test. The bug was in the code, not the test: `drain()` in `lib/queue.js` never waited for the queued jobs. It attached empty error handlers and returned right away. The test only passed when all 5 jobs (each taking a random 0–30 ms) happened to finish within its 15 ms sleep, which is about a 3% chance.

**Fix** (`lib/queue.js:5`, one line):
```js
async drain() { const p = pending.splice(0); await Promise.allSettled(p); return p.length; },
```
`allSettled` keeps the old behaviour of not throwing when a job fails, but now `drain()` waits for every job to finish.

**Evidence:**
- **Before:** `node --test test/queue.test.js` failed 40 times out of 40, with `expected: 5, actual: 4` (some jobs still running when `drain()` returned).
- **After:** it passed 100 times out of 100, and `npm test` passes (1 test).
- **Fix check:** the skill's `verify-fix` script removed my change and the test failed, then put it back and the test passed.

The test still has a `setTimeout(15)` before `drain()`. It no longer matters, but without it the test would fail every time if `drain` broke again. A hook blocks edits to existing test files without your approval, so I left it. Say if you want it removed.

Nothing is committed yet.