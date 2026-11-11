I fixed the flaky test. It was failing 28 times out of 30 on this machine, and after the fix it passed 100 runs out of 100. The only file changed is `test/queue.test.js`; `src/queue.js` was fine.

**Cause:** each job in `src/queue.js` finishes after a random 5–44 ms, but the test slept a fixed 25 ms and then checked that all 3 jobs were done. That only works when all three happen to finish within 25 ms, which is about 14% of the time.

**Fix:** the test now polls until all 3 jobs are done instead of sleeping for a guessed time. It gives up with a clear error if that takes longer than 2 seconds, so a broken queue fails rather than hangs. I also made the final check stricter: it now confirms the done jobs are exactly `a`, `b` and `c`, not just that there are three.

**How I checked it** (reproduction command: `for i in $(seq 1 N); do node --test >/dev/null 2>&1 && echo PASS || echo FAIL; done | sort | uniq -c`):

| | Result |
|---|---|
| Before the fix | 28 failed, 2 passed (30 runs) |
| After the fix | 100 passed, 0 failed (100 runs) |
| Fix stashed, baseline rerun | 28 failed, 2 passed (30 runs) |

This is the whole test suite, since there's only one test file. I didn't add any debug logging, so there's nothing to clean up.

I wanted to run one more check — temporarily breaking the queue so it drops a job, to confirm the new test fails within the 2 seconds. That command needed your approval and was declined, so it hasn't been run.

A sturdier option, if you want it, is to have `Queue.push` return a promise that resolves when the job finishes. The test could then wait for that directly instead of polling. I didn't do it because it changes the queue's API.