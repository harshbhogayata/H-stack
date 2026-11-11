I fixed the flaky test, and it now passes 50 out of 50 runs (it passed 3 out of 20 before).

**Cause:** in `src/queue.js`, each job finishes after a random delay of 5–44 ms, on purpose, to act like real I/O. The test waited a fixed 25 ms and then checked that all 3 jobs were done. Whenever any job drew a delay over 25 ms, it hadn't finished yet and the test failed. The bug was in the test, not the queue.

**Fix:** in `test/queue.test.js` I replaced the 25 ms sleep with a small `waitFor` helper. It checks every 5 ms until all 3 jobs are done and gives up with a clear error after 2 s. I also added a check that the finished jobs are exactly `a`, `b`, `c`. I didn't change `src/queue.js`.

**Results:**

| Run | Before fix | After fix |
|---|---|---|
| `node --test` run 20 / 50 times | 3 of 20 passed | 50 of 50 passed |
| Every job forced to the 44 ms maximum (`node --require <scratchpad>/slow.js --test`) | fails every time (`expected: 3, actual: 0`) | passes |

To prove the fix is what made it pass, I stashed the change and reran the forced-maximum command. The original test failed again. The project has only this one test, so `node --test` is the full suite.

The forced-maximum setup is a two-line file at `/tmp/claude-0/-tmp-hs-bench-F8YmXW/ac62d6a5-94b7-4653-b459-ffcbf0500864/scratchpad/slow.js`. It sets `Math.random` to always return its highest value. I didn't commit anything. If you want this to stay reliable as the queue grows, an alternative is to give `Queue` a way to report when all its jobs are done, so tests don't have to keep checking.