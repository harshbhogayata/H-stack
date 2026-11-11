I fixed the flaky test: it now passes 50 out of 50 runs, where it used to pass about 4 in 20. The problem was in the test, not in the queue.

**Cause (confirmed by testing):** each job in `src/queue.js:5` finishes after a random 5–44 ms, but the test slept a fixed 25 ms and then checked that all three jobs were done. Whenever any job took longer than 25 ms, the check failed.

To confirm this, I forced the random delay to its lowest and highest values. With the shortest delays the old test always passed; with the longest delays it always failed.

**Fix:** in `test/queue.test.js` I replaced the fixed sleep with a small `waitFor` helper. It checks every 5 ms until `q.done.length >= 3` and gives up with a clear error after 2 seconds. I also added an assertion that the finished jobs are exactly `a`, `b` and `c`. I left the queue code alone, since its comment says the variable delay is meant to mimic real I/O.

**Before and after** (command: `node --test`, run repeatedly):

| | Old test | New test |
|---|---|---|
| Normal random delays | 4 of 20 passed | 50 of 50 passed |
| Longest delays forced | fails | passes |

I also put the old test back and confirmed it still fails with the longest delays, so the pass comes from the fix. The change is uncommitted. I skipped the skill's `hs` and `receipts` steps, as you said they aren't installed in this run.