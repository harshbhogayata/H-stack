I fixed the flaky test, and it now passes 100 out of 100 runs. It was actually failing about 9 times in 10, not half the time.

**Cause:** in `src/queue.js`, each job finishes after a random 5–44 ms. The test slept a fixed 25 ms and then checked that all 3 jobs were done. Each job has about a 50% chance of finishing within 25 ms, so all three finish in time only about 12.5% of runs (0.5³). The failure was always `expected: 3, actual: 2`, meaning one slow job hadn't finished yet.

**Fix (`test/queue.test.js` only):** the test no longer sleeps for a fixed time. A small `waitFor` helper checks every 5 ms until `q.done.length === 3`, and gives up with a clear error after 2 s if the jobs never finish. I also made the assertion stricter: it now checks the finished jobs are exactly `a`, `b` and `c`, not just that there are three. `src/queue.js` is unchanged because the queue itself works correctly.

**Repro command:** `for i in $(seq 1 N); do node --test test/queue.test.js >/dev/null 2>&1 && echo PASS || echo FAIL; done | sort | uniq -c`

| | Result |
|---|---|
| Before the fix | 36 failed, 4 passed (40 runs) |
| After the fix | 100 passed (100 runs); `npm test` passes |
| Fix stashed, original test back | 19 failed, 1 passed (20 runs), so the change is what fixed it |

The verify-fix script the skill refers to isn't in this run, so I did the same stash-and-rerun check by hand (last row). I haven't committed the change.

If you'd rather not have tests poll, the alternative is to add a `drain()` or `onIdle()` promise to `Queue` that tests can await. That changes the source code, so I left it out.